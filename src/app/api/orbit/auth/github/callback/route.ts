import { NextRequest, NextResponse } from "next/server";
import { S3OrbitStore } from "@/lib/s3-orbit-store";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

/**
 * GET /api/orbit/auth/github/callback - GitHub OAuth callback
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 },
    );
  }

  try {
    // Decode state (currently unused but kept for future redirect functionality)
    if (state) {
      try {
        // const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
        // Could use stateData.returnTo for custom redirect logic in the future
      } catch (e) {
        console.error("Failed to parse state:", e);
      }
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
        { status: 400 },
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

    // Redirect to success page with user info (always use production domain)
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://principle-md.com"
        : new URL(request.url).origin;
    const redirectUrl = new URL("/orbit-success", baseUrl);
    redirectUrl.searchParams.set("status", user.status);
    redirectUrl.searchParams.set("handle", user.githubHandle);

    // Only pass token if approved (still not secure for production)
    if (user.status === "approved") {
      redirectUrl.searchParams.set("token", accessToken);
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("GitHub OAuth callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
