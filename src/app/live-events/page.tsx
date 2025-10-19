"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@a24z/industry-theme";
import { Logo } from "@a24z/logo-component";
import { RepositoryCard } from "../../components/RepositoryCard";
import { EventTimeline } from "../../components/EventTimeline";

export default function LiveEventsPage() {
  const { theme } = useTheme();

  // Add global styles for animations and prevent scrolling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      body, html {
        overflow: hidden;
        height: 100vh;
        position: fixed;
        width: 100%;
      }
    `;
    document.head.appendChild(style);

    // Store original body styles
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;

    return () => {
      document.head.removeChild(style);
      // Restore original styles
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
    };
  }, []);
  const [repositories, setRepositories] = useState<Array<{
    repoName: string;
    repoOwner: string;
    lastActivityMs: number;
  }>>([]);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [selectedSession, setSelectedSession] = useState<{
    sessionId: string;
    repoOwner?: string;
    repoName?: string;
  } | null>(null);
  const [user, setUser] = useState<{
    id: string;
    email: string;
    login: string;
    name: string;
    avatar_url: string | null;
  } | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/user');
        const data = await response.json();

        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    // Check for auth errors in URL
    const params = new URLSearchParams(window.location.search);
    const authError = params.get('auth_error');
    const errorMessage = params.get('error_message');

    if (authError) {
      console.error('Authentication error:', authError, errorMessage);

      // Provide specific help for email verification error
      if (errorMessage?.includes('Email ownership must be verified')) {
        alert(
          '⚠️ Email Verification Required\n\n' +
          'WorkOS requires your email to be verified before authentication.\n\n' +
          'To fix this:\n' +
          '1. Check your email inbox for a verification link from WorkOS\n' +
          '2. OR verify your email in GitHub settings (https://github.com/settings/emails)\n' +
          '3. OR configure WorkOS to skip email verification for development\n\n' +
          'See console for instructions on disabling email verification.'
        );
        console.log(
          '%c WorkOS Email Verification Error',
          'color: orange; font-weight: bold; font-size: 14px;',
          '\n\nTo disable email verification in WorkOS (development only):\n' +
          '1. Go to https://dashboard.workos.com/\n' +
          '2. Select your project\n' +
          '3. Go to Authentication → Configuration\n' +
          '4. Look for "Email Verification" settings\n' +
          '5. Disable "Require email verification" for development\n\n' +
          'OR verify your GitHub email at: https://github.com/settings/emails'
        );
      } else {
        alert(`Authentication failed: ${errorMessage || authError}\n\nPlease check the console for more details.`);
      }

      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    checkAuth();
  }, []);

  // Fetch repositories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch repositories by activity
        const repoByActivityResponse = await fetch('/api/agent-events/repositories-by-activity');
        const repoByActivityData = await repoByActivityResponse.json();

        if (repoByActivityResponse.ok) {
          setRepositories(repoByActivityData.repositories || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Initial fetch
    fetchData();

    // Fetch every 5 seconds (5000ms) to match sync interval
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const isMobile = windowWidth < 768;

  // Handle timeline session click
  const handleTimelineEventClick = (event: {
    sessionId?: string;
    repoOwner?: string;
    repoName?: string;
  }) => {
    if (event.sessionId) {
      setSelectedSession({
        sessionId: event.sessionId,
        repoOwner: event.repoOwner,
        repoName: event.repoName,
      });
    }
  };

  // Handle repository timeline session click
  const handleRepositorySessionClick = (repoOwner: string, repoName: string) => (sessionId: string) => {
    setSelectedSession({
      sessionId,
      repoOwner,
      repoName,
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        backgroundColor: theme.colors.background,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header with Logo */}
      <div
        style={{
          borderBottom: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.backgroundSecondary,
        }}
      >
        <div
          style={{
            padding: isMobile ? "8px 16px" : "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Logo
                width={isMobile ? 60 : 80}
                height={isMobile ? 60 : 80}
                color={theme.colors.primary}
                particleColor={theme.colors.accent}
                opacity={0.9}
              />
            </Link>
            <div>
              <h1
                style={{
                  fontSize: isMobile ? "24px" : "32px",
                  fontWeight: "700",
                  color: theme.colors.text,
                  margin: 0,
                }}
              >
                Engineer Activity
              </h1>
            </div>
          </div>

          {/* Auth Section */}
          {isLoadingAuth ? (
            <div style={{ padding: `${theme.space[2]} ${theme.space[4]}` }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  border: `2px solid ${theme.colors.border}`,
                  borderTopColor: theme.colors.primary,
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
            </div>
          ) : user ? (
            // User Menu
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.space[3],
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.space[2],
                }}
              >
                {user.avatar_url && (
                  <Image
                    src={user.avatar_url}
                    alt={user.name}
                    width={isMobile ? 32 : 40}
                    height={isMobile ? 32 : 40}
                    style={{
                      borderRadius: "50%",
                      border: `2px solid ${theme.colors.border}`,
                    }}
                  />
                )}
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
                      fontWeight: theme.fontWeights.semibold,
                      color: theme.colors.text,
                    }}
                  >
                    {user.name}
                  </div>
                  <div
                    style={{
                      fontSize: theme.fontSizes[0],
                      color: theme.colors.textSecondary,
                    }}
                  >
                    @{user.login}
                  </div>
                </div>
              </div>
              <button
                onClick={async () => {
                  try {
                    await fetch("/api/auth/user", { method: "DELETE" });
                    setUser(null);
                  } catch (error) {
                    console.error("Logout error:", error);
                  }
                }}
                style={{
                  padding: isMobile ? "8px 12px" : "12px 16px",
                  backgroundColor: theme.colors.backgroundSecondary,
                  color: theme.colors.text,
                  borderRadius: theme.radii[2],
                  border: `1px solid ${theme.colors.border}`,
                  fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
                  fontWeight: theme.fontWeights.medium,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.background;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            // Login Button
            <button
              onClick={async () => {
                try {
                  // Generate PKCE challenge for secure authentication
                  const generateCodeChallenge = async () => {
                    const codeVerifier =
                      Math.random().toString(36).substring(2, 15) +
                      Math.random().toString(36).substring(2, 15);
                    const encoder = new TextEncoder();
                    const data = encoder.encode(codeVerifier);
                    const hash = await crypto.subtle.digest("SHA-256", data);
                    const codeChallenge = btoa(
                      String.fromCharCode(...new Uint8Array(hash)),
                    )
                      .replace(/\+/g, "-")
                      .replace(/\//g, "_")
                      .replace(/=+$/, "");
                    return { codeVerifier, codeChallenge };
                  };

                  const { codeVerifier, codeChallenge } =
                    await generateCodeChallenge();
                  const state = Math.random().toString(36).substring(2, 15);

                  // Store for later verification
                  sessionStorage.setItem("code_verifier", codeVerifier);
                  sessionStorage.setItem("oauth_state", state);

                  // Call WorkOS auth start endpoint
                  const response = await fetch("/api/auth/workos/start", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      code_challenge: codeChallenge,
                      state,
                      return_url: window.location.href, // Return to current page after auth
                    }),
                  });

                  const data = await response.json();

                  if (data.auth_url) {
                    window.location.href = data.auth_url;
                  } else {
                    console.error("Failed to get auth URL:", data);
                    alert("Authentication setup failed. Please try again.");
                  }
                } catch (error) {
                  console.error("Login error:", error);
                  alert("An error occurred. Please try again.");
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: isMobile ? "8px 12px" : "12px 16px",
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
                borderRadius: theme.radii[2],
                border: "none",
                fontSize: isMobile ? theme.fontSizes[1] : theme.fontSizes[2],
                fontWeight: theme.fontWeights.semibold,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.backgroundColor = theme.colors.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = theme.colors.primary;
              }}
            >
              <svg
                width={isMobile ? "16" : "20"}
                height={isMobile ? "16" : "20"}
                viewBox="0 0 98 96"
                fill="currentColor"
              >
                <path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
              </svg>
              <span>{isMobile ? "Login" : "Login with GitHub"}</span>
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          padding: isMobile ? "20px" : "24px 40px",
          flex: 1,
          overflow: "auto",
        }}
      >
        {/* Event Timeline - 24 hour view */}
        <div style={{ marginBottom: theme.space[4] }}>
          <EventTimeline
            hours={24}
            height={160}
            onEventClick={handleTimelineEventClick}
          />
        </div>

        {/* Repository Cards - ordered by most recent activity */}
        {repositories.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: theme.space[6],
              color: theme.colors.textSecondary,
            }}
          >
            No repository activity found
          </div>
        ) : (
          repositories.map((repo) => (
            <RepositoryCard
              key={`${repo.repoOwner}/${repo.repoName}`}
              owner={repo.repoOwner}
              repo={repo.repoName}
              lastActivityMs={repo.lastActivityMs}
              selectedSession={
                selectedSession?.repoOwner === repo.repoOwner &&
                selectedSession?.repoName === repo.repoName
                  ? selectedSession.sessionId
                  : null
              }
              onSessionClick={handleRepositorySessionClick(repo.repoOwner, repo.repoName)}
            />
          ))
        )}
      </div>
    </div>
  );
}
