"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsProofProps {
  isMobile?: boolean;
}

export const CodeTrailsProof: React.FC<CodeTrailsProofProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();

  return (
    <section
      style={{
        background: theme.colors.background,
        padding: isMobile ? '60px 24px' : '80px 40px',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '32px' : '48px',
            marginBottom: '64px',
            textAlign: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                fontSize: isMobile ? '42px' : '56px',
                fontWeight: '700',
                color: theme.colors.primary,
                lineHeight: 1,
                marginBottom: '12px',
              }}
            >
              1,247
            </div>
            <div
              style={{
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                fontSize: '16px',
                color: theme.colors.textSecondary,
              }}
            >
              Trails created
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                fontSize: isMobile ? '42px' : '56px',
                fontWeight: '700',
                color: theme.colors.primary,
                lineHeight: 1,
                marginBottom: '12px',
              }}
            >
              4
            </div>
            <div
              style={{
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                fontSize: '16px',
                color: theme.colors.textSecondary,
              }}
            >
              Synchronized views
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                fontSize: isMobile ? '42px' : '56px',
                fontWeight: '700',
                color: theme.colors.primary,
                lineHeight: 1,
                marginBottom: '12px',
              }}
            >
              30s
            </div>
            <div
              style={{
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                fontSize: '16px',
                color: theme.colors.textSecondary,
              }}
            >
              To your first trail
            </div>
          </div>
        </motion.div>

        {/* Testimonial / Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: isMobile ? '32px 24px' : '48px',
            background: 'rgba(255,255,255,0.5)',
            borderRadius: '12px',
            border: `1px solid ${theme.colors.border}`,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              fontSize: isMobile ? '20px' : '24px',
              lineHeight: 1.5,
              color: theme.colors.text,
              fontStyle: 'italic',
              marginBottom: '24px',
            }}
          >
            "Used by the Principal team to build Principal. We were tired of clone-the-repo to answer one question."
          </p>
          <div
            style={{
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              fontSize: '14px',
              color: theme.colors.textSecondary,
            }}
          >
            — Built by engineers who felt the pain
          </div>
        </motion.div>
      </div>
    </section>
  );
};
