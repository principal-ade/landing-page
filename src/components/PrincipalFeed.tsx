"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";
import { HumanVsAICounter } from "./HumanVsAICounter";
import { FileCityDemo } from "./FileCityDemo";
import { TimelineScrubber } from "./TimelineScrubber";
import { ContributorAvatarFlow } from "./ContributorAvatarFlow";

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
            Every push. Every file.
            <br />
            Every builder. Right now.
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
            Feel the pulse of the builder world. Streaming live across every repo that matters.
          </p>

          {/* Body Copy */}
          <p
            style={{
              fontSize: isMobile ? "15px" : "16px",
              lineHeight: "1.7",
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
              marginBottom: "48px",
            }}
          >
            Like having a window into every dev shop at once. See what's changing, who's building, and where the work is happening. Watch humans and AI collaborate in real time. The codebase becomes a place you recognize, not a list you read.
          </p>

          {/* Human vs AI Counter */}
          <HumanVsAICounter isMobile={isMobile} />

          {/* File City Demo */}
          <FileCityDemo isMobile={isMobile} />

          {/* Timeline Scrubber */}
          <TimelineScrubber isMobile={isMobile} />

          {/* Contributor Avatar Flow */}
          <ContributorAvatarFlow isMobile={isMobile} />

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: `linear-gradient(to right, transparent, ${theme.colors.border}, transparent)`,
              marginBottom: "48px",
            }}
          />

          {/* Real-World Examples Section */}
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: isMobile ? "24px" : "28px",
                fontWeight: "700",
                letterSpacing: "-0.02em",
                color: theme.colors.text,
                marginBottom: "12px",
              }}
            >
              See it in action
            </h3>
            <p
              style={{
                fontSize: isMobile ? "14px" : "15px",
                lineHeight: "1.6",
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.body,
                marginBottom: "32px",
              }}
            >
              The feed is already live. Developers are using it daily to watch repos, track work, and understand what's happening across the projects they care about.
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
                <strong style={{ color: theme.colors.text }}>When + What + Where:</strong> Timeline shows when work happened. Feed shows what changed. File City shows where. All at once.
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
                <strong style={{ color: theme.colors.text }}>No more reading diffs:</strong> Click "Explain" on any commit. Understand what happened in plain English. Recruiters, PMs, investors — everyone can follow along.
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
                <strong style={{ color: theme.colors.text }}>Work surfaces the person:</strong> See every contributor. A chain of five faces tells a story no commit message can.
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

          {/* CTA Box */}
          <div
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.surface} 100%)`,
              border: `1px solid ${theme.colors.primary}40`,
              borderRadius: "12px",
              padding: isMobile ? "24px" : "32px",
            }}
          >
            <h4
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: isMobile ? "18px" : "20px",
                fontWeight: "700",
                color: theme.colors.text,
                marginBottom: "12px",
              }}
            >
              Your repos. Same feed.
            </h4>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.65",
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.body,
                margin: 0,
              }}
            >
              Inside the desktop app, your private repos appear in the same feed format. See your own building the same way you watch the world build. Morning commits, evening pushes, overnight AI work — all visible. Your codebase has a history. Now you can see it.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
