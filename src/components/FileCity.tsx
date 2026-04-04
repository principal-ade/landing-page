"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";

interface FileCityProps {
  isMobile?: boolean;
}

export const FileCity: React.FC<FileCityProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();

  return (
    <section
      style={{
        padding: isMobile ? "60px 24px" : "100px 40px",
        width: "100%",
        boxSizing: "border-box",
        background: theme.colors.background,
      }}
    >
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              background: theme.colors.primary,
              borderRadius: "20px",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color: "#FFFFFF",
                fontFamily: theme.fonts.body,
              }}
            >
              01
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#FFFFFF",
                fontFamily: theme.fonts.body,
              }}
            >
              FILE CITY
            </span>
          </div>

          {/* Headline */}
          <h2
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: isMobile ? "36px" : "48px",
              fontWeight: "700",
              letterSpacing: "-0.02em",
              color: theme.colors.text,
              marginBottom: "24px",
              lineHeight: "1.15",
            }}
          >
            Open any repo.
            <br />
            Understand it in seconds.
          </h2>

          {/* Subheading */}
          <p
            style={{
              fontSize: isMobile ? "16px" : "18px",
              lineHeight: "1.6",
              color: theme.colors.text,
              fontFamily: theme.fonts.body,
              marginBottom: "20px",
              fontWeight: "500",
            }}
          >
            Every repo you open in Principal shows you the map.
          </p>

          {/* Body Copy */}
          <p
            style={{
              fontSize: isMobile ? "15px" : "16px",
              lineHeight: "1.7",
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
              marginBottom: "32px",
            }}
          >
            What the codebase is made of. How it's organized. When an agent runs, the files it changed light up. You see what moved, what grew, and what didn't belong — without opening a terminal.
          </p>

          {/* Screenshot 1: Just File City */}
          <div
            style={{
              marginBottom: "48px",
              borderRadius: "8px",
              overflow: "hidden",
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <img
              src="/images/Screenshot 2026-04-04 at 4.10.27 PM.png"
              alt="File City 2D view showing codebase structure"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
            <div
              style={{
                padding: "16px 20px",
                background: theme.colors.surface,
                borderTop: `1px solid ${theme.colors.border}`,
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: theme.colors.textSecondary,
                  fontFamily: theme.fonts.body,
                  margin: 0,
                }}
              >
                Every block is a file. Color shows what changed. Size shows relative importance.
              </p>
            </div>
          </div>

          {/* Screenshot 2: Time travel feature */}
          <div
            style={{
              marginBottom: "48px",
              borderRadius: "8px",
              overflow: "hidden",
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <img
              src="/images/Screenshot 2026-04-04 at 4.19.19 PM.png"
              alt="File City with commit history and time travel"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
            <div
              style={{
                padding: "16px 20px",
                background: theme.colors.surface,
                borderTop: `1px solid ${theme.colors.border}`,
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: theme.colors.textSecondary,
                  fontFamily: theme.fonts.body,
                  margin: 0,
                }}
              >
                Time travel through your codebase. See activity from the latest commit, last 7 days, or full year.
              </p>
            </div>
          </div>

          {/* Screenshot 3: 3D animation */}
          <div
            style={{
              marginBottom: "48px",
              borderRadius: "8px",
              overflow: "hidden",
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <img
              src="/images/Screenshot 2026-04-04 at 4.11.31 PM.png"
              alt="File City 3D view with building heights representing lines of code"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
            <div
              style={{
                padding: "16px 20px",
                background: theme.colors.surface,
                borderTop: `1px solid ${theme.colors.border}`,
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: theme.colors.textSecondary,
                  fontFamily: theme.fonts.body,
                  margin: 0,
                }}
              >
                Click 3D. Height = lines of code. Rotate and zoom to see complexity from any angle.
              </p>
            </div>
          </div>

          {/* Screenshot 4: Grounded during Story-Based Monitoring */}
          <div
            style={{
              marginBottom: "32px",
              borderRadius: "8px",
              overflow: "hidden",
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <img
              src="/images/Screenshot 2026-04-04 at 4.20.30 PM.png"
              alt="File City always visible during Story-Based Monitoring"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
            <div
              style={{
                padding: "16px 20px",
                background: theme.colors.surface,
                borderTop: `1px solid ${theme.colors.border}`,
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: theme.colors.textSecondary,
                  fontFamily: theme.fonts.body,
                  margin: 0,
                }}
              >
                File City stays visible even during Story-Based Monitoring. Always oriented. Always grounded.
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: "8px",
              padding: isMobile ? "20px" : "24px",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.65",
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.body,
                margin: 0,
              }}
            >
              <strong style={{ fontWeight: "600", color: theme.colors.text }}>
                File City Tours
              </strong>{" "}
              — share a narrated walkthrough of any public repo. We post them on{" "}
              <span style={{ color: theme.colors.primary, fontWeight: "500" }}>
                @FileCityAI
              </span>{" "}
              so developers can understand open-source codebases at a glance.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
