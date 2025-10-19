import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { WorkOS } from "@workos-inc/node";

export async function POST(request: NextRequest) {
  try {
    const { state, code_verifier } = await request.json();

    if (!state || !code_verifier) {
      return NextResponse.json(
        { error: "Missing required parameters: state and code_verifier" },
        { status: 400 },
      );
    }

    // Get the session
    const session = global.cliAuthSessions?.get(state);
    if (!session) {
      return NextResponse.json(
        { error: "authorization_pending" },
        { status: 400 },
      );
    }

    // Verify this is a WorkOS session
    if (session.provider !== "workos") {
      return NextResponse.json(
        {
          error: "invalid_provider",
          error_description: "This session was initiated with a different provider",
        },
        { status: 400 },
      );
    }

    // Check if we have the code yet
    if (!session.code) {
      return NextResponse.json(
        { error: "authorization_pending" },
        { status: 400 },
      );
    }

    // Verify PKCE challenge
    const challenge = crypto
      .createHash("sha256")
      .update(code_verifier)
      .digest("base64url");

    if (challenge !== session.code_challenge) {
      return NextResponse.json(
        { error: "invalid_grant", error_description: "Invalid code_verifier" },
        { status: 400 },
      );
    }

    // Check if WorkOS is configured
    if (!process.env.WORKOS_API_KEY || !process.env.WORKOS_CLIENT_ID) {
      return NextResponse.json(
        {
          error: "workos_not_configured",
          error_description:
            "WorkOS authentication is not configured. Please set WORKOS_API_KEY and WORKOS_CLIENT_ID environment variables.",
        },
        { status: 500 },
      );
    }

    // Initialize WorkOS client
    const workos = new WorkOS(process.env.WORKOS_API_KEY);

    // Authenticate with WorkOS using the authorization code
    const authResponse = await workos.userManagement.authenticateWithCode({
      clientId: process.env.WORKOS_CLIENT_ID,
      code: session.code,
      // Note: WorkOS doesn't use PKCE code_verifier in the same way as GitHub
      // The PKCE verification was already done above for our own security
    });

    // Get user profile from WorkOS
    const userProfile = await workos.userManagement.getUser(
      authResponse.user.id,
    );

    // Extract GitHub user information from the profile
    // WorkOS stores provider-specific data in the user object
    const githubData = userProfile.profilePictureUrl
      ? {
          avatar_url: userProfile.profilePictureUrl,
        }
      : {};

    // Clean up the session
    global.cliAuthSessions.delete(state);

    // Return the token and user info
    // Note: WorkOS manages the access token internally
    // You can use authResponse.accessToken for WorkOS API calls
    // For GitHub API calls, you'll need to get the connection details
    return NextResponse.json({
      access_token: authResponse.accessToken,
      refresh_token: authResponse.refreshToken,
      token_type: "Bearer",
      user: {
        id: authResponse.user.id,
        email: authResponse.user.email,
        // WorkOS doesn't always provide a username/login
        // You may need to extract this from email or profile
        login: authResponse.user.email?.split("@")[0] || authResponse.user.id,
        name:
          authResponse.user.firstName && authResponse.user.lastName
            ? `${authResponse.user.firstName} ${authResponse.user.lastName}`
            : authResponse.user.email,
        ...githubData,
      },
      provider: "workos",
      workos_user_id: authResponse.user.id,
    });
  } catch (error) {
    console.error("WorkOS token exchange error:", error);

    // Handle WorkOS-specific errors
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "token_exchange_failed",
          error_description: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
