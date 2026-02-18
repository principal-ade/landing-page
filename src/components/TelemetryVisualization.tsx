import React from "react";
import { motion } from "framer-motion";
import { COLORS } from "../styles/colors";

interface TelemetryVisualizationProps {
  isMobile?: boolean;
}

export const TelemetryVisualization: React.FC<TelemetryVisualizationProps> = ({
  isMobile = false,
}) => {
  return (
    <section
      style={{
        padding: isMobile ? "60px 24px 0px 24px" : "80px 40px 0px 40px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
            {/* Blue quote block with grid */}
            <div
              style={{
                position: "relative",
                background: COLORS.royalBlue,
                borderRadius: "8px",
                padding: isMobile ? "48px 32px" : "64px 56px",
                marginBottom: "64px",
                overflow: "hidden",
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
                boxShadow: "0 8px 24px rgba(30, 64, 175, 0.3)",
              }}
            >
              {/* Eyebrow */}
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: COLORS.accentAlt,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "24px",
                  fontFamily: "monospace",
                }}
              >
                WHY WE BUILT THIS
              </p>

              {/* Headline */}
              <h2
                style={{
                  fontSize: isMobile ? "32px" : "48px",
                  fontWeight: "700",
                  color: COLORS.white,
                  lineHeight: "1.2",
                  marginBottom: "24px",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}
              >
                Monitoring starts from the wrong end.
              </h2>

              {/* Body */}
              <p
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  color: COLORS.white,
                  lineHeight: "1.7",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}
              >
                Agents write the code. Nobody understands it.{" "}
                <strong style={{ fontWeight: "700" }}>
                  That's the whole problem.
                </strong>{" "}
                Every tool in your stack starts after something breaks. We start from what should happen.
              </p>

              {/* Link */}
              <div style={{ marginTop: "32px" }}>
                <a
                  href="/about"
                  style={{
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: "600",
                    color: COLORS.white,
                    textDecoration: "underline",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
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
                gap: isMobile ? "24px" : "32px",
                marginTop: "64px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {/* Traditional Monitoring Card */}
              <div
                style={{
                  background: COLORS.gray100,
                  borderRadius: "16px",
                  padding: isMobile ? "24px" : "32px",
                  width: "100%",
                  boxSizing: "border-box",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: "600",
                    color: COLORS.gray500,
                    marginBottom: "24px",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  Traditional Monitoring
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { num: 1, text: "Execute code", color: COLORS.gray400 },
                    { num: 2, text: "Emit raw telemetry", color: COLORS.gray400 },
                    { num: 3, text: "Store everything", color: COLORS.gray400 },
                    { num: 4, text: "Something breaks", color: COLORS.error },
                    { num: 5, text: "Search the haystack", color: COLORS.gray400 },
                    { num: 6, text: "Reconstruct what happened", color: COLORS.gray400 },
                    { num: 7, text: "Hope you find it", color: COLORS.gray400 },
                  ].map((step) => (
                    <div
                      key={step.num}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: step.color,
                          color: COLORS.white,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "600",
                          flexShrink: 0,
                        }}
                      >
                        {step.num}
                      </div>
                      <span
                        style={{
                          fontSize: isMobile ? "14px" : "16px",
                          color: COLORS.gray800,
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
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
                  background: COLORS.white,
                  border: `2px solid ${COLORS.info}`,
                  borderRadius: "16px",
                  padding: isMobile ? "24px" : "32px",
                  width: "100%",
                  boxSizing: "border-box",
                  overflowWrap: "break-word",
                  wordBreak: "break-word",
                  boxShadow: "0 4px 12px rgba(8, 145, 178, 0.15)",
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: "600",
                    color: COLORS.info,
                    marginBottom: "24px",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  Story-Based Monitoring
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { num: 1, text: "Start from what should happen", color: COLORS.royalBlue },
                    { num: 2, text: "Run the code", color: COLORS.info },
                    { num: 3, text: "See the story of what did", color: COLORS.success },
                    { num: 4, text: "Every divergence surfaced", color: COLORS.info },
                    { num: 5, text: "Root cause in minutes", color: COLORS.accentAlt },
                  ].map((step) => (
                    <div
                      key={step.num}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: step.color,
                          color: COLORS.white,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: "600",
                          flexShrink: 0,
                        }}
                      >
                        {step.num}
                      </div>
                      <span
                        style={{
                          fontSize: isMobile ? "14px" : "16px",
                          color: COLORS.gray800,
                          fontFamily:
                            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
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
            <p
              style={{
                fontSize: isMobile ? "20px" : "24px",
                fontWeight: "700",
                color: COLORS.gray400,
                textAlign: "center",
                marginTop: "48px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              Not after the fire. Before the smoke.
            </p>

          </motion.div>
      </div>
    </section>
  );
};
