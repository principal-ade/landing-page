"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useTheme } from "@a24z/industry-theme";
import { RepositoryMap } from "./repository-map";
import { EventPlaybackControls } from "./EventPlaybackControls";
import { EventPlaybackService, PlaybackState, PlaybackSpeed } from "../services/EventPlaybackService";
import { DynamicFileTree } from "@a24z/dynamic-file-tree";
import { FileTree } from "@principal-ai/repository-abstraction";

interface SessionModalProps {
  sessionId: string;
  repoOwner?: string;
  repoName?: string;
  onClose: () => void;
  githubToken?: string | null;
}

interface CurrentEvent {
  timestamp: string;
  timestampMs: number;
  eventType?: string;
  tool_name?: string;
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
  [key: string]: unknown;
}

interface Event {
  timestamp: string;
  timestampMs: number;
  eventType?: string;
  [key: string]: unknown;
}

export const SessionModal: React.FC<SessionModalProps> = ({
  sessionId,
  repoOwner,
  repoName,
  onClose,
  githubToken,
}) => {
  const { theme } = useTheme();
  const [currentEvent, setCurrentEvent] = useState<CurrentEvent | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentIndex: -1,
    totalEvents: 0,
    speed: 1,
    currentEvent: null,
  });
  const [accumulatedFiles, setAccumulatedFiles] = useState<{
    read: Set<string>;
    edited: Set<string>;
  }>({ read: new Set(), edited: new Set() });

  const playbackServiceRef = React.useRef<EventPlaybackService | null>(null);
  const previousEventTimestampRef = React.useRef<number | null>(null);

  // Calculate session timeframe
  const sessionTimeframe = React.useMemo(() => {
    if (events.length === 0) return null;

    const timestamps = events.map(e => e.timestampMs);
    const startTime = Math.min(...timestamps);
    const endTime = Math.max(...timestamps);
    const durationMs = endTime - startTime;

    return {
      startTime,
      endTime,
      durationMs,
      startFormatted: new Date(startTime).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      endFormatted: new Date(endTime).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
      durationFormatted: durationMs < 60000
        ? `${Math.round(durationMs / 1000)}s`
        : durationMs < 3600000
        ? `${Math.round(durationMs / 60000)}m`
        : `${Math.floor(durationMs / 3600000)}h ${Math.round((durationMs % 3600000) / 60000)}m`,
    };
  }, [events]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Fetch events for playback
  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          `/api/agent-events/events?sessionId=${encodeURIComponent(sessionId)}`
        );
        const data = await response.json();

        if (response.ok) {
          setEvents(data.events || []);
          setError(null);
        } else {
          setError(data.message || "Failed to fetch events");
        }
      } catch (err) {
        setError("Network error fetching events");
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [sessionId]);

  // Initialize playback service
  React.useEffect(() => {
    if (!playbackServiceRef.current) {
      playbackServiceRef.current = new EventPlaybackService();
    }

    const unsubscribe = playbackServiceRef.current.onStateChange((state) => {
      setPlaybackState(state);
      setCurrentEvent(state.currentEvent as CurrentEvent | null);
      setIsPlaying(state.isPlaying);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Load events into playback service
  React.useEffect(() => {
    if (!playbackServiceRef.current || events.length === 0) {
      return;
    }

    const currentState = playbackServiceRef.current.getState();
    if (currentState.totalEvents !== events.length) {
      playbackServiceRef.current.loadEvents(events);
    }
  }, [events]);

  // Track accumulated files from events
  React.useEffect(() => {
    if (!currentEvent) return;

    const currentTimestamp = currentEvent.timestampMs || 0;
    const previousTimestamp = previousEventTimestampRef.current;

    // Reset accumulated files if we've gone back in time
    if (previousTimestamp !== null && currentTimestamp < previousTimestamp) {
      setAccumulatedFiles({ read: new Set(), edited: new Set() });
      previousEventTimestampRef.current = currentTimestamp;
      return;
    }

    previousEventTimestampRef.current = currentTimestamp;

    // Extract file paths from the event
    const filePaths = currentEvent.normalized_files
      ?.map(file => file.repository?.relativePath || file.displayPath)
      .filter((path): path is string => !!path) || [];

    if (filePaths.length === 0) return;

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

  // Handler to clear accumulated files
  const handleClearAccumulated = () => {
    setAccumulatedFiles({ read: new Set(), edited: new Set() });
    previousEventTimestampRef.current = null;
  };

  // Playback control handlers
  const handlePlay = useCallback(() => {
    playbackServiceRef.current?.play();
  }, []);

  const handlePause = useCallback(() => {
    playbackServiceRef.current?.pause();
  }, []);

  const handleNext = useCallback(() => {
    playbackServiceRef.current?.next();
  }, []);

  const handlePrevious = useCallback(() => {
    playbackServiceRef.current?.previous();
  }, []);

  const handleGoToStart = useCallback(() => {
    playbackServiceRef.current?.goToStart();
  }, []);

  const handleGoToEnd = useCallback(() => {
    playbackServiceRef.current?.goToEnd();
  }, []);

  const handleSpeedChange = useCallback((speed: PlaybackSpeed) => {
    playbackServiceRef.current?.setSpeed(speed);
  }, []);

  // Build file tree from normalized files in events
  const fileTree = useMemo((): FileTree => {
    const allPaths = new Set<string>();

    events.forEach(event => {
      const files = (event as any).normalized_files;
      if (Array.isArray(files)) {
        files.forEach((file: any) => {
          const path = file.repository?.relativePath || file.displayPath;
          if (path) {
            allPaths.add(path);
          }
        });
      }
    });

    // Convert Set to sorted array
    const sortedPaths = Array.from(allPaths).sort();

    // Build tree structure with proper types
    interface TempNode {
      name: string;
      path: string;
      children: TempNode[];
      isFile: boolean;
    }

    const rootNode: TempNode = {
      name: repoName || 'root',
      path: '',
      children: [],
      isFile: false,
    };

    const directories = new Map<string, TempNode>();
    directories.set('', rootNode);

    sortedPaths.forEach(filePath => {
      const parts = filePath.split('/');
      let currentPath = '';

      // Create directories
      for (let i = 0; i < parts.length - 1; i++) {
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];

        if (!directories.has(currentPath)) {
          const dirNode: TempNode = {
            name: parts[i],
            path: currentPath,
            children: [],
            isFile: false,
          };

          const parent = directories.get(parentPath);
          if (parent) {
            parent.children.push(dirNode);
          }

          directories.set(currentPath, dirNode);
        }
      }

      // Add file
      const fileName = parts[parts.length - 1];
      const parentPath = parts.slice(0, -1).join('/');
      const parent = directories.get(parentPath);

      if (parent) {
        parent.children.push({
          name: fileName,
          path: filePath,
          children: [],
          isFile: true,
        });
      }
    });

    // Convert to proper FileTree format
    const now = new Date();

    // Build proper DirectoryInfo for root
    const buildDirectoryInfo = (node: TempNode, depth: number): any => {
      const childrenNodes = node.children.map(child =>
        child.isFile
          ? {
              path: child.path,
              name: child.name,
              extension: child.name.includes('.') ? child.name.split('.').pop() || '' : '',
              size: 0,
              lastModified: now,
              isDirectory: false,
              relativePath: child.path,
            }
          : buildDirectoryInfo(child, depth + 1)
      );

      const fileCount = childrenNodes.filter((n: any) => !n.isDirectory).length;

      return {
        path: node.path,
        name: node.name,
        children: childrenNodes,
        fileCount,
        totalSize: 0,
        depth,
        relativePath: node.path,
      };
    };

    const root = buildDirectoryInfo(rootNode, 0);

    // Build allFiles and allDirectories arrays
    const allFileInfos = sortedPaths.map(p => ({
      path: p,
      name: p.split('/').pop() || p,
      extension: p.includes('.') ? p.split('.').pop() || '' : '',
      size: 0,
      lastModified: now,
      isDirectory: false,
      relativePath: p,
    }));

    const allDirInfos = Array.from(directories.values()).map(d => ({
      path: d.path,
      name: d.name,
      children: [],
      fileCount: 0,
      totalSize: 0,
      depth: d.path.split('/').filter(p => p).length,
      relativePath: d.path,
    }));

    return {
      sha: 'session-' + sessionId.slice(0, 8),
      root,
      allFiles: allFileInfos,
      allDirectories: allDirInfos,
      stats: {
        totalFiles: sortedPaths.length,
        totalDirectories: directories.size,
        totalSize: 0,
        maxDepth: Math.max(...allDirInfos.map(d => d.depth), 0),
      },
      metadata: {
        id: sessionId,
        timestamp: now,
        sourceType: 'session-events',
        sourceInfo: {
          eventCount: events.length,
          repoOwner,
          repoName,
        },
      },
    };
  }, [events, repoName, sessionId, repoOwner]);

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: theme.space[4],
      }}
    >
      <div
        style={{
          backgroundColor: theme.colors.background,
          borderRadius: theme.radii[3],
          border: `2px solid ${theme.colors.border}`,
          width: "90vw",
          maxWidth: "1400px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: theme.space[4],
            borderBottom: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.backgroundSecondary,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1 }}>
            {/* Repository Info */}
            {repoOwner && repoName ? (
              <h2
                style={{
                  fontSize: theme.fontSizes[3],
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.text,
                  margin: 0,
                  marginBottom: theme.space[2],
                  fontFamily: "monospace",
                }}
              >
                {repoOwner}/{repoName}
              </h2>
            ) : (
              <h2
                style={{
                  fontSize: theme.fontSizes[3],
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.text,
                  margin: 0,
                  marginBottom: theme.space[2],
                }}
              >
                Session Playback
              </h2>
            )}

            {/* Event Count and Timeframe */}
            <div
              style={{
                fontSize: theme.fontSizes[1],
                color: theme.colors.textSecondary,
                display: "flex",
                gap: theme.space[3],
                flexWrap: "wrap",
              }}
            >
              {/* Event Count */}
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span>
                  <strong style={{ color: theme.colors.text }}>
                    {events.length}
                  </strong>{" "}
                  {events.length === 1 ? "event" : "events"}
                </span>
              )}

              {/* Timeframe */}
              {sessionTimeframe && (
                <>
                  <span>•</span>
                  <span>
                    {sessionTimeframe.startFormatted} → {sessionTimeframe.endFormatted}
                  </span>
                  <span>•</span>
                  <span>
                    <strong style={{ color: theme.colors.text }}>
                      {sessionTimeframe.durationFormatted}
                    </strong>{" "}
                    duration
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: theme.space[2], alignItems: "center" }}>
            {/* Reset Highlights Button */}
            {accumulatedFiles.read.size > 0 || accumulatedFiles.edited.size > 0 ? (
              <button
                onClick={handleClearAccumulated}
                style={{
                  padding: `${theme.space[2]} ${theme.space[3]}`,
                  backgroundColor: theme.colors.backgroundSecondary,
                  color: theme.colors.text,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: theme.colors.border,
                  borderRadius: theme.radii[1],
                  fontSize: theme.fontSizes[1],
                  fontWeight: theme.fontWeights.medium,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: theme.space[1],
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.background;
                  e.currentTarget.style.borderColor = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                  e.currentTarget.style.borderColor = theme.colors.border;
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </svg>
                Reset
              </button>
            ) : null}

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                padding: theme.space[2],
                backgroundColor: "transparent",
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii[1],
                color: theme.colors.text,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.backgroundHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Two-column layout: File Tree (left) and Repository Map (right) */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "350px 1fr",
              gap: 0,
              overflow: "hidden",
            }}
          >
            {/* File Tree Column */}
            <div
              style={{
                borderRight: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.backgroundSecondary,
                overflow: "auto",
                padding: theme.space[3],
              }}
            >
              {loading ? (
                <div style={{ color: theme.colors.textSecondary }}>
                  Loading files...
                </div>
              ) : error ? (
                <div style={{ color: theme.colors.error }}>{error}</div>
              ) : (
                <>
                  <h3
                    style={{
                      fontSize: theme.fontSizes[1],
                      fontWeight: theme.fontWeights.bold,
                      color: theme.colors.text,
                      margin: 0,
                      marginBottom: theme.space[3],
                    }}
                  >
                    Files Accessed
                  </h3>
                  <DynamicFileTree
                    fileTree={fileTree}
                    theme={theme}
                    onFileSelect={(filePath) => console.log('Selected:', filePath)}
                    padding="12px"
                  />
                </>
              )}
            </div>

            {/* Repository Map Column */}
            <div
              style={{
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.colors.background,
              }}
            >
              {loading ? (
                <div style={{ color: theme.colors.textSecondary }}>
                  Loading events...
                </div>
              ) : error ? (
                <div style={{ color: theme.colors.error }}>{error}</div>
              ) : repoOwner && repoName ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <RepositoryMap
                    owner={repoOwner}
                    repo={repoName}
                    currentEvent={currentEvent}
                    isPlaying={isPlaying}
                    accumulatedFiles={accumulatedFiles}
                    onClearAccumulated={handleClearAccumulated}
                    githubToken={githubToken}
                  />
                </div>
              ) : (
                <div style={{ color: theme.colors.textSecondary }}>
                  Repository information not available
                </div>
              )}
            </div>
          </div>

          {/* Playback Controls - Bottom */}
          <div
            style={{
              padding: theme.space[3],
              borderTop: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.backgroundSecondary,
            }}
          >
            <EventPlaybackControls
              playbackState={playbackState}
              onPlay={handlePlay}
              onPause={handlePause}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onGoToStart={handleGoToStart}
              onGoToEnd={handleGoToEnd}
              onSpeedChange={handleSpeedChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
