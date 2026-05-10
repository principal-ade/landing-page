"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsHeroNewProps {
  isMobile?: boolean;
}

export const CodeTrailsHeroNew: React.FC<CodeTrailsHeroNewProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale }}
      className="hero-section"
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
          padding: isMobile ? '120px 24px 80px' : '140px 40px 100px',
        }}
      >
        {/* Ambient background elements */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: isMobile ? '300px' : '600px',
            height: isMobile ? '300px' : '600px',
            background: `radial-gradient(circle, ${theme.colors.primary}08 0%, transparent 70%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '0%',
            width: isMobile ? '250px' : '500px',
            height: isMobile ? '250px' : '500px',
            background: `radial-gradient(circle, ${theme.colors.accent}06 0%, transparent 70%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1400px',
            width: '100%',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontSize: isMobile ? '11px' : '12px',
              fontWeight: '600',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: theme.colors.primary,
              marginBottom: isMobile ? '24px' : '32px',
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            Principal AI presents
          </motion.div>

          {/* Main Headline - Goodby style: emotional, punchy */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              fontSize: isMobile ? 'clamp(40px, 10vw, 56px)' : 'clamp(64px, 8vw, 120px)',
              fontWeight: '700',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              color: '#1a2842',
              margin: '0 auto',
              maxWidth: isMobile ? '100%' : '1100px',
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            }}
          >
            Stop asking.
            <br />
            <span style={{ color: theme.colors.primary }}>Start showing.</span>
          </motion.h1>

          {/* Subheadline - Clear value prop */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              fontSize: isMobile ? '19px' : '28px',
              lineHeight: 1.5,
              color: '#4a6fa5',
              margin: isMobile ? '32px auto' : '40px auto',
              maxWidth: '800px',
              fontWeight: '400',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            Code Trails turns your changes into a visual story anyone can follow.
            <br />
            One link. No setup. Just understanding.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '16px' : '20px',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: isMobile ? '40px' : '56px',
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
                border: 'none',
                cursor: 'pointer',
              }}
            >
              See it in action
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>

            <motion.a
              href="#how-it-works"
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
              How it works
            </motion.a>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{
              fontSize: isMobile ? '13px' : '14px',
              color: theme.colors.textTertiary,
              marginTop: isMobile ? '32px' : '48px',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            Free · No installation · Works with Claude
          </motion.p>

          {/* Visual Tease - Floating preview cards */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              marginTop: isMobile ? '64px' : '96px',
              position: 'relative',
              height: isMobile ? '300px' : '400px',
            }}
          >
            {/* Code snippet preview - left */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [-2, -3, -2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                left: isMobile ? '5%' : '15%',
                top: '20%',
                background: '#0c1741',
                borderRadius: '12px',
                padding: isMobile ? '16px' : '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                width: isMobile ? '160px' : '240px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: isMobile ? '10px' : '12px',
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.6,
              }}>
                <div style={{ color: '#c8a2ff' }}>function</div>
                <div style={{ color: '#82d4ff', marginLeft: '8px' }}>verifyToken()</div>
                <div style={{ background: 'rgba(255,107,53,0.2)', padding: '2px 0', borderLeft: `3px solid ${theme.colors.primary}`, paddingLeft: '8px' }}>
                  <span style={{ color: '#ff6b35' }}>// Fixed here</span>
                </div>
              </div>
            </motion.div>

            {/* File City preview - center */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '10%',
                transform: 'translateX(-50%)',
                background: '#fff',
                borderRadius: '16px',
                padding: isMobile ? '20px' : '28px',
                boxShadow: '0 30px 80px rgba(0,0,0,0.15)',
                width: isMobile ? '200px' : '320px',
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div style={{
                fontSize: isMobile ? '11px' : '13px',
                fontWeight: '600',
                color: theme.colors.textTertiary,
                marginBottom: '12px',
                fontFamily: 'var(--font-mono, monospace)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                File City
              </div>
              <svg viewBox="0 0 200 120" style={{ width: '100%', height: 'auto' }}>
                <rect x="10" y="20" width="40" height="30" fill="#e0e7ee" rx="2"/>
                <rect x="55" y="20" width="30" height="40" fill={theme.colors.primary} rx="2" opacity="0.3"/>
                <rect x="90" y="20" width="35" height="25" fill="#e0e7ee" rx="2"/>
                <rect x="130" y="20" width="25" height="35" fill={theme.colors.primary} rx="2" opacity="0.6"/>
                <rect x="160" y="20" width="30" height="28" fill="#e0e7ee" rx="2"/>
                <rect x="10" y="60" width="35" height="40" fill="#e0e7ee" rx="2"/>
                <rect x="50" y="60" width="45" height="30" fill={theme.colors.primary} rx="2"/>
                <rect x="100" y="60" width="30" height="35" fill="#e0e7ee" rx="2"/>
                <path d="M 70 35 Q 100 50, 115 45" stroke={theme.colors.primary} strokeWidth="2" fill="none" strokeDasharray="4 4"/>
                <circle cx="70" cy="35" r="4" fill={theme.colors.primary}/>
                <circle cx="115" cy="45" r="4" fill={theme.colors.primary}/>
              </svg>
            </motion.div>

            {/* Comment preview - right */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [2, 3, 2],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              style={{
                position: 'absolute',
                right: isMobile ? '5%' : '15%',
                top: '30%',
                background: '#fff',
                borderRadius: '12px',
                padding: isMobile ? '14px' : '18px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                width: isMobile ? '140px' : '220px',
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: theme.colors.secondary,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '600',
                }}>
                  S
                </div>
                <div style={{
                  fontSize: isMobile ? '11px' : '12px',
                  color: theme.colors.textTertiary,
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}>
                  Sarah
                </div>
              </div>
              <div style={{
                fontSize: isMobile ? '12px' : '14px',
                color: theme.colors.text,
                lineHeight: 1.4,
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}>
                "Perfect. Ship it."
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
