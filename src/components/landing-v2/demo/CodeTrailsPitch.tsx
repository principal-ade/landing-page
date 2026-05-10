"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsPitchProps {
  isMobile?: boolean;
}

export const CodeTrailsPitch: React.FC<CodeTrailsPitchProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();

  const pitchPoints = [
    { left: 'One click.', right: 'Your agent makes a trail of any change.' },
    { left: 'Send the link.', right: 'Anyone opens it. No clone. No IDE.' },
    { left: 'They walk it.', right: 'File City, sequence diagram, code, plain English.' },
    { left: 'They leave a note.', right: 'Approve. Comment. Or pass it on.' },
  ];

  return (
    <section
      style={{
        background: theme.colors.background,
        padding: isMobile ? '80px 24px' : '120px 24px',
      }}
    >
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
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
            <span style={{ fontSize: '12px', fontWeight: '700' }}>04</span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
              }}
            >
              What it does
            </span>
          </div>

          {/* Pitch Rows */}
          <div style={{ marginTop: '56px' }}>
            {pitchPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '0.55fr 1fr',
                  gap: isMobile ? '8px' : '48px',
                  padding: isMobile ? '16px 0' : '24px 0',
                  alignItems: 'baseline',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                    fontWeight: '700',
                    fontSize: isMobile ? '24px' : '28px',
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                    color: theme.colors.text,
                  }}
                >
                  {point.left}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? '17px' : '18px',
                    color: theme.colors.textSecondary,
                    lineHeight: 1.55,
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  }}
                >
                  {point.right}
                </div>
              </motion.div>
            ))}

            {/* Divider */}
            <div
              style={{
                height: '1px',
                background: theme.colors.border,
                margin: '24px 0',
              }}
            />

            {/* Final Point */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '0.55fr 1fr',
                gap: isMobile ? '8px' : '48px',
                padding: isMobile ? '16px 0' : '24px 0',
                alignItems: 'baseline',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                  fontWeight: '700',
                  fontSize: isMobile ? '24px' : '28px',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  color: theme.colors.text,
                }}
              >
                Your agent reads the note.
              </div>
              <div
                style={{
                  fontSize: isMobile ? '17px' : '18px',
                  color: theme.colors.textSecondary,
                  lineHeight: 1.55,
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                Or you do. The conversation lives in the link.
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
