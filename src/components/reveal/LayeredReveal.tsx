"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";
import { DashboardLayer, WorkflowLayer, CanvasLayer } from "./layers";

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
];

// Paper lift - bottom edge lifts up, rotating around top edge
const usePaperLiftAnimation = (
  scrollYProgress: MotionValue<number>,
  index: number,
  total: number
) => {
  const layerStart = index / total;
  const layerEnd = (index + 1) / total;

  // Rotate on X axis - negative value lifts the bottom edge up
  const rotateX = useTransform(
    scrollYProgress,
    [layerStart, layerEnd],
    [0, index < total - 1 ? -90 : 0]
  );

  // Slight lift as it rotates to clear the layer below
  const y = useTransform(
    scrollYProgress,
    [layerStart, layerStart + (layerEnd - layerStart) * 0.5, layerEnd],
    [0, index < total - 1 ? -30 : 0, index < total - 1 ? -50 : 0]
  );

  // All layers stay fully visible - z-index handles stacking
  // Only fade out once fully flipped to avoid visual glitch
  const opacity = useTransform(
    scrollYProgress,
    [layerStart, layerEnd - 0.01, layerEnd],
    [1, 1, index < total - 1 ? 0 : 1]
  );

  return { rotateX, y, opacity };
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

  const paperLiftProps = usePaperLiftAnimation(scrollYProgress, index, total);

  const style = {
    rotateX: paperLiftProps.rotateX,
    y: paperLiftProps.y,
    opacity: paperLiftProps.opacity,
    transformStyle: "preserve-3d" as const,
    transformOrigin: "top center",
    backfaceVisibility: "hidden" as const,
  };

  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: total - index,
        ...style,
      }}
    >
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
          perspective: "1000px",
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
