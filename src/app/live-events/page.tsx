"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  const [sessionCount, setSessionCount] = useState<number>(0);
  const [projectCount, setProjectCount] = useState<number>(0);
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

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch session count, repository count, and repositories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch session count
        const sessionResponse = await fetch('/api/agent-events/session-count');
        const sessionData = await sessionResponse.json();

        if (sessionResponse.ok) {
          setSessionCount(sessionData.count);
        }

        // Fetch repository count
        const repoResponse = await fetch('/api/agent-events/repositories');
        const repoData = await repoResponse.json();

        if (repoResponse.ok) {
          setProjectCount(repoData.count || 0);
        }

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
                Principal View
              </h1>
            </div>
          </div>

          {/* Session and Project Count */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.space[3],
              padding: isMobile ? theme.space[2] : theme.space[3],
              backgroundColor: theme.colors.background,
              borderRadius: theme.radii[2],
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: isMobile ? theme.fontSizes[2] : theme.fontSizes[3],
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.primary,
                  lineHeight: 1.2,
                }}
              >
                {sessionCount} / {projectCount}
              </div>
              <div
                style={{
                  fontSize: theme.fontSizes[0],
                  color: theme.colors.textSecondary,
                  marginTop: "2px",
                }}
              >
                sessions / projects
              </div>
            </div>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: sessionCount > 0 ? theme.colors.success : theme.colors.textMuted,
                animation: sessionCount > 0 ? "pulse 2s infinite" : "none",
              }}
            />
          </div>
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
            />
          ))
        )}
      </div>
    </div>
  );
}
