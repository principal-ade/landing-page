"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';
import { TrailCityDiagram } from '@principal-ai/logo-component';
import { EditableText } from '../EditableText';
import siteContent from '../../../content/site-content.json';

interface CodeTrailsHeroProps {
  isMobile?: boolean;
}

export const CodeTrailsHero: React.FC<CodeTrailsHeroProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const c = siteContent.hero;

  return (
    <section
      style={{
        minHeight: 'calc(100vh - 70px)',
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
          flex: 1,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.05fr 1fr',
          gap: isMobile ? '56px' : '80px',
          alignItems: 'center',
          padding: isMobile ? '40px 24px 64px' : '64px 40px 96px',
          maxWidth: '1480px',
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
                fontWeight: '700',
                lineHeight: 1.0,
                letterSpacing: '-0.04em',
                color: theme.colors.text,
                margin: 0,
                fontSize: isMobile ? 'clamp(42px, 11vw, 64px)' : 'clamp(48px, 9.2vw, 120px)',
              }}
            >
              <EditableText contentKey="hero.heading" value={c.heading} />
            </h1>

            <p
              style={{
                marginTop: '32px',
                fontSize: isMobile ? '18px' : '22px',
                lineHeight: 1.5,
                color: theme.colors.text,
                maxWidth: '560px',
                fontWeight: '400',
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
            maxWidth: isMobile ? '420px' : '620px',
            margin: '0 auto',
          }}
        >
          <TrailCityDiagram theme={theme} />
        </motion.div>
      </div>
    </section>
  );
};
