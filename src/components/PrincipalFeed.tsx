"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";
import { LiveFeedTicker } from "./LiveFeedTicker";

interface PrincipalFeedProps {
  isMobile?: boolean;
}

export const PrincipalFeed: React.FC<PrincipalFeedProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress for the entire section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Hero parallax effects
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  return (
    <section
      ref={containerRef}
      style={{
        padding: isMobile ? "60px 24px" : "100px 40px",
        width: "100%",
        boxSizing: "border-box",
        background: theme.colors.background,
        position: "relative",
      }}
    >
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        {/* Hero Section with Parallax */}
        <motion.div
          style={{
            y: heroY,
          }}
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

          {/* Headline with staggered reveal */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
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
            Watch the builder world
            <br />
            in real time.
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              fontSize: isMobile ? "18px" : "22px",
              lineHeight: "1.5",
              color: "#0c3741",
              fontFamily: theme.fonts.body,
              marginBottom: "24px",
              fontWeight: "500",
            }}
          >
            See who's building what, when they built it, and who contributed...and not just the humans.
          </motion.p>
        </motion.div>

        {/* Live Feed Ticker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginBottom: "48px", marginLeft: "-40px", marginRight: "-40px" }}
        >
          <LiveFeedTicker />
        </motion.div>

        {/* Screenshots */}
        <div>

          {/* Screenshot 1: Gary Tan Tweet */}
          <div
            style={{
              marginBottom: "48px",
              borderRadius: "8px",
              overflow: "hidden",
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <img
              src="/images/gary-tan-tweet.png"
              alt="Gary Tan's tweet about Principal Feed showing 11K views"
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

          {/* Screenshot 2: Principal Feed Activity */}
          <div
            style={{
              marginBottom: "48px",
              borderRadius: "8px",
              overflow: "hidden",
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <img
              src="/images/principal-feed-activity.png"
              alt="Principal Feed showing commit activity timeline, feed details, and File City visualization"
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
                <strong style={{ color: theme.colors.text }}>Explain code in plain English.</strong> See what changed, when it changed, and where it happened. No git commands. No terminal. Just the story of what's being built.
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
        </div>
      </div>
    </section>
  );
};
