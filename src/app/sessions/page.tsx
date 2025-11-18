"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTheme } from "@principal-ade/industry-theme";
import { Logo } from "@principal-ai/logo-component";
import { SessionSummary } from "../../components/SessionCard";
import { useAuth } from "@/hooks/useAuth";

// Dynamically import components that use browser-only APIs (xterm)
const VerticalTimeline = dynamic(
  () => import("../../components/VerticalTimeline").then(mod => ({ default: mod.VerticalTimeline })),
  { ssr: false }
);

const SessionModal = dynamic(
  () => import("../../components/SessionModal").then(mod => ({ default: mod.SessionModal })),
  { ssr: false }
);

export default function SessionsPage() {
  const { theme } = useTheme();
  const { user, loading: isLoadingAuth, login, logout } = useAuth();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [selectedSession, setSelectedSession] = useState<SessionSummary | null>(null);

  // Add global styles for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Login handler
  const handleLogin = async () => {
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

      const { codeVerifier, codeChallenge } = await generateCodeChallenge();

      // Store code verifier for later verification
      sessionStorage.setItem("code_verifier", codeVerifier);

      // Call login from auth provider
      await login(codeChallenge);
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }
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
                Session Timeline
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
                    unoptimized
                    style={{
                      borderRadius: "50%",
                      border: `2px solid ${theme.colors.border}`,
                    }}
                    onError={(e) => {
                      console.error("Failed to load avatar:", user.avatar_url);
                      e.currentTarget.style.display = "none";
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
                onClick={logout}
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
              onClick={handleLogin}
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
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              Login with GitHub
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        <VerticalTimeline
          hours={24}
          githubToken={user?.github_access_token || null}
          onSessionClick={(session) => setSelectedSession(session)}
        />
      </div>

      {/* Session Modal */}
      {selectedSession && (
        <SessionModal
          sessionId={selectedSession.sessionId}
          repoOwner={selectedSession.repoOwner}
          repoName={selectedSession.repoName}
          onClose={() => setSelectedSession(null)}
          githubToken={user?.github_access_token || null}
        />
      )}
    </div>
  );
}
