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
      {/* Controls Header */}
      <div
        style={{
          padding: theme.space[3],
          borderBottom: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.backgroundSecondary,
        }}
      >
        <div>
          <div
            style={{
              fontSize: theme.fontSizes[1],
              fontWeight: theme.fontWeights.bold,
              color: theme.colors.text,
            }}
          >
            {sessions.length} Sessions
          </div>
          <div
            style={{
              fontSize: theme.fontSizes[0],
              color: theme.colors.textSecondary,
            }}
          >
            {events.length} total events
          </div>
        </div>
      </div>

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

        {/* Session Cards Column */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
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
            }}
          >
            {sessions.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: theme.space[6],
                  color: theme.colors.textSecondary,
                }}
              >
                No sessions found
              </div>
            ) : (
              sessions.map((session) => {
                const position = getSessionPosition(session.startTime);

                return (
                  <div
                    key={session.sessionId}
                    style={{
                      position: "absolute",
                      top: `${position}%`,
                      left: 0,
                      right: 0,
                      paddingRight: theme.space[3],
                      marginBottom: theme.space[2],
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
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
