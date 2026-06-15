"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';
import { TrailCityDiagram } from '@principal-ai/logo-component';
import { EditableText } from '../EditableText';
import siteContent from '../../../content/site-content.json';
import { typography, spacing, layout, px, responsive } from '../designSystem';

interface CodeTrailsHeroProps {
  isMobile?: boolean;
}

export const CodeTrailsHero: React.FC<CodeTrailsHeroProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const c = siteContent.hero;

  return (
    <section
      style={{
        background: `radial-gradient(1100px 600px at 70% 8%, rgba(255,135,85,0.10), transparent 60%),
                     radial-gradient(900px 600px at 12% 90%, rgba(34,211,238,0.10), transparent 60%),
                     ${theme.colors.background}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.05fr 1fr',
          gap: px(isMobile ? spacing.gap.md : spacing.gap.lg),
          alignItems: 'center',
          padding: spacing.section[isMobile ? 'mobile' : 'desktop'],
          maxWidth: px(layout.maxWidth.content),
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Left: Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              style={{
                fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                fontWeight: typography.weight.bold,
                lineHeight: typography.lineHeight.tight,
                letterSpacing: typography.letterSpacing.tight,
                color: theme.colors.text,
                margin: 0,
                fontSize: responsive(typography.size.displayLarge.mobile, typography.size.displayLarge.desktop, isMobile),
              }}
            >
              <EditableText contentKey="hero.heading" value={c.heading} />
            </h1>

            <p
              style={{
                marginTop: px(spacing.gap.sm),
                fontSize: responsive(typography.size.bodyLarge.mobile, typography.size.bodyLarge.desktop, isMobile),
                lineHeight: typography.lineHeight.relaxed,
                color: theme.colors.text,
                maxWidth: px(layout.maxWidth.prose),
                fontWeight: typography.weight.normal,
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            >
              <EditableText contentKey="hero.subheading" value={c.subheading} />
            </p>
          </motion.div>
        </div>

        {/* Right: Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: isMobile ? '380px' : '520px',
            margin: '0 auto',
            minHeight: isMobile ? '380px' : '520px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TrailCityDiagram theme={theme} />
        </motion.div>
      </div>
    </section>
  );
};
