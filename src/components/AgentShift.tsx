"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";

interface AgentShiftProps {
  isMobile?: boolean;
}

export const AgentShift: React.FC<AgentShiftProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();

  const cards = [
    {
      num: "File City",
      title: "Your codebase, visualized.",
      desc: "See files, structure, and changes at a glance.",
      accent: theme.colors.primary,
    },
    {
      num: "Principal Feed",
      title: "Watch the work",
      desc: "Real-time activity from every agent and human across repos.",
      accent: "#0893d2",
    },
    {
      num: "Story-Based Monitoring",
      title: "Verify the outcome",
      desc: "Production matched against declared intent. You know if it went right.",
      accent: theme.colors.text,
    },
  ];

  return (
    <section
      style={{
        padding: isMobile ? "60px 24px" : "80px 40px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: isMobile ? "32px" : "44px",
              fontWeight: "700",
              letterSpacing: "-0.035em",
              color: theme.colors.text,
              marginBottom: "14px",
            }}
          >
            Three tools. One principal.
          </h2>
          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.65",
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
              maxWidth: "560px",
              margin: "0 auto 52px",
            }}
          >
            You're the principal. Agents report to you. This is how you stay in that
            seat as they take on more of the work.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
              gap: isMobile ? "16px" : "1px",
              borderRadius: "12px",
              overflow: "hidden",
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            {cards.map((card, i) => (
              <div
                key={i}
                style={{
                  padding: "28px 24px",
                  textAlign: "left",
                  background: theme.colors.surface || "#fff",
                  borderRight:
                    i < cards.length - 1 && !isMobile
                      ? `1px solid ${theme.colors.border}`
                      : "none",
                  borderBottom:
                    i < cards.length - 1 && isMobile
                      ? `1px solid ${theme.colors.border}`
                      : "none",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: card.accent,
                    opacity: 0.6,
                  }}
                />
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: card.accent,
                    fontFamily: theme.fonts.body,
                    marginBottom: "8px",
                  }}
                >
                  {card.num}
                </div>
                <div
                  style={{
                    fontSize: "17px",
                    fontWeight: "600",
                    color: theme.colors.text,
                    fontFamily: theme.fonts.heading,
                    marginBottom: "8px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: theme.colors.textSecondary,
                    fontFamily: theme.fonts.body,
                    lineHeight: "1.55",
                  }}
                >
                  {card.desc}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
