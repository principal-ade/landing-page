"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsBeforeAfterProps {
  isMobile?: boolean;
}

export const CodeTrailsBeforeAfter: React.FC<CodeTrailsBeforeAfterProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();

  return (
    <section
      style={{
        background: theme.colors.background,
        padding: isMobile ? '80px 24px' : '100px 24px 120px',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
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
            <span style={{ fontSize: '12px', fontWeight: '700' }}>05</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
              }}
            >
              The shift
            </span>
          </div>

          {/* Cards */}
          <div
            style={{
              marginTop: '48px',
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? '16px' : '24px',
            }}
          >
            {/* Before Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                padding: isMobile ? '28px' : '40px',
                borderRadius: '16px',
                border: `1px solid ${theme.colors.border}`,
                background: 'rgba(8,147,210,0.04)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.10em',
                  color: theme.colors.textTertiary,
                  marginBottom: '16px',
                }}
              >
                Before
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                  fontWeight: '700',
                  fontSize: '28px',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  color: theme.colors.text,
                  margin: '0 0 20px',
                }}
              >
                Asking is expensive.
              </h3>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Schedule a meeting', 'Send a Loom', '"Can you clone my branch?"', 'Write a design doc'].map((item, index) => (
                  <li
                    key={index}
                    style={{
                      padding: '14px 0',
                      fontSize: '17px',
                      color: theme.colors.textSecondary,
                      borderTop: index === 0 ? 'none' : `1px solid ${theme.colors.border}`,
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* After Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                padding: isMobile ? '28px' : '40px',
                borderRadius: '16px',
                border: `2px solid ${theme.colors.primary}`,
                background: theme.colors.surface,
                boxShadow: `0 8px 24px ${theme.colors.primary}18`,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.10em',
                  color: theme.colors.primary,
                  marginBottom: '16px',
                }}
              >
                After
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                  fontWeight: '700',
                  fontSize: '28px',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  color: theme.colors.text,
                  margin: '0 0 20px',
                }}
              >
                Asking is a link.
              </h3>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['One link', 'They click', 'They drop a note', 'You ship'].map((item, index) => (
                  <li
                    key={index}
                    style={{
                      padding: '14px 0',
                      fontSize: '17px',
                      color: theme.colors.textSecondary,
                      borderTop: index === 0 ? 'none' : `1px solid ${theme.colors.border}`,
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
