"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsHeroFinalProps {
  isMobile?: boolean;
}

export const CodeTrailsHeroFinal: React.FC<CodeTrailsHeroFinalProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.98]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale }}
    >
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, #f7fcfd 0%, #e8f5f7 100%)`,
          position: 'relative',
          overflow: 'hidden',
          padding: isMobile ? '140px 24px 80px' : '160px 40px 100px',
        }}
      >
        {/* Ambient background */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '8%',
            width: isMobile ? '400px' : '700px',
            height: isMobile ? '400px' : '700px',
            background: `radial-gradient(circle, ${theme.colors.primary}06 0%, transparent 70%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              textAlign: 'center',
              marginBottom: isMobile ? '32px' : '40px',
            }}
          >
            <div
              style={{
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: '500',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: theme.colors.textSecondary,
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              For the love of building
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontSize: isMobile ? 'clamp(32px, 9vw, 48px)' : 'clamp(52px, 6vw, 80px)',
              fontWeight: '600',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#1a2842',
              margin: '0 auto',
              maxWidth: '1100px',
              textAlign: 'center',
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            }}
          >
            The best builders don't want to code less.
            <br />
            <span style={{ color: theme.colors.primary }}>They want to understand more.</span>
          </motion.h1>

          {/* Problem Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              textAlign: 'center',
              margin: isMobile ? '48px auto' : '56px auto',
              maxWidth: '900px',
            }}
          >
            <p
              style={{
                fontSize: isMobile ? '19px' : '26px',
                lineHeight: 1.5,
                color: '#2d4563',
                margin: '0 0 16px',
                fontWeight: '500',
                fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              }}
            >
              Agents made coding fast.
            </p>
            <p
              style={{
                fontSize: isMobile ? '17px' : '22px',
                lineHeight: 1.6,
                color: '#4a6fa5',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            >
              But understanding what they did? Explaining it to your team?
              <br />
              That's still on you.
            </p>
            <p
              style={{
                fontSize: isMobile ? '20px' : '28px',
                lineHeight: 1.4,
                color: theme.colors.primary,
                marginTop: '24px',
                fontWeight: '600',
                fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              }}
            >
              Code Trails makes both effortless.
            </p>
          </motion.div>

          {/* Value Props - Three Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: isMobile ? '16px' : '24px',
              margin: isMobile ? '56px auto 64px' : '72px auto 80px',
              maxWidth: '1200px',
            }}
          >
            {[
              {
                title: 'Understand',
                description: 'See what your agent touched. File City shows where, sequence shows how, code shows what.',
              },
              {
                title: 'Share',
                description: 'One link. No clone. No IDE. Anyone reviews—on their phone if they want.',
              },
              {
                title: 'Collaborate',
                description: 'They leave a note. It lives with the trail. Your agent can read it too.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: isMobile ? '24px' : '32px',
                  background: '#fff',
                  borderRadius: '16px',
                  border: `1px solid ${theme.colors.border}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? '20px' : '24px',
                    fontWeight: '700',
                    color: theme.colors.primary,
                    marginBottom: '12px',
                    fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: isMobile ? '15px' : '16px',
                    lineHeight: 1.6,
                    color: theme.colors.textSecondary,
                    margin: 0,
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  }}
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '16px' : '20px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <motion.a
              href="#see-it"
              whileHover={{ scale: 1.03, boxShadow: `0 20px 40px ${theme.colors.primary}30` }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: isMobile ? '18px 40px' : '22px 52px',
                fontSize: isMobile ? '17px' : '18px',
                fontWeight: '600',
                color: '#fff',
                background: theme.colors.primary,
                borderRadius: '12px',
                textDecoration: 'none',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                boxShadow: `0 12px 28px ${theme.colors.primary}25`,
                cursor: 'pointer',
              }}
            >
              See a live trail
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>

            <motion.a
              href="#get-started"
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.04)' }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: isMobile ? '18px 40px' : '22px 52px',
                fontSize: isMobile ? '17px' : '18px',
                fontWeight: '600',
                color: theme.colors.text,
                background: 'transparent',
                borderRadius: '12px',
                textDecoration: 'none',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                border: `2px solid ${theme.colors.border}`,
                cursor: 'pointer',
              }}
            >
              Get started — it's free
            </motion.a>
          </motion.div>

          {/* Frame.io positioning */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            style={{
              textAlign: 'center',
              marginTop: isMobile ? '48px' : '56px',
              fontSize: isMobile ? '15px' : '17px',
              color: theme.colors.textTertiary,
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              fontStyle: 'italic',
            }}
          >
            It's Frame.io for code. The new collaboration primitive for software development.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
};
