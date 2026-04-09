"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";
import { FileCityDemo } from "./FileCityDemo";

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

          {/* Value Prop */}
          <p
            style={{
              fontSize: isMobile ? "18px" : "22px",
              lineHeight: "1.5",
              color: "#0c3741",
              fontFamily: theme.fonts.body,
              marginBottom: "40px",
              fontWeight: "500",
            }}
          >
            File City maps every codebase instantly. See what files exist, how they're organized, and what changed.
          </p>

          {/* File City Demo */}
          <FileCityDemo isMobile={isMobile} />

          {/* 3D View Section */}
          <h3
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: isMobile ? "24px" : "28px",
              fontWeight: "600",
              color: "#0d274d",
              marginBottom: "24px",
              marginTop: "48px",
            }}
          >
            Switch to 3D
          </h3>

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
              src="/images/new 3D.jpg"
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
                The same map, now with vertical scale. Height = lines of code. Rotate and zoom to see complexity from any angle.
              </p>
            </div>
          </div>

          {/* Story-Based Monitoring Section */}
          <h3
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: isMobile ? "24px" : "28px",
              fontWeight: "600",
              color: "#0d274d",
              marginBottom: "24px",
              marginTop: "48px",
            }}
          >
            Never Lose Context
          </h3>

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
              src="/images/File City in Story Monitoring .png"
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

          {/* Time Travel Section */}
          <h3
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: isMobile ? "24px" : "28px",
              fontWeight: "600",
              color: "#0d274d",
              marginBottom: "24px",
              marginTop: "48px",
            }}
          >
            Rewind Time
          </h3>

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
              src="/images/History view.jpg"
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
                Watch the latest activity from today, the last week or last year.
              </p>
            </div>
          </div>

          {/* File City Tours Box */}
          <a
            href="https://x.com/FileCityAI"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              textDecoration: "none",
              background: `linear-gradient(135deg, ${theme.colors.secondary}08 0%, ${theme.colors.secondary}18 100%)`,
              border: `2px solid ${theme.colors.secondary}`,
              borderRadius: "12px",
              padding: isMobile ? "24px 20px" : "32px 40px",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 12px 24px ${theme.colors.secondary}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <h3
              style={{
                fontSize: isMobile ? "20px" : "24px",
                fontWeight: "700",
                color: theme.colors.text,
                fontFamily: theme.fonts.heading,
                marginBottom: "8px",
                lineHeight: "1.2",
              }}
            >
              File City Tours
            </h3>
            <p
              style={{
                fontSize: isMobile ? "14px" : "16px",
                lineHeight: "1.65",
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.body,
                margin: 0,
              }}
            >
              Narrated walkthroughs of public codebases. Follow{" "}
              <span
                style={{
                  color: theme.colors.secondary,
                  fontWeight: "600",
                }}
              >
                @FileCityAI
              </span>{" "}
              to understand and learn from popular repos.
            </p>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
