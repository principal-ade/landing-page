import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/user
 * Returns the current user's session if authenticated
 */
export async function GET(request: NextRequest) {
  try {
    // Get the session cookie
    const sessionCookie = request.cookies.get("workos_session");

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Parse the session data
    const userData = JSON.parse(sessionCookie.value);

    // Return user info including GitHub token for API access
    return NextResponse.json({
      authenticated: true,
      user: {
        id: userData.id,
        email: userData.email,
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
        github_access_token: userData.github_access_token,
      },
    });
  } catch (error) {
    console.error("Session retrieval error:", error);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

/**
 * DELETE /api/auth/user
 * Logout endpoint - clears the session cookie
 */
export async function DELETE() {
  const response = NextResponse.json({ success: true });

  // Clear the session cookie
  response.cookies.delete("workos_session");

  return response;
}
