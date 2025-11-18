"use client";

import React, { useState } from "react";
import { useTheme } from "@principal-ade/industry-theme";

export interface SessionSummary {
  sessionId: string;
  startTime: number;
  endTime: number;
  eventCount: number;
  repoOwner?: string;
  repoName?: string;
  tools?: string[]; // Most used tools
  eventTypes?: string[]; // Types of events (Read, Write, Edit, etc.)
  hasGitActivity?: boolean; // Whether this session has git commands
  commitCount?: number; // Number of git commits in this session
  commitMessages?: string[]; // Commit messages from this session
  commitSHAs?: string[]; // SHAs of commits created in this session
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
  const [showOverviewModal, setShowOverviewModal] = useState(false);

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

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
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
        minHeight: "80px", // Ensure a minimum height even for very short sessions
        overflow: "hidden", // Prevent content from spilling out
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header: Start Time and Duration - Only show if no commits */}
      {!session.commitMessages?.length && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.space[2],
            marginBottom: theme.space[2],
            flexShrink: 0, // Don't shrink the header
          }}
        >
          <div
            style={{
              fontSize: theme.fontSizes[1],
              fontWeight: theme.fontWeights.bold,
              color: theme.colors.text,
            }}
          >
            {startTimeText}
          </div>
          <div
            style={{
              fontSize: theme.fontSizes[0],
              color: theme.colors.textSecondary,
            }}
          >
            • {durationText}
          </div>
        </div>
      )}

      {/* Git Activity Indicator */}
      {session.hasGitActivity && (
        <div
          style={{
            marginBottom: theme.space[2],
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {/* Commit message preview */}
          {session.commitMessages && session.commitMessages.length > 0 && (
            <div
              style={{
                padding: `${theme.space[2]} ${theme.space[2]}`,
                fontSize: theme.fontSizes[1],
                color: theme.colors.text,
                fontWeight: theme.fontWeights.medium,
                borderLeft: `3px solid ${accentColor}`,
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: `0 ${theme.radii[1]} ${theme.radii[1]} 0`,
                lineHeight: "1.5",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginBottom: theme.space[2],
              }}
            >
              {session.commitMessages[0].split('\n')[0]}
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: theme.space[2],
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick();
              }}
              style={{
                flex: 1,
                padding: `${theme.space[2]} ${theme.space[3]}`,
                backgroundColor: theme.colors.backgroundSecondary,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii[1],
                color: theme.colors.text,
                fontSize: theme.fontSizes[1],
                fontWeight: theme.fontWeights.medium,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.background;
                e.currentTarget.style.borderColor = accentColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                e.currentTarget.style.borderColor = theme.colors.border;
              }}
            >
              Events
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOverviewModal(true);
              }}
              style={{
                flex: 1,
                padding: `${theme.space[2]} ${theme.space[3]}`,
                backgroundColor: theme.colors.backgroundSecondary,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii[1],
                color: theme.colors.text,
                fontSize: theme.fontSizes[1],
                fontWeight: theme.fontWeights.medium,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.background;
                e.currentTarget.style.borderColor = accentColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                e.currentTarget.style.borderColor = theme.colors.border;
              }}
            >
              Overview
            </button>
          </div>
        </div>
      )}

      {/* Session ID at bottom - Only show if no commits */}
      {!session.commitMessages?.length && (
        <div
          style={{
            fontSize: theme.fontSizes[0],
            color: theme.colors.textMuted,
            fontFamily: "monospace",
            marginTop: "auto", // Push to bottom
            paddingTop: theme.space[2],
            flexShrink: 0,
          }}
        >
          Session: {session.sessionId.slice(0, 8)}...
        </div>
      )}

      {/* Overview Modal */}
      {showOverviewModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setShowOverviewModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: theme.colors.background,
              borderRadius: theme.radii[2],
              padding: theme.space[4],
              maxWidth: "600px",
              maxHeight: "80vh",
              overflow: "auto",
              border: `2px solid ${accentColor}`,
              boxShadow: `0 8px 32px ${theme.colors.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: theme.space[3],
                paddingBottom: theme.space[3],
                borderBottom: `1px solid ${theme.colors.border}`,
              }}
            >
              <h2
                style={{
                  fontSize: theme.fontSizes[3],
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.text,
                  margin: 0,
                }}
              >
                Session Overview
              </h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOverviewModal(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: theme.fontSizes[3],
                  color: theme.colors.textSecondary,
                  cursor: "pointer",
                  padding: theme.space[1],
                }}
              >
                ×
              </button>
            </div>

            {/* Session Info */}
            <div style={{ marginBottom: theme.space[3] }}>
              <div
                style={{
                  fontSize: theme.fontSizes[1],
                  color: theme.colors.textSecondary,
                  marginBottom: theme.space[2],
                }}
              >
                <strong>Session ID:</strong> {session.sessionId}
              </div>
              <div
                style={{
                  fontSize: theme.fontSizes[1],
                  color: theme.colors.textSecondary,
                  marginBottom: theme.space[2],
                }}
              >
                <strong>Time:</strong> {startTimeText} • {durationText}
              </div>
              <div
                style={{
                  fontSize: theme.fontSizes[1],
                  color: theme.colors.textSecondary,
                  marginBottom: theme.space[2],
                }}
              >
                <strong>Events:</strong> {session.eventCount}
              </div>
              {session.repoOwner && session.repoName && (
                <div
                  style={{
                    fontSize: theme.fontSizes[1],
                    color: theme.colors.textSecondary,
                    marginBottom: theme.space[2],
                  }}
                >
                  <strong>Repository:</strong> {session.repoOwner}/{session.repoName}
                </div>
              )}
            </div>

            {/* Commit Messages */}
            {session.commitMessages && session.commitMessages.length > 0 && (
              <div>
                <h3
                  style={{
                    fontSize: theme.fontSizes[2],
                    fontWeight: theme.fontWeights.semibold,
                    color: theme.colors.text,
                    marginBottom: theme.space[2],
                  }}
                >
                  Commits ({session.commitMessages.length})
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: theme.space[2],
                  }}
                >
                  {session.commitMessages.map((message, idx) => {
                    const firstLine = message.split('\n')[0];
                    const restOfMessage = message.split('\n').slice(1).join('\n').trim();

                    return (
                      <div
                        key={idx}
                        style={{
                          padding: theme.space[3],
                          borderLeft: `3px solid ${accentColor}`,
                          backgroundColor: theme.colors.backgroundSecondary,
                          borderRadius: `0 ${theme.radii[1]} ${theme.radii[1]} 0`,
                        }}
                      >
                        {/* First line */}
                        <div
                          style={{
                            fontSize: theme.fontSizes[1],
                            color: theme.colors.text,
                            fontWeight: theme.fontWeights.semibold,
                            marginBottom: restOfMessage ? theme.space[1] : 0,
                            lineHeight: "1.5",
                          }}
                        >
                          {firstLine}
                        </div>
                        {/* Rest of message */}
                        {restOfMessage && (
                          <div
                            style={{
                              fontSize: theme.fontSizes[0],
                              color: theme.colors.textSecondary,
                              whiteSpace: "pre-wrap",
                              lineHeight: "1.5",
                              wordBreak: "break-word",
                            }}
                          >
                            {restOfMessage}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
