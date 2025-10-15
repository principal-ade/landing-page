"use client";

import React, { useState } from "react";
import { useTheme } from "@a24z/industry-theme";
import { RepositoryMap } from "./repository-map";
import { SessionList } from "./SessionList";
import { EventList } from "./EventList";

interface RepositoryCardProps {
  owner: string;
  repo: string;
  lastActivityMs: number;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  owner,
  repo,
  lastActivityMs,
}) => {
  const { theme } = useTheme();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

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

  return (
    <div
      style={{
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.radii[2],
        border: `2px solid ${theme.colors.border}`,
        padding: theme.space[4],
        marginBottom: theme.space[4],
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.space[4],
          paddingBottom: theme.space[3],
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: theme.fontSizes[3],
              fontWeight: theme.fontWeights.bold,
              color: theme.colors.text,
              margin: 0,
              marginBottom: theme.space[1],
              fontFamily: "monospace",
            }}
          >
            {owner}/{repo}
          </h2>
          <div
            style={{
              fontSize: theme.fontSizes[0],
              color: theme.colors.textSecondary,
            }}
          >
            Last activity: {formatRelativeTime(lastActivityMs)}
          </div>
        </div>
      </div>

      {/* Three column layout: Sessions (left), Map (middle), Events (right) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr 300px",
          gap: theme.space[4],
          alignItems: "start",
        }}
      >
        {/* Sessions List */}
        <div>
          <SessionList
            owner={owner}
            repo={repo}
            onSelectSession={setSelectedSession}
            selectedSession={selectedSession}
            refreshInterval={5000}
          />
        </div>

        {/* Repository Map */}
        <div
          style={{
            height: "500px",
            minHeight: "500px",
          }}
        >
          <RepositoryMap owner={owner} repo={repo} />
        </div>

        {/* Event List or Placeholder */}
        <div>
          {selectedSession ? (
            <EventList
              sessionId={selectedSession}
              refreshInterval={5000}
            />
          ) : (
            <div
              style={{
                height: "500px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.colors.background,
                borderRadius: theme.radii[2],
                border: `1px solid ${theme.colors.border}`,
                color: theme.colors.textSecondary,
                padding: theme.space[4],
                textAlign: "center",
              }}
            >
              Select a session to view events
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
