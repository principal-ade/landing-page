"use client";

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsFinalCTAProps {
  isMobile?: boolean;
}

export const CodeTrailsFinalCTA: React.FC<CodeTrailsFinalCTAProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const text = '@principal-ade/code-trail';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <section
      id="get-started"
      ref={ref}
      style={{
        background: `linear-gradient(135deg, #f7fcfd 0%, #e8f5f7 100%)`,
        padding: isMobile ? '100px 24px' : '140px 40px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2
            style={{
              fontSize: isMobile ? 'clamp(36px, 8vw, 48px)' : 'clamp(48px, 6vw, 64px)',
              fontWeight: '700',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              color: '#1a2842',
              margin: '0 auto 32px',
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            }}
          >
            Start in
            <br />
            <span style={{ color: theme.colors.primary }}>30 seconds.</span>
          </h2>

          <p
            style={{
              fontSize: isMobile ? '18px' : '22px',
              lineHeight: 1.6,
              color: '#4a6fa5',
              marginBottom: isMobile ? '48px' : '56px',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            Open Claude. Paste this. Done.
          </p>

          {/* Code snippet */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              position: 'relative',
              background: '#0c1741',
              borderRadius: '16px',
              padding: isMobile ? '28px 24px' : '36px 32px',
              marginBottom: isMobile ? '32px' : '40px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: isMobile ? '16px' : '20px',
                color: '#ffb574',
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              @principal-ade/code-trail
            </div>

            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: copied ? '#14b8a6' : theme.colors.primary,
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: isMobile ? '14px 32px' : '16px 40px',
                fontSize: isMobile ? '15px' : '16px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                width: isMobile ? '100%' : 'auto',
                boxShadow: copied ? '0 8px 24px rgba(20,184,166,0.3)' : `0 8px 24px ${theme.colors.primary}30`,
                transition: 'all 0.3s ease',
              }}
            >
              {copied ? '✓ Copied!' : 'Copy to clipboard'}
            </motion.button>
          </motion.div>

          <p
            style={{
              fontSize: isMobile ? '14px' : '15px',
              color: theme.colors.textTertiary,
              marginBottom: isMobile ? '40px' : '48px',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            Then tell Claude: "make me a trail of [your change]"
          </p>

          {/* Secondary links */}
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '12px' : '24px',
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: isMobile ? '32px' : '40px',
              borderTop: `1px solid ${theme.colors.border}`,
            }}
          >
            <a
              href="https://docs.principal-ade.com/code-trails"
              style={{
                fontSize: '15px',
                color: theme.colors.text,
                textDecoration: 'none',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.text)}
            >
              Read the docs →
            </a>
            <span style={{ color: theme.colors.border }}>·</span>
            <a
              href="https://github.com/principal-ai/code-trail"
              style={{
                fontSize: '15px',
                color: theme.colors.text,
                textDecoration: 'none',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.text)}
            >
              View on GitHub →
            </a>
            <span style={{ color: theme.colors.border }}>·</span>
            <a
              href="https://discord.gg/principal-ai"
              style={{
                fontSize: '15px',
                color: theme.colors.text,
                textDecoration: 'none',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.text)}
            >
              Join Discord →
            </a>
          </div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{
              marginTop: isMobile ? '56px' : '72px',
              fontSize: isMobile ? '15px' : '17px',
              fontStyle: 'italic',
              color: theme.colors.textSecondary,
              lineHeight: 1.6,
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            }}
          >
            Built by engineers who got tired of explaining code
            <br />
            over seventeen Slack messages.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};
