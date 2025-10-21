"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "@a24z/industry-theme";

interface Event {
  timestamp: string;
  timestampMs: number;
  eventType?: string;
  tool_name?: string;
  [key: string]: unknown;
}

interface SessionEventTimelineProps {
  sessionId: string;
  currentEvent?: Event | null;
  onEventClick?: (event: Event) => void;
  height?: number;
}

export const SessionEventTimeline: React.FC<SessionEventTimelineProps> = ({
  sessionId,
  currentEvent,
  onEventClick,
  height = 120,
}) => {
  const { theme } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);

  // Fetch events for this session
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

    fetchEvents();
  }, [sessionId]);

  // Calculate time range
  const { startTime, endTime, duration } = useMemo(() => {
    if (events.length === 0) {
      return { startTime: 0, endTime: 0, duration: 0 };
    }

    const start = Math.min(...events.map((e) => e.timestampMs));
    const end = Math.max(...events.map((e) => e.timestampMs));
    return {
      startTime: start,
      endTime: end,
      duration: end - start,
    };
  }, [events]);

  // Get position for an event (0-100%)
  const getEventPosition = (timestampMs: number) => {
    if (duration === 0) return 50; // Center if no duration
    return ((timestampMs - startTime) / duration) * 100;
  };

  // Get color for event type
  const getEventColor = (eventType?: string) => {
    switch (eventType) {
      case "pre_hook":
        return theme.colors.accent;
      case "post_hook":
        return theme.colors.success;
      case "tool_use":
        return theme.colors.primary;
      default:
        return theme.colors.textMuted;
    }
  };

  // Group events by tool name
  const eventsByTool = useMemo(() => {
    const grouped = new Map<string, Event[]>();
    events.forEach((event) => {
      const tool = event.tool_name || "Other";
      if (!grouped.has(tool)) {
        grouped.set(tool, []);
      }
      grouped.get(tool)!.push(event);
    });
    return grouped;
  }, [events]);

  if (loading) {
    return (
      <div
        style={{
          height: `${height}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.textSecondary,
        }}
      >
        Loading events...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: `${height}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.error,
        }}
      >
        {error}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div
        style={{
          height: `${height}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.textSecondary,
        }}
      >
        No events found
      </div>
    );
  }

  return (
    <div
      style={{
        height: `${height}px`,
        position: "relative",
        backgroundColor: theme.colors.background,
        borderRadius: theme.radii[2],
        border: `1px solid ${theme.colors.border}`,
        padding: theme.space[3],
      }}
    >
      {/* Header */}
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
          Event Timeline
        </div>
        <div
          style={{
            fontSize: theme.fontSizes[0],
            color: theme.colors.textSecondary,
          }}
        >
          {events.length} events
          {duration > 0 && (
            <span style={{ marginLeft: theme.space[2] }}>
              • {Math.round(duration / 1000)}s duration
            </span>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div
        style={{
          position: "relative",
          height: `${height - 60}px`,
        }}
      >
        {/* Timeline base line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: "2px",
            backgroundColor: theme.colors.border,
            transform: "translateY(-50%)",
          }}
        />

        {/* Start and end markers */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            fontSize: theme.fontSizes[0],
            color: theme.colors.textMuted,
          }}
        >
          {new Date(startTime).toLocaleTimeString()}
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            fontSize: theme.fontSizes[0],
            color: theme.colors.textMuted,
          }}
        >
          {new Date(endTime).toLocaleTimeString()}
        </div>

        {/* Event markers */}
        {events.map((event, idx) => {
          const position = getEventPosition(event.timestampMs);
          const isCurrentEvent = currentEvent?.timestampMs === event.timestampMs;
          const isHovered = hoveredEvent?.timestampMs === event.timestampMs;
          const color = getEventColor(event.eventType);

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                top: "50%",
                left: `${position}%`,
                transform: "translate(-50%, -50%)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                zIndex: isCurrentEvent ? 20 : isHovered ? 15 : 10,
              }}
              onClick={() => onEventClick?.(event)}
              onMouseEnter={() => setHoveredEvent(event)}
              onMouseLeave={() => setHoveredEvent(null)}
            >
              {/* Event dot */}
              <div
                style={{
                  width: isCurrentEvent ? "16px" : isHovered ? "12px" : "8px",
                  height: isCurrentEvent ? "16px" : isHovered ? "12px" : "8px",
                  backgroundColor: isCurrentEvent ? theme.colors.primary : color,
                  borderRadius: "50%",
                  border: isCurrentEvent
                    ? `3px solid ${theme.colors.background}`
                    : `2px solid ${theme.colors.background}`,
                  boxShadow: isCurrentEvent || isHovered
                    ? `0 0 8px ${color}`
                    : "none",
                }}
              />

              {/* Tooltip on hover */}
              {isHovered && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "120%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: theme.colors.background,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radii[1],
                    padding: theme.space[2],
                    fontSize: theme.fontSizes[0],
                    color: theme.colors.text,
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    zIndex: 1000,
                    boxShadow: `0 4px 12px ${theme.colors.border}`,
                  }}
                >
                  <div style={{ fontWeight: theme.fontWeights.bold }}>
                    {event.tool_name || event.eventType || "Event"}
                  </div>
                  <div style={{ color: theme.colors.textSecondary }}>
                    {new Date(event.timestampMs).toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Tool legend */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            gap: theme.space[2],
            flexWrap: "wrap",
            fontSize: theme.fontSizes[0],
          }}
        >
          {Array.from(eventsByTool.keys())
            .slice(0, 5)
            .map((tool) => (
              <div
                key={tool}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.space[1],
                  color: theme.colors.textSecondary,
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: theme.colors.primary,
                    borderRadius: "50%",
                  }}
                />
                <span>{tool}</span>
                <span style={{ color: theme.colors.textMuted }}>
                  ({eventsByTool.get(tool)!.length})
                </span>
              </div>
            ))}
          {eventsByTool.size > 5 && (
            <div style={{ color: theme.colors.textMuted }}>
              +{eventsByTool.size - 5} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
