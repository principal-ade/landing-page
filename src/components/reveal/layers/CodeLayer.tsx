"use client";

import React from "react";
import { useTheme } from "@principal-ade/industry-theme";

interface CodeLayerProps {
  className?: string;
  fillContainer?: boolean;
}

const BlueprintGrid: React.FC<{ opacity?: number }> = ({ opacity = 0.08 }) => {
  const { theme } = useTheme();
  return (
    <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
      <defs>
        <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth="0.5"
            opacity={opacity}
          />
        </pattern>
        <pattern id="blueprintGridLarge" width="60" height="60" patternUnits="userSpaceOnUse">
          <path
            d="M 60 0 L 0 0 0 60"
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth="1"
            opacity={0.15}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprintGrid)" />
      <rect width="100%" height="100%" fill="url(#blueprintGridLarge)" />
    </svg>
  );
};

const CodeLineSkeleton: React.FC<{ indent?: number }> = ({ indent = 0 }) => {
  const { theme } = useTheme();
  const widths = [60, 80, 40, 70, 50, 90];
  const width = widths[Math.floor(Math.random() * widths.length)];
  return (
    <div style={{ display: "flex", gap: "4px", paddingLeft: indent * 16 }}>
      <span
        style={{
          width: 24,
          textAlign: "right",
          color: theme.colors.textSecondary,
          fontSize: "9px",
          opacity: 0.5,
        }}
      >
        {Math.floor(Math.random() * 50) + 1}
      </span>
      <div
        style={{
          height: 10,
          width,
          border: `1px solid ${theme.colors.primary}`,
          opacity: 0.6,
        }}
      />
    </div>
  );
};

const FunctionBlock: React.FC<{ name: string; params?: string }> = ({ name, params }) => {
  const { theme } = useTheme();
  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <span style={{ color: theme.colors.primary, fontSize: "10px" }}>fn</span>
      <span style={{ color: theme.colors.text, fontSize: "10px", fontWeight: 600 }}>{name}</span>
      <span style={{ color: theme.colors.textSecondary, fontSize: "10px" }}>({params || "..."})</span>
      <span style={{ color: theme.colors.textSecondary, fontSize: "10px" }}>{"{"}</span>
    </div>
  );
};

const ImportSkeleton: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      <span style={{ color: theme.colors.primary, fontSize: "10px" }}>import</span>
      <div style={{ height: 10, width: 100, border: `1px dashed ${theme.colors.primary}`, opacity: 0.5 }} />
      <span style={{ color: theme.colors.textSecondary, fontSize: "10px" }}>from</span>
      <div style={{ height: 10, width: 80, border: `1px dashed ${theme.colors.primary}`, opacity: 0.5 }} />
    </div>
  );
};

export const CodeLayer: React.FC<CodeLayerProps> = ({ className, fillContainer = false }) => {
  const { theme } = useTheme();

  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        background: theme.colors.backgroundSecondary,
        borderRadius: fillContainer ? 0 : "12px",
        padding: "24px",
        boxSizing: "border-box",
        fontFamily: "var(--font-fira-code), monospace",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <BlueprintGrid />

      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              fontSize: "10px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: theme.colors.primary,
              marginBottom: "4px",
            }}
          >
            Layer 4: Implementation
          </div>
          <div
            style={{
              borderBottom: `1px solid ${theme.colors.primary}`,
              paddingBottom: "4px",
              display: "inline-block",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: theme.colors.text,
                margin: 0,
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              telemetry.ts
            </h3>
          </div>
        </div>

        {/* Code block wireframe */}
        <div
          style={{
            background: "#1e1e2e",
            borderRadius: "8px",
            border: `1px solid ${theme.colors.primary}`,
            overflow: "hidden",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* File tab */}
          <div
            style={{
              background: "#313244",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderBottom: `1px solid ${theme.colors.primary}`,
            }}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", border: `1px solid ${theme.colors.primary}` }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", border: `1px solid ${theme.colors.primary}` }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", border: `1px solid ${theme.colors.primary}` }} />
            </div>
            <span style={{ fontSize: "11px", color: theme.colors.primary }}>telemetry.ts</span>
          </div>

          {/* Code content */}
          <div style={{ padding: "16px", flex: 1, overflow: "hidden" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Imports */}
              <ImportSkeleton />
              <ImportSkeleton />
              <div style={{ height: 1, borderTop: `1px dashed ${theme.colors.primary}`, opacity: 0.3, margin: "8px 0" }} />

              {/* Function signatures */}
              <FunctionBlock name="initTracer" params="config: TracerConfig" />
              <div style={{ paddingLeft: 16 }}>
                <CodeLineSkeleton />
              </div>
              <FunctionBlock name="createSpan" params="name: string, ctx: Context" />
              <div style={{ paddingLeft: 16 }}>
                <CodeLineSkeleton />
                <CodeLineSkeleton />
              </div>
              <FunctionBlock name="addEvent" params="span: Span, event: string" />
              <div style={{ paddingLeft: 16 }}>
                <CodeLineSkeleton />
              </div>

              {/* Ellipsis */}
              <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: theme.colors.primary, fontSize: "10px" }}>...</span>
                <div style={{ flex: 1, height: 1, borderTop: `1px dashed ${theme.colors.primary}`, opacity: 0.3 }} />
                <span style={{ color: theme.colors.primary, fontSize: "10px" }}>24 more functions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Type annotations */}
        <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "8px", color: theme.colors.primary }}>Span</span>
            <div style={{ width: 40, height: 1, borderBottom: `1px dashed ${theme.colors.primary}` }} />
            <span style={{ fontSize: "8px", color: theme.colors.primary }}>interface</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "8px", color: theme.colors.primary }}>Tracer</span>
            <div style={{ width: 40, height: 1, borderBottom: `1px dashed ${theme.colors.primary}` }} />
            <span style={{ fontSize: "8px", color: theme.colors.primary }}>class</span>
          </div>
        </div>
      </div>
    </div>
  );
};