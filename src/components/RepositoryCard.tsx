"use client";

import React, { useState } from "react";
import { useTheme } from "@a24z/industry-theme";
import { RepositoryMap } from "./repository-map";
import { EventList } from "./EventList";
import { RepositoryTimeline } from "./RepositoryTimeline";

interface RepositoryCardProps {
  owner: string;
  repo: string;
  lastActivityMs: number;
  selectedSession?: string | null;
  onSessionClick?: (sessionId: string) => void;
}

interface CurrentEvent {
  normalized_files?: Array<{
    originalPath: string;
    absolutePath: string;
    displayPath: string;
    repository?: {
      gitRoot: string;
      relativePath: string;
      remoteUrl?: string;
      owner?: string;
      repo?: string;
    };
  }>;
  operation?: string;
  tool_name?: string;
  [key: string]: unknown;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  owner,
  repo,
  lastActivityMs,
  selectedSession = null,
  onSessionClick,
}) => {
  const { theme } = useTheme();
  const [currentEvent, setCurrentEvent] = useState<CurrentEvent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [accumulatedFiles, setAccumulatedFiles] = useState<{
    read: Set<string>;
    edited: Set<string>;
  }>({ read: new Set(), edited: new Set() });
  const previousEventTimestampRef = React.useRef<number | null>(null);

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

  // Track accumulated files from events
  React.useEffect(() => {
    if (!currentEvent) return;

    const currentTimestamp = (currentEvent as any).timestampMs || 0;
    const previousTimestamp = previousEventTimestampRef.current;

    // Reset accumulated files if we've gone back in time (playback reset or rewind)
    if (previousTimestamp !== null && currentTimestamp < previousTimestamp) {
      setAccumulatedFiles({ read: new Set(), edited: new Set() });
      previousEventTimestampRef.current = currentTimestamp;
      return;
    }

    // Update timestamp reference
    previousEventTimestampRef.current = currentTimestamp;

    // Extract file paths from the event
    const filePaths = currentEvent.normalized_files
      ?.map(file => file.repository?.relativePath || file.displayPath)
      .filter((path): path is string => !!path) || [];

    if (filePaths.length === 0) return;

    // Accumulate files based on operation type
    const operation = currentEvent.operation?.toLowerCase();

    setAccumulatedFiles(prev => {
      const newAccumulated = {
        read: new Set(prev.read),
        edited: new Set(prev.edited),
      };

      if (operation === 'read') {
        filePaths.forEach(path => newAccumulated.read.add(path));
      } else if (operation === 'edit' || operation === 'write') {
        filePaths.forEach(path => newAccumulated.edited.add(path));
      }

      return newAccumulated;
    });
  }, [currentEvent]);

  // Reset accumulated files when session changes
  React.useEffect(() => {
    setAccumulatedFiles({ read: new Set(), edited: new Set() });
    previousEventTimestampRef.current = null;
  }, [selectedSession]);

  // Handler to clear accumulated files
  const handleClearAccumulated = () => {
    setAccumulatedFiles({ read: new Set(), edited: new Set() });
    previousEventTimestampRef.current = null;
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
          marginBottom: theme.space[3],
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

      {/* Repository Timeline */}
      <div style={{ marginBottom: theme.space[4] }}>
        <RepositoryTimeline
          repoName={repo}
          repoOwner={owner}
          hours={24}
          height={140}
          onSessionClick={onSessionClick}
          selectedSession={selectedSession}
        />
      </div>

      {/* Three column layout: Events (left), Map (middle), Summary (right) - only shown when session selected */}
      {selectedSession ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: theme.space[4],
            alignItems: "start",
          }}
        >
          {/* Event List */}
          <div
            style={{
              height: "500px",
              minHeight: "500px",
            }}
          >
            <EventList
              sessionId={selectedSession}
              refreshInterval={5000}
              onEventChange={setCurrentEvent}
              onPlaybackStateChange={setIsPlaying}
            />
          </div>

          {/* Repository Map */}
          <div
            style={{
              height: "500px",
              minHeight: "500px",
            }}
          >
            <RepositoryMap
              owner={owner}
              repo={repo}
              currentEvent={currentEvent}
              isPlaying={isPlaying}
              accumulatedFiles={accumulatedFiles}
              onClearAccumulated={handleClearAccumulated}
            />
          </div>

          {/* Summary Placeholder */}
          <div
            style={{
              height: "500px",
              backgroundColor: theme.colors.background,
              borderRadius: theme.radii[2],
              border: `1px solid ${theme.colors.border}`,
              padding: theme.space[4],
            }}
          >
            <h3
              style={{
                fontSize: theme.fontSizes[2],
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.text,
                margin: 0,
                marginBottom: theme.space[3],
              }}
            >
              Session Summary
            </h3>
            <div
              style={{
                color: theme.colors.textSecondary,
                fontSize: theme.fontSizes[1],
              }}
            >
              Summary content will appear here
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            height: "200px",
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
          Click on a session in the timeline above to view details
        </div>
      )}
    </div>
  );
};
