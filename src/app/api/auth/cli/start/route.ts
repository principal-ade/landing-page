import { NextRequest, NextResponse } from "next/server";

// Use global sessions store (in production, use Redis or a database)
declare global {
  var cliAuthSessions: Map<
    string,
    {
      code_challenge: string;
      code?: string;
      created_at: number;
    }
  >;
  var cliAuthCleanupInterval: NodeJS.Timeout;
}

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
    const { code_challenge, state, force_reauth } = await request.json();

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

    // Store the challenge with the state
    global.cliAuthSessions.set(state, {
      code_challenge,
      created_at: Date.now(),
    });

    // Build GitHub OAuth URL
    const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
    githubAuthUrl.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID!);
    githubAuthUrl.searchParams.set(
      "redirect_uri",
      `${process.env.NEXTAUTH_URL}/api/auth/cli/callback`,
    );
    githubAuthUrl.searchParams.set("state", state);
    githubAuthUrl.searchParams.set("scope", "read:user user:email repo");

    // Force re-authorization to show repository grant screen
    if (force_reauth) {
      githubAuthUrl.searchParams.set("prompt", "select_account");
      // Add a timestamp to force cache bust and ensure fresh auth
      githubAuthUrl.searchParams.set("_t", Date.now().toString());
    }

    return NextResponse.json({
      auth_url: githubAuthUrl.toString(),
      expires_in: 300, // 5 minutes
    });
  } catch (error) {
    console.error("CLI auth start error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
