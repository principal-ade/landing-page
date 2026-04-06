"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from '@principal-ade/industry-theme';

export const Manifesto: React.FC = () => {
  const { theme } = useTheme();
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Helper style functions using theme
  const bodyTextStyle = (mobile: boolean): React.CSSProperties => ({
    fontSize: mobile ? "17px" : "19px",
    lineHeight: "1.75",
    color: theme.colors.textSecondary,
    marginBottom: "24px",
    fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: "400",
  });

  const sectionHeadingStyle = (mobile: boolean): React.CSSProperties => ({
    fontSize: mobile ? "24px" : "30px",
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: "20px",
    lineHeight: "1.2",
    fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
  });

  return (
    <div
      style={{
        background: theme.colors.background,
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile ? "80px 24px 32px" : "120px 40px 40px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: "11px",
              color: theme.colors.primary,
              textAlign: "center",
              marginBottom: "24px",
              fontFamily: '"JetBrains Mono", monospace',
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontWeight: "500",
            }}
          >
            What we believe and why we built Principal AI
          </motion.p>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: isMobile ? "40px" : "64px",
              fontWeight: "700",
              color: theme.colors.text,
              textAlign: "center",
              marginBottom: isMobile ? "64px" : "80px",
              lineHeight: "1.05",
              fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
              letterSpacing: "-0.04em",
            }}
          >
            Monitoring starts from<br />the wrong end.
          </motion.h1>

          {/* Opening */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p style={bodyTextStyle(isMobile)}>
              Agents write the code. Nobody understands it. That's the whole problem.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              Not because the code is bad. It passes tests. It deploys. It runs. But when production breaks at 3 AM, you're staring at a wall of logs for a system you didn't build, trying to reconstruct what happened from evidence that was never designed to tell you.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              <strong style={{ fontWeight: "700", color: theme.colors.text }}>It's called comprehension debt.</strong> The growing gap between what machines produce and what humans can supervise. It compounds with every agent-written commit. And every tool in your stack makes it worse.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section: The Old Paradigm Is a Flashlight After the Fall */}
      <section
        style={{
          padding: isMobile ? "32px 24px" : "40px 40px",
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={sectionHeadingStyle(isMobile)}>
              The Old Paradigm Is a Flashlight After the Fall.
            </h2>
            <p style={bodyTextStyle(isMobile)}>
              Every observability tool works the same way. Something breaks. They hand you a light. Go find what tripped you.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              And they charge you for a brighter one every year.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              The new wave thinks the fix is pointing language models at the mess. "Logs are all you need." Just throw AI at unstructured data and let it figure out what happened.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              That's not a new paradigm. That's the old paradigm with a chatbot bolted on.
            </p>
            <p style={{ ...bodyTextStyle(isMobile), fontStyle: "italic", fontSize: isMobile ? "19px" : "21px" }}>
              A brighter flashlight. You're still on the floor.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              We don't need smarter ways to search through noise. We need systems that never produce the noise in the first place.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              Has anyone stopped to ask why your monitoring bill scales with how much data you don't understand? The observability industry charges you by the gigabyte to store information that was never designed to mean anything. We think that's a strange definition of insight.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section: Stories Beat Logs */}
      <section
        style={{
          padding: isMobile ? "32px 24px" : "40px 40px",
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={sectionHeadingStyle(isMobile)}>
              Stories Beat Logs. Literally.
            </h2>
            <p style={bodyTextStyle(isMobile)}>
              Your brain doesn't store raw data. It stores narrative. Causal chains with a beginning, middle, and end. Every postmortem is a story. Every incident review is a story. Every time you explain a bug, you reconstruct a narrative from fragments.
            </p>
            <p style={{ ...bodyTextStyle(isMobile), fontFamily: '"JetBrains Mono", monospace', color: theme.colors.error, fontSize: isMobile ? "15px" : "16px" }}>
              A log line says: ERROR: Connection timeout at 14:32:07.
            </p>
            <p style={{ ...bodyTextStyle(isMobile), fontStyle: "italic", fontFamily: '"JetBrains Mono", monospace', color: theme.colors.success, fontSize: isMobile ? "15px" : "16px" }}>
              A story says: User authenticates. Gateway validates. Auth service receives request. Connection pool exhausted. Session never created. User sees blank screen.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              Same failure. One is a needle in a haystack. The other is a five-second visual diagnosis.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              <strong style={{ fontWeight: "700", color: theme.colors.text }}>Events with stories are more efficient than raw logs.</strong> Not metaphorically. Literally. Stories compress complexity into something the human brain was built to process. And here's what should change how you think about monitoring forever: stories aren't just retrospective. They're predictive. Your brain uses narrative to simulate the future, to anticipate what happens next.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              <strong style={{ fontWeight: "700", color: theme.colors.text }}>Monitoring shows you what already happened. Stories prepare you for what's about to.</strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section: The Inversion */}
      <section
        style={{
          padding: isMobile ? "32px 24px" : "40px 40px",
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={sectionHeadingStyle(isMobile)}>
              The Inversion.
            </h2>
            <p style={{ ...bodyTextStyle(isMobile), fontFamily: '"JetBrains Mono", monospace', fontSize: isMobile ? "15px" : "16px" }}>
              The old model: Execute → emit data → hope someone reconstructs meaning.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              We flip it.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              <strong style={{ fontWeight: "700", color: theme.colors.text }}>Start from what should happen. Run the code. See the story of what actually did, with every divergence surfaced visually, instantly.</strong>
            </p>
            <p style={bodyTextStyle(isMobile)}>
              Not after the fire. Before the smoke.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              That's story-based development. Visual understanding. Behavioral validation. Agent coordination. One system, three problems solved.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section: This Only Works Now */}
      <section
        style={{
          padding: isMobile ? "32px 24px" : "40px 40px",
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={sectionHeadingStyle(isMobile)}>
              This Only Works Now.
            </h2>
            <p style={bodyTextStyle(isMobile)}>
              Two years ago this wasn't possible. Three things had to converge:
            </p>
            <p style={bodyTextStyle(isMobile)}>
              <strong style={{ fontWeight: "700", color: theme.colors.text }}>Agents had to write real production code.</strong> Not autocomplete — actual systems shipped without humans writing most of it. Done.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              <strong style={{ fontWeight: "700", color: theme.colors.text }}>The supervision gap had to become undeniable.</strong> Nobody carries the mental model anymore. Not the agent. Not the engineer. Done.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              <strong style={{ fontWeight: "700", color: theme.colors.text }}>Agents had to become capable enough to help build the supervision layer.</strong> The same machines creating the comprehension problem can now help solve it. Discovering patterns, generating narrative structure, instrumenting telemetry. That's the unlock.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              Every agent-written system deployed without narrative structure is another codebase no human fully understands. That debt is compounding. Right now.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section: One Story */}
      <section
        style={{
          padding: isMobile ? "32px 24px" : "40px 40px",
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={sectionHeadingStyle(isMobile)}>
              One Story. Humans and Machines. Same Page.
            </h2>
            <p style={bodyTextStyle(isMobile)}>
              When a system tells its own story in a structure both humans and machines can read, engineers watch behavior instead of grepping logs. Non-technical stakeholders see the story as it happens. And agents operate against the same narrative their human supervisors use to validate their work.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              Everything lives in Git, alongside the code. No cloud lock-in. No dashboard to learn.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              <strong style={{ fontWeight: "700", color: theme.colors.text }}>That's not a feature. That's a new category.</strong>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section: The Bet */}
      <section
        style={{
          padding: isMobile ? "32px 24px" : "40px 40px",
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={sectionHeadingStyle(isMobile)}>
              The Bet.
            </h2>
            <p style={bodyTextStyle(isMobile)}>
              We're three founders who met in line at a pitch contest. Bootstrapped. Seven patents filed. Working product. Building Principal AI with Principal AI every day.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              The next great developer platform won't be built on better data collection.
            </p>
            <p style={bodyTextStyle(isMobile)}>
              It'll be built on better stories.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Closing */}
      <section
        style={{
          padding: isMobile ? "48px 24px 80px" : "60px 40px 100px",
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: isMobile ? "64px" : "96px" }}
          >
            <p style={{
              fontSize: isMobile ? "24px" : "28px",
              lineHeight: "1.5",
              fontWeight: "500",
              marginBottom: "20px",
              fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
            }}>
              <span style={{ color: theme.colors.primary }}>Stories are how</span><br />
              <span style={{ color: theme.colors.text }}>humans have understood the world for 40,000 years.</span>
            </p>
            <p style={{
              fontSize: isMobile ? "24px" : "28px",
              lineHeight: "1.5",
              fontWeight: "500",
              fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
            }}>
              <span style={{ color: theme.colors.primary }}>Stories are how</span><br />
              <span style={{ color: theme.colors.text }}>we'll understand the systems that run it next.</span>
            </p>
          </motion.div>

          {/* Game callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p style={{
              fontSize: isMobile ? "16px" : "18px",
              color: theme.colors.textTertiary,
              fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
            }}>
              Want to feel the difference instead of read about it?{" "}
              <Link href="/game" style={{
                color: theme.colors.primary,
                textDecoration: "none",
                fontWeight: "600",
              }}>
                Play the game →
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

