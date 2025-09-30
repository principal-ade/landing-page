import { WebSocketServer, WebSocket } from "ws";
import { S3OrbitStore } from "./s3-orbit-store";

interface PeerConnection {
  ws: WebSocket;
  githubHandle: string;
  repoUrl: string;
  peerId: string;
}

interface SignalMessage {
  type: "join" | "leave" | "offer" | "answer" | "ice-candidate" | "error";
  from?: string;
  to?: string;
  repoUrl?: string;
  token?: string;
  data?: any;
}

export class SignalingServer {
  private wss: WebSocketServer;
  private store: S3OrbitStore;
  private connections: Map<string, PeerConnection> = new Map();
  private rooms: Map<string, Set<string>> = new Map(); // repoUrl -> Set of peerIds

  constructor(server: any) {
    this.wss = new WebSocketServer({ server, path: "/orbit/signal" });
    this.store = new S3OrbitStore();

    this.wss.on("connection", this.handleConnection.bind(this));
  }

  private async handleConnection(ws: WebSocket) {
    const peerId = this.generatePeerId();

    ws.on("message", async (message) => {
      try {
        const signal: SignalMessage = JSON.parse(message.toString());
        await this.handleSignal(ws, peerId, signal);
      } catch (error) {
        console.error("Signal handling error:", error);
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Invalid signal message",
          }),
        );
      }
    });

    ws.on("close", () => {
      this.handleDisconnect(peerId);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      this.handleDisconnect(peerId);
    });
  }

  private async handleSignal(
    ws: WebSocket,
    peerId: string,
    signal: SignalMessage,
  ) {
    switch (signal.type) {
      case "join":
        await this.handleJoin(ws, peerId, signal);
        break;

      case "leave":
        this.handleLeave(peerId);
        break;

      case "offer":
      case "answer":
      case "ice-candidate":
        this.relaySignal(peerId, signal);
        break;

      default:
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Unknown signal type",
          }),
        );
    }
  }

  private async handleJoin(
    ws: WebSocket,
    peerId: string,
    signal: SignalMessage,
  ) {
    const { token, repoUrl } = signal;

    if (!token || !repoUrl) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Missing token or repoUrl",
        }),
      );
      return;
    }

    // Verify user is approved
    const user = await this.store.getUserByToken(token);
    if (!user) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Invalid token",
        }),
      );
      ws.close();
      return;
    }

    if (user.status !== "approved") {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Not approved for access",
          status: user.status,
        }),
      );
      ws.close();
      return;
    }

    // Verify GitHub repo access
    const hasAccess = await this.verifyRepoAccess(token, repoUrl);
    if (!hasAccess) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "No access to repository",
        }),
      );
      ws.close();
      return;
    }

    // Add to connections
    this.connections.set(peerId, {
      ws,
      githubHandle: user.githubHandle,
      repoUrl,
      peerId,
    });

    // Add to room
    if (!this.rooms.has(repoUrl)) {
      this.rooms.set(repoUrl, new Set());
    }
    this.rooms.get(repoUrl)!.add(peerId);

    // Update S3 session
    await this.store.addUserToRoom(repoUrl, user.githubHandle);

    // Get existing peers in room
    const roomPeers = Array.from(this.rooms.get(repoUrl) || [])
      .filter((id) => id !== peerId)
      .map((id) => {
        const conn = this.connections.get(id);
        return {
          peerId: id,
          githubHandle: conn?.githubHandle,
        };
      });

    // Send join confirmation with peer list
    ws.send(
      JSON.stringify({
        type: "joined",
        peerId,
        githubHandle: user.githubHandle,
        peers: roomPeers,
      }),
    );

    // Notify other peers in room
    this.broadcastToRoom(
      repoUrl,
      {
        type: "peer-joined",
        peerId,
        githubHandle: user.githubHandle,
      },
      peerId,
    );
  }

  private handleLeave(peerId: string) {
    const connection = this.connections.get(peerId);
    if (!connection) return;

    const { repoUrl, githubHandle } = connection;

    // Remove from room
    const room = this.rooms.get(repoUrl);
    if (room) {
      room.delete(peerId);
      if (room.size === 0) {
        this.rooms.delete(repoUrl);
      }
    }

    // Remove from connections
    this.connections.delete(peerId);

    // Update S3 session
    this.store.removeUserFromRoom(repoUrl, githubHandle).catch(console.error);

    // Notify other peers
    this.broadcastToRoom(
      repoUrl,
      {
        type: "peer-left",
        peerId,
        githubHandle,
      },
      peerId,
    );
  }

  private handleDisconnect(peerId: string) {
    this.handleLeave(peerId);
  }

  private relaySignal(fromPeerId: string, signal: SignalMessage) {
    const { to } = signal;
    if (!to) return;

    const targetConnection = this.connections.get(to);
    if (!targetConnection) {
      const fromConnection = this.connections.get(fromPeerId);
      if (fromConnection) {
        fromConnection.ws.send(
          JSON.stringify({
            type: "error",
            message: "Target peer not found",
          }),
        );
      }
      return;
    }

    // Relay the signal to target peer
    targetConnection.ws.send(
      JSON.stringify({
        ...signal,
        from: fromPeerId,
      }),
    );
  }

  private broadcastToRoom(
    repoUrl: string,
    message: any,
    excludePeerId?: string,
  ) {
    const room = this.rooms.get(repoUrl);
    if (!room) return;

    room.forEach((peerId) => {
      if (peerId === excludePeerId) return;

      const connection = this.connections.get(peerId);
      if (connection) {
        connection.ws.send(JSON.stringify(message));
      }
    });
  }

  private async verifyRepoAccess(
    token: string,
    repoUrl: string,
  ): Promise<boolean> {
    try {
      // Parse repo URL to get owner and name
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\?#]+)/);
      if (!match) return false;

      const [, owner, repo] = match;
      const repoName = repo.replace(/\.git$/, "");

      // Check if user has access to the repository
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        },
      );

      // If we get a 200, user has at least read access
      return response.status === 200;
    } catch (error) {
      console.error("Repo access verification error:", error);
      return false;
    }
  }

  private generatePeerId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  public getStats() {
    return {
      totalConnections: this.connections.size,
      totalRooms: this.rooms.size,
      rooms: Array.from(this.rooms.entries()).map(([repoUrl, peers]) => ({
        repoUrl,
        peerCount: peers.size,
      })),
    };
  }
}
