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
        console.error("[WorkOS Verify] Error fetching GitHub user data:", error);
      }
    }

    // Create user session data (for web flow cookies)
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
      github_access_token: githubAccessToken,
    };

    // CRITICAL: Store full token data for CLI polling
    // This matches the format returned by /token endpoint
    session.tokens = {
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
    };

    // DO NOT delete session - keep it for CLI polling to retrieve tokens
    global.cliAuthSessions.set(state, session);

    // Return appropriate response based on flow type
    if (session.return_url) {
      // Web flow - return session data for cookie setting
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
    } else {
      // CLI flow - return simple success message
      // The Electron app will poll /token endpoint to get the tokens
      return NextResponse.json({
        success: true,
        message: "Email verified successfully. You can close this window and return to your terminal.",
      });
    }
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
