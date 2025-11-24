import { NextRequest, NextResponse } from "next/server";
import { WorkOS } from "@workos-inc/node";

export async function POST(request: NextRequest) {
  try {
    const { refresh_token } = await request.json();

    if (!refresh_token) {
      return NextResponse.json(
        { error: "Missing required parameter: refresh_token" },
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

    // Refresh the access token using WorkOS SDK
    const authResponse = await workos.userManagement.authenticateWithRefreshToken({
      clientId: process.env.WORKOS_CLIENT_ID,
      refreshToken: refresh_token,
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

    // Fetch real GitHub user data using the GitHub token if available
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

          // Update cache with fresh data
          if (!global.githubUserCache) {
            global.githubUserCache = new Map();
          }
          global.githubUserCache.set(authResponse.user.id, {
            id: githubUserData.id,
            email: githubUserData.email,
            login: githubUserData.login,
            name: githubUserData.name,
            avatar_url: githubUserData.avatar_url,
          });
        }
      } catch (error) {
        console.error("[WorkOS Refresh] Error fetching GitHub user data:", error);
      }
    }

    // If we didn't get fresh GitHub data, try to use cached data
    if (!githubUserData) {
      if (!global.githubUserCache) {
        global.githubUserCache = new Map();
      }

      const cachedGithubUser = global.githubUserCache.get(authResponse.user.id);

      if (!cachedGithubUser) {
        return NextResponse.json(
          {
            error: "github_data_unavailable",
            error_description:
              "GitHub user data is not available and no cached data exists. Please re-authenticate.",
          },
          { status: 401 }
        );
      }

      githubUserData = cachedGithubUser;
      console.log("[WorkOS Refresh] Using cached GitHub user data for:", cachedGithubUser.login);
    }

    // Return the new token and user info with REAL GitHub data (fresh or cached)
    return NextResponse.json({
      // GitHub token for GitHub API calls (may be null on refresh)
      github_access_token: githubAccessToken,

      // WorkOS token for session management (always present)
      workos_access_token: authResponse.accessToken,
      refresh_token: authResponse.refreshToken,
      expires_in: 3600, // Token lifetime in seconds (1 hour)
      token_type: "Bearer",

      // Always use real GitHub data (never fallback to email snippet)
      user: {
        id: githubUserData.id, // Real GitHub ID (number)
        email: githubUserData.email || authResponse.user.email,
        login: githubUserData.login, // Real GitHub username - REQUIRED
        name: githubUserData.name || authResponse.user.email,
        avatar_url: githubUserData.avatar_url,
      },

      provider: "workos",
      workos_user_id: authResponse.user.id,
    });
  } catch (error) {
    console.error("WorkOS token refresh error:", error);

    // Handle WorkOS-specific errors
    if (error instanceof Error) {
      // Check if the refresh token is invalid or expired
      if (error.message.includes("invalid") || error.message.includes("expired")) {
        return NextResponse.json(
          {
            error: "invalid_grant",
            error_description: "Refresh token is invalid or expired. Please re-authenticate.",
          },
          { status: 401 },
        );
      }

      return NextResponse.json(
        {
          error: "token_refresh_failed",
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
