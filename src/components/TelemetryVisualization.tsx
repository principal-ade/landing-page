"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";

interface TelemetryVisualizationProps {
  isMobile?: boolean;
}

export const TelemetryVisualization: React.FC<TelemetryVisualizationProps> = ({
  isMobile = false,
}) => {
  const { theme } = useTheme();
  return (
    <section
      style={{
        padding: isMobile ? "40px 24px" : "60px 40px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
            {/* Quote block with grid */}
            <div
              style={{
                position: "relative",
                background: theme.colors.accent,
                borderRadius: "8px",
                padding: isMobile ? "40px 28px" : "48px 48px",
                marginBottom: "0px",
                overflow: "hidden",
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
                boxShadow: `0 8px 24px ${theme.colors.accent}4D`,
              }}
            >
              {/* Eyebrow */}
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#FFFFFF",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "16px",
                  fontFamily: "monospace",
                }}
              >
                WHY WE BUILT THIS
              </p>

              {/* Headline */}
              <h2
                style={{
                  fontSize: isMobile ? "28px" : "40px",
                  fontWeight: "700",
                  color: theme.colors.textOnAccent,
                  lineHeight: "1.2",
                  marginBottom: "16px",
                  fontFamily: theme.fonts.heading,
                }}
              >
                Monitoring starts from the wrong end.
              </h2>

              {/* Body */}
              <p
                style={{
                  fontSize: isMobile ? "15px" : "16px",
                  color: theme.colors.textOnAccent,
                  lineHeight: "1.6",
                  fontFamily: theme.fonts.body,
                }}
              >
                Agents write the code. Nobody understands it.{" "}
                <strong style={{ fontWeight: "700" }}>
                  That's the whole problem.
                </strong>{" "}
                Every tool in your stack starts after something breaks. We start from what should happen.
              </p>

              {/* Link */}
              <div style={{ marginTop: "24px" }}>
                <a
                  href="/about"
                  style={{
                    fontSize: isMobile ? "14px" : "15px",
                    fontWeight: "600",
                    color: theme.colors.textOnAccent,
                    textDecoration: "underline",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontFamily: theme.fonts.body,
                    transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Read our thesis →
                </a>
              </div>
            </div>

            {/* Comparison Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? "16px" : "24px",
                marginTop: isMobile ? "24px" : "32px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {/* Traditional Monitoring Card */}
              <div
                style={{
                  background: theme.colors.muted,
                  borderRadius: "12px",
                  padding: isMobile ? "20px" : "24px",
                  width: "100%",
                  boxSizing: "border-box",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? "14px" : "16px",
                    fontWeight: "600",
                    color: theme.colors.textTertiary,
                    marginBottom: "16px",
                    fontFamily: theme.fonts.heading,
                  }}
                >
                  Traditional Monitoring
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { num: 1, text: "Execute code", color: theme.colors.secondary },
                    { num: 2, text: "Emit raw telemetry", color: theme.colors.secondary },
                    { num: 3, text: "Store everything", color: theme.colors.secondary },
                    { num: 4, text: "Something breaks", color: theme.colors.error },
                    { num: 5, text: "Search the haystack", color: theme.colors.secondary },
                    { num: 6, text: "Reconstruct what happened", color: theme.colors.secondary },
                    { num: 7, text: "Hope you find it", color: theme.colors.secondary },
                  ].map((step) => (
                    <div
                      key={step.num}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "50%",
                          background: step.color,
                          color: theme.colors.textOnSecondary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "600",
                          flexShrink: 0,
                        }}
                      >
                        {step.num}
                      </div>
                      <span
                        style={{
                          fontSize: isMobile ? "13px" : "14px",
                          color: theme.colors.text,
                          fontFamily: theme.fonts.body,
                        }}
                      >
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Story-Based Monitoring Card */}
              <div
                style={{
                  background: theme.colors.surface,
                  border: `2px solid ${theme.colors.primary}`,
                  borderRadius: "12px",
                  padding: isMobile ? "20px" : "24px",
                  width: "100%",
                  boxSizing: "border-box",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  boxShadow: `0 4px 12px ${theme.colors.primary}26`,
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? "14px" : "16px",
                    fontWeight: "600",
                    color: theme.colors.primary,
                    marginBottom: "16px",
                    fontFamily: theme.fonts.heading,
                  }}
                >
                  Story-Based Monitoring
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    { num: 1, text: "Start from what should happen", color: theme.colors.accent },
                    { num: 2, text: "Run the code", color: theme.colors.info },
                    { num: 3, text: "See the story of what did", color: theme.colors.success },
                    { num: 4, text: "Every divergence surfaced", color: theme.colors.info },
                    { num: 5, text: "Root cause in minutes", color: theme.colors.primary },
                  ].map((step) => (
                    <div
                      key={step.num}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "50%",
                          background: step.color,
                          color: theme.colors.textOnSecondary,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                          fontWeight: "600",
                          flexShrink: 0,
                        }}
                      >
                        {step.num}
                      </div>
                      <span
                        style={{
                          fontSize: isMobile ? "13px" : "14px",
                          color: theme.colors.text,
                          fontFamily: theme.fonts.body,
                        }}
                      >
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div style={{ textAlign: "center", marginTop: isMobile ? "40px" : "48px" }}>
              <p
                style={{
                  fontSize: isMobile ? "20px" : "24px",
                  fontWeight: "600",
                  color: theme.colors.textTertiary,
                  fontFamily: theme.fonts.body,
                  margin: 0,
                }}
              >
                Not after the fire. Before the smoke.
              </p>
            </div>

          </motion.div>
      </div>
    </section>
  );
};
