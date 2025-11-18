import { NextRequest, NextResponse } from "next/server";
import { getValidSession, getSessionAge, getSessionTTL } from "@/lib/auth-session-manager";

/**
 * POST /api/auth/workos/verify/check
 * Check if a verification session is still valid
 */
export async function POST(request: NextRequest) {
  try {
    const { state } = await request.json();

    if (!state) {
      return NextResponse.json(
        { error: "Missing required parameter: state" },
        { status: 400 },
      );
    }

    // Get and validate session (checks expiration automatically)
    const session = getValidSession(state);
    if (!session) {
      return NextResponse.json(
        {
          error: "session_expired",
          error_description: "Session expired. Please start the login process again."
        },
        { status: 400 },
      );
    }

    // Check if this session is waiting for verification
    if (!session.pending_auth_token) {
      return NextResponse.json(
        {
          error: "invalid_session",
          error_description: "This session is not waiting for email verification."
        },
        { status: 400 },
      );
    }

    // Return session validity info
    const age = getSessionAge(session);
    const ttl = getSessionTTL();
    const remainingTime = Math.max(0, ttl - age);

    return NextResponse.json({
      valid: true,
      email: session.email,
      remainingTime: Math.floor(remainingTime / 1000), // Convert to seconds
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
