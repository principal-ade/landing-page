"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';
import { CodeTrailsHero } from './demo/CodeTrailsHero';
import { CodeTrailsFrameIoMomentV2 } from './demo/CodeTrailsFrameIoMomentV2';
import { CodeTrailsMakeFor } from './demo/CodeTrailsMakeFor';
import { CodeTrailsFlowRhythm } from './demo/CodeTrailsFlowRhythm';
import { CodeTrailsForBuilders } from './demo/CodeTrailsForBuilders';
import { Footer } from '../Footer';

export const CodeTrailsLanding: React.FC = () => {
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

  return (
    <div
      style={{
        background: theme.colors.background,
        scrollBehavior: 'smooth',
      }}
    >
      {/* Hero Section */}
      <CodeTrailsHero isMobile={isMobile} />

      {/* Frame.io Moment - Four Synchronized Views */}
      <CodeTrailsFrameIoMomentV2 isMobile={isMobile} />

      {/* Make For Section - Use Cases */}
      <CodeTrailsMakeFor isMobile={isMobile} />

      {/* Flow Rhythm Checkpoints Section */}
      <CodeTrailsFlowRhythm isMobile={isMobile} />

      {/* For Builders Section */}
      <CodeTrailsForBuilders isMobile={isMobile} />

      {/* Closer Section */}
      <section
        style={{
          background: theme.colors.background,
          padding: isMobile ? '80px 24px 48px' : '140px 24px 64px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              fontStyle: 'italic',
              fontSize: isMobile ? '20px' : '24px',
              lineHeight: 1.5,
              color: theme.colors.textSecondary,
              margin: 0,
              fontWeight: '400',
            }}
          >
            Built by engineers who got tired of clone-the-repo to answer one question.
          </motion.p>

          <div
            style={{
              margin: '80px auto 32px',
              height: '1px',
              background: theme.colors.border,
              maxWidth: '480px',
            }}
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap',
              color: theme.colors.textTertiary,
              fontSize: '13px',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            <a
              href="https://github.com/principal-ai/code-trail"
              style={{
                color: theme.colors.textTertiary,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.textTertiary)}
            >
              Skill source
            </a>
            <span style={{ color: theme.colors.border }}>·</span>
            <a
              href="https://docs.principal-ade.com"
              style={{
                color: theme.colors.textTertiary,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.textTertiary)}
            >
              Docs
            </a>
            <span style={{ color: theme.colors.border }}>·</span>
            <a
              href="https://github.com/principal-ai"
              style={{
                color: theme.colors.textTertiary,
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.textTertiary)}
            >
              Run locally
            </a>
          </motion.div>

          <div
            style={{
              marginTop: '16px',
              fontSize: '12px',
              color: theme.colors.textTertiary,
              fontFamily: 'var(--font-mono, monospace)',
              letterSpacing: '0.06em',
            }}
          >
            © 2026 Principal AI
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
