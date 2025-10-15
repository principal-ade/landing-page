"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@a24z/industry-theme";

interface Event {
  timestamp: string;
  timestampMs: number;
  eventType?: string;
  [key: string]: unknown;
}

interface EventListProps {
  sessionId: string;
  refreshInterval?: number;
}

export const EventList: React.FC<EventListProps> = ({
  sessionId,
  refreshInterval = 5000,
}) => {
  const { theme } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        maxHeight: "600px",
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
          }}
        >
          Session: {sessionId.substring(0, 12)}...
        </div>
      </div>
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

              return (
                <div
                  key={index}
                  style={{
                    padding: theme.space[3],
                    backgroundColor: theme.colors.background,
                    borderRadius: theme.radii[1],
                    border: `1px solid ${theme.colors.border}`,
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
