"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";
import { DashboardLayer, WorkflowLayer, CanvasLayer, Layer04 } from "./layers";

export type AnimationStyle = "paperLift";
export type ScrollHeight = "200vh" | "300vh" | "400vh" | "500vh";

interface LayeredRevealProps {
  animationStyle?: AnimationStyle;
  scrollHeight?: ScrollHeight;
  showLabels?: boolean;
}

// Layer configuration
const layers = [
  { id: "dashboard", label: "Dashboard", Component: DashboardLayer },
  { id: "workflow", label: "workflow.json", Component: WorkflowLayer },
  { id: "canvas", label: "otel.canvas", Component: CanvasLayer },
  { id: "layer04", label: "Layer 04", Component: Layer04 },
];

// Paper lift - bottom edge lifts up, rotating around top edge
const usePaperLiftAnimation = (
  scrollYProgress: MotionValue<number>,
  index: number,
  total: number,
  shadowColor: string
) => {
  const layerStart = index / total;
  const layerEnd = (index + 1) / total;
  const isLastLayer = index >= total - 1;

  // Rotate on X axis - negative value lifts the bottom edge up
  // Top stays almost fixed initially, rotation kicks in later
  const rotateX = useTransform(
    scrollYProgress,
    [
      layerStart,
      layerStart + (layerEnd - layerStart) * 0.25,  // stay flat longer
      layerStart + (layerEnd - layerStart) * 0.5,
      layerEnd
    ],
    [0, isLastLayer ? 0 : -2, isLastLayer ? 0 : -40, isLastLayer ? 0 : -95]
  );

  // No Y movement - top edge stays completely fixed
  // The rotation + perspective handles the lift illusion
  const y = 0;

  // Dynamic shadow that grows as paper lifts - simulates light from above
  const shadowBlur = useTransform(
    scrollYProgress,
    [layerStart, layerStart + (layerEnd - layerStart) * 0.5, layerEnd],
    [4, isLastLayer ? 4 : 25, isLastLayer ? 4 : 0]
  );

  const shadowY = useTransform(
    scrollYProgress,
    [layerStart, layerStart + (layerEnd - layerStart) * 0.5, layerEnd],
    [2, isLastLayer ? 2 : 15, isLastLayer ? 2 : 0]
  );

  const shadowOpacity = useTransform(
    scrollYProgress,
    [layerStart, layerStart + (layerEnd - layerStart) * 0.3, layerEnd - 0.05, layerEnd],
    [0.15, isLastLayer ? 0.15 : 0.3, isLastLayer ? 0.15 : 0.1, isLastLayer ? 0.15 : 0]
  );

  // Combine shadow values into a boxShadow string
  const boxShadow = useTransform(
    [shadowY, shadowBlur, shadowOpacity],
    ([y, blur, opacity]) =>
      `0px ${y}px ${blur}px rgba(${shadowColor}, ${opacity})`
  );

  // All layers stay fully visible - z-index handles stacking
  // Only fade out once fully flipped to avoid visual glitch
  const opacity = useTransform(
    scrollYProgress,
    [layerStart, layerEnd - 0.02, layerEnd],
    [1, 1, isLastLayer ? 1 : 0]
  );

  // Non-uniform scale - bottom comes toward viewer more than top
  // Delayed significantly so top doesn't move initially
  const scaleY = useTransform(
    scrollYProgress,
    [
      layerStart,
      layerStart + (layerEnd - layerStart) * 0.3,  // no scale initially
      layerStart + (layerEnd - layerStart) * 0.55,
      layerEnd
    ],
    [1, 1, isLastLayer ? 1 : 1.06, isLastLayer ? 1 : 1.02]
  );

  // Slight X scale - also delayed
  const scaleX = useTransform(
    scrollYProgress,
    [
      layerStart,
      layerStart + (layerEnd - layerStart) * 0.3,
      layerStart + (layerEnd - layerStart) * 0.55,
      layerEnd
    ],
    [1, 1, isLastLayer ? 1 : 1.015, isLastLayer ? 1 : 1]
  );

  // Grid reveal effect - starts when rotation begins (at 25%), grows to fill layer
  const gridHeight = useTransform(
    scrollYProgress,
    [
      layerStart + (layerEnd - layerStart) * 0.25, // Match rotation start
      layerStart + (layerEnd - layerStart) * 0.9,
      layerEnd
    ],
    ["0%", isLastLayer ? "0%" : "100%", isLastLayer ? "0%" : "100%"]
  );

  // Grid opacity - fades in when lift starts, out when layer flips away
  const gridOpacity = useTransform(
    scrollYProgress,
    [
      layerStart + (layerEnd - layerStart) * 0.25, // Match rotation start
      layerStart + (layerEnd - layerStart) * 0.3,
      layerEnd - 0.1,
      layerEnd
    ],
    [0, isLastLayer ? 0 : 1, isLastLayer ? 0 : 1, 0]
  );

  return { rotateX, y, opacity, boxShadow, scaleX, scaleY, gridHeight, gridOpacity };
};

