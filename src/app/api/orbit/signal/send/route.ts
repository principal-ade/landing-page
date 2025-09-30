import { NextRequest, NextResponse } from "next/server";
import { S3OrbitStore } from "@/lib/s3-orbit-store";

/**
 * POST /api/orbit/signal/send - Send a signal to another peer
 */
export async function POST(request: NextRequest) {
  try {
    const { from, to, type, data } = await request.json();

    if (!from || !to || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const store = new S3OrbitStore();

    // Store signal for the target peer
    await store.storeSignal({
      from,
      to,
      type,
      data,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send signal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
