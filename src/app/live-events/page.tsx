"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@a24z/industry-theme";
import { ArrowLeft } from "lucide-react";
import { SyncPropagationVisualizer } from "../../components/collaborative-metrics/SyncPropagationVisualizer";
import { MetricsStatistics } from "../../components/collaborative-metrics/MetricsStatistics";
import { LatestSyncEvent } from "../../components/collaborative-metrics/LatestSyncEvent";
import { MetricsData, LiveEvent, SyncEvent, CollisionEvent } from "../../components/collaborative-metrics/types";

export default function LiveEventsPage() {
  const { theme } = useTheme();
  const [metrics, setMetrics] = useState<MetricsData>({
    avgSyncLatency: 45,
    timeBetweenSyncs: 12,
    collisionRate: 0.2,
    activeUsers: 5,
    recentSyncs: [],
    recentCollisions: [],
    syncVelocity: 5,
  });
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [sessionCount, setSessionCount] = useState<number | null>(null);
  const [sessionCountError, setSessionCountError] = useState<string | null>(null);

  // Simulate live events for demonstration
  useEffect(() => {
    const generateSyncEvent = (): SyncEvent => ({
      id: `sync-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      initiatorHash: `user-${Math.floor(Math.random() * 5)}`,
      propagationTimes: Array.from({ length: 4 }, () => Math.random() * 100 + 20),
      avgLatency: Math.random() * 50 + 30,
    });

    const generateCollisionEvent = (): CollisionEvent => ({
      id: `collision-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      userHashes: [`user-${Math.floor(Math.random() * 5)}`, `user-${Math.floor(Math.random() * 5)}`],
      resourceType: [".tsx", ".ts", ".css", ".json"][Math.floor(Math.random() * 4)],
      resolved: Math.random() > 0.3,
      resolutionTime: Math.random() * 1000 + 500,
    });

    const generateLiveEvent = (): LiveEvent => {
      const type = Math.random() > 0.7 ? "collision" : Math.random() > 0.3 ? "sync" : "activity";
      return {
        id: `event-${Date.now()}-${Math.random()}`,
        type,
        timestamp: Date.now(),
        latency: type === "sync" ? Math.random() * 100 + 20 : undefined,
        userCount: type === "sync" ? Math.floor(Math.random() * 4) + 2 : undefined,
        fileType: [".tsx", ".ts", ".css", ".json"][Math.floor(Math.random() * 4)],
        resolved: type === "collision" ? Math.random() > 0.3 : undefined,
      };
    };

    // Generate initial events
    const initialSyncs = Array.from({ length: 3 }, generateSyncEvent);
    setMetrics((prev) => ({
      ...prev,
      recentSyncs: initialSyncs,
    }));

    // Periodically generate new events
    const interval = setInterval(() => {
      const newSyncEvent = generateSyncEvent();
      const newLiveEvent = generateLiveEvent();

      setMetrics((prev) => ({
        ...prev,
        recentSyncs: [newSyncEvent, ...prev.recentSyncs].slice(0, 10),
        recentCollisions:
          Math.random() > 0.8
            ? [generateCollisionEvent(), ...prev.recentCollisions].slice(0, 5)
            : prev.recentCollisions,
        avgSyncLatency: newSyncEvent.avgLatency,
        timeBetweenSyncs: Math.random() * 15 + 8,
        syncVelocity: Math.random() * 10 + 3,
      }));

      setLiveEvents((prev) => [newLiveEvent, ...prev].slice(0, 20));
    }, 3000); // New event every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Fetch session count from API
  useEffect(() => {
    const fetchSessionCount = async () => {
      try {
        const response = await fetch('/api/agent-events/session-count');
        const data = await response.json();

        if (response.ok) {
          setSessionCount(data.count);
          setSessionCountError(null);
        } else {
          setSessionCountError(data.message || 'Failed to fetch session count');
        }
      } catch (error) {
        setSessionCountError('Network error fetching session count');
        console.error('Error fetching session count:', error);
      }
    };

    // Initial fetch
    fetchSessionCount();

    // Fetch every 5 seconds (5000ms) to match sync interval
    const interval = setInterval(fetchSessionCount, 5000);

    return () => clearInterval(interval);
  }, []);

  const lastCollisionTime =
    metrics.recentCollisions.length > 0
      ? metrics.recentCollisions[0].timestamp
      : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        padding: "40px 20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          marginBottom: "40px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: theme.colors.primary,
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "500",
            marginBottom: "20px",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateX(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <h1
          style={{
            fontSize: "48px",
            fontWeight: "700",
            marginBottom: "12px",
            background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Live Session Events
        </h1>
        <p
          style={{
            fontSize: "20px",
            color: theme.colors.textSecondary,
            maxWidth: "800px",
          }}
        >
          Watch real-time collaboration events from coding sessions in your panel
        </p>
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Session Count Card */}
        <div
          style={{
            gridColumn: "1 / -1",
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: theme.radii[2],
            padding: theme.space[4],
            border: `2px solid ${theme.colors.primary}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: theme.fontSizes[2],
                fontWeight: theme.fontWeights.heading,
                marginBottom: theme.space[1],
                color: theme.colors.textSecondary,
              }}
            >
              Sessions in Last 24 Hours
            </h2>
            <div
              style={{
                fontSize: "48px",
                fontWeight: theme.fontWeights.bold,
                color: theme.colors.primary,
                lineHeight: 1,
              }}
            >
              {sessionCount !== null ? sessionCount : '...'}
            </div>
            {sessionCountError && (
              <div
                style={{
                  fontSize: theme.fontSizes[0],
                  color: theme.colors.error,
                  marginTop: theme.space[2],
                }}
              >
                {sessionCountError}
              </div>
            )}
          </div>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: sessionCount !== null ? theme.colors.success : theme.colors.textMuted,
              animation: sessionCount !== null ? "pulse 2s infinite" : "none",
            }}
          />
        </div>

        {/* Latest Event Card */}
        <div style={{ gridColumn: "1 / -1" }}>
          <LatestSyncEvent events={liveEvents} />
        </div>

        {/* Metrics Statistics */}
        <div>
          <MetricsStatistics
            metrics={metrics}
            lastCollisionTime={lastCollisionTime}
          />
        </div>

        {/* Sync Propagation Visualizer */}
        <div>
          <SyncPropagationVisualizer metrics={metrics} />
        </div>

        {/* Event History */}
        <div
          style={{
            gridColumn: "1 / -1",
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: theme.radii[2],
            padding: theme.space[4],
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h2
            style={{
              fontSize: theme.fontSizes[3],
              fontWeight: theme.fontWeights.heading,
              marginBottom: theme.space[3],
              color: theme.colors.text,
            }}
          >
            Recent Events
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.space[2],
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {liveEvents.map((event) => {
              const getEventColor = (type: string) => {
                switch (type) {
                  case "sync":
                    return theme.colors.info;
                  case "collision":
                    return theme.colors.warning;
                  case "activity":
                    return theme.colors.success;
                  default:
                    return theme.colors.primary;
                }
              };

              const getEventLabel = (type: string) => {
                switch (type) {
                  case "sync":
                    return "Sync";
                  case "collision":
                    return "Collision";
                  case "activity":
                    return "Activity";
                  default:
                    return "Event";
                }
              };

              const getTimeAgo = (timestamp: number) => {
                const seconds = Math.floor((Date.now() - timestamp) / 1000);
                if (seconds < 5) return "just now";
                if (seconds < 60) return `${seconds}s ago`;
                if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
                return `${Math.floor(seconds / 3600)}h ago`;
              };

              return (
                <div
                  key={event.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: theme.space[2],
                    padding: theme.space[2],
                    backgroundColor: theme.colors.backgroundTertiary,
                    borderRadius: theme.radii[1],
                    borderLeft: `3px solid ${getEventColor(event.type)}`,
                  }}
                >
                  <div
                    style={{
                      minWidth: "80px",
                      padding: "4px 8px",
                      backgroundColor: `${getEventColor(event.type)}20`,
                      color: getEventColor(event.type),
                      borderRadius: theme.radii[1],
                      fontSize: theme.fontSizes[0],
                      fontWeight: theme.fontWeights.semibold,
                      textAlign: "center",
                    }}
                  >
                    {getEventLabel(event.type)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: theme.fontSizes[1],
                        color: theme.colors.text,
                      }}
                    >
                      {event.description ||
                        `${getEventLabel(event.type)} event on ${event.fileType || "file"}`}
                    </div>
                    {event.latency && (
                      <div
                        style={{
                          fontSize: theme.fontSizes[0],
                          color: theme.colors.textSecondary,
                          marginTop: "2px",
                        }}
                      >
                        Latency: {event.latency.toFixed(0)}ms
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: theme.fontSizes[0],
                      color: theme.colors.textSecondary,
                      minWidth: "80px",
                      textAlign: "right",
                    }}
                  >
                    {getTimeAgo(event.timestamp)}
                  </div>
                </div>
              );
            })}

            {liveEvents.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: theme.space[4],
                  color: theme.colors.textMuted,
                  fontSize: theme.fontSizes[1],
                }}
              >
                Waiting for events...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