// Parse hex color to RGB for shadow
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  }
  return "0, 0, 0";
};

// Individual layer wrapper with animation
const AnimatedLayer: React.FC<{
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  animationStyle: AnimationStyle;
  children: React.ReactNode;
  label: string;
  showLabels: boolean;
}> = ({ index, total, scrollYProgress, children, label, showLabels }) => {
  const { theme } = useTheme();

  // Use a dark shadow color based on theme
  const shadowColorRgb = hexToRgb(theme.colors.text || "#000000");
  const paperLiftProps = usePaperLiftAnimation(scrollYProgress, index, total, shadowColorRgb);

  const isLastLayer = index >= total - 1;

  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: total - index,
        rotateX: paperLiftProps.rotateX,
        y: paperLiftProps.y,
        opacity: paperLiftProps.opacity,
        scaleX: paperLiftProps.scaleX,
        scaleY: paperLiftProps.scaleY,
        boxShadow: paperLiftProps.boxShadow,
        transformStyle: "preserve-3d",
        // Origin at top so scaleY stretches downward (bottom comes toward viewer)
        transformOrigin: "top center",
        backfaceVisibility: "hidden",
        borderRadius: "2px",
      }}
    >
      {/* Content layer */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}>
        {showLabels && (
          <div
            style={{
              position: "absolute",
              top: -30,
              left: 0,
              fontSize: "12px",
              fontWeight: "600",
              color: theme.colors.primary,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            {label}
          </div>
        )}
        {children}
      </div>

      {/* Shadow reveal effect - grows from bottom as layer lifts */}
      {!isLastLayer && (
        <motion.div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: paperLiftProps.gridHeight,
            opacity: paperLiftProps.gridOpacity,
            pointerEvents: "none",
            // Gradient shadow from bottom
            background: `linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 40%, transparent 100%)`,
          }}
        />
      )}
    </motion.div>
  );
};

export const LayeredReveal: React.FC<LayeredRevealProps> = ({
  animationStyle = "paperLift",
  scrollHeight = "400vh",
  showLabels = false,
}) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={containerRef}
      style={{
        height: scrollHeight,
        position: "relative",
        background: theme.colors.background,
      }}
    >
      {/* Sticky container */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          boxSizing: "border-box",
          // Closer perspective for more dramatic paper lift effect
          perspective: "800px",
          perspectiveOrigin: "center 40%",
        }}
      >
        {/* Layer container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "600px",
            height: "500px",
          }}
        >
          {layers.map((layer, index) => (
            <AnimatedLayer
              key={layer.id}
              index={index}
              total={layers.length}
              scrollYProgress={scrollYProgress}
              animationStyle={animationStyle}
              label={layer.label}
              showLabels={showLabels}
            >
              <layer.Component fillContainer={animationStyle === "paperLift"} />
            </AnimatedLayer>
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]),
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: theme.colors.textSecondary,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            Scroll to reveal layers
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: "20px",
              height: "30px",
              borderRadius: "10px",
              border: `2px solid ${theme.colors.textSecondary}`,
              display: "flex",
              justifyContent: "center",
              paddingTop: "6px",
            }}
          >
            <div
              style={{
                width: "4px",
                height: "8px",
                borderRadius: "2px",
                background: theme.colors.textSecondary,
              }}
            />
          </motion.div>
        </motion.div>

        {/* Progress indicator */}
        <div
          style={{
            position: "absolute",
            right: "40px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {layers.map((layer, index) => {
            const layerStart = index / layers.length;
            const layerEnd = (index + 1) / layers.length;
            return (
              <ProgressDot
                key={layer.id}
                scrollYProgress={scrollYProgress}
                layerStart={layerStart}
                layerEnd={layerEnd}
                borderColor={theme.colors.border}
                activeColor={theme.colors.primary}
                label={layer.label}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ProgressDot: React.FC<{
  scrollYProgress: MotionValue<number>;
  layerStart: number;
  layerEnd: number;
  borderColor: string;
  activeColor: string;
  label: string;
}> = ({ scrollYProgress, layerStart, layerEnd, borderColor, activeColor, label }) => {
  const dotColor = useTransform(
    scrollYProgress,
    [layerStart, layerEnd],
    [borderColor, activeColor]
  );

  return (
    <motion.div
      style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: dotColor,
        border: `1px solid ${borderColor}`,
      }}
      title={label}
    />
  );
};

export default LayeredReveal;
