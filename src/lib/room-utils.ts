// Shared utilities for room management
// This module provides shared functions for the SSE events and status endpoints

// Simple in-memory store for demo (use Redis in production)
export const roomConnections = new Map<string, Set<ReadableStreamDefaultController>>();
export const roomStates = new Map<string, RoomState>();

export interface RoomState {
  repository: string;
  clients: Map<string, ClientInfo>;
  gitStatuses: Map<string, GitStatus>;
  lastActivity: number;
}

export interface ClientInfo {
  id: string;
  userId: string;
  userName: string;
  clientType: "sync_client" | "observer";
  permissions: {
    canRead: boolean;
    canWrite: boolean;
    canAdmin: boolean;
  };
  connectedAt: number;
}

export interface GitStatus {
  branch: string;
  commit: string;
  upstream?: {
    branch: string;
    ahead: number;
    behind: number;
  };
  files: {
    staged: any[];
    unstaged: any[];
    untracked: string[];
  };
  timestamp: number;
}

// Helper function to broadcast to all connections in a room
export function broadcastToRoom(
  roomId: string,
  message: any,
  exclude?: ReadableStreamDefaultController,
) {
  const connections = roomConnections.get(roomId);
  if (!connections) return;

  const encoder = new TextEncoder();
  const data = encoder.encode(`data: ${JSON.stringify(message)}\n\n`);

  for (const controller of connections) {
    if (controller !== exclude) {
      try {
        controller.enqueue(data);
      } catch {
        // Connection closed, remove it
        connections.delete(controller);
      }
    }
  }
}