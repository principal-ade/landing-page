import { NextRequest, NextResponse } from "next/server";
import { S3OrbitStore } from "@/lib/s3-orbit-store";

/**
 * POST /api/orbit/signal/leave - Leave a signaling room
 */
export async function POST(request: NextRequest) {
  try {
    const { peerId, repoUrl } = await request.json();

    if (!peerId || !repoUrl) {
      return NextResponse.json(
        { error: "Missing peerId or repoUrl" },
        { status: 400 },
      );
    }

    const store = new S3OrbitStore();

    // Remove peer from room
    await store.leaveRoom(repoUrl, peerId);

    // Clean up any pending signals for this peer
    await store.clearSignalsForPeer(peerId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Leave room error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
