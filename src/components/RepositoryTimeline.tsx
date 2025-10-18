"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTheme } from "@a24z/industry-theme";

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

interface ActivityCluster {
  startTime: number;
  endTime: number;
  eventCount: number;
  centerTime: number;
}

interface SessionSegment {
  sessionId: string;
  startTime: number;
  endTime: number;
  eventCount: number;
  events: TimelineEvent[];
}

interface RepositoryTimelineProps {
  repoName: string;
  repoOwner: string;
  hours?: number;
  refreshInterval?: number;
  height?: number;
  showLabels?: boolean;
  onSessionClick?: (sessionId: string) => void;
  selectedSession?: string | null;
}

export const RepositoryTimeline: React.FC<RepositoryTimelineProps> = ({
  repoName,
  repoOwner,
  hours = 24,
  refreshInterval = 5000,
  height = 100,
  showLabels = true,
  onSessionClick,
  selectedSession,
}) => {
  const { theme } = useTheme();
  const [allEvents, setAllEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<SessionSegment | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Zoom and pan state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartOffset, setDragStartOffset] = useState(0);

  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/agent-events/timeline?hours=${hours}`);
        const data = await response.json();

        if (response.ok) {
          setAllEvents(data.events || []);
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
  }, [hours, refreshInterval]);

  // Filter events for this repository
  const events = useMemo(() => {
    return allEvents.filter(
      (event) => event.repoName === repoName && event.repoOwner === repoOwner
    );
  }, [allEvents, repoName, repoOwner]);

  // Group events into session segments
  const sessionSegments = useMemo(() => {
    if (events.length === 0) return [];

    const sessionMap = new Map<string, SessionSegment>();

    events.forEach((event) => {
      const sessionId = event.sessionId || "unknown";

      if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, {
          sessionId,
          startTime: event.timestampMs,
          endTime: event.timestampMs,
          eventCount: 1,
          events: [event],
        });
      } else {
        const segment = sessionMap.get(sessionId)!;
        segment.startTime = Math.min(segment.startTime, event.timestampMs);
        segment.endTime = Math.max(segment.endTime, event.timestampMs);
        segment.eventCount++;
        segment.events.push(event);
      }
    });

    return Array.from(sessionMap.values()).sort((a, b) => a.startTime - b.startTime);
  }, [events]);

  // Detect activity clusters
  const activityClusters = useMemo(() => {
    if (sessionSegments.length === 0) return [];

    const clusters: ActivityCluster[] = [];
    const GAP_THRESHOLD = 30 * 60 * 1000; // 30 minutes

    let currentCluster: ActivityCluster | null = null;

    sessionSegments.forEach((segment) => {
      if (!currentCluster) {
        currentCluster = {
          startTime: segment.startTime,
          endTime: segment.endTime,
          eventCount: segment.eventCount,
          centerTime: (segment.startTime + segment.endTime) / 2,
        };
      } else {
        const gap = segment.startTime - currentCluster.endTime;

        if (gap <= GAP_THRESHOLD) {
          currentCluster.endTime = Math.max(currentCluster.endTime, segment.endTime);
          currentCluster.eventCount += segment.eventCount;
          currentCluster.centerTime = (currentCluster.startTime + currentCluster.endTime) / 2;
        } else {
          clusters.push(currentCluster);
          currentCluster = {
            startTime: segment.startTime,
            endTime: segment.endTime,
            eventCount: segment.eventCount,
            centerTime: (segment.startTime + segment.endTime) / 2,
          };
        }
      }
    });

    if (currentCluster) {
      clusters.push(currentCluster);
    }

    return clusters;
  }, [sessionSegments]);

  // Calculate time range
  const now = Date.now();
  const totalStartTime = now - hours * 60 * 60 * 1000;
  const totalDuration = now - totalStartTime;

  // Calculate visible window based on zoom and pan
  const visibleDuration = totalDuration / zoomLevel;
  const maxPanOffset = 1 - 1 / zoomLevel;
  const clampedPanOffset = Math.max(0, Math.min(panOffset, maxPanOffset));
  const visibleStartTime = totalStartTime + (totalDuration - visibleDuration) * clampedPanOffset;
  const visibleEndTime = visibleStartTime + visibleDuration;

  // Generate time markers based on zoom level
  const getTimeMarkers = () => {
    const visibleHours = visibleDuration / (60 * 60 * 1000);
    let intervalMinutes = 60;

    if (visibleHours <= 2) {
      intervalMinutes = 15;
    } else if (visibleHours <= 6) {
      intervalMinutes = 30;
    } else if (visibleHours <= 12) {
      intervalMinutes = 60;
    } else {
      intervalMinutes = 120;
    }

    const markers = [];
    const intervalMs = intervalMinutes * 60 * 1000;
    const firstMarkerTime = Math.ceil(visibleStartTime / intervalMs) * intervalMs;

    for (let time = firstMarkerTime; time <= visibleEndTime; time += intervalMs) {
      markers.push({
        time,
        label: new Date(time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }

    return markers;
  };

  const timeMarkers = getTimeMarkers();

  // Generate 12-hour period markers (midnight and noon)
  const getPeriodMarkers = () => {
    const markers = [];
    const startDate = new Date(visibleStartTime);
    const current = new Date(startDate);
    current.setMinutes(0, 0, 0);

    const hour = current.getHours();
    if (hour < 12) {
      current.setHours(12);
    } else {
      current.setDate(current.getDate() + 1);
      current.setHours(0);
    }

    while (current.getTime() <= visibleEndTime) {
      if (current.getTime() >= visibleStartTime) {
        markers.push({
          time: current.getTime(),
          label: current.getHours() === 0 ? "Midnight" : "Noon",
          isMidnight: current.getHours() === 0,
        });
      }

      if (current.getHours() === 0) {
        current.setHours(12);
      } else {
        current.setDate(current.getDate() + 1);
        current.setHours(0);
      }
    }

    return markers;
  };

  const periodMarkers = getPeriodMarkers();

  // Generate background shading for 12-hour periods
  const getPeriodBackgrounds = () => {
    const backgrounds = [];
    let current = new Date(visibleStartTime);
    current.setMinutes(0, 0, 0);
    const hour = current.getHours();

    if (hour >= 12) {
      current.setHours(12);
    } else {
      current.setHours(0);
    }

    if (current.getTime() > visibleStartTime) {
      if (current.getHours() === 0) {
        current.setDate(current.getDate() - 1);
        current.setHours(12);
      } else {
        current.setHours(0);
      }
    }

    while (current.getTime() < visibleEndTime) {
      const periodStart = current.getTime();
      const nextPeriod = new Date(current);

      if (current.getHours() === 0) {
        nextPeriod.setHours(12);
      } else {
        nextPeriod.setDate(nextPeriod.getDate() + 1);
        nextPeriod.setHours(0);
      }

      const periodEnd = nextPeriod.getTime();
      const isNightPeriod = current.getHours() === 0;

      backgrounds.push({
        start: periodStart,
        end: periodEnd,
        isNight: isNightPeriod,
      });

      current = nextPeriod;
    }

    return backgrounds;
  };

  const periodBackgrounds = getPeriodBackgrounds();

  // Calculate position for an event within visible window (0-100%)
  const getEventPosition = (timestampMs: number) => {
    return ((timestampMs - visibleStartTime) / visibleDuration) * 100;
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev * 2, 16));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const newZoom = Math.max(prev / 2, 1);
      if (newZoom === 1) {
        setPanOffset(0);
      }
      return newZoom;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset(0);
  };

  // Jump to activity cluster
  const jumpToCluster = (cluster: ActivityCluster) => {
    const clusterCenter = cluster.centerTime;
    const relativePosition = (clusterCenter - totalStartTime) / totalDuration;
    const clusterDuration = cluster.endTime - cluster.startTime;
    const targetVisibleDuration = clusterDuration * 2;
    const calculatedZoom = totalDuration / targetVisibleDuration;
    const clampedZoom = Math.max(2, calculatedZoom);
    const niceZoom = Math.pow(2, Math.round(Math.log2(clampedZoom)));

    setZoomLevel(niceZoom);

    const targetPanOffset = relativePosition - 0.5 / niceZoom;
    setPanOffset(Math.max(0, Math.min(targetPanOffset, 1 - 1 / niceZoom)));
  };

  // Drag to pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartOffset(panOffset);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    if (isDragging) {
      const deltaX = e.clientX - dragStartX;
      const deltaPan = -(deltaX / rect.width) * (1 / zoomLevel);
      const newPanOffset = dragStartOffset + deltaPan;
      setPanOffset(Math.max(0, Math.min(newPanOffset, maxPanOffset)));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Generate consistent color for this repository
  const repoKey = `${repoOwner}/${repoName}`;
  const colorSeed = repoKey.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const repoColor = `hsl(${(colorSeed * 137.5) % 360}, 60%, 60%)`;

  if (loading) {
    return (
      <div
        style={{
          height: `${height}px`,
          backgroundColor: theme.colors.backgroundSecondary,
          borderRadius: theme.radii[2],
          border: `1px solid ${theme.colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.textSecondary,
          fontSize: theme.fontSizes[0],
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
          height: `${height}px`,
          backgroundColor: theme.colors.backgroundSecondary,
          borderRadius: theme.radii[2],
          border: `1px solid ${theme.colors.error}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.error,
          fontSize: theme.fontSizes[0],
          padding: theme.space[2],
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
          backgroundColor: theme.colors.backgroundSecondary,
          borderRadius: theme.radii[2],
          border: `1px solid ${theme.colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.textSecondary,
          fontSize: theme.fontSizes[0],
        }}
      >
        No activity in the last {hours} hours
      </div>
    );
  }

  return (
    <div
      style={{
        height: `${height}px`,
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.radii[2],
        border: `1px solid ${theme.colors.border}`,
        padding: theme.space[2],
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Compact header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.space[1],
        }}
      >
        <div
          style={{
            fontSize: theme.fontSizes[0],
            color: theme.colors.textSecondary,
          }}
        >
          {sessionSegments.length} session{sessionSegments.length !== 1 ? "s" : ""} • {events.length} event
          {events.length !== 1 ? "s" : ""}
          {activityClusters.length > 1 && ` • ${activityClusters.length} clusters`}
        </div>
      </div>

      {/* Activity cluster quick jump buttons */}
      {activityClusters.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: theme.space[1],
            marginBottom: theme.space[1],
            flexWrap: "wrap",
          }}
        >
          {activityClusters.map((cluster, idx) => (
            <button
              key={idx}
              onClick={() => jumpToCluster(cluster)}
              style={{
                padding: `2px ${theme.space[1]}`,
                fontSize: theme.fontSizes[0],
                backgroundColor: theme.colors.background,
                color: theme.colors.accent,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii[1],
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.backgroundHover;
                e.currentTarget.style.borderColor = theme.colors.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.background;
                e.currentTarget.style.borderColor = theme.colors.border;
              }}
            >
              <span>
                {new Date(cluster.centerTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span style={{ color: theme.colors.textMuted }}>({cluster.eventCount})</span>
            </button>
          ))}
        </div>
      )}

      {/* Timeline Container */}
      <div
        ref={timelineRef}
        style={{
          position: "relative",
          height: `${height - (activityClusters.length > 1 ? 75 : 55)}px`,
          width: "100%",
          cursor: isDragging ? "grabbing" : zoomLevel > 1 ? "grab" : "default",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* 12-hour period background shading */}
        {periodBackgrounds.map((period, idx) => {
          const startPos = getEventPosition(period.start);
          const endPos = getEventPosition(period.end);

          if (endPos < 0 || startPos > 100) return null;

          const leftPos = Math.max(0, startPos);
          const rightPos = Math.min(100, endPos);
          const width = rightPos - leftPos;

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                top: 0,
                left: `${leftPos}%`,
                width: `${width}%`,
                bottom: showLabels ? "30px" : 0,
                backgroundColor: period.isNight ? `${theme.colors.primary}08` : "transparent",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
          );
        })}

        {/* 12-hour period dividers (midnight/noon) */}
        {periodMarkers.map((marker, idx) => {
          const position = getEventPosition(marker.time);
          if (position < 0 || position > 100) return null;

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: `${position}%`,
                top: 0,
                bottom: showLabels ? "30px" : 0,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: "1px",
                  backgroundColor: marker.isMidnight
                    ? `${theme.colors.primary}40`
                    : `${theme.colors.border}80`,
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "-2px",
                  left: "3px",
                  fontSize: theme.fontSizes[0],
                  fontWeight: theme.fontWeights.medium,
                  color: marker.isMidnight ? theme.colors.primary : theme.colors.textSecondary,
                  backgroundColor: `${theme.colors.background}CC`,
                  padding: "1px 4px",
                  borderRadius: theme.radii[0],
                  whiteSpace: "nowrap",
                  zIndex: 2,
                }}
              >
                {marker.label}
              </div>
            </div>
          );
        })}

        {/* Time markers */}
        {showLabels && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "30px",
              pointerEvents: "none",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            {timeMarkers.map((marker, idx) => {
              const position = getEventPosition(marker.time);
              if (position < 0 || position > 100) return null;

              return (
                <div
                  key={idx}
                  style={{
                    position: "absolute",
                    left: `${position}%`,
                    fontSize: theme.fontSizes[0],
                    color: theme.colors.textMuted,
                    transform: "translateX(-50%)",
                  }}
                >
                  {marker.label}
                </div>
              );
            })}
          </div>
        )}

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
            pointerEvents: "none",
            zIndex: 3,
          }}
        />

        {/* Time tick marks */}
        {timeMarkers.map((marker, idx) => {
          const position = getEventPosition(marker.time);
          if (position < 0 || position > 100) return null;

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                top: "50%",
                left: `${position}%`,
                width: "1px",
                height: "16px",
                backgroundColor: theme.colors.border,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 3,
              }}
            />
          );
        })}

        {/* Current time indicator */}
        {getEventPosition(now) >= 0 && getEventPosition(now) <= 100 && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${getEventPosition(now)}%`,
              bottom: showLabels ? "16px" : 0,
              width: "2px",
              backgroundColor: theme.colors.primary,
              opacity: 0.6,
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        )}

        {/* Session segment bars */}
        {sessionSegments.map((segment) => {
          const startPosition = getEventPosition(segment.startTime);
          const endPosition = getEventPosition(segment.endTime);

          if (endPosition < -2 || startPosition > 102) return null;

          const leftPos = Math.max(0, startPosition);
          const rightPos = Math.min(100, endPosition);
          const width = rightPos - leftPos;
          const minWidth = 0.1;
          const displayWidth = Math.max(width, minWidth);

          const isSelected = selectedSession === segment.sessionId;
          const isHovered = hoveredSegment === segment;

          return (
            <div
              key={segment.sessionId}
              style={{
                position: "absolute",
                top: "50%",
                left: `${leftPos}%`,
                width: `${displayWidth}%`,
                height: isSelected ? "20px" : isHovered ? "16px" : "12px",
                backgroundColor: repoColor,
                border: isSelected
                  ? `2px solid ${theme.colors.primary}`
                  : `1px solid ${theme.colors.background}`,
                transform: "translateY(-50%)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                zIndex: isSelected ? 30 : isHovered ? 20 : 10,
                pointerEvents: isDragging ? "none" : "auto",
                borderRadius: "2px",
                opacity: isSelected ? 1 : isHovered ? 0.9 : 0.8,
              }}
              onMouseEnter={() => !isDragging && setHoveredSegment(segment)}
              onMouseLeave={() => setHoveredSegment(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSessionClick?.(segment.sessionId);
              }}
            />
          );
        })}

        {/* Tooltip */}
        {hoveredSegment && !isDragging && (
          <div
            style={{
              position: "fixed",
              left: `${mousePosition.x + (timelineRef.current?.getBoundingClientRect().left || 0)}px`,
              top: `${(timelineRef.current?.getBoundingClientRect().top || 0) + mousePosition.y - 100}px`,
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
            <div style={{ fontWeight: theme.fontWeights.bold, marginBottom: "4px" }}>
              Session {hoveredSegment.sessionId.slice(0, 8)}...
            </div>
            <div style={{ color: theme.colors.text, fontSize: theme.fontSizes[0], marginBottom: "2px" }}>
              {hoveredSegment.eventCount} event{hoveredSegment.eventCount !== 1 ? "s" : ""}
            </div>
            <div style={{ color: theme.colors.textMuted, fontSize: theme.fontSizes[0] }}>
              {new Date(hoveredSegment.startTime).toLocaleTimeString()} -{" "}
              {new Date(hoveredSegment.endTime).toLocaleTimeString()}
            </div>
            <div style={{ color: theme.colors.textMuted, fontSize: theme.fontSizes[0] }}>
              Duration: {Math.round((hoveredSegment.endTime - hoveredSegment.startTime) / 60000)}m
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
