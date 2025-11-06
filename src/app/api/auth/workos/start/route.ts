import { NextRequest, NextResponse } from "next/server";
import { WorkOS } from "@workos-inc/node";

// Initialize if not exists
if (!global.cliAuthSessions) {
  global.cliAuthSessions = new Map();
}

// Clean up old sessions periodically
if (!global.cliAuthCleanupInterval) {
  global.cliAuthCleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, session] of global.cliAuthSessions.entries()) {
      if (now - session.created_at > 5 * 60 * 1000) {
        // 5 minutes
        global.cliAuthSessions.delete(key);
      }
    }
  }, 60 * 1000); // Check every minute
}

export async function POST(request: NextRequest) {
  try {
    const { code_challenge, state, return_url } = await request.json();

    if (!code_challenge || !state) {
      return NextResponse.json(
        { error: "Missing required parameters: code_challenge and state" },
        { status: 400 },
      );
    }

    // Validate code_challenge format (base64url)
    if (!/^[A-Za-z0-9_-]+$/.test(code_challenge)) {
      return NextResponse.json(
        { error: "Invalid code_challenge format" },
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

    // Store the challenge with the state and optional return URL
    global.cliAuthSessions.set(state, {
      code_challenge,
      created_at: Date.now(),
      provider: "workos",
      return_url,
    });

    // Initialize WorkOS client
    const workos = new WorkOS(process.env.WORKOS_API_KEY);

    // Build WorkOS authorization URL
    // Note: Scopes are explicitly requested here to ensure correct GitHub permissions
    // The scopes used are: read:user, user:email, repo, read:public_key
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/workos/callback`;

    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
      provider: "GitHubOAuth", // Using GitHub as the provider through WorkOS
      clientId: process.env.WORKOS_CLIENT_ID,
      redirectUri,
      state,
      // Request offline_access for WorkOS refresh tokens + GitHub scopes
      // This allows the Electron app to refresh tokens without re-authentication
      // and ensures correct GitHub API permissions
      providerScopes: ['offline_access', 'read:user', 'user:email', 'repo', 'read:public_key'],
    });

    return NextResponse.json({
      auth_url: authorizationUrl,
      expires_in: 300, // 5 minutes
      provider: "workos",
      debug: {
        redirectUri,
        clientId: process.env.WORKOS_CLIENT_ID,
      },
    });
  } catch (error) {
    console.error("WorkOS auth start error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        error_description:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
