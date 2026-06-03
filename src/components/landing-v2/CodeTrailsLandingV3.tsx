"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';
import { CodeTrailsHeroV3 } from './demo/CodeTrailsHeroV3';
import { CodeTrailsFrameIoMoment } from './demo/CodeTrailsFrameIoMoment';
import { CodeTrailsMakeFor } from './demo/CodeTrailsMakeFor';
import { CodeTrailsForBuilders } from './demo/CodeTrailsForBuilders';
import { CodeTrailsFlowRhythm } from './demo/CodeTrailsFlowRhythm';

export const CodeTrailsLandingV3: React.FC = () => {
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
        background: '#0c1741',
        scrollBehavior: 'smooth',
      }}
    >
      {/* Hero - Strong hook with clear CTA */}
      <CodeTrailsHeroV3 isMobile={isMobile} />

      {/* Frame.io Moment - Show the four views immediately */}
      <CodeTrailsFrameIoMoment isMobile={isMobile} />

      {/* Use Cases - When you need this */}
      <CodeTrailsMakeFor isMobile={isMobile} />

      {/* Get Started - Move this UP so it's clearer how to start */}
      <div id="get-started">
        <CodeTrailsForBuilders isMobile={isMobile} />
      </div>

      {/* Philosophy - Optional depth, moved to bottom */}
      <CodeTrailsFlowRhythm isMobile={isMobile} />

      {/* Closer Section */}
      <section
        style={{
          background: '#0c1741',
          padding: isMobile ? '80px 24px 48px' : '100px 24px 64px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
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
              color: '#9DB1BF',
              fontSize: '13px',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            <a
              href="https://github.com/principal-ai/code-trail"
              style={{
                color: '#9DB1BF',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9DB1BF')}
            >
              Skill source
            </a>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
            <a
              href="https://docs.principal-ade.com"
              style={{
                color: '#9DB1BF',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9DB1BF')}
            >
              Docs
            </a>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
            <a
              href="https://github.com/principal-ai"
              style={{
                color: '#9DB1BF',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9DB1BF')}
            >
              Run locally
            </a>
          </motion.div>

          <div
            style={{
              marginTop: '16px',
              fontSize: '12px',
              color: '#9DB1BF',
              fontFamily: 'var(--font-mono, monospace)',
              letterSpacing: '0.06em',
            }}
          >
            © 2026 Principal AI
          </div>
        </div>
      </section>
    </div>
  );
};
