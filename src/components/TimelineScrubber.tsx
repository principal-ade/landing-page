"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";

interface TimeBlock {
  hour: number;
  period: "Morning" | "Afternoon" | "Evening" | "Night Shift";
  commits: number;
  active: boolean;
}

interface TimelineScrubberProps {
  isMobile?: boolean;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();

  const generateTimeBlocks = (): TimeBlock[] => {
    const blocks: TimeBlock[] = [];
    for (let hour = 0; hour < 24; hour++) {
      let period: "Morning" | "Afternoon" | "Evening" | "Night Shift";
      if (hour >= 6 && hour < 12) period = "Morning";
      else if (hour >= 12 && hour < 18) period = "Afternoon";
      else if (hour >= 18 && hour < 22) period = "Evening";
      else period = "Night Shift";

      const commits = Math.floor(Math.random() * 20);
      blocks.push({ hour, period, commits, active: false });
    }
    return blocks;
  };

  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(generateTimeBlocks());
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  const handleBlockClick = (hour: number) => {
    setSelectedHour(hour);
    setTimeBlocks(blocks =>
      blocks.map(block => ({
        ...block,
        active: block.hour === hour,
      }))
    );
  };

  const getPeriodColor = (period: string) => {
    switch (period) {
      case "Morning":
        return "#FCD34D"; // Yellow
      case "Afternoon":
        return "#FB923C"; // Orange
      case "Evening":
        return "#A78BFA"; // Purple
      case "Night Shift":
        return "#60A5FA"; // Blue
      default:
        return theme.colors.border;
    }
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return "12am";
    if (hour < 12) return `${hour}am`;
    if (hour === 12) return "12pm";
    return `${hour - 12}pm`;
  };

  const selectedBlock = selectedHour !== null ? timeBlocks[selectedHour] : null;

  return (
    <div
      style={{
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "12px",
        padding: isMobile ? "20px" : "24px",
        marginBottom: "32px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h4
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: "600",
            color: theme.colors.text,
            marginBottom: "4px",
          }}
        >
          Time Travel Timeline
        </h4>
        <p
          style={{
            fontSize: isMobile ? "12px" : "13px",
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.body,
            margin: 0,
          }}
        >
          Click any hour to jump to that moment
        </p>
      </div>

      {/* Timeline Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${isMobile ? "12" : "24"}, 1fr)`,
          gap: isMobile ? "4px" : "6px",
          marginBottom: "20px",
        }}
      >
        {timeBlocks.map((block) => {
          const intensity = Math.min(block.commits / 20, 1);

          return (
            <motion.div
              key={block.hour}
              style={{
                aspectRatio: "1",
                background: block.commits > 0
                  ? getPeriodColor(block.period)
                  : theme.colors.border,
                opacity: block.commits > 0 ? 0.3 + (intensity * 0.7) : 0.2,
                borderRadius: "4px",
                cursor: "pointer",
                border: block.active
                  ? `2px solid ${getPeriodColor(block.period)}`
                  : "1px solid transparent",
                position: "relative",
              }}
              whileHover={{ scale: 1.15, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBlockClick(block.hour)}
              animate={{
                scale: block.active ? 1.1 : 1,
                opacity: block.active ? 1 : (block.commits > 0 ? 0.3 + (intensity * 0.7) : 0.2),
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Tooltip on hover */}
              <div
                style={{
                  position: "absolute",
                  bottom: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "10px",
                  fontFamily: theme.fonts.body,
                  color: theme.colors.text,
                  whiteSpace: "nowrap",
                  opacity: 0,
                  pointerEvents: "none",
                  marginBottom: "4px",
                  zIndex: 10,
                }}
                className="timeline-tooltip"
              >
                {formatHour(block.hour)}: {block.commits} commits
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Period Info */}
      {selectedBlock && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: theme.colors.background,
            border: `1px solid ${getPeriodColor(selectedBlock.period)}`,
            borderRadius: "8px",
            padding: isMobile ? "12px" : "16px",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span
                style={{
                  fontSize: isMobile ? "11px" : "12px",
                  color: theme.colors.textSecondary,
                  fontFamily: theme.fonts.body,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontWeight: "600",
                }}
              >
                {selectedBlock.period}
              </span>
              <div
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "700",
                  fontFamily: theme.fonts.heading,
                  color: theme.colors.text,
                  marginTop: "4px",
                }}
              >
                {formatHour(selectedBlock.hour)}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: isMobile ? "24px" : "28px",
                  fontWeight: "700",
                  fontFamily: theme.fonts.heading,
                  color: getPeriodColor(selectedBlock.period),
                }}
              >
                {selectedBlock.commits}
              </div>
              <span
                style={{
                  fontSize: isMobile ? "11px" : "12px",
                  color: theme.colors.textSecondary,
                  fontFamily: theme.fonts.body,
                }}
              >
                commits
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Period Legend */}
      <div
        style={{
          display: "flex",
          gap: isMobile ? "8px" : "12px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {["Morning", "Afternoon", "Evening", "Night Shift"].map((period) => (
          <div key={period} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                background: getPeriodColor(period),
              }}
            />
            <span
              style={{
                fontSize: isMobile ? "10px" : "11px",
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.body,
              }}
            >
              {period}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .timeline-tooltip {
          transition: opacity 0.2s;
        }
        div:hover > .timeline-tooltip {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};
