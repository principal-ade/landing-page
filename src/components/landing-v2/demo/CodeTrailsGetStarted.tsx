"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsGetStartedProps {
  isMobile?: boolean;
}

export const CodeTrailsGetStarted: React.FC<CodeTrailsGetStartedProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
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
      style={{
        background: theme.colors.background,
        padding: isMobile ? '80px 24px' : '120px 24px',
        borderTop: `1px solid ${theme.colors.border}`,
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
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
              marginBottom: '24px',
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: '700' }}>02</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
              }}
            >
              Get started
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              fontWeight: '700',
              fontSize: isMobile ? '40px' : '56px',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: theme.colors.text,
              margin: '24px 0 20px',
            }}
          >
            Open Claude. Paste this.
          </h2>

          <p
            style={{
              fontSize: '18px',
              color: theme.colors.textSecondary,
              maxWidth: '560px',
              lineHeight: 1.55,
              margin: '0 auto 40px',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            Your agent makes a Code Trail of any change. One click. No setup.
          </p>

          {/* Code Window with Copy Button */}
          <div
            style={{
              textAlign: 'left',
              position: 'relative',
              background: '#0c1741',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              fontFamily: 'var(--font-mono, monospace)',
              color: 'rgba(255,255,255,0.92)',
            }}
          >
            {/* Title Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: '#131e54',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              <div style={{ display: 'inline-flex', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
              </div>
              <span>claude · skill</span>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              style={{
                position: 'absolute',
                top: '12px',
                right: '14px',
                border: 'none',
                background: copied ? '#14b8a6' : theme.colors.primary,
                color: '#fff',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                fontWeight: '600',
                padding: '8px 14px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: copied ? '0 4px 12px rgba(20,184,166,0.32)' : `0 4px 12px ${theme.colors.primary}38`,
              }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>

            {/* Code Body */}
            <div
              style={{
                padding: '28px 0',
                fontSize: isMobile ? '13px' : '14px',
              }}
            >
              <div style={{ padding: '4px 28px', lineHeight: 1.7 }}>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>&gt;</span>{' '}
                <span style={{ color: '#ffb574' }}>@principal-ade/code-trail</span>
              </div>
              <div style={{ height: '12px' }} />
              <div style={{ padding: '4px 28px', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>
                Then: "make me a trail of [your project]"
              </div>
            </div>
          </div>

          {/* Ghost Link */}
          <a
            href="https://github.com/principal-ai/code-trail"
            style={{
              display: 'inline-block',
              marginTop: '28px',
              color: theme.colors.textTertiary,
              textDecoration: 'none',
              fontSize: '14px',
              borderBottom: `1px solid ${theme.colors.border}`,
              paddingBottom: '2px',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.colors.primary;
              e.currentTarget.style.borderColor = theme.colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = theme.colors.textTertiary;
              e.currentTarget.style.borderColor = theme.colors.border;
            }}
          >
            Read the skill source on GitHub →
          </a>
        </motion.div>
      </div>
    </section>
  );
};
