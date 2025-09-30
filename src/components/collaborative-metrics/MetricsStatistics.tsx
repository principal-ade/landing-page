"use client";

import React from "react";
import { useTheme } from "themed-markdown";
import { Zap, Clock, AlertTriangle, Users } from "lucide-react";
import { MetricsData } from "./types";

interface Props {
  metrics: MetricsData;
  lastCollisionTime?: number | null;
}

export const MetricsStatistics: React.FC<Props> = ({
  metrics,
  lastCollisionTime,
}) => {
  const { theme } = useTheme();

  const getTimeSinceLastCollision = () => {
    if (!lastCollisionTime) return "No collisions";
    const seconds = Math.floor((Date.now() - lastCollisionTime) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const stats = [
    {
      value: `${metrics.avgSyncLatency.toFixed(0)}ms`,
      label: "Sync Latency",
      color: theme.colors.info,
      Icon: Zap,
    },
    {
      value: `${metrics.timeBetweenSyncs.toFixed(1)}s`,
      label: "Between Syncs",
      color: theme.colors.success,
      Icon: Clock,
    },
    {
      value: getTimeSinceLastCollision(),
      label: "Last Collision",
      color: theme.colors.success,
      Icon: AlertTriangle,
    },
    {
      value: metrics.activeUsers.toString(),
      label: "Active Users",
      color: theme.colors.primary,
      Icon: Users,
    },
  ];

  return (
    <div
      style={{
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.radii[2],
        padding: theme.space[3],
        height: "100%",
      }}
    >
      <h3
        style={{
          fontSize: theme.fontSizes[2],
          fontWeight: theme.fontWeights.heading,
          marginBottom: theme.space[2],
          color: theme.colors.text,
        }}
      >
        Real-time Metrics
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: theme.space[2],
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              backgroundColor: theme.colors.backgroundTertiary,
              borderRadius: theme.radii[1],
              padding: theme.space[2],
              borderLeft: `3px solid ${stat.color}`,
              transition: "transform 0.2s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.space[1],
                marginBottom: theme.space[1],
              }}
            >
              <stat.Icon size={20} color={stat.color} />
              <div
                style={{
                  fontSize: theme.fontSizes[3],
                  fontWeight: theme.fontWeights.bold,
                  color: stat.color,
                }}
              >
                {stat.value}
              </div>
            </div>
            <div
              style={{
                fontSize: theme.fontSizes[0],
                color: theme.colors.textSecondary,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Sync Velocity Bar - Smaller version */}
      <div
        style={{
          marginTop: theme.space[2],
          padding: theme.space[2],
          backgroundColor: theme.colors.backgroundTertiary,
          borderRadius: theme.radii[1],
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.space[1],
          }}
        >
          <span
            style={{
              fontSize: theme.fontSizes[0],
              color: theme.colors.textSecondary,
            }}
          >
            Sync Velocity
          </span>
          <span
            style={{
              fontSize: theme.fontSizes[1],
              fontWeight: theme.fontWeights.semibold,
              color: theme.colors.text,
            }}
          >
            {metrics.syncVelocity.toFixed(1)} /min
          </span>
        </div>
        <div
          style={{
            height: "4px",
            backgroundColor: theme.colors.background,
            borderRadius: theme.radii[1],
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.min(100, (metrics.syncVelocity / 30) * 100)}%`,
              backgroundColor: theme.colors.primary,
              transition: "width 0.5s ease",
              borderRadius: theme.radii[1],
            }}
          />
        </div>
      </div>
    </div>
  );
};
