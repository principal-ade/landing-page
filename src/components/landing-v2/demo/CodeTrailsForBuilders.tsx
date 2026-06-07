"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';
import { EditableText } from '../EditableText';
import siteContent from '../../../content/site-content.json';

interface CodeTrailsForBuildersProps {
  isMobile?: boolean;
}

export const CodeTrailsForBuilders: React.FC<CodeTrailsForBuildersProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const c = siteContent.forBuilders;
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(c.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      style={{
        minHeight: 'calc(100vh - 70px)',
        background: '#15324A',
        padding: isMobile ? '80px 24px' : '100px 40px 120px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: theme.colors.primary,
              marginBottom: '16px',
            }}
          >
            <EditableText contentKey="forBuilders.eyebrow" value={c.eyebrow} />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              fontWeight: '700',
              fontSize: isMobile ? 'clamp(22px, 7vw, 32px)' : 'clamp(42px, 4.5vw, 56px)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '24px',
            }}
          >
            <EditableText contentKey="forBuilders.heading" value={c.heading} />
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              fontSize: isMobile ? '13px' : '18px',
              lineHeight: 1.6,
              color: '#9DB1BF',
              maxWidth: '700px',
              marginBottom: '32px',
            }}
          >
            <EditableText contentKey="forBuilders.body" value={c.body} />
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#0c1741',
              borderRadius: '8px',
              padding: isMobile ? '16px 20px' : '18px 24px',
              gap: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <code
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: isMobile ? '12px' : '16px',
                color: '#F0A48B',
                letterSpacing: '0.02em',
              }}
            >
              <EditableText contentKey="forBuilders.command" value={c.command} />
            </code>
            <button
              onClick={handleCopy}
              style={{
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                fontSize: '14px',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '6px',
                background: theme.colors.primary,
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
