import { NextRequest, NextResponse } from "next/server";
import { WorkOS } from "@workos-inc/node";

/**
 * POST /api/auth/workos/verify
 * Complete email verification with the code sent to the user's email
 */
export async function POST(request: NextRequest) {
  try {
    const { state, verificationCode } = await request.json();

    if (!state || !verificationCode) {
      return NextResponse.json(
        { error: "Missing required parameters: state and verificationCode" },
        { status: 400 },
      );
    }

    // Get the session
    const session = global.cliAuthSessions?.get(state);
    if (!session) {
      return NextResponse.json(
        { error: "Session expired. Please start the login process again." },
        { status: 400 },
      );
    }

    if (!session.pending_auth_token) {
      return NextResponse.json(
        { error: "No pending authentication token found." },
        { status: 400 },
      );
    }

    // Initialize WorkOS client
    const workos = new WorkOS(process.env.WORKOS_API_KEY!);

    // Complete email verification
    const authResponse = await workos.userManagement.authenticateWithEmailVerification({
      clientId: process.env.WORKOS_CLIENT_ID!,
      code: verificationCode,
      pendingAuthenticationToken: session.pending_auth_token,
    });

    // Get user profile
    const userProfile = await workos.userManagement.getUser(
      authResponse.user.id,
    );

    // Create user session data
    const userData = {
      id: authResponse.user.id,
      email: authResponse.user.email,
      login: authResponse.user.email?.split("@")[0] || authResponse.user.id,
      name:
        authResponse.user.firstName && authResponse.user.lastName
          ? `${authResponse.user.firstName} ${authResponse.user.lastName}`
          : authResponse.user.email,
      avatar_url: userProfile.profilePictureUrl || null,
      access_token: authResponse.accessToken,
      refresh_token: authResponse.refreshToken,
    };

    // Clean up the session
    global.cliAuthSessions.delete(state);

    // Return session data (cookie will be set on the client)
    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
      },
      sessionData: userData,
      return_url: session.return_url,
    });
  } catch (error: any) {
    console.error("Email verification error:", error);

    return NextResponse.json(
      {
        error: "verification_failed",
        error_description:
          error?.message || "Failed to verify email. Please check the code and try again.",
      },
      { status: 400 },
    );
  }
}
