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

          {/* Social Proof Quote */}
          <div
            style={{
              padding: isMobile ? "20px" : "24px 28px",
              background: `linear-gradient(135deg, ${theme.colors.primary}08 0%, ${theme.colors.primary}15 100%)`,
              border: `1px solid ${theme.colors.primary}30`,
              borderRadius: "8px",
              marginBottom: "32px",
            }}
          >
            <p
              style={{
                fontSize: isMobile ? "18px" : "22px",
                lineHeight: "1.5",
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
                fontStyle: "italic",
                marginBottom: "12px",
                fontWeight: "500",
              }}
            >
              "For the polymath designer-coder, this is kind of like catnip."
            </p>
            <p
              style={{
                fontSize: "14px",
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.body,
                margin: 0,
              }}
            >
              — Gary Tan, President of Y Combinator
            </p>
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
            The Bloomberg Terminal
            <br />
            for software.
          </h2>

          {/* Subheading */}
          <p
            style={{
              fontSize: isMobile ? "18px" : "22px",
              lineHeight: "1.5",
              color: "#0c3741",
              fontFamily: theme.fonts.body,
              marginBottom: "24px",
              fontWeight: "500",
            }}
          >
            Watch the builder world in real time. Every commit. Every repo. Humans and AI building together.
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
            For the first time, software work is visible to everyone. Developers discover talent. Recruiters see what people actually build. PMs track progress without asking. Investors watch companies grow. The feed runs 24/7. No logins required.
          </p>

          {/* CTA Banner */}
          <a
            href="https://app.principal-ade.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              textDecoration: "none",
              background: `linear-gradient(135deg, ${theme.colors.primary}08 0%, ${theme.colors.primary}18 100%)`,
              border: `2px solid ${theme.colors.primary}`,
              borderRadius: "12px",
              padding: isMobile ? "24px 20px" : "32px 40px",
              marginBottom: "64px",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 12px 24px ${theme.colors.primary}20`;
              e.currentTarget.style.borderColor = theme.colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = theme.colors.primary;
            }}
          >
            {/* Live indicator */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              <motion.span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                }}
                animate={{
                  opacity: [1, 0.4, 1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#22c55e",
                  fontFamily: theme.fonts.body,
                }}
              >
                LIVE NOW
              </span>
            </div>

            {/* Main CTA text */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: isMobile ? "20px" : "24px",
                    fontWeight: "700",
                    color: theme.colors.text,
                    fontFamily: theme.fonts.heading,
                    marginBottom: "4px",
                    lineHeight: "1.2",
                  }}
                >
                  See the Principal Feed
                </h3>
                <p
                  style={{
                    fontSize: isMobile ? "14px" : "15px",
                    color: theme.colors.textSecondary,
                    fontFamily: theme.fonts.body,
                    margin: 0,
                  }}
                >
                  Watch real commits happening right now
                </p>
              </div>
              <div
                style={{
                  fontSize: "24px",
                  color: theme.colors.primary,
                  flexShrink: 0,
                }}
              >
                →
              </div>
            </div>
          </a>

          {/* Historic Moment Section */}
          <div style={{ marginBottom: "48px", marginTop: "64px" }}>
            <h3
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: isMobile ? "28px" : "32px",
                fontWeight: "700",
                letterSpacing: "-0.02em",
                color: "#0d274d",
                marginBottom: "16px",
              }}
            >
              A historic moment.
            </h3>
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                lineHeight: "1.6",
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
                marginBottom: "16px",
                fontWeight: "500",
              }}
            >
              For the first time in software history, you can watch humans and AI build side by side.
            </p>
            <p
              style={{
                fontSize: isMobile ? "14px" : "15px",
                lineHeight: "1.7",
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.body,
                marginBottom: "32px",
              }}
            >
              The bot commits at 3 AM. The developer commits at 9 AM. They're collaborating, and now everyone can see it. This has never been visible before. Principal Feed makes it real.
            </p>
          </div>

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
                <strong style={{ color: theme.colors.text }}>Three surfaces. One view.</strong> Timeline shows <em>when</em> work happened. Feed shows <em>what</em> changed. File City shows <em>where</em>. This is how you understand a codebase in motion.
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
                <strong style={{ color: theme.colors.text }}>Built for everyone.</strong> Click "Explain" on any commit and get it in plain English. Your PM doesn't need to read diffs. Your recruiter sees what candidates actually build. Your investors watch progress in real time. Software work, finally visible.
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
                <strong style={{ color: theme.colors.text }}>Discover builders through their work.</strong> Not LinkedIn profiles. Not GitHub stars. Watch what people actually build, when they build it, and how they collaborate. A chain of five faces tells a story no resume can.
              </p>
            </div>
          </div>

          {/* Who It's For Section */}
          <div style={{ marginBottom: "48px", marginTop: "64px" }}>
            <h3
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: isMobile ? "24px" : "28px",
                fontWeight: "700",
                letterSpacing: "-0.02em",
                color: "#0d274d",
                marginBottom: "24px",
              }}
            >
              Who is this for?
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <p style={{ fontSize: "15px", fontWeight: "600", color: theme.colors.text, fontFamily: theme.fonts.body, marginBottom: "4px" }}>
                  Developers
                </p>
                <p style={{ fontSize: "14px", color: theme.colors.textSecondary, fontFamily: theme.fonts.body, margin: 0, lineHeight: "1.6" }}>
                  Discover talent based on actual work. See who's building what you care about. Find collaborators, not keywords.
                </p>
              </div>

              <div>
                <p style={{ fontSize: "15px", fontWeight: "600", color: theme.colors.text, fontFamily: theme.fonts.body, marginBottom: "4px" }}>
                  Recruiters
                </p>
                <p style={{ fontSize: "14px", color: theme.colors.textSecondary, fontFamily: theme.fonts.body, margin: 0, lineHeight: "1.6" }}>
                  See what candidates actually build, not what they say they built. Morning commits, AI collaboration, real contributions. It's all visible.
                </p>
              </div>

              <div>
                <p style={{ fontSize: "15px", fontWeight: "600", color: theme.colors.text, fontFamily: theme.fonts.body, marginBottom: "4px" }}>
                  PMs & Investors
                </p>
                <p style={{ fontSize: "14px", color: theme.colors.textSecondary, fontFamily: theme.fonts.body, margin: 0, lineHeight: "1.6" }}>
                  Track progress in plain English. No technical background needed. Understand what's changing and why it matters.
                </p>
              </div>

              <div>
                <p style={{ fontSize: "15px", fontWeight: "600", color: theme.colors.text, fontFamily: theme.fonts.body, marginBottom: "4px" }}>
                  Teams
                </p>
                <p style={{ fontSize: "14px", color: theme.colors.textSecondary, fontFamily: theme.fonts.body, margin: 0, lineHeight: "1.6" }}>
                  Your private repos. Same feed. See your own team building the same way you watch the world build.
                </p>
              </div>
            </div>
          </div>

          {/* Final Value Prop */}
          <div style={{ marginTop: "64px", marginBottom: "48px" }}>
            <h3
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: isMobile ? "28px" : "32px",
                fontWeight: "700",
                letterSpacing: "-0.02em",
                color: "#0d274d",
                marginBottom: "20px",
                lineHeight: "1.2",
              }}
            >
              Software work was invisible.
              <br />
              Not anymore.
            </h3>
            <p
              style={{
                fontSize: isMobile ? "15px" : "16px",
                lineHeight: "1.7",
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.body,
                marginBottom: "32px",
              }}
            >
              For thirty years, understanding what's happening in a codebase meant reading logs, parsing diffs, and asking developers what they did. Principal Feed makes it visible. Live. To everyone.
            </p>
          </div>

          {/* CTA Box */}
          <div
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.surface} 100%)`,
              border: `1px solid ${theme.colors.primary}40`,
              borderRadius: "12px",
              padding: isMobile ? "32px 24px" : "40px 48px",
              textAlign: "center",
            }}
          >
            <h4
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: isMobile ? "24px" : "28px",
                fontWeight: "700",
                color: theme.colors.text,
                marginBottom: "16px",
                lineHeight: "1.2",
              }}
            >
              The feed runs 24/7.
            </h4>
            <p
              style={{
                fontSize: isMobile ? "15px" : "16px",
                lineHeight: "1.65",
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.body,
                marginBottom: "28px",
              }}
            >
              Watch the builder world in real time. No login required. Inside the desktop app, add your private repos and see your team build the same way you watch the world build.
            </p>
            <a
              href="https://app.principal-ade.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: isMobile ? "14px 28px" : "16px 32px",
                background: theme.colors.primary,
                color: "#FFFFFF",
                fontFamily: theme.fonts.body,
                fontSize: isMobile ? "15px" : "16px",
                fontWeight: "600",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = `0 8px 16px ${theme.colors.primary}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              See the Principal Feed
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
