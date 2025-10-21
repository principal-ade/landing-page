"use client";

import React, { useState, useCallback } from "react";
import { useTheme } from "@a24z/industry-theme";
import { RepositoryMap } from "./repository-map";
import { EventPlaybackControls } from "./EventPlaybackControls";
import { EventPlaybackService, PlaybackState, PlaybackSpeed } from "../services/EventPlaybackService";
import { ThemedTerminal, ThemedTerminalRef } from "@principal-ade/industry-themed-terminal";
import "@principal-ade/industry-themed-terminal/styles.css";

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
  const [showLintingErrors, setShowLintingErrors] = useState(false);
  const [lintingErrorFiles, setLintingErrorFiles] = useState<Set<string>>(new Set());

  const playbackServiceRef = React.useRef<EventPlaybackService | null>(null);
  const previousEventTimestampRef = React.useRef<number | null>(null);
  const terminalRef = React.useRef<ThemedTerminalRef>(null);
  const streamingTimeoutsRef = React.useRef<NodeJS.Timeout[]>([]);

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

  // Cleanup streaming timeouts
  React.useEffect(() => {
    return () => {
      streamingTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      streamingTimeoutsRef.current = [];
    };
  }, []);

  // Write events to terminal as they're played
  React.useEffect(() => {
    if (!currentEvent || !terminalRef.current) return;

    const terminal = terminalRef.current;
    const currentIndex = playbackState.currentIndex;

    // Clear any pending streaming animations
    streamingTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    streamingTimeoutsRef.current = [];

    // Check if we went backward (user pressed previous or jumped back)
    // In that case, we should clear terminal and replay from start to current position
    const previousIndex = previousEventTimestampRef.current;
    if (previousIndex !== null && currentIndex < previousIndex) {
      terminal.clear();
      // Replay all events up to current index (no streaming for catch-up)
      for (let i = 0; i <= currentIndex && i < events.length; i++) {
        const event = events[i] as CurrentEvent;
        writeEventToTerminal(terminal, event, false);
      }
    } else {
      // Normal forward playback, write with streaming effect
      writeEventToTerminal(terminal, currentEvent, true);
    }

    previousEventTimestampRef.current = currentIndex;
  }, [currentEvent, playbackState.currentIndex, events]);

  // Helper function to write a single event to terminal with streaming effect
  const writeEventToTerminal = (terminal: ThemedTerminalRef, event: CurrentEvent, stream: boolean = true) => {
    const timestamp = new Date(event.timestampMs).toLocaleTimeString();

    // Try to extract a meaningful event type from various fields
    // Check both event_type (snake_case) and eventType (camelCase)
    const eventType = (event as any).event_type || event.eventType || event.tool_name || 'event';
    const operation = event.operation?.toLowerCase();

    // Collect all lines to write
    const lines: string[] = [];

    // Format based on event type for better narrative
    if (operation === 'read') {
      lines.push(`\x1b[36m${timestamp}\x1b[0m \x1b[35m▸\x1b[0m Reading files...`);
      if (event.normalized_files && event.normalized_files.length > 0) {
        event.normalized_files.forEach(file => {
          const displayPath = file.repository?.relativePath || file.displayPath;
          lines.push(`  \x1b[90m📖\x1b[0m \x1b[32m${displayPath}\x1b[0m`);
        });
      }
    } else if (operation === 'edit' || operation === 'write') {
      lines.push(`\x1b[36m${timestamp}\x1b[0m \x1b[35m▸\x1b[0m ${operation === 'edit' ? 'Editing' : 'Writing'} files...`);
      if (event.normalized_files && event.normalized_files.length > 0) {
        event.normalized_files.forEach(file => {
          const displayPath = file.repository?.relativePath || file.displayPath;
          lines.push(`  \x1b[90m✎\x1b[0m \x1b[33m${displayPath}\x1b[0m`);
        });
      }
    } else if (eventType.toLowerCase().includes('bash') || eventType.toLowerCase().includes('command')) {
      lines.push(`\x1b[36m${timestamp}\x1b[0m \x1b[35m▸\x1b[0m Running command...`);
      lines.push(`  \x1b[90m$\x1b[0m \x1b[37m${eventType}\x1b[0m`);
    } else if (eventType.toLowerCase().includes('think') || eventType.toLowerCase().includes('plan')) {
      lines.push(`\x1b[36m${timestamp}\x1b[0m \x1b[35m▸\x1b[0m Thinking...`);
      lines.push(`  \x1b[90m💭\x1b[0m \x1b[36m${eventType}\x1b[0m`);
    } else if (eventType === 'user-prompt-submit') {
      lines.push(`\x1b[36m${timestamp}\x1b[0m \x1b[35m▸\x1b[0m \x1b[34mUser input received\x1b[0m`);
    } else if (eventType === 'subagent-stop' || eventType === 'stop') {
      lines.push(`\x1b[36m${timestamp}\x1b[0m \x1b[35m▸\x1b[0m \x1b[90mSession ${eventType === 'subagent-stop' ? 'subagent' : 'task'} completed\x1b[0m`);
    } else if (eventType === 'notification') {
      lines.push(`\x1b[36m${timestamp}\x1b[0m \x1b[35m▸\x1b[0m \x1b[36mNotification\x1b[0m`);
    } else {
      // Generic event
      lines.push(`\x1b[36m${timestamp}\x1b[0m \x1b[35m▸\x1b[0m \x1b[33m${eventType}\x1b[0m`);
      if (event.normalized_files && event.normalized_files.length > 0) {
        event.normalized_files.forEach(file => {
          const displayPath = file.repository?.relativePath || file.displayPath;
          lines.push(`  \x1b[90m•\x1b[0m \x1b[32m${displayPath}\x1b[0m`);
        });
      }
    }

    // Show interesting metadata (not the full dump)
    const interestingKeys = ['description', 'result', 'output', 'error', 'message', 'summary'];
    interestingKeys.forEach(key => {
      const value = (event as any)[key];
      if (value && typeof value === 'string' && value.length > 0) {
        // Split into lines and show with streaming effect
        const valueLines = value.split('\n').slice(0, 10); // Limit to 10 lines
        valueLines.forEach(line => {
          if (line.trim()) {
            const truncated = line.length > 100 ? line.slice(0, 97) + '...' : line;
            lines.push(`  \x1b[90m│\x1b[0m ${truncated}`);
          }
        });
      }
    });

    lines.push('');

    // Write lines with streaming effect or immediately
    if (stream) {
      // Stream line by line with delay
      lines.forEach((line, index) => {
        const delay = index * 15; // 15ms per line for smooth streaming
        const timeout = setTimeout(() => {
          terminal.writeln(line);
          if (index === lines.length - 1) {
            terminal.scrollToBottom();
          }
        }, delay);
        streamingTimeoutsRef.current.push(timeout);
      });
    } else {
      // Write all at once (for backward navigation)
      lines.forEach(line => terminal.writeln(line));
    }
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
    terminalRef.current?.clear();
  }, []);

  const handleGoToEnd = useCallback(() => {
    playbackServiceRef.current?.goToEnd();
  }, []);

  const handleSpeedChange = useCallback((speed: PlaybackSpeed) => {
    playbackServiceRef.current?.setSpeed(speed);
  }, []);

  // Generate demo linting errors (pick random files from events)
  React.useEffect(() => {
    if (events.length === 0) return;

    // Extract all unique file paths from events
    const allFilePaths = new Set<string>();
    events.forEach(event => {
      const files = (event as any).normalized_files;
      if (Array.isArray(files)) {
        files.forEach((file: any) => {
          const path = file.repository?.relativePath || file.displayPath;
          if (path) {
            allFilePaths.add(path);
          }
        });
      }
    });

    // Pick ~30% of files to have "linting errors" for demo
    const filePathsArray = Array.from(allFilePaths);
    const errorCount = Math.max(1, Math.floor(filePathsArray.length * 0.3));
    const errorFiles = new Set<string>();

    // Randomly select files
    const shuffled = [...filePathsArray].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(errorCount, shuffled.length); i++) {
      errorFiles.add(shuffled[i]);
    }

    setLintingErrorFiles(errorFiles);
  }, [events]);

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
            {/* Linting Errors Toggle Button */}
            {lintingErrorFiles.size > 0 && (
              <button
                onClick={() => setShowLintingErrors(!showLintingErrors)}
                style={{
                  padding: `${theme.space[2]} ${theme.space[3]}`,
                  backgroundColor: showLintingErrors ? theme.colors.error : theme.colors.backgroundSecondary,
                  color: showLintingErrors ? "#FFFFFF" : theme.colors.text,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: showLintingErrors ? theme.colors.error : theme.colors.border,
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
                  if (!showLintingErrors) {
                    e.currentTarget.style.backgroundColor = theme.colors.background;
                    e.currentTarget.style.borderColor = theme.colors.error;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showLintingErrors) {
                    e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
                    e.currentTarget.style.borderColor = theme.colors.border;
                  }
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
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Linting ({lintingErrorFiles.size})
              </button>
            )}

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
          {/* Two-column layout: Repository Map (left) and Terminal (right) */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 0,
              overflow: "hidden",
            }}
          >
            {/* Repository Map Column */}
            <div
              style={{
                borderRight: `1px solid ${theme.colors.border}`,
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
                    lintingErrors={showLintingErrors ? lintingErrorFiles : undefined}
                    showLintingErrors={showLintingErrors}
                  />
                </div>
              ) : (
                <div style={{ color: theme.colors.textSecondary }}>
                  Repository information not available
                </div>
              )}
            </div>

            {/* Terminal Column */}
            <div
              style={{
                backgroundColor: theme.colors.background,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {loading ? (
                <div style={{
                  color: theme.colors.textSecondary,
                  padding: theme.space[4],
                }}>
                  Loading events...
                </div>
              ) : error ? (
                <div style={{
                  color: theme.colors.error,
                  padding: theme.space[4],
                }}>{error}</div>
              ) : (
                <ThemedTerminal
                  ref={terminalRef}
                  theme={theme}
                  headerTitle="Event Stream"
                  headerSubtitle={`Session ${sessionId.slice(0, 8)}`}
                  autoFocus={false}
                  enableWebLinks={true}
                  scrollback={10000}
                />
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
