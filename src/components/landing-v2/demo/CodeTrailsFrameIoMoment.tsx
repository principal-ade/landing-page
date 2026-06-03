"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsFrameIoMomentProps {
  isMobile?: boolean;
}

const spotlights = [
  {
    id: 1,
    title: 'Plain English.',
    desc: 'What the code does, in words, before you read the code.',
    region: { top: '8%', left: '0%', width: '45%', height: '35%' }, // Left panel
  },
  {
    id: 2,
    title: 'File City.',
    desc: 'Spacial understanding, your codebase as a map by files and packages.',
    region: { top: '15%', left: '15%', width: '40%', height: '40%' }, // File City viz
  },
  {
    id: 3,
    title: 'Human feedback.',
    desc: 'Leave a note by highlighting words or attach to a specific line of code.',
    region: { top: '15%', left: '45%', width: '30%', height: '30%' }, // Notes dialog
  },
  {
    id: 4,
    title: 'Relevant code.',
    desc: 'The lines that matter, for whoever needs them.',
    region: { top: '12%', left: '63%', width: '34%', height: '48%' }, // Code panel - tighter around code
  },
  {
    id: 5,
    title: 'Sequence flow.',
    desc: 'Every step in the trail, in order.',
    region: { top: '60%', left: '20%', width: '60%', height: '35%' }, // Bottom flow
  },
];

export const CodeTrailsFrameIoMoment: React.FC<CodeTrailsFrameIoMomentProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const [activeSpotlight, setActiveSpotlight] = React.useState(0);
  const [isInView, setIsInView] = React.useState(false);

  // Auto-cycle through spotlights when in view
  React.useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setActiveSpotlight((prev) => (prev + 1) % spotlights.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [isInView]);

  const currentSpotlight = spotlights[activeSpotlight];

  return (
    <section
      style={{
        background: '#15324A',
        padding: isMobile ? '80px 24px' : '100px 40px 120px',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginBottom: isMobile ? '48px' : '72px',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: theme.colors.primary,
              marginBottom: '16px',
            }}
          >
            Frame.io for software development
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              fontWeight: '700',
              fontSize: isMobile ? 'clamp(28px, 9vw, 42px)' : 'clamp(42px, 4.5vw, 56px)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '16px',
            }}
          >
            Four views for understanding.
            <br />
            One link.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              fontSize: isMobile ? '16px' : '18px',
              lineHeight: 1.6,
              color: '#9DB1BF',
              maxWidth: '800px',
              margin: 0,
            }}
          >
            Click any view. The others follow. Open in any browser. No clone, no IDE, no setup.
          </p>
        </motion.div>

        {/* Main Content - Screenshot with Animated Spotlight */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          onViewportEnter={() => setIsInView(true)}
          onViewportLeave={() => setIsInView(false)}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Screenshot Container */}
          <div
            style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 40px 120px rgba(0,0,0,0.25)',
            }}
          >
            {/* Base Screenshot */}
            <img
              src="/trail-four-views.jpg"
              alt="Four synchronized views of a Code Trail"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />

            {/* Animated Spotlight */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSpotlight.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute',
                  top: currentSpotlight.region.top,
                  left: currentSpotlight.region.left,
                  width: currentSpotlight.region.width,
                  height: currentSpotlight.region.height,
                  boxShadow: `inset 0 0 0 3px ${theme.colors.primary},
                              0 0 60px rgba(255, 107, 53, 0.6),
                              0 0 120px rgba(255, 107, 53, 0.3)`,
                  borderRadius: '8px',
                  pointerEvents: 'none',
                }}
              />
            </AnimatePresence>
          </div>

          {/* Text Description Below */}
          <div
            style={{
              marginTop: isMobile ? '32px' : '48px',
              textAlign: 'center',
              minHeight: isMobile ? '100px' : '120px',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                  fontSize: isMobile ? '24px' : '32px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '12px',
                  letterSpacing: '-0.02em',
                }}
              >
                {currentSpotlight.title}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  fontSize: isMobile ? '16px' : '18px',
                  lineHeight: 1.6,
                  color: '#B8C7D6',
                  maxWidth: '600px',
                  margin: '0 auto',
                }}
              >
                {currentSpotlight.desc}
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '32px',
            }}
          >
            {spotlights.map((spotlight, index) => (
              <button
                key={spotlight.id}
                onClick={() => setActiveSpotlight(index)}
                style={{
                  width: index === activeSpotlight ? '32px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: index === activeSpotlight ? theme.colors.primary : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
