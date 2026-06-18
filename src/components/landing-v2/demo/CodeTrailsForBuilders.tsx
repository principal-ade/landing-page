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
    navigator.clipboard.writeText(c.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      style={{
        background: '#15324A',
        padding: isMobile ? '80px 24px' : '100px 40px 120px',
        position: 'relative',
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
              background: 'rgba(12, 23, 65, 0.5)',
              borderRadius: '8px',
              padding: isMobile ? '20px' : '24px',
              border: '1px solid rgba(255, 114, 94, 0.3)',
              marginBottom: '24px',
              maxWidth: '700px',
            }}
          >
            <code
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: isMobile ? '13px' : '14px',
                color: '#E8E8E8',
                lineHeight: 1.6,
                display: 'block',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              <EditableText contentKey="forBuilders.prompt" value={c.prompt} />
            </code>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '32px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={handleCopy}
              style={{
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                fontSize: '14px',
                fontWeight: '600',
                padding: '12px 24px',
                borderRadius: '6px',
                background: theme.colors.primary,
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {copied ? 'Copied!' : 'Copy prompt'}
            </button>
            <a
              href={c.skillUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                fontSize: '14px',
                fontWeight: '600',
                padding: '12px 24px',
                borderRadius: '6px',
                background: 'transparent',
                color: theme.colors.primary,
                border: `1px solid ${theme.colors.primary}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              View skill
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
