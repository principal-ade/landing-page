"use client";

import React from "react";
import { useTheme } from "@a24z/industry-theme";

interface TimeMarker {
  timestampMs: number;
  label: string;
  isMajor: boolean; // major = hour markers, minor = 15/30 min markers
}

interface TimeRulerProps {
  startTime: number;
  endTime: number;
  currentTime: number;
}

export const TimeRuler = React.forwardRef<HTMLDivElement, TimeRulerProps>(
  ({ startTime, endTime, currentTime }, ref) => {
    const { theme } = useTheme();

  // Generate time markers
  const getTimeMarkers = (): TimeMarker[] => {
    const markers: TimeMarker[] = [];
    const duration = endTime - startTime;
    const durationHours = duration / (60 * 60 * 1000);

    // Determine interval based on duration
    let majorIntervalMinutes = 60; // 1 hour
    let minorIntervalMinutes = 30; // 30 minutes

    if (durationHours <= 6) {
      majorIntervalMinutes = 60;
      minorIntervalMinutes = 15;
    } else if (durationHours <= 12) {
      majorIntervalMinutes = 60;
      minorIntervalMinutes = 30;
    } else {
      majorIntervalMinutes = 120;
      minorIntervalMinutes = 60;
    }

    // Use minor interval for iteration
    const intervalMs = minorIntervalMinutes * 60 * 1000;
    const firstMarkerTime = Math.ceil(startTime / intervalMs) * intervalMs;

    for (let time = firstMarkerTime; time <= endTime; time += intervalMs) {
      const date = new Date(time);
      const minutes = date.getMinutes();
      const hours = date.getHours();

      // Check if this is a major marker (on the hour or 2-hour boundary)
      const isMajor =
        (majorIntervalMinutes === 60 && minutes === 0) ||
        (majorIntervalMinutes === 120 && minutes === 0 && hours % 2 === 0);

      markers.push({
        timestampMs: time,
        label: date.toLocaleTimeString([], {
          hour: "numeric",
          minute: minutes === 0 ? undefined : "2-digit",
          hour12: true,
        }),
        isMajor,
      });
    }

    return markers;
  };

  const markers = getTimeMarkers();
  const totalDuration = endTime - startTime;

  // Calculate position for current time indicator
  const currentTimePosition =
    ((currentTime - startTime) / totalDuration) * 100;
  const isCurrentTimeVisible =
    currentTime >= startTime && currentTime <= endTime;

    return (
      <div
        ref={ref}
        style={{
          width: "80px",
          borderRight: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.backgroundSecondary,
          flexShrink: 0,
          overflowY: "hidden",
          overflowX: "hidden",
        }}
      >
        {/* Scrollable content matching session cards height */}
        <div
          style={{
            position: "relative",
            minHeight: "200vh", // Match the session cards container height
          }}
        >
          {/* Time markers */}
          {markers.map((marker, idx) => {
            const position =
              ((marker.timestampMs - startTime) / totalDuration) * 100;

            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  top: `${position}%`,
                  right: 0,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: theme.space[2],
                }}
              >
                {/* Tick mark */}
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    width: marker.isMajor ? "12px" : "6px",
                    height: "1px",
                    backgroundColor: marker.isMajor
                      ? theme.colors.border
                      : theme.colors.border,
                    opacity: marker.isMajor ? 1 : 0.5,
                  }}
                />

                {/* Time label */}
                {marker.isMajor && (
                  <div
                    style={{
                      fontSize: theme.fontSizes[0],
                      color: theme.colors.textSecondary,
                      fontWeight: theme.fontWeights.medium,
                      marginRight: "16px",
                      backgroundColor: theme.colors.backgroundSecondary,
                      padding: "2px 4px",
                      borderRadius: theme.radii[0],
                    }}
                  >
                    {marker.label}
                  </div>
                )}
              </div>
            );
          })}

          {/* Current time indicator */}
          {isCurrentTimeVisible && (
            <div
              style={{
                position: "absolute",
                top: `${currentTimePosition}%`,
                right: 0,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: theme.space[2],
                zIndex: 10,
              }}
            >
              {/* Current time tick */}
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  width: "16px",
                  height: "2px",
                  backgroundColor: theme.colors.primary,
                }}
              />

              {/* "Now" label */}
              <div
                style={{
                  fontSize: theme.fontSizes[0],
                  color: theme.colors.primary,
                  fontWeight: theme.fontWeights.bold,
                  marginRight: "20px",
                  backgroundColor: theme.colors.background,
                  padding: "2px 6px",
                  borderRadius: theme.radii[1],
                  border: `1px solid ${theme.colors.primary}`,
                }}
              >
                Now
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

TimeRuler.displayName = "TimeRuler";
