import { NextRequest, NextResponse } from "next/server";

// Import the shared auth sessions from start route
// In production, use Redis or a database
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
          <title>Authentication Failed - Specktor</title>
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
            <p>Unable to complete authentication with GitHub.</p>
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
          <title>Session Expired - Specktor</title>
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

  // Store the code with the session
  session.code = code;
  global.cliAuthSessions.set(state, session);

  // Return success page
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authentication Successful - Specktor</title>
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
