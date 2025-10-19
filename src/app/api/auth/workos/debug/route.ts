import { NextResponse } from "next/server";

/**
 * Debug endpoint to check WorkOS configuration
 * GET /api/auth/workos/debug
 */
export async function GET() {
  return NextResponse.json({
    workos_configured: !!(process.env.WORKOS_API_KEY && process.env.WORKOS_CLIENT_ID),
    workos_client_id: process.env.WORKOS_CLIENT_ID,
    nextauth_url: process.env.NEXTAUTH_URL,
    expected_redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/workos/callback`,
    instructions: {
      step1: "Go to https://dashboard.workos.com/",
      step2: "Navigate to Authentication > Redirect URIs",
      step3: "Add this exact redirect URI:",
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/workos/callback`,
      step4: "Make sure it matches EXACTLY (including http vs https)",
    },
  });
}
