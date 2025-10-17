"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "@a24z/industry-theme";
import { EventPlaybackService, PlaybackState } from "../services/EventPlaybackService";
import { EventPlaybackControls } from "./EventPlaybackControls";

interface Event {
  timestamp: string;
  timestampMs: number;
  eventType?: string;
  [key: string]: unknown;
}

interface EventListProps {
  sessionId: string;
  refreshInterval?: number;
  onEventChange?: (event: Event | null) => void;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
}

export const EventList: React.FC<EventListProps> = ({
  sessionId,
  refreshInterval = 5000,
  onEventChange,
  onPlaybackStateChange,
}) => {
  const { theme } = useTheme();
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

  // Use ref to persist service instance across renders
  const playbackServiceRef = useRef<EventPlaybackService | null>(null);
  const eventListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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

    // Initial fetch
    fetchEvents();

    // Refresh periodically
    const interval = setInterval(fetchEvents, refreshInterval);

    return () => clearInterval(interval);
  }, [sessionId, refreshInterval]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const renderEventValue = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    try {
      const parsed = JSON.stringify(value, null, 2);
      // Truncate very long values
      if (parsed.length > 500) {
        return parsed.substring(0, 500) + "...";
      }
      return parsed;
    } catch {
      return String(value);
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case "pre_hook":
        return theme.colors.accent;
      case "post_hook":
        return theme.colors.success;
      case "user_prompt":
        return theme.colors.primary;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getEventTypeLabel = (eventType: string) => {
    switch (eventType) {
      case "pre_hook":
        return "Tool Call Started";
      case "post_hook":
        return "Tool Call Completed";
      case "user_prompt":
        return "User Interaction";
      default:
        return eventType;
    }
  };

  // Initialize playback service
  useEffect(() => {
    // Create service if it doesn't exist
    if (!playbackServiceRef.current) {
      playbackServiceRef.current = new EventPlaybackService();
    }

    // Always subscribe when component mounts (handles React Strict Mode)
    const unsubscribe = playbackServiceRef.current.onStateChange((state) => {
      setPlaybackState(state);
      // Notify parent component about current event change
      if (onEventChange) {
        onEventChange(state.currentEvent as Event | null);
      }
      // Notify parent component about playback state change
      if (onPlaybackStateChange) {
        onPlaybackStateChange(state.isPlaying);
      }
    });

    return () => {
      unsubscribe();
      // Don't destroy the service here, just unsubscribe
    };
  }, [onEventChange, onPlaybackStateChange]);

  // Load events into playback service when they change (but not on every fetch)
  useEffect(() => {
    if (!playbackServiceRef.current || events.length === 0) {
      return;
    }

    const currentState = playbackServiceRef.current.getState();

    // Only reload if event count actually changed or this is the first load
    if (currentState.totalEvents !== events.length) {
      playbackServiceRef.current.loadEvents(events);
    }
  }, [events]);

  // Auto-scroll to current event
  useEffect(() => {
    if (playbackState.currentIndex >= 0 && eventListRef.current) {
      const eventElements = eventListRef.current.querySelectorAll('[data-event-index]');
      const currentElement = eventElements[playbackState.currentIndex] as HTMLElement;

      if (currentElement) {
        currentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [playbackState.currentIndex]);

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

  const handleSpeedChange = useCallback((speed: 0.5 | 1 | 2 | 5) => {
    playbackServiceRef.current?.setSpeed(speed);
  }, []);

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
            color: theme.colors.text,
            margin: 0,
            marginBottom: theme.space[3],
          }}
        >
          Session Events
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
            color: theme.colors.text,
            margin: 0,
            marginBottom: theme.space[3],
          }}
        >
          Session Events
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
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        <h3
          style={{
            fontSize: theme.fontSizes[2],
            fontWeight: theme.fontWeights.heading,
            color: theme.colors.text,
            margin: 0,
            marginBottom: theme.space[1],
          }}
        >
          Session Events
        </h3>
        <div
          style={{
            fontSize: theme.fontSizes[0],
            color: theme.colors.textSecondary,
            marginBottom: theme.space[3],
            wordBreak: "break-all",
          }}
        >
          Session: {sessionId}
        </div>
      </div>

      {/* Playback Controls */}
      {events.length > 0 && (
        <div style={{ marginBottom: theme.space[3] }}>
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
      )}

      <div
        style={{
          fontSize: theme.fontSizes[0],
          color: theme.colors.textSecondary,
          marginBottom: theme.space[3],
        }}
      >
        {events.length} event{events.length !== 1 ? "s" : ""} found
      </div>
      <div
        ref={eventListRef}
        style={{
          overflowY: "auto",
          flex: 1,
        }}
      >
        {events.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: theme.space[4],
              color: theme.colors.textMuted,
            }}
          >
            No events found for this session
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: theme.space[2] }}>
            {events.map((event, index) => {
              const eventType = String(event.event_type || event.eventType || "unknown");
              const toolName = event.tool_name ? String(event.tool_name) : null;
              const isCurrentEvent = playbackState.currentIndex === index;

              return (
                <div
                  key={index}
                  data-event-index={index}
                  style={{
                    padding: theme.space[3],
                    backgroundColor: isCurrentEvent
                      ? theme.colors.primary + "15"
                      : theme.colors.background,
                    borderRadius: theme.radii[1],
                    border: `2px solid ${
                      isCurrentEvent
                        ? theme.colors.primary
                        : theme.colors.border
                    }`,
                    transform: isCurrentEvent ? "scale(1.02)" : "scale(1)",
                    transition: "all 0.3s ease",
                    boxShadow: isCurrentEvent
                      ? `0 4px 12px ${theme.colors.primary}30`
                      : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: theme.space[2],
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: theme.fontSizes[1],
                          fontWeight: theme.fontWeights.medium,
                          color: getEventTypeColor(eventType),
                          marginBottom: theme.space[1],
                        }}
                      >
                        {getEventTypeLabel(eventType)}
                      </div>
                      {toolName && (
                        <div
                          style={{
                            fontSize: theme.fontSizes[0],
                            color: theme.colors.text,
                            fontFamily: "monospace",
                          }}
                        >
                          {toolName}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: theme.fontSizes[0],
                        color: theme.colors.textSecondary,
                      }}
                    >
                      {formatTime(event.timestamp)}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: theme.fontSizes[0],
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {Object.entries(event)
                      .filter(
                        ([key]) =>
                          key !== "timestamp" &&
                          key !== "timestampMs" &&
                          key !== "eventType" &&
                          key !== "event_type" &&
                          key !== "tool_name" &&
                          key !== "tool_call_id" &&
                          key !== "cwd"
                      )
                      .map(([key, value]) => {
                        // Skip empty values
                        if (value === null || value === undefined || value === "") {
                          return null;
                        }

                        return (
                          <div
                            key={key}
                            style={{
                              marginBottom: theme.space[1],
                              wordBreak: "break-word",
                            }}
                          >
                            <div style={{ fontWeight: theme.fontWeights.medium, marginBottom: "4px" }}>
                              {key}:
                            </div>
                            <div
                              style={{
                                backgroundColor: theme.colors.backgroundSecondary,
                                padding: theme.space[2],
                                borderRadius: theme.radii[1],
                                fontFamily: "monospace",
                                fontSize: theme.fontSizes[0],
                                maxHeight: "200px",
                                overflowY: "auto",
                              }}
                            >
                              {renderEventValue(value)}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
