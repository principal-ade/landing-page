"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsHeroV3Props {
  isMobile?: boolean;
}

export const CodeTrailsHeroV3: React.FC<CodeTrailsHeroV3Props> = ({ isMobile = false }) => {
  const { theme } = useTheme();

  return (
    <section
      style={{
        minHeight: isMobile ? '70vh' : '85vh',
        background: `radial-gradient(1100px 600px at 70% 8%, rgba(255,135,85,0.15), transparent 60%),
                     radial-gradient(900px 600px at 12% 90%, rgba(34,211,238,0.12), transparent 60%),
                     #0c1741`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        padding: isMobile ? '60px 24px' : '80px 40px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              fontWeight: '700',
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              margin: '0 auto',
              fontSize: isMobile ? 'clamp(48px, 12vw, 72px)' : 'clamp(72px, 9vw, 120px)',
              maxWidth: '900px',
              marginBottom: '32px',
            }}
          >
            Code
            <br />
            Trails.
          </h1>

          <p
            style={{
              fontSize: isMobile ? '22px' : '32px',
              lineHeight: 1.3,
              color: '#e0e7ee',
              maxWidth: '800px',
              fontWeight: '400',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              margin: '0 auto 24px',
            }}
          >
            We make AI-written code{' '}
            <span style={{ color: theme.colors.primary, fontWeight: '600' }}>
              something you can stand behind.
            </span>
          </p>

          <div
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: isMobile ? '10px' : '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#9DB1BF',
              marginBottom: '48px',
            }}
          >
            — Frame.io for code, built for the supervisor era
          </div>

          {/* Primary CTA */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '48px',
            }}
          >
            <a
              href="https://app.principal-ade.com/trail/dc577428"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                fontSize: '18px',
                fontWeight: '600',
                padding: '16px 32px',
                borderRadius: '8px',
                background: theme.colors.primary,
                color: '#fff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
              }}
            >
              See a trail in action →
            </a>
            <a
              href="#get-started"
              style={{
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                fontSize: '18px',
                fontWeight: '600',
                padding: '16px 32px',
                borderRadius: '8px',
                background: 'transparent',
                color: '#ffffff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                transition: 'all 0.2s ease',
                border: '2px solid rgba(255,255,255,0.2)',
              }}
            >
              Get started
            </a>
          </div>

          {/* The hook - pain to solution */}
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              padding: isMobile ? '24px' : '32px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr',
                gap: isMobile ? '16px' : '24px',
                alignItems: 'center',
              }}
            >
              <div style={{ textAlign: isMobile ? 'center' : 'right' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    fontSize: '13px',
                    color: '#9DB1BF',
                    marginBottom: '8px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Before
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    fontSize: '15px',
                    color: '#B8C7D6',
                    lineHeight: 1.4,
                  }}
                >
                  Agent made 47 changes. Screenshot code, paste in Slack, hope they understand...
                </div>
              </div>

              {!isMobile && (
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: theme.colors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '20px',
                  }}
                >
                  →
                </div>
              )}

              <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    fontSize: '13px',
                    color: theme.colors.primary,
                    marginBottom: '8px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  After
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    fontSize: '15px',
                    color: '#ffffff',
                    lineHeight: 1.4,
                    fontWeight: '500',
                  }}
                >
                  One link. Four views. They leave a note.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
