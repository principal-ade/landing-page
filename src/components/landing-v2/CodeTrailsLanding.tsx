"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';
import { CodeTrailsHero } from './demo/CodeTrailsHero';
import { CodeTrailsGetStarted } from './demo/CodeTrailsGetStarted';
import { CodeTrailsPitch } from './demo/CodeTrailsPitch';
import { CodeTrailsBeforeAfter } from './demo/CodeTrailsBeforeAfter';
import { Footer } from './Footer';

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

      {/* Get Started Section */}
      <CodeTrailsGetStarted isMobile={isMobile} />

      {/* Try One First Section */}
      <section
        style={{
          background: theme.colors.background,
          padding: isMobile ? '64px 24px' : '100px 24px 120px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '0.66fr 1fr',
            gap: isMobile ? '40px' : '64px',
            alignItems: 'center',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Eyebrow Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                background: theme.colors.primary,
                borderRadius: '999px',
                color: '#fff',
                fontFamily: 'var(--font-sans, sans-serif)',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '700' }}>03</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                }}
              >
                Try one first
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                fontWeight: '700',
                fontSize: isMobile ? '34px' : '48px',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                margin: '24px 0 20px',
                color: theme.colors.text,
              }}
            >
              See one before
              <br />
              you make one.
            </h2>

            <p
              style={{
                fontSize: '17px',
                color: theme.colors.textSecondary,
                maxWidth: '380px',
                lineHeight: 1.55,
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            >
              A real Code Trail of how Principal AI's trail wiring system works. Six markers. Click through it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              position: 'relative',
              width: '100%',
              height: isMobile ? '420px' : '540px',
              borderRadius: '16px',
              overflow: 'hidden',
              border: `1px solid ${theme.colors.border}`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              background: '#0c1741',
            }}
          >
            <iframe
              src="https://app.principal-ade.com/trail/trail-electron-app-tour"
              style={{
                width: '100%',
                height: '100%',
                border: 0,
                display: 'block',
              }}
              loading="lazy"
              allow="clipboard-write"
              title="Code Trail example"
            />
          </motion.div>
        </div>
      </section>

      {/* Pitch Section */}
      <CodeTrailsPitch isMobile={isMobile} />

      {/* Before/After Section */}
      <CodeTrailsBeforeAfter isMobile={isMobile} />

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
