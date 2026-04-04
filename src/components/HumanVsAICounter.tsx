"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";

interface HumanVsAICounterProps {
  isMobile?: boolean;
}

export const HumanVsAICounter: React.FC<HumanVsAICounterProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const [humanCount, setHumanCount] = useState(0);
  const [aiCount, setAICount] = useState(0);
  const controls = useAnimation();

  // Simulate live updates
  useEffect(() => {
    const targetHuman = 492;
    const targetAI = 355;
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setHumanCount(Math.floor(targetHuman * progress));
      setAICount(Math.floor(targetAI * progress));

      if (step >= steps) {
        clearInterval(timer);
        // Occasionally add a new commit
        setInterval(() => {
          const isHuman = Math.random() > 0.42;
          if (isHuman) {
            setHumanCount(prev => prev + 1);
          } else {
            setAICount(prev => prev + 1);
          }
        }, 3000);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const total = humanCount + aiCount;
  const humanPercent = total > 0 ? Math.round((humanCount / total) * 100) : 0;
  const aiPercent = total > 0 ? Math.round((aiCount / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{
        background: theme.colors.surface,
        border: `2px solid ${theme.colors.border}`,
        borderRadius: "12px",
        padding: isMobile ? "24px" : "32px",
        marginBottom: "48px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <h3
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: "700",
            color: theme.colors.text,
            marginBottom: "8px",
          }}
        >
          Right Now
        </h3>
        <p
          style={{
            fontSize: isMobile ? "14px" : "16px",
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.body,
            margin: 0,
          }}
        >
          Today's commits across tracked repos
        </p>
      </div>

      {/* Total Counter */}
      <motion.div
        style={{
          fontSize: isMobile ? "48px" : "64px",
          fontWeight: "700",
          fontFamily: theme.fonts.heading,
          color: theme.colors.text,
          textAlign: "center",
          marginBottom: "32px",
          letterSpacing: "-0.02em",
        }}
        animate={controls}
      >
        {total.toLocaleString()}
      </motion.div>

      {/* Human vs AI Breakdown */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: isMobile ? "16px" : "24px",
          marginBottom: "24px",
        }}
      >
        {/* Human */}
        <motion.div
          style={{
            background: "rgba(59, 130, 246, 0.1)",
            border: "2px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "8px",
            padding: isMobile ? "16px" : "20px",
            textAlign: "center",
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div
            style={{
              fontSize: isMobile ? "32px" : "40px",
              marginBottom: "4px",
            }}
          >
            👤
          </div>
          <div
            style={{
              fontSize: isMobile ? "24px" : "32px",
              fontWeight: "700",
              fontFamily: theme.fonts.heading,
              color: "rgb(59, 130, 246)",
              marginBottom: "4px",
            }}
          >
            {humanCount.toLocaleString()}
          </div>
          <div
            style={{
              fontSize: isMobile ? "12px" : "14px",
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
              marginBottom: "8px",
            }}
          >
            Human
          </div>
          <div
            style={{
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "600",
              color: "rgb(59, 130, 246)",
              fontFamily: theme.fonts.body,
            }}
          >
            {humanPercent}%
          </div>
        </motion.div>

        {/* AI */}
        <motion.div
          style={{
            background: "rgba(168, 85, 247, 0.1)",
            border: "2px solid rgba(168, 85, 247, 0.3)",
            borderRadius: "8px",
            padding: isMobile ? "16px" : "20px",
            textAlign: "center",
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div
            style={{
              fontSize: isMobile ? "32px" : "40px",
              marginBottom: "4px",
            }}
          >
            🤖
          </div>
          <div
            style={{
              fontSize: isMobile ? "24px" : "32px",
              fontWeight: "700",
              fontFamily: theme.fonts.heading,
              color: "rgb(168, 85, 247)",
              marginBottom: "4px",
            }}
          >
            {aiCount.toLocaleString()}
          </div>
          <div
            style={{
              fontSize: isMobile ? "12px" : "14px",
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
              marginBottom: "8px",
            }}
          >
            AI / Bot
          </div>
          <div
            style={{
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "600",
              color: "rgb(168, 85, 247)",
              fontFamily: theme.fonts.body,
            }}
          >
            {aiPercent}%
          </div>
        </motion.div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: "8px",
          background: theme.colors.border,
          borderRadius: "4px",
          overflow: "hidden",
          marginBottom: "16px",
        }}
      >
        <motion.div
          style={{
            height: "100%",
            background: "linear-gradient(to right, rgb(59, 130, 246), rgb(168, 85, 247))",
            borderRadius: "4px",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${humanPercent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Caption */}
      <p
        style={{
          fontSize: isMobile ? "11px" : "12px",
          color: theme.colors.textSecondary,
          fontFamily: theme.fonts.body,
          textAlign: "center",
          margin: 0,
          fontStyle: "italic",
        }}
      >
        The most important number in software right now — and we're the only ones tracking it.
      </p>
    </motion.div>
  );
};
