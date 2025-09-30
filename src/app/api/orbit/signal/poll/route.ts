import { NextRequest, NextResponse } from "next/server";
import { S3OrbitStore } from "@/lib/s3-orbit-store";

/**
 * POST /api/orbit/signal/poll - Poll for signals
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

    // Get pending signals for this peer
    const signals = await store.getSignalsForPeer(peerId);

    // Get current peers in room (for peer updates)
    const peers = await store.getRoomPeers(repoUrl);

    // Update peer's last seen timestamp
    await store.updatePeerActivity(repoUrl, peerId);

    return NextResponse.json({
      signals,
      peers: peers.filter((p) => p.peerId !== peerId),
    });
  } catch (error) {
    console.error("Poll error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
