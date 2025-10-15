"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@a24z/industry-theme";
import { Logo } from "@a24z/logo-component";
import { RepositoryMap } from "../../components/repository-map";
import { RepositoryList } from "../../components/RepositoryList";

export default function LiveEventsPage() {
  const { theme } = useTheme();

  // Add global styles for animations
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
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [sessionCount, setSessionCount] = useState<number | null>(null);
  const [sessionCountError, setSessionCountError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<{ owner: string; name: string } | null>(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch session count from API
  useEffect(() => {
    const fetchSessionCount = async () => {
      try {
        const response = await fetch('/api/agent-events/session-count');
        const data = await response.json();

        if (response.ok) {
          setSessionCount(data.count);
          setSessionCountError(null);
        } else {
          setSessionCountError(data.message || 'Failed to fetch session count');
        }
      } catch (error) {
        setSessionCountError('Network error fetching session count');
        console.error('Error fetching session count:', error);
      }
    };

    // Initial fetch
    fetchSessionCount();

    // Fetch every 5 seconds (5000ms) to match sync interval
    const interval = setInterval(fetchSessionCount, 5000);

    return () => clearInterval(interval);
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
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
            maxWidth: "1400px",
            margin: "0 auto",
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
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
              Principal View
            </h1>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isMobile ? "40px 20px" : "60px 40px",
        }}
      >
        {/* Main Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "24px",
          }}
        >
        {/* Session Count Card */}
        <div
          style={{
            gridColumn: "1 / -1",
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: theme.radii[2],
            padding: theme.space[4],
            border: `2px solid ${theme.colors.primary}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: theme.fontSizes[2],
                fontWeight: theme.fontWeights.heading,
                marginBottom: theme.space[1],
                color: theme.colors.textSecondary,
              }}
            >
              Sessions in Last 24 Hours
            </h2>
            <div
              style={{
                fontSize: "48px",
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.primary,
                lineHeight: 1,
              }}
            >
              {sessionCount !== null ? sessionCount : '...'}
            </div>
            {sessionCountError && (
              <div
                style={{
                  fontSize: theme.fontSizes[0],
                  color: theme.colors.error,
                  marginTop: theme.space[2],
                }}
              >
                {sessionCountError}
              </div>
            )}
          </div>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: sessionCount !== null ? theme.colors.success : theme.colors.textMuted,
              animation: sessionCount !== null ? "pulse 2s infinite" : "none",
            }}
          />
        </div>

        {/* Two Column Layout: Public Repos Left, Map Right */}
        <div
          style={{
            gridColumn: "1 / -1",
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "400px 1fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Public Repository List */}
          <div>
            <RepositoryList
              refreshInterval={30000}
              showOnlyPublic={true}
              onSelectRepo={setSelectedRepo}
              selectedRepo={selectedRepo}
            />
          </div>

          {/* Repository Map */}
          <div
            style={{
              height: "600px",
              minHeight: "600px",
            }}
          >
            {selectedRepo ? (
              <RepositoryMap owner={selectedRepo.owner} repo={selectedRepo.name} />
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderRadius: theme.radii[2],
                  border: `1px solid ${theme.colors.border}`,
                  color: theme.colors.textSecondary,
                }}
              >
                Select a repository to view its map
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
