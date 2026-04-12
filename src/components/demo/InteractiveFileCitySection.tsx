'use client';

import React, { useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Color palette
const NAVY = '#1a2842';
const BLUE_DARK = '#2d4563';
const BLUE_MID = '#4a6fa5';
const BLUE_LIGHT = '#6b9bd1';
const ORANGE = '#ff6b35';

interface FileBlock {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  fileName: string;
  lines: number;
}

export function InteractiveFileCitySection({ isMobile }: { isMobile: boolean }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);

  // Generate file blocks with names
  const fileBlocks = useMemo<FileBlock[]>(() => {
    const fileNames = [
      'components/Dashboard.tsx',
      'services/api.ts',
      'utils/helpers.ts',
      'App.tsx',
      'pages/index.tsx',
      'components/Header.tsx',
      'components/FileCity.tsx',
      'hooks/useData.ts',
      'lib/analytics.ts',
      'types/index.ts',
      'config/theme.ts',
      'components/Button.tsx',
      'utils/format.ts',
      'services/auth.ts',
      'components/Modal.tsx',
      'pages/dashboard.tsx',
      'hooks/useAuth.ts',
      'lib/db.ts',
      'components/Card.tsx',
      'utils/validate.ts',
    ];

    const colors = [BLUE_DARK, BLUE_MID, BLUE_LIGHT, ORANGE];
    const blocks: FileBlock[] = [];

    // Large blocks (important files)
    const largePositions = [
      { x: 5, y: 10, width: 28, height: 35 },
      { x: 35, y: 10, width: 22, height: 28 },
      { x: 59, y: 10, width: 36, height: 32 },
      { x: 5, y: 47, width: 20, height: 25 },
      { x: 27, y: 47, width: 18, height: 25 },
      { x: 47, y: 44, width: 24, height: 28 },
      { x: 73, y: 44, width: 22, height: 28 },
    ];

    largePositions.forEach((pos, i) => {
      blocks.push({
        id: i,
        ...pos,
        color: i % 4 === 0 ? ORANGE : colors[i % 3],
        fileName: fileNames[i] || `file${i}.tsx`,
        lines: Math.floor(Math.random() * 500) + 200,
      });
    });

    // Medium blocks
    const mediumPositions = [
      { x: 5, y: 74, width: 12, height: 16 },
      { x: 19, y: 74, width: 14, height: 16 },
      { x: 35, y: 74, width: 10, height: 16 },
      { x: 47, y: 74, width: 13, height: 16 },
      { x: 62, y: 74, width: 11, height: 16 },
      { x: 75, y: 74, width: 10, height: 16 },
      { x: 87, y: 74, width: 8, height: 16 },
    ];

    mediumPositions.forEach((pos, i) => {
      blocks.push({
        id: largePositions.length + i,
        ...pos,
        color: colors[(i + 1) % colors.length],
        fileName: fileNames[largePositions.length + i] || `file${largePositions.length + i}.tsx`,
        lines: Math.floor(Math.random() * 200) + 50,
      });
    });

    // Small blocks
    const smallPositions = [
      { x: 5, y: 92, width: 7, height: 6 },
      { x: 14, y: 92, width: 6, height: 6 },
      { x: 22, y: 92, width: 8, height: 6 },
      { x: 32, y: 92, width: 6, height: 6 },
      { x: 40, y: 92, width: 7, height: 6 },
      { x: 49, y: 92, width: 6, height: 6 },
    ];

    smallPositions.forEach((pos, i) => {
      blocks.push({
        id: largePositions.length + mediumPositions.length + i,
        ...pos,
        color: i % 3 === 0 ? ORANGE : colors[i % 2],
        fileName: fileNames[largePositions.length + mediumPositions.length + i] || `util${i}.ts`,
        lines: Math.floor(Math.random() * 100) + 10,
      });
    });

    return blocks;
  }, []);

  return (
    <section
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0a0e1a',
        padding: isMobile ? '80px 24px' : '100px 40px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? '48px' : '80px',
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? '36px' : '56px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '24px',
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            For the{' '}
            <Heart
              size={isMobile ? 36 : 48}
              fill={ORANGE}
              stroke={ORANGE}
              style={{ flexShrink: 0 }}
            />{' '}
            of seeing the whole thing.
          </h2>
          <p
            style={{
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: '800',
              color: ORANGE,
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            File City
          </p>
          <p
            style={{
              fontSize: isMobile ? '15px' : '17px',
              color: BLUE_LIGHT,
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              lineHeight: 1.5,
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Your entire codebase, rendered as a living map. Watch it light up when something changes.
          </p>
        </motion.div>

        {/* Interactive Treemap */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '400px' : '600px',
            background: NAVY,
            borderRadius: '16px',
            overflow: 'hidden',
            border: `3px solid ${BLUE_DARK}`,
            marginBottom: isMobile ? '40px' : '60px',
          }}
        >
          {fileBlocks.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.3 + index * 0.02,
                ease: [0.4, 0, 0.2, 1],
              }}
              onHoverStart={() => setHoveredBlock(block.id)}
              onHoverEnd={() => setHoveredBlock(null)}
              whileHover={{
                scale: 1.05,
                zIndex: 10,
                transition: { duration: 0.2 },
              }}
              style={{
                position: 'absolute',
                left: `${block.x}%`,
                top: `${block.y}%`,
                width: `${block.width}%`,
                height: `${block.height}%`,
                background: hoveredBlock === block.id ? block.color : `${block.color}dd`,
                border: `2px solid ${hoveredBlock === block.id ? ORANGE : '#000000'}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease, border-color 0.2s ease',
              }}
            >
              {/* Tooltip on hover */}
              {hoveredBlock === block.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: 'absolute',
                    background: '#000000ee',
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap',
                    zIndex: 20,
                    border: `1px solid ${ORANGE}`,
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {block.fileName}
                  </div>
                  <div style={{ color: BLUE_LIGHT, fontSize: '11px' }}>
                    {block.lines} lines
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            textAlign: 'center',
          }}
        >
          <Link
            href="https://principal-ade.com/file-city"
            style={{
              color: BLUE_MID,
              fontSize: isMobile ? '15px' : '16px',
              fontWeight: '500',
              textDecoration: 'none',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              borderBottom: `1px solid ${BLUE_MID}`,
              transition: 'opacity 0.2s ease',
            }}
          >
            Learn more about File City →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
