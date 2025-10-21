"use client";

import React, { useState } from "react";
import { useTheme } from "@a24z/industry-theme";

export interface SessionSummary {
  sessionId: string;
  startTime: number;
  endTime: number;
  eventCount: number;
  repoOwner?: string;
  repoName?: string;
  tools?: string[]; // Most used tools
  eventTypes?: string[]; // Types of events (Read, Write, Edit, etc.)
}

interface SessionCardProps {
  session: SessionSummary;
  onClick?: () => void;
  isExpanded?: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onClick,
  isExpanded = false,
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Generate consistent color based on repository
  const repoKey =
    session.repoOwner && session.repoName
      ? `${session.repoOwner}/${session.repoName}`
      : session.sessionId;
  const colorSeed = repoKey
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const accentColor = `hsl(${(colorSeed * 137.5) % 360}, 60%, 60%)`;

  // Calculate duration
  const durationMs = session.endTime - session.startTime;
  const durationMinutes = Math.round(durationMs / 60000);
  const durationText =
    durationMinutes < 60
      ? `${durationMinutes}m`
      : `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;

  // Format time
  const startTimeText = new Date(session.startTime).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const endTimeText = new Date(session.endTime).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        backgroundColor: theme.colors.background,
        borderTopWidth: "1px",
        borderTopStyle: "solid",
        borderTopColor: isHovered || isExpanded ? accentColor : theme.colors.border,
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderRightColor: isHovered || isExpanded ? accentColor : theme.colors.border,
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: isHovered || isExpanded ? accentColor : theme.colors.border,
        borderLeftWidth: "4px",
        borderLeftStyle: "solid",
        borderLeftColor: accentColor,
        borderRadius: theme.radii[2],
        padding: theme.space[3],
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: isHovered || isExpanded
          ? `0 4px 12px ${theme.colors.border}`
          : "none",
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header: Time and Duration */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.space[2],
        }}
      >
        <div
          style={{
            fontSize: theme.fontSizes[1],
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
          }}
        >
          {startTimeText} - {endTimeText}
        </div>
        <div
          style={{
            fontSize: theme.fontSizes[0],
            color: theme.colors.textSecondary,
            backgroundColor: theme.colors.backgroundSecondary,
            padding: "2px 8px",
            borderRadius: theme.radii[1],
          }}
        >
          {durationText}
        </div>
      </div>

      {/* Repository Info */}
      {session.repoOwner && session.repoName && (
        <div
          style={{
            fontSize: theme.fontSizes[1],
            color: theme.colors.text,
            marginBottom: theme.space[2],
            fontFamily: "monospace",
          }}
        >
          {session.repoOwner}/<strong>{session.repoName}</strong>
        </div>
      )}

      {/* Session ID (truncated) */}
      <div
        style={{
          fontSize: theme.fontSizes[0],
          color: theme.colors.textMuted,
          fontFamily: "monospace",
          marginBottom: theme.space[2],
        }}
      >
        Session: {session.sessionId.slice(0, 8)}...
      </div>

      {/* Event Count and Types */}
      <div
        style={{
          display: "flex",
          gap: theme.space[2],
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: theme.fontSizes[0],
            color: theme.colors.textSecondary,
          }}
        >
          {session.eventCount} events
        </div>

        {/* Tool badges */}
        {session.tools && session.tools.length > 0 && (
          <div style={{ display: "flex", gap: theme.space[1], flexWrap: "wrap" }}>
            {session.tools.slice(0, 3).map((tool, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: theme.fontSizes[0],
                  color: theme.colors.accent,
                  backgroundColor: theme.colors.backgroundSecondary,
                  padding: "2px 6px",
                  borderRadius: theme.radii[1],
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                {tool}
              </div>
            ))}
            {session.tools.length > 3 && (
              <div
                style={{
                  fontSize: theme.fontSizes[0],
                  color: theme.colors.textMuted,
                  padding: "2px 6px",
                }}
              >
                +{session.tools.length - 3} more
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expanded details */}
      {isExpanded && session.eventTypes && session.eventTypes.length > 0 && (
        <div
          style={{
            marginTop: theme.space[3],
            paddingTop: theme.space[3],
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          <div
            style={{
              fontSize: theme.fontSizes[0],
              color: theme.colors.textSecondary,
              marginBottom: theme.space[1],
            }}
          >
            Event Types:
          </div>
          <div style={{ display: "flex", gap: theme.space[1], flexWrap: "wrap" }}>
            {session.eventTypes.map((type, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: theme.fontSizes[0],
                  color: theme.colors.text,
                  backgroundColor: theme.colors.backgroundSecondary,
                  padding: "2px 6px",
                  borderRadius: theme.radii[1],
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                {type}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
