"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { defaultTheme as theme } from "themed-markdown";

function OrbitSuccessContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const handle = searchParams.get("handle");
  const token = searchParams.get("token");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference for dark mode
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);

    // Listen for changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    // If this page is opened in a popup or new tab, we could use postMessage
    // to communicate back to the Electron app
    if (window.opener) {
      window.opener.postMessage(
        {
          type: "orbit-auth-success",
          status,
          handle,
          token,
        },
        "*",
      );

      // Close the window after a moment
      setTimeout(() => {
        window.close();
      }, 2000);
    }

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [status, handle, token]);

  // Get theme colors
  const colors = theme.colors;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: theme.fonts.body,
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      <div
        style={{
          backgroundColor: colors.surface || colors.background,
          borderRadius: `${theme.radii[3]}px`,
          padding: "40px",
          boxShadow: theme.shadows[3],
          maxWidth: "400px",
          textAlign: "center",
          border: `1px solid ${colors.border}`,
        }}
      >
        {status === "approved" ? (
          <>
            <div
              style={{
                fontSize: "48px",
                marginBottom: "20px",
                color: colors.success,
              }}
            >
              ✅
            </div>
            <h1
              style={{
                fontSize: `${theme.fontSizes[5]}px`,
                fontWeight: theme.fontWeights.heading,
                marginBottom: "10px",
                color: colors.text,
              }}
            >
              Authentication Successful!
            </h1>
            <p
              style={{
                color: colors.textSecondary,
                marginBottom: "20px",
                fontSize: `${theme.fontSizes[2]}px`,
                lineHeight: theme.lineHeights.body,
              }}
            >
              Welcome, {handle}! You can now close this window and return to the
              app.
            </p>
            <div
              style={{
                backgroundColor: colors.backgroundSecondary,
                padding: "15px",
                borderRadius: `${theme.radii[2]}px`,
                fontSize: `${theme.fontSizes[1]}px`,
                wordBreak: "break-all",
                marginBottom: "20px",
                border: `1px solid ${colors.border}`,
              }}
            >
              <strong style={{ color: colors.text }}>
                Your token (copy if needed):
              </strong>
              <br />
              <code
                style={{
                  fontSize: `${theme.fontSizes[0]}px`,
                  fontFamily: theme.fonts.monospace,
                  color: colors.textTertiary,
                }}
              >
                {token || "Token hidden for security"}
              </code>
            </div>
          </>
        ) : status === "waitlisted" ? (
          <>
            <div
              style={{
                fontSize: "48px",
                marginBottom: "20px",
                color: colors.warning,
              }}
            >
              ⏳
            </div>
            <h1
              style={{
                fontSize: `${theme.fontSizes[5]}px`,
                fontWeight: theme.fontWeights.heading,
                marginBottom: "10px",
                color: colors.text,
              }}
            >
              You&apos;re on the Waitlist
            </h1>
            <p
              style={{
                color: colors.textSecondary,
                fontSize: `${theme.fontSizes[2]}px`,
                lineHeight: theme.lineHeights.body,
              }}
            >
              Thanks for your interest, {handle}! We&apos;ll notify you when you&apos;re
              approved.
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: "48px",
                marginBottom: "20px",
                color: colors.error,
              }}
            >
              ❌
            </div>
            <h1
              style={{
                fontSize: `${theme.fontSizes[5]}px`,
                fontWeight: theme.fontWeights.heading,
                marginBottom: "10px",
                color: colors.text,
              }}
            >
              Access Denied
            </h1>
            <p
              style={{
                color: colors.textSecondary,
                fontSize: `${theme.fontSizes[2]}px`,
                lineHeight: theme.lineHeights.body,
              }}
            >
              Sorry, you don&apos;t have access to this application.
            </p>
          </>
        )}

        <button
          onClick={() => window.close()}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: colors.primary,
            color: isDarkMode ? colors.text : "#FFFFFF",
            border: "none",
            borderRadius: `${theme.radii[2]}px`,
            fontSize: `${theme.fontSizes[2]}px`,
            fontWeight: theme.fontWeights.medium,
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary;
          }}
        >
          Close Window
        </button>
      </div>
    </div>
  );
}

export default function OrbitSuccessPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            backgroundColor: theme.colors.background,
          }}
        >
          <div
            style={{
              color: theme.colors.text,
              fontSize: `${theme.fontSizes[3]}px`,
              fontFamily: theme.fonts.body,
            }}
          >
            Loading...
          </div>
        </div>
      }
    >
      <OrbitSuccessContent />
    </Suspense>
  );
}
