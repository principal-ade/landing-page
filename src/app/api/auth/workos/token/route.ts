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

    // Check if tokens are already available (after email verification)
    if (session.tokens) {
      // Verify PKCE challenge before returning tokens
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

      // Clean up the session
      global.cliAuthSessions.delete(state);

      // Return pre-exchanged tokens
      return NextResponse.json(session.tokens);
    }

    // If no pre-exchanged tokens, check if we have the OAuth code yet
    if (!session.code) {
      return NextResponse.json(
        { error: "authorization_pending" },
        { status: 400 },
      );
    }

    // Verify PKCE challenge before exchanging code
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

    // Extract GitHub access token from the authentication response
    // When "Return GitHub OAuth tokens" is enabled in WorkOS Dashboard,
    // the GitHub access token will be available in the response
    let githubAccessToken: string | null = null;

    // WorkOS returns the OAuth provider's access token when configured
    // Check if the response contains the impersonator/OAuth token
    if ((authResponse as any).impersonator?.accessToken) {
      githubAccessToken = (authResponse as any).impersonator.accessToken;
    } else if ((authResponse as any).oauthTokens?.accessToken) {
      githubAccessToken = (authResponse as any).oauthTokens.accessToken;
    }

    // Fetch real GitHub user data using the GitHub token
    let githubUserData = null;
    if (githubAccessToken) {
      try {
        const userResponse = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${githubAccessToken}`,
            Accept: "application/json",
          },
        });

        if (userResponse.ok) {
          githubUserData = await userResponse.json();
        }
      } catch (error) {
        console.error("[WorkOS] Error fetching GitHub user data:", error);
      }
    }

    // Clean up the session
    global.cliAuthSessions.delete(state);

    // Return the token and user info
    // Primary access token should be GitHub token (for backwards compatibility with Electron app)
    return NextResponse.json({
      // Use GitHub token as primary access_token if available (for api.github.com calls)
      access_token: githubAccessToken || authResponse.accessToken,

      // Keep WorkOS token available for WorkOS API calls
      workos_access_token: authResponse.accessToken,
      refresh_token: authResponse.refreshToken,
      expires_in: 3600, // Token lifetime in seconds (1 hour)
      token_type: "Bearer",

      // Use real GitHub user data if available, fallback to WorkOS data
      user: githubUserData
        ? {
            id: githubUserData.id, // Real GitHub ID (number)
            email: githubUserData.email || authResponse.user.email,
            login: githubUserData.login, // Real GitHub username
            name:
              githubUserData.name ||
              (authResponse.user.firstName && authResponse.user.lastName
                ? `${authResponse.user.firstName} ${authResponse.user.lastName}`
                : authResponse.user.email),
            avatar_url: githubUserData.avatar_url,
          }
        : {
            // Fallback to WorkOS data if GitHub fetch failed
            id: authResponse.user.id,
            email: authResponse.user.email,
            login:
              authResponse.user.email?.split("@")[0] || authResponse.user.id,
            name:
              authResponse.user.firstName && authResponse.user.lastName
                ? `${authResponse.user.firstName} ${authResponse.user.lastName}`
                : authResponse.user.email,
            avatar_url: userProfile.profilePictureUrl || null,
          },

      provider: "workos",
      workos_user_id: authResponse.user.id,
      github_access_token: githubAccessToken, // Also available explicitly
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
