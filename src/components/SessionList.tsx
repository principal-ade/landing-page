"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@a24z/industry-theme";

interface Session {
  sessionId: string;
  timestamp: string;
  timestampMs: number;
  repoName: string;
  repoOwner: string;
}

interface SessionListProps {
  owner: string;
  repo: string;
  onSelectSession: (sessionId: string) => void;
  selectedSession: string | null;
  refreshInterval?: number;
}

export const SessionList: React.FC<SessionListProps> = ({
  owner,
  repo,
  onSelectSession,
  selectedSession,
  refreshInterval = 5000,
}) => {
  const { theme } = useTheme();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(
          `/api/agent-events/sessions?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repo)}`
        );
        const data = await response.json();

        if (response.ok) {
          setSessions(data.sessions || []);
          setError(null);
        } else {
          setError(data.message || "Failed to fetch sessions");
        }
      } catch (err) {
        setError("Network error fetching sessions");
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchSessions();

    // Refresh periodically
    const interval = setInterval(fetchSessions, refreshInterval);

    return () => clearInterval(interval);
  }, [owner, repo, refreshInterval]);

  const formatRelativeTime = (timestampMs: number) => {
    const now = Date.now();
    const diff = now - timestampMs;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: theme.colors.backgroundSecondary,
          borderRadius: theme.radii[2],
          border: `1px solid ${theme.colors.border}`,
          padding: theme.space[4],
        }}
      >
        <h3
          style={{
            fontSize: theme.fontSizes[2],
            fontWeight: theme.fontWeights.heading,
            marginBottom: theme.space[3],
            color: theme.colors.text,
          }}
        >
          Agent Sessions
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: theme.space[4],
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              border: `2px solid ${theme.colors.border}`,
              borderTopColor: theme.colors.primary,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundColor: theme.colors.backgroundSecondary,
          borderRadius: theme.radii[2],
          border: `1px solid ${theme.colors.error}`,
          padding: theme.space[4],
        }}
      >
        <h3
          style={{
            fontSize: theme.fontSizes[2],
            fontWeight: theme.fontWeights.heading,
            marginBottom: theme.space[3],
            color: theme.colors.text,
          }}
        >
          Agent Sessions
        </h3>
        <p style={{ color: theme.colors.error, fontSize: theme.fontSizes[1] }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.radii[2],
        border: `1px solid ${theme.colors.border}`,
        padding: theme.space[4],
        maxHeight: "600px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3
        style={{
          fontSize: theme.fontSizes[2],
          fontWeight: theme.fontWeights.heading,
          marginBottom: theme.space[3],
          color: theme.colors.text,
        }}
      >
        Agent Sessions
      </h3>
      <div
        style={{
          fontSize: theme.fontSizes[0],
          color: theme.colors.textSecondary,
          marginBottom: theme.space[3],
        }}
      >
        {sessions.length} session{sessions.length !== 1 ? "s" : ""} found
      </div>
      <div
        style={{
          overflowY: "auto",
          flex: 1,
        }}
      >
        {sessions.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: theme.space[4],
              color: theme.colors.textMuted,
            }}
          >
            No sessions found for this repository
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: theme.space[2] }}>
            {sessions.map((session) => (
              <div
                key={session.sessionId}
                onClick={() => onSelectSession(session.sessionId)}
                style={{
                  padding: theme.space[3],
                  backgroundColor:
                    selectedSession === session.sessionId
                      ? theme.colors.primary + "20"
                      : theme.colors.background,
                  borderRadius: theme.radii[1],
                  border: `1px solid ${
                    selectedSession === session.sessionId
                      ? theme.colors.primary
                      : theme.colors.border
                  }`,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (selectedSession !== session.sessionId) {
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                    e.currentTarget.style.borderColor = theme.colors.primary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSession !== session.sessionId) {
                    e.currentTarget.style.backgroundColor = theme.colors.background;
                    e.currentTarget.style.borderColor = theme.colors.border;
                  }
                }}
              >
                <div
                  style={{
                    fontSize: theme.fontSizes[1],
                    fontWeight: theme.fontWeights.medium,
                    color: theme.colors.text,
                    marginBottom: theme.space[1],
                    wordBreak: "break-all",
                  }}
                >
                  {session.sessionId.substring(0, 8)}...
                </div>
                <div
                  style={{
                    fontSize: theme.fontSizes[0],
                    color: theme.colors.textSecondary,
                  }}
                >
                  {formatRelativeTime(session.timestampMs)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
