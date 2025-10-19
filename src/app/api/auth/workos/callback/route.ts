import { NextRequest, NextResponse } from "next/server";
import { WorkOS } from "@workos-inc/node";

// Initialize if not exists
if (!global.cliAuthSessions) {
  global.cliAuthSessions = new Map();
}

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

  // Get the session
  const session = global.cliAuthSessions.get(state);
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
  global.cliAuthSessions.set(state, session);

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
          console.log("[WorkOS] Email verification required:", {
            email: authError?.rawData?.email,
            hasPendingToken: !!authError?.rawData?.pending_authentication_token,
          });

          // Store the pending token in the session
          session.pending_auth_token = authError.rawData.pending_authentication_token;
          session.email = authError.rawData.email;
          global.cliAuthSessions.set(state, session);

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

      console.log('[WorkOS] GitHub token available:', !!githubAccessToken);

      // Create user session data
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

      // Clean up the session
      global.cliAuthSessions.delete(state);

      // Set session cookie and redirect
      const response = NextResponse.redirect(session.return_url);

      // Store user data in a secure HTTP-only cookie
      response.cookies.set("workos_session", JSON.stringify(userData), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    } catch (error) {
      console.error("Token exchange error:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        code: code,
        state: state,
        workos_client_id: process.env.WORKOS_CLIENT_ID,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/workos/callback`,
      });

      // Redirect with error
      const errorUrl = new URL(session.return_url);
      errorUrl.searchParams.set("auth_error", "token_exchange_failed");
      errorUrl.searchParams.set("error_message", error instanceof Error ? error.message : "Unknown error");
      return NextResponse.redirect(errorUrl.toString());
    }
  }

  // For CLI flow, return success page
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
}
