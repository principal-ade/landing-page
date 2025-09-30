import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export interface OrbitUser {
  id: string;
  githubHandle: string;
  email?: string;
  status: "waitlisted" | "approved" | "denied";
  createdAt: string;
  updatedAt: string;
  githubToken?: string; // Encrypted in production
  metadata?: {
    avatarUrl?: string;
    name?: string;
    company?: string;
    location?: string;
  };
}

export interface RoomSession {
  repoUrl: string;
  owner: string;
  repo: string;
  activeUsers: string[]; // GitHub handles
  createdAt: string;
  lastActivity: string;
}

export interface WaitlistStats {
  totalWaitlisted: number;
  totalApproved: number;
  totalDenied: number;
  lastUpdated: string;
}

export interface RoomPeer {
  peerId: string;
  githubHandle: string;
  lastSeen: string;
}

export interface Signal {
  from: string;
  to: string;
  type: "offer" | "answer" | "ice-candidate";
  data: any;
  timestamp: string;
}

export class S3OrbitStore {
  private s3: S3Client;
  private bucket: string;
  private prefix: string = "orbit";

  constructor() {
    const bucket = process.env.ORBIT_S3_BUCKET;
    const region = process.env.AWS_REGION;

    if (!bucket) {
      throw new Error("ORBIT_S3_BUCKET environment variable is required");
    }

    if (!region) {
      throw new Error("AWS_REGION environment variable is required");
    }

    this.s3 = new S3Client({
      region: region,
      credentials: process.env.AWS_ACCESS_KEY_ID
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          }
        : undefined,
    });
    this.bucket = bucket;
  }

  /**
   * Create or update a user in the waitlist
   */
  async createOrUpdateUser(
    githubHandle: string,
    email?: string,
    token?: string,
  ): Promise<OrbitUser> {
    const normalizedHandle = githubHandle.toLowerCase();

    // Check for existing user
    const existingUser = await this.getUser(normalizedHandle);

    if (existingUser) {
      // Update existing user
      existingUser.email = email || existingUser.email;
      existingUser.githubToken = token || existingUser.githubToken;
      existingUser.updatedAt = new Date().toISOString();

      await this.putObject(
        `${this.prefix}/users/${normalizedHandle}.json`,
        JSON.stringify(existingUser),
      );

      return existingUser;
    }

    // Create new user
    const user: OrbitUser = {
      id: uuidv4(),
      githubHandle,
      email,
      status: "waitlisted",
      githubToken: token,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.putObject(
      `${this.prefix}/users/${normalizedHandle}.json`,
      JSON.stringify(user),
    );

    // Add to waitlist index
    await this.addToIndex("waitlist", normalizedHandle);

    // Update stats
    await this.updateStats("waitlisted", 1);

    return user;
  }

  /**
   * Get user by GitHub handle
   */
  async getUser(githubHandle: string): Promise<OrbitUser | null> {
    const normalizedHandle = githubHandle.toLowerCase();

    try {
      const data = await this.getObject(
        `${this.prefix}/users/${normalizedHandle}.json`,
      );
      if (!data) return null;
      return JSON.parse(data) as OrbitUser;
    } catch (error: any) {
      // Only return null for "not found" errors, throw others
      if (error.name === "NoSuchKey") {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get user by GitHub token (for auth verification)
   */
  async getUserByToken(token: string): Promise<OrbitUser | null> {
    try {
      console.log(
        "[S3OrbitStore] getUserByToken called with token:",
        token.substring(0, 10) + "...",
      );

      // Check if S3 client is initialized
      if (!this.s3) {
        throw new Error("S3 client not initialized");
      }

      if (!this.bucket) {
        throw new Error("S3 bucket not configured");
      }

      // In production, this would use a token index or hash lookup
      // For now, we'll scan users (inefficient but works for beta)
      const usersPrefix = `${this.prefix}/users/`;
      console.log("[S3OrbitStore] Listing objects with prefix:", usersPrefix);
      console.log("[S3OrbitStore] Using bucket:", this.bucket);

      const listCommand = new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: usersPrefix,
      });

      console.log("[S3OrbitStore] Sending ListObjectsV2Command...");
      const response = await this.s3.send(listCommand);
      console.log("[S3OrbitStore] ListObjectsV2 response received");

      console.log(
        "[S3OrbitStore] Found",
        response.Contents?.length || 0,
        "user files",
      );

      if (!response.Contents) {
        console.log("[S3OrbitStore] No contents in response");
        return null;
      }

      for (const item of response.Contents) {
        if (!item.Key) {
          console.log("[S3OrbitStore] Skipping item with no key");
          continue;
        }
        console.log("[S3OrbitStore] Checking user file:", item.Key);

        try {
          const userData = await this.getObject(item.Key);
          if (!userData) {
            console.log("[S3OrbitStore] No data for key:", item.Key);
            continue;
          }

          const user = JSON.parse(userData) as OrbitUser;
          console.log(
            "[S3OrbitStore] Checking user:",
            user?.githubHandle,
            "has token:",
            !!user?.githubToken,
          );

          if (user?.githubToken === token) {
            console.log(
              "[S3OrbitStore] Token match found for user:",
              user.githubHandle,
            );
            return user;
          }
        } catch (parseError) {
          console.error(
            "[S3OrbitStore] Error parsing user data for key:",
            item.Key,
            parseError,
          );
          continue;
        }
      }

      console.log("[S3OrbitStore] No user found with matching token");
      return null;
    } catch (error: unknown) {
      const errorObj = error as any;
      console.error(
        "[S3OrbitStore] getUserByToken error type:",
        errorObj.constructor?.name,
      );
      console.error(
        "[S3OrbitStore] getUserByToken error message:",
        errorObj.message,
      );
      console.error("[S3OrbitStore] getUserByToken error stack:", errorObj.stack);
      throw error;
    }
  }

  /**
   * Approve a user
   */
  async approveUser(githubHandle: string): Promise<void> {
    const normalizedHandle = githubHandle.toLowerCase();
    const user = await this.getUser(normalizedHandle);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.status === "approved") {
      return; // Already approved
    }

    const oldStatus = user.status;
    user.status = "approved";
    user.updatedAt = new Date().toISOString();

    await this.putObject(
      `${this.prefix}/users/${normalizedHandle}.json`,
      JSON.stringify(user),
    );

    // Update indices
    if (oldStatus === "waitlisted") {
      await this.removeFromIndex("waitlist", normalizedHandle);
      await this.updateStats("waitlisted", -1);
    } else if (oldStatus === "denied") {
      await this.removeFromIndex("denied", normalizedHandle);
      await this.updateStats("denied", -1);
    }

    await this.addToIndex("approved", normalizedHandle);
    await this.updateStats("approved", 1);
  }

  /**
   * Deny a user
   */
  async denyUser(githubHandle: string): Promise<void> {
    const normalizedHandle = githubHandle.toLowerCase();
    const user = await this.getUser(normalizedHandle);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.status === "denied") {
      return; // Already denied
    }

    const oldStatus = user.status;
    user.status = "denied";
    user.updatedAt = new Date().toISOString();

    await this.putObject(
      `${this.prefix}/users/${normalizedHandle}.json`,
      JSON.stringify(user),
    );

    // Update indices
    if (oldStatus === "waitlisted") {
      await this.removeFromIndex("waitlist", normalizedHandle);
      await this.updateStats("waitlisted", -1);
    } else if (oldStatus === "approved") {
      await this.removeFromIndex("approved", normalizedHandle);
      await this.updateStats("approved", -1);
    }

    await this.addToIndex("denied", normalizedHandle);
    await this.updateStats("denied", 1);
  }

  /**
   * Get all users with a specific status
   */
  async getUsersByStatus(status: OrbitUser["status"]): Promise<OrbitUser[]> {
    const indexName = status === "waitlisted" ? "waitlist" : status;
    const handles = await this.getIndex(indexName);

    const users = await Promise.all(
      handles.map((handle) => this.getUser(handle)),
    );

    return users.filter((user) => user !== null) as OrbitUser[];
  }

  /**
   * Add user to a room session
   */
  async addUserToRoom(repoUrl: string, githubHandle: string): Promise<void> {
    const { owner, repo } = this.parseRepoUrl(repoUrl);
    const sessionKey = `${this.prefix}/sessions/${owner}/${repo}/active.json`;

    let session: RoomSession;
    const existingData = await this.getObject(sessionKey);

    if (existingData) {
      session = JSON.parse(existingData) as RoomSession;
      if (!session.activeUsers.includes(githubHandle)) {
        session.activeUsers.push(githubHandle);
        session.lastActivity = new Date().toISOString();
      }
    } else {
      session = {
        repoUrl,
        owner,
        repo,
        activeUsers: [githubHandle],
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };
    }

    await this.putObject(sessionKey, JSON.stringify(session));
  }

  /**
   * Remove user from a room session
   */
  async removeUserFromRoom(
    repoUrl: string,
    githubHandle: string,
  ): Promise<void> {
    const { owner, repo } = this.parseRepoUrl(repoUrl);
    const sessionKey = `${this.prefix}/sessions/${owner}/${repo}/active.json`;

    const existingData = await this.getObject(sessionKey);
    if (!existingData) return;

    const session = JSON.parse(existingData) as RoomSession;
    session.activeUsers = session.activeUsers.filter(
      (user) => user !== githubHandle,
    );
    session.lastActivity = new Date().toISOString();

    if (session.activeUsers.length === 0) {
      // Delete empty session
      await this.deleteObject(sessionKey);
    } else {
      await this.putObject(sessionKey, JSON.stringify(session));
    }
  }

  /**
   * Get active users in a room
   */
  async getRoomUsers(repoUrl: string): Promise<string[]> {
    const { owner, repo } = this.parseRepoUrl(repoUrl);
    const sessionKey = `${this.prefix}/sessions/${owner}/${repo}/active.json`;

    const data = await this.getObject(sessionKey);
    if (!data) return [];

    const session = JSON.parse(data) as RoomSession;
    return session.activeUsers;
  }

  /**
   * Get waitlist statistics
   */
  async getStats(): Promise<WaitlistStats> {
    const statsKey = `${this.prefix}/metadata/stats.json`;
    const data = await this.getObject(statsKey);

    if (!data) {
      return {
        totalWaitlisted: 0,
        totalApproved: 0,
        totalDenied: 0,
        lastUpdated: new Date().toISOString(),
      };
    }

    return JSON.parse(data) as WaitlistStats;
  }

  // Helper methods

  private async addToIndex(indexName: string, value: string): Promise<void> {
    const indexKey = `${this.prefix}/indices/${indexName}.json`;
    const existing = await this.getObject(indexKey);

    const values: string[] = existing ? JSON.parse(existing) : [];
    if (!values.includes(value)) {
      values.push(value);
      await this.putObject(indexKey, JSON.stringify(values));
    }
  }

  private async removeFromIndex(
    indexName: string,
    value: string,
  ): Promise<void> {
    const indexKey = `${this.prefix}/indices/${indexName}.json`;
    const existing = await this.getObject(indexKey);

    if (!existing) return;

    let values: string[] = JSON.parse(existing);
    values = values.filter((v) => v !== value);
    await this.putObject(indexKey, JSON.stringify(values));
  }

  private async getIndex(indexName: string): Promise<string[]> {
    const indexKey = `${this.prefix}/indices/${indexName}.json`;
    const data = await this.getObject(indexKey);
    return data ? JSON.parse(data) : [];
  }

  private async updateStats(
    field: "waitlisted" | "approved" | "denied",
    delta: number,
  ): Promise<void> {
    const stats = await this.getStats();

    if (field === "waitlisted") {
      stats.totalWaitlisted = Math.max(0, stats.totalWaitlisted + delta);
    } else if (field === "approved") {
      stats.totalApproved = Math.max(0, stats.totalApproved + delta);
    } else if (field === "denied") {
      stats.totalDenied = Math.max(0, stats.totalDenied + delta);
    }

    stats.lastUpdated = new Date().toISOString();

    await this.putObject(
      `${this.prefix}/metadata/stats.json`,
      JSON.stringify(stats),
    );
  }

  // Room management methods for HTTP-based signaling

  async joinRoom(
    repoUrl: string,
    githubHandle: string,
    peerId: string,
  ): Promise<void> {
    const roomKey = `${this.prefix}/rooms/${this.sanitizeKey(repoUrl)}/peers/${peerId}.json`;
    const peer: RoomPeer = {
      peerId,
      githubHandle,
      lastSeen: new Date().toISOString(),
    };
    await this.putObject(roomKey, JSON.stringify(peer));
  }

  async leaveRoom(repoUrl: string, peerId: string): Promise<void> {
    const roomKey = `${this.prefix}/rooms/${this.sanitizeKey(repoUrl)}/peers/${peerId}.json`;
    await this.deleteObject(roomKey);
  }

  async getRoomPeers(repoUrl: string): Promise<RoomPeer[]> {
    const prefix = `${this.prefix}/rooms/${this.sanitizeKey(repoUrl)}/peers/`;
    const objects = await this.listObjects(prefix);

    const peers: RoomPeer[] = [];
    const now = Date.now();
    const PEER_TIMEOUT = 30000; // 30 seconds

    for (const obj of objects) {
      const data = await this.getObject(obj.Key!);
      if (data) {
        const peer = JSON.parse(data) as RoomPeer;
        // Only include peers that have been active recently
        if (now - new Date(peer.lastSeen).getTime() < PEER_TIMEOUT) {
          peers.push(peer);
        } else {
          // Clean up stale peer
          await this.deleteObject(obj.Key!);
        }
      }
    }

    return peers;
  }

  async updatePeerActivity(repoUrl: string, peerId: string): Promise<void> {
    const roomKey = `${this.prefix}/rooms/${this.sanitizeKey(repoUrl)}/peers/${peerId}.json`;
    const data = await this.getObject(roomKey);
    if (data) {
      const peer = JSON.parse(data) as RoomPeer;
      peer.lastSeen = new Date().toISOString();
      await this.putObject(roomKey, JSON.stringify(peer));
    }
  }

  // Signal management methods

  async storeSignal(signal: Signal): Promise<void> {
    const signalKey = `${this.prefix}/signals/${signal.to}/${Date.now()}-${Math.random()}.json`;
    await this.putObject(signalKey, JSON.stringify(signal));
  }

  async getSignalsForPeer(peerId: string): Promise<Signal[]> {
    const prefix = `${this.prefix}/signals/${peerId}/`;
    const objects = await this.listObjects(prefix);

    const signals: Signal[] = [];
    for (const obj of objects) {
      const data = await this.getObject(obj.Key!);
      if (data) {
        signals.push(JSON.parse(data) as Signal);
        // Delete the signal after reading (they're one-time use)
        await this.deleteObject(obj.Key!);
      }
    }

    return signals;
  }

  async clearSignalsForPeer(peerId: string): Promise<void> {
    const prefix = `${this.prefix}/signals/${peerId}/`;
    const objects = await this.listObjects(prefix);

    for (const obj of objects) {
      await this.deleteObject(obj.Key!);
    }
  }

  private sanitizeKey(key: string): string {
    return key.replace(/[^a-zA-Z0-9-_]/g, "_");
  }

  private async listObjects(prefix: string): Promise<any[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
    });
    const response = await this.s3.send(command);
    return response.Contents || [];
  }

  private parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
    // Parse GitHub URL formats
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/\?#]+)/, // HTTPS URLs
      /git@github\.com:([^\/]+)\/([^\/\.]+)/, // SSH URLs
      /^([^\/]+)\/([^\/]+)$/, // Short format (owner/repo)
    ];

    for (const pattern of patterns) {
      const match = repoUrl.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, ""),
        };
      }
    }

    throw new Error(`Invalid repository URL: ${repoUrl}`);
  }

  private async getObject(key: string): Promise<string | null> {
    try {
      const response = await this.s3.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      if (!response.Body) return null;

      // Handle different response body types in AWS SDK v3
      // In Node.js, Body is a Readable stream
      // In browsers, Body might be a Blob or other type
      if (typeof response.Body.transformToString === "function") {
        // AWS SDK v3 with transformToString (Node.js >= 18)
        return await response.Body.transformToString();
      } else if (response.Body instanceof Blob) {
        // Browser environment with Blob
        return await response.Body.text();
      } else if (typeof response.Body === "string") {
        // Already a string
        return response.Body;
      } else {
        // Fallback: try to read as stream (Node.js)
        const streamToString = (stream: any): Promise<string> => {
          const chunks: any[] = [];
          return new Promise((resolve, reject) => {
            stream.on("data", (chunk: any) => chunks.push(Buffer.from(chunk)));
            stream.on("error", (err: any) => reject(err));
            stream.on("end", () =>
              resolve(Buffer.concat(chunks).toString("utf8")),
            );
          });
        };
        return await streamToString(response.Body);
      }
    } catch (error: any) {
      if (error.name === "NoSuchKey") {
        return null;
      }
      console.error("[S3OrbitStore] getObject error for key:", key, error);
      throw error;
    }
  }

  private async putObject(key: string, body: string): Promise<void> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: "application/json",
      }),
    );
  }

  private async deleteObject(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.s3.send(command);
    } catch (error) {
      console.error(`Failed to delete object ${key}:`, error);
    }
  }
}
