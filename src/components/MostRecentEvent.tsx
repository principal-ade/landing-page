"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@a24z/industry-theme";

interface RecentEvent {
  sessionId: string;
  timestamp: string;
  timestampMs: number;
  repoName: string;
  repoOwner: string;
  eventType: string;
  toolName?: string;
  prompt?: string;
}

interface MostRecentEventProps {
  onRepoSelect?: (owner: string, repo: string) => void;
  refreshInterval?: number;
}

export const MostRecentEvent: React.FC<MostRecentEventProps> = ({
  onRepoSelect,
  refreshInterval = 5000,
}) => {
  const { theme } = useTheme();
  const [event, setEvent] = useState<RecentEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentEvent = async () => {
      try {
        const response = await fetch('/api/agent-events/recent');
        const data = await response.json();

        if (response.ok && data.event) {
          setEvent(data.event);
          setError(null);

          // Auto-select the repository
          if (onRepoSelect && data.event.repoOwner && data.event.repoName) {
            onRepoSelect(data.event.repoOwner, data.event.repoName);
          }
        } else {
          setError(data.message || "No recent events found");
        }
      } catch (err) {
        setError("Network error fetching recent event");
        console.error("Error fetching recent event:", err);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchRecentEvent();

    // Refresh periodically
    const interval = setInterval(fetchRecentEvent, refreshInterval);

    return () => clearInterval(interval);
  }, [onRepoSelect, refreshInterval]);

  const formatRelativeTime = (timestampMs: number) => {
    const now = Date.now();
    const diff = now - timestampMs;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (seconds < 10) return "just now";
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getEventTypeLabel = (eventType: string) => {
    switch (eventType) {
      case "tool_call":
        return "Tool Call";
      case "user_prompt":
        return "User Prompt";
      case "session_start":
        return "Session Start";
      default:
        return eventType;
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case "tool_call":
        return theme.colors.accent;
      case "user_prompt":
        return theme.colors.primary;
      case "session_start":
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
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
          Most Recent Event
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

  if (error || !event) {
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
          Most Recent Event
        </h3>
        <p
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.fontSizes[1],
            textAlign: "center",
          }}
        >
          {error || "No events found"}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.radii[2],
        border: `2px solid ${getEventTypeColor(event.eventType)}`,
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
        Most Recent Event
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: theme.space[3] }}>
        {/* Event Type Badge */}
        <div
          style={{
            display: "inline-block",
            padding: `${theme.space[1]} ${theme.space[2]}`,
            backgroundColor: getEventTypeColor(event.eventType) + "20",
            borderRadius: theme.radii[1],
            border: `1px solid ${getEventTypeColor(event.eventType)}`,
            fontSize: theme.fontSizes[0],
            fontWeight: theme.fontWeights.medium,
            color: getEventTypeColor(event.eventType),
            alignSelf: "flex-start",
          }}
        >
          {getEventTypeLabel(event.eventType)}
        </div>

        {/* Repository Info */}
        <div>
          <div
            style={{
              fontSize: theme.fontSizes[0],
              color: theme.colors.textSecondary,
              marginBottom: theme.space[1],
            }}
          >
            Repository
          </div>
          <div
            style={{
              fontSize: theme.fontSizes[1],
              fontWeight: theme.fontWeights.medium,
              color: theme.colors.text,
              fontFamily: "monospace",
            }}
          >
            {event.repoOwner}/{event.repoName}
          </div>
        </div>

        {/* Tool Name (if applicable) */}
        {event.toolName && (
          <div>
            <div
              style={{
                fontSize: theme.fontSizes[0],
                color: theme.colors.textSecondary,
                marginBottom: theme.space[1],
              }}
            >
              Tool
            </div>
            <div
              style={{
                fontSize: theme.fontSizes[1],
                color: theme.colors.text,
                fontFamily: "monospace",
              }}
            >
              {event.toolName}
            </div>
          </div>
        )}

        {/* Prompt Preview (if applicable) */}
        {event.prompt && (
          <div>
            <div
              style={{
                fontSize: theme.fontSizes[0],
                color: theme.colors.textSecondary,
                marginBottom: theme.space[1],
              }}
            >
              Prompt
            </div>
            <div
              style={{
                fontSize: theme.fontSizes[0],
                color: theme.colors.text,
                fontStyle: "italic",
                wordBreak: "break-word",
              }}
            >
              {event.prompt}
            </div>
          </div>
        )}

        {/* Session ID */}
        <div>
          <div
            style={{
              fontSize: theme.fontSizes[0],
              color: theme.colors.textSecondary,
              marginBottom: theme.space[1],
            }}
          >
            Session
          </div>
          <div
            style={{
              fontSize: theme.fontSizes[0],
              color: theme.colors.text,
              fontFamily: "monospace",
            }}
          >
            {event.sessionId.substring(0, 12)}...
          </div>
        </div>

        {/* Timestamp */}
        <div
          style={{
            fontSize: theme.fontSizes[0],
            color: theme.colors.textSecondary,
            paddingTop: theme.space[2],
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          {formatRelativeTime(event.timestampMs)}
        </div>
      </div>
    </div>
  );
};
