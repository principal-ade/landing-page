"use client";

import React from "react";
import { useTheme } from "@principal-ade/industry-theme";

interface DashboardLayerProps {
  className?: string;
  fillContainer?: boolean;
}

export const DashboardLayer: React.FC<DashboardLayerProps> = ({ className, fillContainer = false }) => {
  const { theme } = useTheme();

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        background: "transparent",
        borderRadius: fillContainer ? 0 : "12px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `2px solid ${theme.colors.primary}`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 16,
          background: theme.colors.backgroundSecondary,
          padding: "2px 8px",
          fontSize: "10px",
          color: theme.colors.primary,
          fontFamily: "monospace",
        }}
      >
        01
      </div>
      <span
        style={{
          color: theme.colors.primary,
          fontFamily: "monospace",
          fontSize: "24px",
          fontWeight: 700,
          position: "absolute",
          top: 40,
          left: 40,
        }}
      >
        OBSERVE
      </span>
    </div>
  );
};

export default DashboardLayer;