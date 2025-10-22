"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTheme } from "@a24z/industry-theme";
import { TimeRuler } from "./TimeRuler";
import { SessionCard, SessionSummary } from "./SessionCard";

interface TimelineEvent {
  timestampMs: number;
  timestamp: string | null;
  eventType?: string;
  toolName?: string;
  sessionId?: string;
  repoName?: string;
  repoOwner?: string;
  isPublic?: boolean;
}

interface VerticalTimelineProps {
  hours?: number;
  refreshInterval?: number;
  githubToken?: string | null;
  onSessionClick?: (session: SessionSummary) => void;
}

export const VerticalTimeline: React.FC<VerticalTimelineProps> = ({
  hours = 24,
  refreshInterval = 5000,
  githubToken = null,
  onSessionClick,
}) => {
  const { theme } = useTheme();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timeRulerRef = useRef<HTMLDivElement>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const headers: HeadersInit = {};
        if (githubToken) {
          headers['Authorization'] = `Bearer ${githubToken}`;
        }

        const response = await fetch(`/api/agent-events/timeline?hours=${hours}`, {
          headers,
        });
        const data = await response.json();

        if (response.ok) {
          setEvents(data.events || []);
          setError(null);
        } else {
          setError(data.message || "Failed to fetch events");
        }
      } catch (err) {
        setError("Network error fetching events");
        console.error("Error fetching timeline events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, refreshInterval);
    return () => clearInterval(interval);
  }, [hours, refreshInterval, githubToken]);

  // Group events into session summaries
  const sessions = useMemo(() => {
    if (events.length === 0) return [];

    const sessionMap = new Map<string, SessionSummary>();

    events.forEach((event) => {
      const sessionId = event.sessionId || "unknown";

      if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, {
          sessionId,
          startTime: event.timestampMs,
          endTime: event.timestampMs,
          eventCount: 1,
          repoOwner: event.repoOwner,
          repoName: event.repoName,
          tools: event.toolName ? [event.toolName] : [],
          eventTypes: event.eventType ? [event.eventType] : [],
        });
      } else {
        const session = sessionMap.get(sessionId)!;
        session.startTime = Math.min(session.startTime, event.timestampMs);
        session.endTime = Math.max(session.endTime, event.timestampMs);
        session.eventCount++;

        // Collect unique tools
        if (event.toolName && !session.tools?.includes(event.toolName)) {
          session.tools = [...(session.tools || []), event.toolName];
        }

        // Collect unique event types
        if (event.eventType && !session.eventTypes?.includes(event.eventType)) {
          session.eventTypes = [...(session.eventTypes || []), event.eventType];
        }
      }
    });

    // Sort by start time (most recent first)
    return Array.from(sessionMap.values()).sort((a, b) => b.startTime - a.startTime);
  }, [events]);

  // Group sessions by repository
  const sessionsByRepository = useMemo(() => {
    const grouped = new Map<string, SessionSummary[]>();

    sessions.forEach((session) => {
      const repoKey = session.repoOwner && session.repoName
        ? `${session.repoOwner}/${session.repoName}`
        : "Unknown";

      if (!grouped.has(repoKey)) {
        grouped.set(repoKey, []);
      }
      grouped.get(repoKey)!.push(session);
    });

    return grouped;
  }, [sessions]);

  // Get repositories as ordered array
  const repositories = useMemo(() => {
    return Array.from(sessionsByRepository.keys()).sort();
  }, [sessionsByRepository]);

  // Check if two sessions overlap in time
  const sessionsOverlap = (session1: SessionSummary, session2: SessionSummary): boolean => {
    return session1.startTime < session2.endTime && session2.startTime < session1.endTime;
  };

  // Assign sub-lanes to sessions to prevent overlap within a repository
  const assignLanes = (sessions: SessionSummary[]): Array<SessionSummary & { lane: number; totalLanes: number }> => {
    if (sessions.length === 0) return [];

    // Sort by start time
    const sorted = [...sessions].sort((a, b) => a.startTime - b.startTime);

    // Track which lane each session is in
    const sessionLanes: Array<SessionSummary & { lane: number; totalLanes: number }> = [];

    // For each session, find the first available lane
    sorted.forEach((session) => {
      // Find all sessions that overlap with this one
      const overlapping = sessionLanes.filter(s => sessionsOverlap(s, session));

      // Find the first available lane (0, 1, 2, ...)
      const usedLanes = new Set(overlapping.map(s => s.lane));
      let lane = 0;
      while (usedLanes.has(lane)) {
        lane++;
      }

      sessionLanes.push({
        ...session,
        lane,
        totalLanes: 1, // Will be updated later
      });
    });

    // Calculate total lanes needed (max lane + 1)
    const maxLane = Math.max(...sessionLanes.map(s => s.lane), 0);
    const totalLanes = maxLane + 1;

    // Update all sessions with total lanes
    return sessionLanes.map(s => ({
      ...s,
      totalLanes,
    }));
  };

  // Assign lanes to sessions in each repository
  const sessionsWithLanes = useMemo(() => {
    const result = new Map<string, Array<SessionSummary & { lane: number; totalLanes: number }>>();

    repositories.forEach(repoKey => {
      const repoSessions = sessionsByRepository.get(repoKey) || [];
      result.set(repoKey, assignLanes(repoSessions));
    });

    return result;
  }, [sessionsByRepository, repositories]);

  // Calculate time range
  const now = Date.now();
  const startTime = now - hours * 60 * 60 * 1000;
  const endTime = now;

  // Auto-scroll to current time on initial load
  useEffect(() => {
    if (!autoScrollEnabled || !scrollContainerRef.current || sessions.length === 0) return;

    // Scroll to 80% down (showing recent activity with some context above)
    const scrollHeight = scrollContainerRef.current.scrollHeight;
    const containerHeight = scrollContainerRef.current.clientHeight;
    const targetScroll = scrollHeight * 0.8 - containerHeight / 2;

    scrollContainerRef.current.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });

    // Sync TimeRuler scroll
    if (timeRulerRef.current) {
      timeRulerRef.current.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }

    setAutoScrollEnabled(false); // Only auto-scroll once
  }, [sessions.length, autoScrollEnabled]);

  // Handle user scroll (disable auto-scroll if user manually scrolls)
  const handleScroll = () => {
    // User has taken control of scrolling
    setAutoScrollEnabled(false);

    // Sync TimeRuler scroll with session cards scroll
    if (scrollContainerRef.current && timeRulerRef.current) {
      timeRulerRef.current.scrollTop = scrollContainerRef.current.scrollTop;
    }
  };

  // Calculate position for a session card
  const getSessionPosition = (sessionStartTime: number) => {
    const totalDuration = endTime - startTime;
    return ((sessionStartTime - startTime) / totalDuration) * 100;
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.textSecondary,
          backgroundColor: theme.colors.background,
        }}
      >
        Loading timeline...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.error,
          backgroundColor: theme.colors.background,
          padding: theme.space[4],
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.colors.background,
      }}
    >
      {/* Timeline Container */}
      <div
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Time Ruler */}
        <TimeRuler
          ref={timeRulerRef}
          startTime={startTime}
          endTime={endTime}
          currentTime={now}
        />

        {/* Session Cards Columns - One per repository */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "auto",
            position: "relative",
            WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
          }}
        >
          {/* Scrollable content with height matching time range */}
          <div
            style={{
              position: "relative",
              minHeight: "200vh", // Tall enough to scroll through time
              padding: theme.space[3],
              display: "grid",
              gridTemplateColumns: `repeat(${repositories.length}, minmax(300px, 1fr))`,
              gap: theme.space[3],
            }}
          >
            {sessions.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: theme.space[6],
                  color: theme.colors.textSecondary,
                  gridColumn: "1 / -1",
                }}
              >
                No sessions found
              </div>
            ) : (
              repositories.map((repoKey, colIndex) => {
                const repoSessions = sessionsWithLanes.get(repoKey) || [];
                const totalLanes = repoSessions[0]?.totalLanes || 1;

                return (
                  <div
                    key={repoKey}
                    style={{
                      position: "relative",
                      minHeight: "100%",
                    }}
                  >
                    {/* Repository Column Header */}
                    <div
                      style={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: theme.colors.backgroundSecondary,
                        padding: theme.space[2],
                        borderRadius: theme.radii[1],
                        marginBottom: theme.space[2],
                        border: `1px solid ${theme.colors.border}`,
                        zIndex: 10,
                      }}
                    >
                      {/* Repository name and owner */}
                      {(() => {
                        const parts = repoKey.split('/');
                        const owner = parts[0];
                        const repo = parts[1] || repoKey; // Fallback to full key if no slash

                        return (
                          <div style={{ marginBottom: theme.space[1] }}>
                            <div
                              style={{
                                fontSize: theme.fontSizes[2],
                                fontWeight: theme.fontWeights.bold,
                                color: theme.colors.text,
                                fontFamily: "monospace",
                              }}
                            >
                              {repo}
                            </div>
                            {parts.length > 1 && (
                              <div
                                style={{
                                  fontSize: theme.fontSizes[0],
                                  color: theme.colors.textMuted,
                                  fontFamily: "monospace",
                                }}
                              >
                                {owner}
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      <div
                        style={{
                          fontSize: theme.fontSizes[0],
                          color: theme.colors.textSecondary,
                        }}
                      >
                        {repoSessions.length} {repoSessions.length === 1 ? 'session' : 'sessions'}
                      </div>
                    </div>

                    {/* Sessions in this repository column with sub-lanes */}
                    {repoSessions.map((session) => {
                      const position = getSessionPosition(session.startTime);
                      const laneWidth = 100 / totalLanes; // Percentage width per lane
                      const leftPosition = session.lane * laneWidth; // Left offset based on lane

                      return (
                        <div
                          key={session.sessionId}
                          style={{
                            position: "absolute",
                            top: `${position}%`,
                            left: `${leftPosition}%`,
                            width: `${laneWidth}%`,
                            paddingRight: totalLanes > 1 ? theme.space[1] : 0,
                          }}
                        >
                          <SessionCard
                            session={session}
                            onClick={() => {
                              // Toggle expansion for inline view
                              setExpandedSessionId(
                                expandedSessionId === session.sessionId
                                  ? null
                                  : session.sessionId
                              );
                              // Call parent callback if provided (for modal)
                              onSessionClick?.(session);
                            }}
                            isExpanded={expandedSessionId === session.sessionId}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
