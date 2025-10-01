"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@a24z/industry-theme";
import { Zap, AlertTriangle, Edit } from "lucide-react";
import { LiveEvent } from "./types";

interface Props {
  events: LiveEvent[];
}

export const LatestSyncEvent: React.FC<Props> = ({ events }) => {
  const { theme } = useTheme();
  const [latestEvent, setLatestEvent] = useState<LiveEvent | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (events.length > 0) {
      setLatestEvent(events[0]);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [events]);

  if (!latestEvent) {
    return (
      <div
        style={{
          backgroundColor: theme.colors.backgroundSecondary,
          borderRadius: theme.radii[2],
          padding: theme.space[4],
          textAlign: "center",
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        <div
          style={{
            fontSize: theme.fontSizes[2],
            color: theme.colors.textMuted,
          }}
        >
          Waiting for sync events...
        </div>
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "sync":
        return Zap;
      case "collision":
        return AlertTriangle;
      case "activity":
        return Edit;
      default:
        return Edit;
    }
  };

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

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 5) return "just now";
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div
      style={{
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.radii[2],
        padding: theme.space[4],
        border: `2px solid ${getEventColor(latestEvent.type)}`,
        transition: "all 0.3s ease",
        transform: isAnimating ? "scale(1.02)" : "scale(1)",
        boxShadow: isAnimating
          ? `0 4px 20px ${getEventColor(latestEvent.type)}40`
          : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.space[3],
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: `${getEventColor(latestEvent.type)}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {React.createElement(getEventIcon(latestEvent.type), {
            size: 24,
            color: getEventColor(latestEvent.type),
          })}
        </div>

        {/* Event Details */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: theme.fontSizes[1],
              color: theme.colors.textSecondary,
              marginBottom: theme.space[1],
            }}
          >
            Latest Event • {getTimeAgo(latestEvent.timestamp)}
          </div>
          <div
            style={{
              fontSize: theme.fontSizes[2],
              color: theme.colors.text,
              fontWeight: theme.fontWeights.medium,
            }}
          >
            {latestEvent.description || getDefaultDescription(latestEvent)}
          </div>
          {latestEvent.latency && (
            <div
              style={{
                fontSize: theme.fontSizes[1],
                color: getEventColor(latestEvent.type),
                marginTop: theme.space[1],
              }}
            >
              Latency: {latestEvent.latency.toFixed(0)}ms
            </div>
          )}
        </div>

        {/* Live Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.space[2],
            color: theme.colors.success,
            fontSize: theme.fontSizes[1],
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: theme.colors.success,
              animation: "pulse 2s infinite",
            }}
          />
          LIVE
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

function getDefaultDescription(event: LiveEvent): string {
  switch (event.type) {
    case "sync":
      return `Sync propagated to ${event.userCount || 0} users in ${event.latency?.toFixed(0) || "?"}ms`;
    case "collision":
      return `Collision on ${event.fileType || "file"} - ${event.resolved ? "Resolved" : "Pending resolution"}`;
    case "activity":
      return `User edited ${event.fileType || "file"}`;
    default:
      return "Activity detected";
  }
}
