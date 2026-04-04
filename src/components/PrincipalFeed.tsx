"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";

interface PrincipalFeedProps {
  isMobile?: boolean;
}

export const PrincipalFeed: React.FC<PrincipalFeedProps> = ({ isMobile = false }) => {
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
              02
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
              PRINCIPAL FEED
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
            Watch the work.
            <br />
            Across every repo.
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
            Real-time activity from every agent and human.
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
            Paste any GitHub URL. See every commit, organized by time of day. Morning, afternoon, evening. Who did what, when they did it, and exactly what moved. Click "Explain" for a plain-English summary. No more reading diffs.
          </p>

          {/* Screenshot 1: Gary Tan commit in feed */}
          <div
            style={{
              marginBottom: "48px",
              borderRadius: "8px",
              overflow: "hidden",
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <img
              src="/images/gary-tan-activity-feed.png"
              alt="Principal Feed showing commit activity with File City visualization"
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
                Timeline shows when work happened. Feed shows what changed. File City shows where.
              </p>
            </div>
          </div>

          {/* Screenshot 2: Explain Changes */}
          <div
            style={{
              marginBottom: "48px",
              borderRadius: "8px",
              overflow: "hidden",
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <img
              src="/images/explain-changes.png"
              alt="Explain Changes feature showing AI summary of commit"
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
                Click "Explain" on any commit. Get a plain-English summary. No diff reading required.
              </p>
            </div>
          </div>

          {/* Screenshot 3: Contributor Timeline */}
          <div
            style={{
              marginBottom: "48px",
              borderRadius: "8px",
              overflow: "hidden",
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <img
              src="/images/contributor-timeline.png"
              alt="Contributor timeline showing collaborator avatars"
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
                See everyone who contributed. Visual timeline shows collaboration at a glance.
              </p>
            </div>
          </div>

          {/* Screenshot 4: Gary Tan Social Proof */}
          <div
            style={{
              marginBottom: "32px",
              borderRadius: "8px",
              overflow: "hidden",
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <img
              src="/images/gary-tan-tweet.png"
              alt="Gary Tan tweet showing Principal Feed with 11K views"
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
                "For the polymath designer-coder, this is kind of like catnip" — Gary Tan
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
                Follow any public repo
              </strong>{" "}
              — Paste a GitHub URL or search by name. Watch open-source projects you care about. See what's changing, who's building, and where the work is happening. Time-organized, contributor-visible, always up to date.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
