"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@principal-ade/industry-theme";
import { Logo } from "@principal-ai/logo-component";
import { RepositorySelector } from "@/components/RepositorySelector";
import { MarkdownEditorView } from "@/components/MarkdownEditorView";
import { useAuth } from "@/hooks/useAuth";

interface SelectedRepository {
  owner: string;
  repo: string;
  branch: string;
}

const MarkdownEditorPage: React.FC = () => {
  const { theme } = useTheme();
  const { user, loading: isLoadingAuth, login, logout } = useAuth();
  const [selectedRepository, setSelectedRepository] = useState<SelectedRepository | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  const isMobile = windowWidth < 768;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      const generateCodeChallenge = async () => {
        const codeVerifier =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const hash = await crypto.subtle.digest("SHA-256", data);
        const codeChallenge = btoa(
          String.fromCharCode(...new Uint8Array(hash))
        )
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
        return { codeVerifier, codeChallenge };
      };

      const { codeVerifier, codeChallenge } = await generateCodeChallenge();

      sessionStorage.setItem("code_verifier", codeVerifier);

      await login(codeChallenge);
    } catch (loginError) {
      console.error("[Markdown Editor] Login error", loginError);
      alert("An error occurred. Please try again.");
    }
  }, [login]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setSelectedRepository(null);
    } catch (logoutError) {
      console.error("[Markdown Editor] Logout error", logoutError);
    }
  }, [logout]);

  const handleSelectRepository = useCallback(
    (owner: string, repo: string, branch: string) => {
      setSelectedRepository({ owner, repo, branch });
    },
    []
  );

  const handleBackToSelector = useCallback(() => {
    setSelectedRepository(null);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <header
        style={{
          borderBottom: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.backgroundSecondary,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: theme.space[4],
            padding: isMobile ? "8px 16px" : "16px 32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: theme.space[3] }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Logo
                width={isMobile ? 56 : 72}
                height={isMobile ? 56 : 72}
                color={theme.colors.primary}
                particleColor={theme.colors.accent}
                opacity={0.9}
              />
            </Link>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: isMobile ? "24px" : "32px",
                  fontWeight: 700,
                }}
              >
                Markdown Editor
              </h1>
              <div
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.fontSizes[1],
                }}
              >
                Browse and edit markdown files from GitHub repositories
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.space[3],
            }}
          >
            <Link
              href="/sessions"
              style={{
                padding: `${theme.space[2]} ${theme.space[3]}`,
                borderRadius: theme.radii[2],
                border: `1px solid ${theme.colors.border}`,
                textDecoration: "none",
                color: theme.colors.text,
                backgroundColor: theme.colors.background,
              }}
            >
              Sessions
            </Link>

            <Link
              href="/observatory"
              style={{
                padding: `${theme.space[2]} ${theme.space[3]}`,
                borderRadius: theme.radii[2],
                border: `1px solid ${theme.colors.border}`,
                textDecoration: "none",
                color: theme.colors.text,
                backgroundColor: theme.colors.background,
              }}
            >
              Observatory
            </Link>

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
                      fontWeight: theme.fontWeights.semibold,
                      fontSize: theme.fontSizes[2],
                    }}
                  >
                    {user.name}
                  </div>
                  <div
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: theme.fontSizes[0],
                    }}
                  >
                    @{user.login}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: `${theme.space[2]} ${theme.space[3]}`,
                    borderRadius: theme.radii[2],
                    border: `1px solid ${theme.colors.border}`,
                    backgroundColor: theme.colors.backgroundSecondary,
                    color: theme.colors.text,
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.space[2],
                  padding: `${theme.space[2]} ${theme.space[3]}`,
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.background,
                  borderRadius: theme.radii[2],
                  border: "none",
                  cursor: "pointer",
                  fontWeight: theme.fontWeights.semibold,
                }}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: isMobile ? "16px" : "24px 48px",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {selectedRepository ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
            <MarkdownEditorView
              repoOwner={selectedRepository.owner}
              repoName={selectedRepository.repo}
              branch={selectedRepository.branch}
              githubToken={user?.github_access_token || undefined}
              onBack={handleBackToSelector}
            />
          </div>
        ) : (
          <RepositorySelector
            githubToken={user?.github_access_token || undefined}
            onSelectRepository={handleSelectRepository}
          />
        )}
      </main>
    </div>
  );
};

export default MarkdownEditorPage;
