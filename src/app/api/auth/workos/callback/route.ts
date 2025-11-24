import { NextRequest, NextResponse } from "next/server";
import { WorkOS } from "@workos-inc/node";
import { getValidSession, setSession, deleteSession } from "@/lib/auth-session-manager";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    const errorDescription =
      searchParams.get("error_description") || "Authentication failed";
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Failed - WorkOS</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: #f5f5f5;
              color: #333;
            }
            .container {
              text-align: center;
              background: white;
              padding: 2rem;
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              max-width: 400px;
            }
            h1 { color: #d32f2f; margin-bottom: 1rem; }
            p { color: #666; margin-bottom: 1rem; }

            @media (prefers-color-scheme: dark) {
              body {
                background: #1a1a1a;
                color: #e0e0e0;
              }
              .container {
                background: #2d2d2d;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
              }
              p { color: #b0b0b0; }
              h1 { color: #f87171; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Authentication Failed</h1>
            <p>Unable to complete authentication with WorkOS.</p>
            <p><strong>Error:</strong> ${errorDescription}</p>
            <p>You can close this window and try again.</p>
          </div>
          <script>setTimeout(() => window.close(), 5000);</script>
        </body>
      </html>
      `,
      {
        status: 400,
        headers: { "Content-Type": "text/html" },
      },
    );
  }

  if (!code || !state) {
    return NextResponse.json(
      { error: "Missing code or state parameter" },
      { status: 400 },
    );
  }

  // Get and validate session (checks expiration automatically)
  const session = getValidSession(state);
  if (!session) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Session Expired - WorkOS</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: #f5f5f5;
              color: #333;
            }
            .container {
              text-align: center;
              background: white;
              padding: 2rem;
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            h1 { color: #f57c00; margin-bottom: 1rem; }
            p { color: #666; }

            @media (prefers-color-scheme: dark) {
              body {
                background: #1a1a1a;
                color: #e0e0e0;
              }
              .container {
                background: #2d2d2d;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
              }
              p { color: #b0b0b0; }
              h1 { color: #ffa726; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Session Expired</h1>
            <p>Please return to your terminal and try again.</p>
          </div>
          <script>setTimeout(() => window.close(), 3000);</script>
        </body>
      </html>
      `,
      {
        status: 400,
        headers: { "Content-Type": "text/html" },
      },
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

  // Store the code with the session
  session.code = code;
  setSession(state, session);

  // If this is a web flow (has return_url), exchange token and redirect
  if (session.return_url) {
    try {
      // Initialize WorkOS client
      const workos = new WorkOS(process.env.WORKOS_API_KEY!);

      // Exchange code for access token
      let authResponse;
      try {
        authResponse = await workos.userManagement.authenticateWithCode({
          clientId: process.env.WORKOS_CLIENT_ID!,
          code: code,
        });
      } catch (authError: any) {
        // Check if email verification is required
        if (
          authError?.rawData?.code === "email_verification_required" ||
          authError?.message?.includes("Email ownership must be verified")
        ) {
          // Store the pending token in the session
          session.pending_auth_token = authError.rawData.pending_authentication_token;
          session.email = authError.rawData.email;
          setSession(state, session);

          // Redirect to verification page with state
          const verifyUrl = new URL(session.return_url);
          verifyUrl.pathname = "/auth/verify-email";
          verifyUrl.searchParams.set("state", state);
          verifyUrl.searchParams.set("email", authError.rawData.email || "your email");

          return NextResponse.redirect(verifyUrl.toString());
        }

        // Re-throw other errors
        throw authError;
      }

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

      // Fetch GitHub user data - REQUIRED for web flow
      if (!githubAccessToken) {
        throw new Error(
          "GitHub access token not available. Please ensure 'Return OAuth provider tokens' is enabled in WorkOS Dashboard."
        );
      }

      let githubUserData = null;
      try {
        const userResponse = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${githubAccessToken}`,
            Accept: "application/json",
          },
        });

        if (!userResponse.ok) {
          throw new Error(`GitHub API returned ${userResponse.status}`);
        }

        githubUserData = await userResponse.json();
      } catch (error) {
        console.error("[WorkOS] Web flow - Error fetching GitHub user data:", error);
        throw new Error(
          "Failed to fetch GitHub user data. Authentication cannot proceed without valid GitHub credentials."
        );
      }

      if (!githubUserData || !githubUserData.login) {
        throw new Error("GitHub user data is missing required fields (login)");
      }

      // Cache GitHub user data for future token refreshes
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

      // Create user session data with REAL GitHub data
      const userData = {
        id: githubUserData.id, // Real GitHub ID
        email: githubUserData.email || authResponse.user.email,
        login: githubUserData.login, // Real GitHub username - REQUIRED
        name:
          githubUserData.name ||
          (authResponse.user.firstName && authResponse.user.lastName
            ? `${authResponse.user.firstName} ${authResponse.user.lastName}`
            : authResponse.user.email),
        avatar_url: githubUserData.avatar_url,
        access_token: authResponse.accessToken,
        refresh_token: authResponse.refreshToken,
        github_access_token: githubAccessToken,
      };

      // Clean up the session
      deleteSession(state);

      // Build redirect URL with state parameter
      const redirectUrl = new URL(session.return_url);
      redirectUrl.searchParams.set("state", state);

      // Set session cookie and redirect
      const response = NextResponse.redirect(redirectUrl.toString());

      // Store user data in a secure HTTP-only cookie
      // Set domain to allow subdomain access (e.g., app.principal-ade.com)
      response.cookies.set("workos_session", JSON.stringify(userData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
        domain: process.env.NODE_ENV === "production" ? ".principal-ade.com" : undefined,
      });

      return response;
    } catch (error) {
      console.error("Token exchange error:", error instanceof Error ? error.message : "Unknown error");

      // Redirect with error
      const errorUrl = new URL(session.return_url);
      errorUrl.searchParams.set("auth_error", "token_exchange_failed");
      errorUrl.searchParams.set("error_message", error instanceof Error ? error.message : "Unknown error");
      return NextResponse.redirect(errorUrl.toString());
    }
  }

  // For CLI flow, check if email verification is required
  // Initialize WorkOS client
  const workos = new WorkOS(process.env.WORKOS_API_KEY!);

  try {
    // Try to authenticate to detect if verification is needed
    // IMPORTANT: Store the result because OAuth codes can only be used once
    const authResponse = await workos.userManagement.authenticateWithCode({
      clientId: process.env.WORKOS_CLIENT_ID!,
      code: code,
    });

    // Success - no verification needed
    // Store the authentication response as tokens for the polling endpoint
    // Get user profile
    const userProfile = await workos.userManagement.getUser(
      authResponse.user.id,
    );

    // Extract GitHub access token from the authentication response
    let githubAccessToken: string | null = null;
    if ((authResponse as any).impersonator?.accessToken) {
      githubAccessToken = (authResponse as any).impersonator.accessToken;
    } else if ((authResponse as any).oauthTokens?.accessToken) {
      githubAccessToken = (authResponse as any).oauthTokens.accessToken;
    }

    // Fetch real GitHub user data using the GitHub token
    if (!githubAccessToken) {
      throw new Error(
        "GitHub access token not available. Please ensure 'Return OAuth provider tokens' is enabled in WorkOS Dashboard."
      );
    }

    let githubUserData = null;
    try {
      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
          Accept: "application/json",
        },
      });

      if (!userResponse.ok) {
        throw new Error(`GitHub API returned ${userResponse.status}`);
      }

      githubUserData = await userResponse.json();
    } catch (error) {
      console.error("[WorkOS] CLI flow - Error fetching GitHub user data:", error);
      throw new Error(
        "Failed to fetch GitHub user data. Authentication cannot proceed without valid GitHub credentials."
      );
    }

    if (!githubUserData || !githubUserData.login) {
      throw new Error("GitHub user data is missing required fields (login)");
    }

    // Cache GitHub user data for future token refreshes (keyed by WorkOS user ID)
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

    // Store full token data for CLI polling (same format as verify endpoint)
    session.tokens = {
      access_token: githubAccessToken,
      workos_access_token: authResponse.accessToken,
      refresh_token: authResponse.refreshToken,
      expires_in: 3600,
      token_type: "Bearer",
      user: {
        id: githubUserData.id,
        email: githubUserData.email || authResponse.user.email,
        login: githubUserData.login, // Real GitHub username - REQUIRED
        name:
          githubUserData.name ||
          (authResponse.user.firstName && authResponse.user.lastName
            ? `${authResponse.user.firstName} ${authResponse.user.lastName}`
            : authResponse.user.email),
        avatar_url: githubUserData.avatar_url,
      },
      provider: "workos",
      workos_user_id: authResponse.user.id,
      github_access_token: githubAccessToken,
    };
    setSession(state, session);

    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Successful - WorkOS</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: #f5f5f5;
              color: #333;
            }
            .container {
              text-align: center;
              background: white;
              padding: 2rem;
              border-radius: 8px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            h1 { color: #2e7d32; margin-bottom: 1rem; }
            p { color: #666; margin-bottom: 1rem; }

            @media (prefers-color-scheme: dark) {
              body {
                background: #1a1a1a;
                color: #e0e0e0;
              }
              .container {
                background: #2d2d2d;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
              }
              p { color: #b0b0b0; }
              h1 { color: #4caf50; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Authentication Successful!</h1>
            <p>You can now close this window and return to your terminal.</p>
            <p><small>This window will close automatically in 3 seconds...</small></p>
          </div>
          <script>setTimeout(() => window.close(), 3000);</script>
        </body>
      </html>
      `,
      {
        headers: { "Content-Type": "text/html" },
      },
    );
  } catch (authError: any) {
    // Check if email verification is required
    if (
      authError?.rawData?.code === "email_verification_required" ||
      authError?.message?.includes("Email ownership must be verified")
    ) {
      // Store the pending token in the session
      session.pending_auth_token = authError.rawData.pending_authentication_token;
      session.email = authError.rawData.email;
      setSession(state, session);

      // Redirect to verification page with state
      const verifyUrl = `/auth/verify-email?state=${state}&email=${encodeURIComponent(authError.rawData.email || "your email")}`;

      return new NextResponse(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Email Verification Required - WorkOS</title>
            <meta http-equiv="refresh" content="0;url=${verifyUrl}">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: #f5f5f5;
                color: #333;
              }
              .container {
                text-align: center;
                background: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              }
              h1 { color: #f57c00; margin-bottom: 1rem; }
              p { color: #666; }

              @media (prefers-color-scheme: dark) {
                body {
                  background: #1a1a1a;
                  color: #e0e0e0;
                }
                .container {
                  background: #2d2d2d;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                }
                p { color: #b0b0b0; }
                h1 { color: #ffa726; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Email Verification Required</h1>
              <p>Redirecting to email verification page...</p>
              <p><small>If you are not redirected, <a href="${verifyUrl}">click here</a>.</small></p>
            </div>
          </body>
        </html>
        `,
        {
          status: 302,
          headers: {
            'Location': verifyUrl,
            'Content-Type': 'text/html',
          },
        },
      );
    }

    // Re-throw other errors
    throw authError;
  }
}
