import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { broadcastToRoom, roomStates } from "@/lib/room-utils";

// Helper function to get JWT secret
function getJWTSecret(): string {
  if (!process.env.ROOM_TOKEN_SECRET) {
    throw new Error("ROOM_TOKEN_SECRET environment variable is required");
  }
  return process.env.ROOM_TOKEN_SECRET;
}

interface GitStatusUpdate {
  branch: string;
  commit: string;
  upstream?: {
    branch: string;
    ahead: number;
    behind: number;
  };
  files: {
    staged: Array<{
      path: string;
      status: string;
      additions?: number;
      deletions?: number;
    }>;
    unstaged: Array<{
      path: string;
      status: string;
      additions?: number;
      deletions?: number;
    }>;
    untracked: string[];
    conflicted?: string[];
  };
  stats?: {
    totalFiles: number;
    additions: number;
    deletions: number;
    filesChanged: number;
  };
}

// POST endpoint for sync clients to send status updates
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const { roomId } = await params;

  // Verify JWT token
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  let tokenPayload: any;

  try {
    tokenPayload = jwt.verify(token, getJWTSecret());
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Check if user has write access
  if (!tokenPayload.permissions?.canJoin) {
    return NextResponse.json(
      { error: "No access to this room" },
      { status: 403 },
    );
  }

  // Verify room matches token
  const tokenRepo = tokenPayload.repository.replace("/", "__");
  if (tokenRepo !== roomId) {
    return NextResponse.json(
      { error: "Room mismatch with token" },
      { status: 403 },
    );
  }

  // Parse status update
  let statusUpdate: GitStatusUpdate;
  try {
    statusUpdate = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  // Validate required fields
  if (!statusUpdate.branch || !statusUpdate.commit) {
    return NextResponse.json(
      { error: "Missing required fields: branch, commit" },
      { status: 400 },
    );
  }

  // Get or create room state
  if (!roomStates.has(roomId)) {
    roomStates.set(roomId, {
      repository: tokenPayload.repository,
      clients: new Map(),
      gitStatuses: new Map(),
      lastActivity: Date.now(),
    });
  }

  const roomState = roomStates.get(roomId)!;

  // Store the git status
  const gitStatus = {
    ...statusUpdate,
    userId: tokenPayload.sub,
    userName: tokenPayload.sub, // Could be enhanced with GitHub user data
    timestamp: Date.now(),
  };

  roomState.gitStatuses.set(tokenPayload.sub, gitStatus);
  roomState.lastActivity = Date.now();

  // Broadcast to all SSE connections in the room
  broadcastToRoom(roomId, {
    type: "git_status",
    payload: gitStatus,
  });

  // Log for debugging
  console.log(`[Room ${roomId}] Git status update from ${tokenPayload.sub}:`, {
    branch: statusUpdate.branch,
    commit: statusUpdate.commit.substring(0, 7),
    files: {
      staged: statusUpdate.files.staged.length,
      unstaged: statusUpdate.files.unstaged.length,
      untracked: statusUpdate.files.untracked.length,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Status broadcasted",
    roomId,
    clientsInRoom: roomState.clients.size,
  });
}

// GET endpoint to retrieve current room status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const { roomId } = await params;

  // Verify JWT token
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.substring(7);
  let tokenPayload: any;

  try {
    tokenPayload = jwt.verify(token, getJWTSecret());
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Check room access
  const tokenRepo = tokenPayload.repository.replace("/", "__");
  if (tokenRepo !== roomId) {
    return NextResponse.json(
      { error: "Access denied to this room" },
      { status: 403 },
    );
  }

  // Get room state
  const roomState = roomStates.get(roomId);

  if (!roomState) {
    return NextResponse.json({
      repository: tokenPayload.repository,
      clients: [],
      gitStatuses: {},
      message: "Room is empty",
    });
  }

  // Return current state
  return NextResponse.json({
    repository: roomState.repository,
    clients: Array.from(roomState.clients.values()).map((client) => ({
      id: client.id,
      userId: client.userId,
      userName: client.userName,
      clientType: client.clientType,
      connectedAt: client.connectedAt,
    })),
    gitStatuses: Object.fromEntries(roomState.gitStatuses),
    lastActivity: roomState.lastActivity,
  });
}
