import { NextRequest, NextResponse } from "next/server";
import { S3OrbitStore } from "@/lib/s3-orbit-store";

// CORS headers for Electron app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Allow all origins for Electron
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const GITHUB_REDIRECT_URI =
  process.env.GITHUB_REDIRECT_URI ||
  "http://localhost:3002/api/orbit/auth/github/callback";

/**
 * GET /api/orbit/auth/github - Initiate GitHub OAuth flow
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const returnTo = searchParams.get("returnTo") || "/";

  // Generate state for CSRF protection
  const state = Buffer.from(
    JSON.stringify({
      returnTo,
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substring(7),
    }),
  ).toString("base64");

  // GitHub OAuth authorization URL
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: "read:user user:email repo",
    state,
  });

  const authUrl = `https://github.com/login/oauth/authorize?${params}`;

  return NextResponse.redirect(authUrl);
}

/**
 * OPTIONS /api/orbit/auth/github - Handle CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

/**
 * POST /api/orbit/auth/github - Exchange code for token (called by Electron app)
 */
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Missing authorization code" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.json(
        { error: tokenData.error_description || "Failed to get access token" },
        { status: 400, headers: corsHeaders },
      );
    }

    const accessToken = tokenData.access_token;

    // Get user info from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const userData = await userResponse.json();

    // Get primary email
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const emails = await emailResponse.json();
    const primaryEmail = emails.find((e: any) => e.primary)?.email;

    // Create or update user in S3
    const store = new S3OrbitStore();
    const user = await store.createOrUpdateUser(
      userData.login,
      primaryEmail,
      accessToken,
    );

    // Update user metadata
    user.metadata = {
      avatarUrl: userData.avatar_url,
      name: userData.name,
      company: userData.company,
      location: userData.location,
    };

    await store.createOrUpdateUser(user.githubHandle, user.email, accessToken);

    return NextResponse.json(
      {
        success: true,
        user: {
          githubHandle: user.githubHandle,
          email: user.email,
          status: user.status,
          metadata: user.metadata,
        },
        token: accessToken,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders },
    );
  }
}
