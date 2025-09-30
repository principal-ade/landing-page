import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { 
  roomConnections, 
  roomStates, 
  broadcastToRoom,
  type ClientInfo
} from "@/lib/room-utils";

// Helper function to get JWT secret
function getJWTSecret(): string {
  if (!process.env.ROOM_TOKEN_SECRET) {
    throw new Error("ROOM_TOKEN_SECRET environment variable is required");
  }
  return process.env.ROOM_TOKEN_SECRET;
}

// Room management is now handled in shared module

// SSE endpoint for real-time events
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const { roomId } = await params;

  // Verify JWT token
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = authHeader.substring(7);
  let tokenPayload: any;

  try {
    tokenPayload = jwt.verify(token, getJWTSecret());
  } catch {
    return new Response("Invalid token", { status: 401 });
  }

  // Check if user has access to this room
  const tokenRepo = tokenPayload.repository.replace("/", "__");

  if (tokenRepo !== roomId) {
    return new Response("Access denied to this room", { status: 403 });
  }

  // Create SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Generate unique client ID
      const clientId = `${tokenPayload.sub}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Initialize room if needed
      if (!roomStates.has(roomId)) {
        roomStates.set(roomId, {
          repository: tokenPayload.repository,
          clients: new Map(),
          gitStatuses: new Map(),
          lastActivity: Date.now(),
        });
      }

      const roomState = roomStates.get(roomId)!;

      // Determine client type based on request headers or query params
      const clientType =
        (request.nextUrl.searchParams.get("type") as
          | "sync_client"
          | "observer") || "observer";

      // Add client to room
      const clientInfo: ClientInfo = {
        id: clientId,
        userId: tokenPayload.sub,
        userName: tokenPayload.sub, // Could be enhanced with GitHub API
        clientType,
        permissions: tokenPayload.permissions,
        connectedAt: Date.now(),
      };

      roomState.clients.set(clientId, clientInfo);

      // Track this connection
      if (!roomConnections.has(roomId)) {
        roomConnections.set(roomId, new Set());
      }
      roomConnections.get(roomId)!.add(controller);

      // Send initial connection success
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "connected",
            payload: {
              clientId,
              roomId,
              repository: tokenPayload.repository,
            },
          })}\n\n`,
        ),
      );

      // Send current room state
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "room_state",
            payload: {
              clients: Array.from(roomState.clients.values()),
              gitStatuses: Object.fromEntries(roomState.gitStatuses),
              repository: roomState.repository,
            },
          })}\n\n`,
        ),
      );

      // Broadcast to others that someone joined
      broadcastToRoom(
        roomId,
        {
          type: "client_joined",
          payload: clientInfo,
        },
        controller,
      );

      // Set up heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(":heartbeat\n\n"));
        } catch {
          // Connection closed
          clearInterval(heartbeat);
        }
      }, 30000);

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);

        // Remove from connections
        roomConnections.get(roomId)?.delete(controller);

        // Remove from room state
        roomState.clients.delete(clientId);

        // Remove git status if it was a sync client
        if (clientType === "sync_client") {
          roomState.gitStatuses.delete(tokenPayload.sub);
        }

        // Broadcast departure
        broadcastToRoom(roomId, {
          type: "client_left",
          payload: {
            clientId,
            userId: tokenPayload.sub,
          },
        });

        // Clean up empty rooms
        if (roomState.clients.size === 0) {
          roomStates.delete(roomId);
          roomConnections.delete(roomId);
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*", // Configure properly in production
    },
  });
}

// broadcastToRoom function is now imported from shared module
