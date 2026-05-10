'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Logo } from '@principal-ai/logo-component';
import { useTheme } from '@principal-ade/industry-theme';

// Color palette from "For the Love of Building"
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

interface Trail {
  id: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  delay: number;
  duration: number;
}

export function CodeTrailsHeroDark({ isMobile }: { isMobile: boolean }) {
  const { theme } = useTheme();

  // Generate blocks procedurally (same as AnimatedFileCityHero)
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

  // Generate animated trails connecting blocks
  const trails = useMemo<Trail[]>(() => {
    const generated: Trail[] = [];
    const trailConnections = [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 0, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
      { from: 7, to: 8 },
      { from: 1, to: 6 },
      { from: 2, to: 7 },
    ];

    trailConnections.forEach((conn, idx) => {
      const fromBlock = blocks[conn.from];
      const toBlock = blocks[conn.to];

      if (fromBlock && toBlock) {
        generated.push({
          id: idx,
          from: {
            x: fromBlock.x + fromBlock.width / 2,
            y: fromBlock.y + fromBlock.height / 2,
          },
          to: {
            x: toBlock.x + toBlock.width / 2,
            y: toBlock.y + toBlock.height / 2,
          },
          delay: 1.2 + idx * 0.2,
          duration: 1.5 + Math.random() * 0.5,
        });
      }
    });

    return generated;
  }, [blocks]);

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

      {/* Animated Code Trails */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3,
          zIndex: 0,
        }}
        width="100%"
        height="100%"
      >
        {trails.map((trail) => (
          <motion.line
            key={trail.id}
            x1={`${trail.from.x}%`}
            y1={`${trail.from.y}%`}
            x2={`${trail.to.x}%`}
            y2={`${trail.to.y}%`}
            stroke={ORANGE}
            strokeWidth="2"
            strokeDasharray="8 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 0.6, 0] }}
            transition={{
              pathLength: {
                duration: trail.duration,
                delay: trail.delay,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 2,
              },
              opacity: {
                duration: trail.duration,
                delay: trail.delay,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 2,
              },
            }}
          />
        ))}
      </svg>

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
          maxWidth: '1000px',
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

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            fontSize: isMobile ? '56px' : '84px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: isMobile ? '48px' : '56px',
            lineHeight: 1.05,
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
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontSize: isMobile ? '20px' : '26px',
            lineHeight: 1.6,
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

        {/* Problem Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            maxWidth: '650px',
            margin: '0 auto 48px',
          }}
        >
          <p
            style={{
              fontSize: isMobile ? '17px' : '20px',
              lineHeight: 1.6,
              color: '#8ba3c7',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              marginBottom: '24px',
            }}
          >
            Agents made coding fast. But understanding what they did? Explaining it to your team? That's still on you.
          </p>
          <p
            style={{
              fontSize: isMobile ? '20px' : '26px',
              lineHeight: 1.4,
              color: ORANGE,
              fontWeight: '600',
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            }}
          >
            Code Trails makes both effortless.
          </p>
        </motion.div>

        {/* Install the Skill */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{
            maxWidth: '700px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '16px',
              padding: isMobile ? '32px 24px' : '40px 40px',
              border: '2px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Label */}
            <div
              style={{
                fontSize: isMobile ? '12px' : '13px',
                fontWeight: '500',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: '16px',
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              Install the skill
            </div>

            {/* Command Box */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'rgba(0,0,0,0.4)',
                borderRadius: '12px',
                padding: isMobile ? '18px 20px' : '20px 24px',
                border: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '24px',
              }}
            >
              <code
                style={{
                  flex: 1,
                  fontSize: isMobile ? '16px' : '20px',
                  fontWeight: '500',
                  color: '#fff',
                  fontFamily: 'var(--font-mono, monospace)',
                  wordBreak: 'break-all',
                }}
              >
                @principal-ade/code-trail
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('@principal-ade/code-trail');
                }}
                style={{
                  padding: isMobile ? '10px 20px' : '12px 24px',
                  background: '#fff',
                  color: '#0c1741',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: isMobile ? '14px' : '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  whiteSpace: 'nowrap',
                }}
              >
                Copy
              </button>
            </div>

            {/* Steps */}
            <div
              style={{
                fontSize: isMobile ? '14px' : '15px',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            >
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <span style={{ color: ORANGE, fontWeight: '600', flexShrink: 0 }}>1.</span>
                <span>Open Claude Code or any Claude interface</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <span style={{ color: ORANGE, fontWeight: '600', flexShrink: 0 }}>2.</span>
                <span>Paste the command above</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: ORANGE, fontWeight: '600', flexShrink: 0 }}>3.</span>
                <span>Start making trails</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Frame.io positioning */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          style={{
            textAlign: 'center',
            fontSize: isMobile ? '15px' : '17px',
            color: '#8ba3c7',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            fontStyle: 'italic',
            marginTop: '40px',
          }}
        >
          It's Frame.io for code. The new collaboration primitive for software development.
        </motion.p>
      </div>
    </section>
  );
}
