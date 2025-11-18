"use client";

import React, { useState } from "react";
import { useTheme } from "@principal-ade/industry-theme";

export interface CommitSummary {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  url: string;
  timestampMs: number; // For positioning on timeline
  repoOwner: string;
  repoName: string;
}

interface CommitCardProps {
  commit: CommitSummary;
  onClick?: () => void;
}

export const CommitCard: React.FC<CommitCardProps> = ({
  commit,
  onClick,
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Generate consistent color based on repository (different hue offset from sessions)
  const repoKey = `${commit.repoOwner}/${commit.repoName}`;
  const colorSeed = repoKey
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Use a different calculation to distinguish from session cards
  const accentColor = `hsl(${(colorSeed * 137.5 + 180) % 360}, 70%, 55%)`;

  // Format time
  const commitTimeText = new Date(commit.timestampMs).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  // Get first line of commit message
  const firstLine = commit.message.split('\n')[0];
  const displayMessage = firstLine.length > 50
    ? firstLine.slice(0, 50) + '...'
    : firstLine;

  // Shortened SHA
  const shortSha = commit.sha.slice(0, 7);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: open commit in new tab
      window.open(commit.url, '_blank');
    }
  };

  return (
    <div
      style={{
        backgroundColor: theme.colors.backgroundSecondary,
        borderTopWidth: "1px",
        borderTopStyle: "solid",
        borderTopColor: isHovered ? accentColor : theme.colors.border,
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderRightColor: isHovered ? accentColor : theme.colors.border,
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: isHovered ? accentColor : theme.colors.border,
        borderLeftWidth: "3px",
        borderLeftStyle: "solid",
        borderLeftColor: accentColor,
        borderRadius: theme.radii[1],
        padding: `${theme.space[2]} ${theme.space[3]}`,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: isHovered
          ? `0 2px 8px ${theme.colors.border}`
          : "none",
        opacity: isHovered ? 1 : 0.9,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header: Commit Icon and Time */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.space[2],
          marginBottom: theme.space[1],
        }}
      >
        {/* Git commit icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke={accentColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="8" cy="8" r="3" />
          <line x1="0" y1="8" x2="5" y2="8" />
          <line x1="11" y1="8" x2="16" y2="8" />
        </svg>
        <div
          style={{
            fontSize: theme.fontSizes[0],
            fontWeight: theme.fontWeights.semibold,
            color: theme.colors.text,
          }}
        >
          {commitTimeText}
        </div>
        <div
          style={{
            fontSize: theme.fontSizes[0],
            color: theme.colors.textMuted,
            fontFamily: "monospace",
          }}
        >
          {shortSha}
        </div>
      </div>

      {/* Commit Message */}
      <div
        style={{
          fontSize: theme.fontSizes[0],
          color: theme.colors.textSecondary,
          marginBottom: theme.space[1],
          lineHeight: "1.4",
        }}
      >
        {displayMessage}
      </div>

      {/* Author */}
      <div
        style={{
          fontSize: theme.fontSizes[0],
          color: theme.colors.textMuted,
        }}
      >
        {commit.author.name}
      </div>
    </div>
  );
};
