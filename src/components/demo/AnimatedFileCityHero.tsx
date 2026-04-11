'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@principal-ai/logo-component';
import { Download } from 'lucide-react';
import { useTheme } from '@principal-ade/industry-theme';

// Color palette
const NAVY = '#1a2842';
const BLUE_DARK = '#2d4563';
const BLUE_MID = '#4a6fa5';
const BLUE_LIGHT = '#6b9bd1';
const ORANGE = '#ff6b35';

interface Block {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  delay: number;
}

export function AnimatedFileCityHero({ isMobile }: { isMobile: boolean }) {
  const { theme } = useTheme();

  // Generate blocks procedurally
  const blocks = useMemo<Block[]>(() => {
    const colors = [BLUE_DARK, BLUE_MID, BLUE_LIGHT, ORANGE];
    const generated: Block[] = [];
    let id = 0;

    // Large blocks
    const largeBlocks = [
      { x: 5, y: 10, width: 22, height: 28 },
      { x: 29, y: 10, width: 18, height: 35 },
      { x: 49, y: 10, width: 26, height: 25 },
      { x: 77, y: 10, width: 18, height: 30 },
      { x: 5, y: 40, width: 15, height: 22 },
      { x: 22, y: 47, width: 13, height: 25 },
      { x: 37, y: 37, width: 20, height: 18 },
      { x: 59, y: 37, width: 16, height: 28 },
      { x: 77, y: 42, width: 18, height: 23 },
    ];

    largeBlocks.forEach((block) => {
      generated.push({
        id: id++,
        ...block,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.8,
      });
    });

    // Medium blocks
    const mediumBlocks = [
      { x: 5, y: 64, width: 10, height: 14 },
      { x: 17, y: 74, width: 8, height: 16 },
      { x: 27, y: 74, width: 12, height: 16 },
      { x: 41, y: 57, width: 9, height: 18 },
      { x: 52, y: 57, width: 11, height: 12 },
      { x: 65, y: 67, width: 8, height: 11 },
      { x: 75, y: 67, width: 10, height: 15 },
      { x: 87, y: 67, width: 8, height: 12 },
    ];

    mediumBlocks.forEach((block) => {
      generated.push({
        id: id++,
        ...block,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.8 + 0.3,
      });
    });

    // Small accent blocks
    const smallBlocks = [
      { x: 5, y: 80, width: 6, height: 8 },
      { x: 13, y: 92, width: 5, height: 6 },
      { x: 20, y: 92, width: 7, height: 6 },
      { x: 29, y: 92, width: 5, height: 6 },
      { x: 36, y: 77, width: 6, height: 9 },
      { x: 44, y: 77, width: 5, height: 7 },
      { x: 51, y: 71, width: 6, height: 8 },
      { x: 59, y: 80, width: 7, height: 9 },
      { x: 68, y: 80, width: 5, height: 8 },
      { x: 75, y: 84, width: 6, height: 9 },
      { x: 83, y: 84, width: 6, height: 7 },
      { x: 91, y: 81, width: 5, height: 10 },
    ];

    smallBlocks.forEach((block) => {
      generated.push({
        id: id++,
        ...block,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.8 + 0.5,
      });
    });

    return generated;
  }, []);

  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: NAVY,
        padding: isMobile ? '120px 24px 80px' : '120px 40px 80px',
      }}
    >
      {/* Animated File City Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          zIndex: 0,
        }}
      >
        {blocks.map((block) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              delay: block.delay,
              ease: [0.4, 0, 0.2, 1],
            }}
            whileHover={{
              scale: 1.05,
              opacity: 1,
              transition: { duration: 0.2 },
            }}
            style={{
              position: 'absolute',
              left: `${block.x}%`,
              top: `${block.y}%`,
              width: `${block.width}%`,
              height: `${block.height}%`,
              background: block.color,
              border: '1px solid rgba(0, 0, 0, 0.3)',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Gradient overlay for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 0%, ${NAVY}dd 100%)`,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '900px',
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <Logo
            width={isMobile ? 90 : 120}
            height={isMobile ? 90 : 120}
            color={ORANGE}
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontSize: isMobile ? '56px' : '84px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: isMobile ? '32px' : '48px',
            lineHeight: '1.05',
            fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            letterSpacing: '-0.04em',
          }}
        >
          For the Love
          <br />
          of Building.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            fontSize: isMobile ? '20px' : '26px',
            lineHeight: '1.6',
            color: BLUE_LIGHT,
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            maxWidth: '700px',
            margin: '0 auto 48px',
            fontWeight: '400',
          }}
        >
          The best builders don't want to code less.
          <br />
          They want to understand more.
        </motion.p>

        {/* CTA */}
        <motion.a
          href="https://principal-ade.com/download"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{
            scale: 1.05,
            boxShadow: `0 12px 32px ${ORANGE}66`,
          }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: ORANGE,
            color: '#ffffff',
            padding: isMobile ? '16px 36px' : '20px 48px',
            borderRadius: '12px',
            fontSize: isMobile ? '17px' : '19px',
            fontWeight: '700',
            textDecoration: 'none',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            border: `2px solid ${ORANGE}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          Download Principal AI
          <Download size={24} strokeWidth={2.5} />
        </motion.a>
      </div>
    </section>
  );
}
