import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Use the shared global sessions
declare global {
  var cliAuthSessions: Map<
    string,
    {
      code_challenge: string;
      code?: string;
      created_at: number;
    }
  >;
}

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

    // Exchange the code for an access token with GitHub
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.GITHUB_CLIENT_ID!,
          client_secret: process.env.GITHUB_CLIENT_SECRET!,
          code: session.code,
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/cli/callback`,
        }),
      },
    );

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error("GitHub token exchange failed:", error);
      return NextResponse.json(
        {
          error: "token_exchange_failed",
          error_description: error.error_description,
        },
        { status: 400 },
      );
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.json(
        {
          error: tokenData.error,
          error_description: tokenData.error_description,
        },
        { status: 400 },
      );
    }

    // Get user information
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/json",
      },
    });

    if (!userResponse.ok) {
      console.error("Failed to fetch user info");
      return NextResponse.json({ error: "user_info_failed" }, { status: 500 });
    }

    const userData = await userResponse.json();

    // Clean up the session
    global.cliAuthSessions.delete(state);

    // Return the token and user info
    return NextResponse.json({
      access_token: tokenData.access_token,
      token_type: tokenData.token_type || "Bearer",
      scope: tokenData.scope,
      user: {
        login: userData.login,
        email: userData.email,
        name: userData.name,
        id: userData.id,
      },
    });
  } catch (error) {
    console.error("CLI token exchange error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
