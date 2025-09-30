import { NextRequest, NextResponse } from "next/server";
import { S3OrbitStore } from "@/lib/s3-orbit-store";

/**
 * POST /api/orbit/signal/join - Join a signaling room
 */
export async function POST(request: NextRequest) {
  try {
    const { token, repoUrl } = await request.json();

    if (!token || !repoUrl) {
      return NextResponse.json(
        { error: "Missing token or repoUrl" },
        { status: 400 },
      );
    }

    const store = new S3OrbitStore();

    // Verify token and get user
    const user = await store.getUserByToken(token);
    if (!user || user.status !== "approved") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a unique peer ID
    const peerId = Math.random().toString(36).substring(2, 15);

    // Add user to room
    await store.joinRoom(repoUrl, user.githubHandle, peerId);

    // Get current peers in room
    const peers = await store.getRoomPeers(repoUrl);

    return NextResponse.json({
      type: "connected",
      peerId,
      githubHandle: user.githubHandle,
      peers: peers.filter((p) => p.peerId !== peerId),
    });
  } catch (error) {
    console.error("Join room error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
