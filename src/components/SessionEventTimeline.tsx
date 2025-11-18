"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "@principal-ade/industry-theme";

interface Event {
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
  repository_context?: {
    gitRoot: string;
    remoteUrl?: string;
    owner?: string;
    repo?: string;
  };
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
          const fetchedEvents = data.events || [];
          setEvents(fetchedEvents);
          setError(null);

          // Debug: Log sample events
          console.log('[SessionEventTimeline] Sample events:', {
            count: fetchedEvents.length,
            samples: fetchedEvents.slice(0, 3).map((e: Event) => ({
              tool_name: e.tool_name,
              timestamp: e.timestamp,
              has_repository_context: !!e.repository_context,
              repository_context: e.repository_context,
              has_normalized_files: !!e.normalized_files,
              normalized_files_count: e.normalized_files?.length || 0,
              first_file_repo: e.normalized_files?.[0]?.repository
            }))
          });
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

  // Get horizontal position for an event (0-100%)
  const getEventPosition = (timestampMs: number) => {
    if (duration === 0) return 50; // Center if no duration
    return ((timestampMs - startTime) / duration) * 100;
  };

  // Get vertical position for an event based on repository lane (0-100%)
  const getEventLanePosition = (event: Event) => {
    const repoKey = getRepositoryKey(event);
    const laneIndex = repositories.indexOf(repoKey);
    const numLanes = repositories.length;

    if (numLanes === 0) return 50; // Center if no lanes
    if (numLanes === 1) return 50; // Center if only one lane

    // Distribute lanes evenly across the vertical space
    // Add padding at top and bottom (10% each)
    const padding = 10;
    const usableSpace = 100 - (2 * padding);
    const laneSpacing = usableSpace / (numLanes - 1);

    return padding + (laneIndex * laneSpacing);
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

  // Extract repository identifier from event
  const getRepositoryKey = (event: Event): string => {
    // Try repository_context first
    if (event.repository_context?.owner && event.repository_context?.repo) {
      return `${event.repository_context.owner}/${event.repository_context.repo}`;
    }

    // Try first normalized_file repository
    if (event.normalized_files?.[0]?.repository?.owner &&
        event.normalized_files?.[0]?.repository?.repo) {
      return `${event.normalized_files[0].repository.owner}/${event.normalized_files[0].repository.repo}`;
    }

    // Fallback to git root or "Unknown"
    if (event.repository_context?.gitRoot) {
      return event.repository_context.gitRoot.split('/').pop() || "Unknown";
    }

    return "Unknown";
  };

  // Group events by repository
  const eventsByRepository = useMemo(() => {
    const grouped = new Map<string, Event[]>();
    events.forEach((event) => {
      const repoKey = getRepositoryKey(event);
      if (!grouped.has(repoKey)) {
        grouped.set(repoKey, []);
      }
      grouped.get(repoKey)!.push(event);
    });

    // Debug: Log repository grouping
    console.log('[SessionEventTimeline] Repository grouping:', {
      totalEvents: events.length,
      repositories: Array.from(grouped.keys()),
      distribution: Array.from(grouped.entries()).map(([repo, evts]) => ({
        repo,
        count: evts.length
      }))
    });

    return grouped;
  }, [events]);

  // Get repositories as an ordered array for consistent lane positioning
  const repositories = useMemo(() => {
    return Array.from(eventsByRepository.keys()).sort();
  }, [eventsByRepository]);

  // Calculate dynamic height based on number of repositories
  const dynamicHeight = useMemo(() => {
    const minHeight = height;
    const numRepos = repositories.length;

    // Add 60px for each repository beyond the first 2
    if (numRepos <= 2) return minHeight;
    return minHeight + ((numRepos - 2) * 60);
  }, [repositories.length, height]);

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
        height: `${dynamicHeight}px`,
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
          {events.length} events • {repositories.length} {repositories.length === 1 ? 'repository' : 'repositories'}
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
          height: `${dynamicHeight - 60}px`,
        }}
      >
        {/* Timeline lane lines - one for each repository */}
        {repositories.map((repo, idx) => {
          const lanePos = repositories.length === 1 ? 50 :
            10 + (idx * (80 / Math.max(1, repositories.length - 1)));
          return (
            <React.Fragment key={repo}>
              {/* Lane line */}
              <div
                style={{
                  position: "absolute",
                  top: `${lanePos}%`,
                  left: 0,
                  right: 0,
                  height: "2px",
                  backgroundColor: theme.colors.border,
                  transform: "translateY(-50%)",
                }}
              />
              {/* Repository label */}
              <div
                style={{
                  position: "absolute",
                  top: `${lanePos}%`,
                  left: 0,
                  transform: "translateY(-50%)",
                  fontSize: theme.fontSizes[0],
                  color: theme.colors.textSecondary,
                  backgroundColor: theme.colors.background,
                  padding: `${theme.space[1]} ${theme.space[2]}`,
                  borderRadius: theme.radii[1],
                  border: `1px solid ${theme.colors.border}`,
                  whiteSpace: "nowrap",
                  zIndex: 5,
                }}
                title={repo}
              >
                {repo.length > 25 ? `${repo.substring(0, 25)}...` : repo}
              </div>
            </React.Fragment>
          );
        })}

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
          const lanePosition = getEventLanePosition(event);
          const isCurrentEvent = currentEvent?.timestampMs === event.timestampMs;
          const isHovered = hoveredEvent?.timestampMs === event.timestampMs;
          const color = getEventColor(event.eventType);

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                top: `${lanePosition}%`,
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
                  <div style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes[0] }}>
                    {getRepositoryKey(event)}
                  </div>
                  <div style={{ color: theme.colors.textSecondary }}>
                    {new Date(event.timestampMs).toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Repository legend */}
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
          {repositories.slice(0, 5).map((repo) => (
            <div
              key={repo}
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
              <span>{repo.length > 20 ? `${repo.substring(0, 20)}...` : repo}</span>
              <span style={{ color: theme.colors.textMuted }}>
                ({eventsByRepository.get(repo)!.length})
              </span>
            </div>
          ))}
          {repositories.length > 5 && (
            <div style={{ color: theme.colors.textMuted }}>
              +{repositories.length - 5} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
