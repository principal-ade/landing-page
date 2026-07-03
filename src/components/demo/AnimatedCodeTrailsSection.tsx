'use client';

import React from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Color palette
const NAVY = '#1a2842';
const BLUE_DARK = '#2d4563';
const BLUE_MID = '#4a6fa5';
const BLUE_LIGHT = '#6b9bd1';
const ORANGE = '#ff6b35';

// Spotlight regions for the interactive carousel
const spotlights = [
  {
    id: 1,
    region: { top: '8%', left: '0.4%', width: '28%', height: '31%' },
    labelPos: { top: '41.5%', left: '1.5%' },
    title: 'Plain English description'
  },
  {
    id: 2,
    region: { top: '19%', left: '29.6%', width: '21%', height: '33%' },
    labelPos: { top: '53%', left: '35.5%' },
    title: 'File City'
  },
  {
    id: 3,
    region: { top: '15%', left: '54%', width: '19%', height: '28%' },
    labelPos: { top: '44%', left: '57.5%' },
    title: 'Leave a note'
  },
  {
    id: 4,
    region: { top: '15%', left: '74%', width: '25%', height: '43%' },
    labelPos: { top: '59%', left: '81%' },
    title: 'Actual code'
  },
  {
    id: 5,
    region: { top: '59%', left: '26%', width: '48%', height: '37%' },
    labelPos: { top: '77%', left: '76%' },
    title: 'Sequence flow'
  },
];

export function AnimatedCodeTrailsSection({ isMobile }: { isMobile: boolean }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [activeSpotlight, setActiveSpotlight] = React.useState(0);
  const currentSpotlight = spotlights[activeSpotlight];
  const handleNext = () => setActiveSpotlight((prev) => (prev + 1) % spotlights.length);

  return (
    <section
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: NAVY,
        padding: isMobile ? '60px 24px' : '70px 40px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1000px', width: '100%' }}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? '48px' : '64px',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                fontSize: '16px',
                fontWeight: '700',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: ORANGE,
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            >
              CODE TRAILS
            </span>
          </div>

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
            of knowing how it works.
          </h2>
          <p
            style={{
              fontSize: isMobile ? '15px' : '17px',
              color: BLUE_LIGHT,
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              lineHeight: 1.5,
              maxWidth: '600px',
              margin: '0 auto',
              marginTop: '24px',
            }}
          >
            Four synchronized views. File City shows where. Sequence shows how. Code shows what. Plain English explains why. Click one, the others follow. Click a line, leave a note, right where it belongs.
          </p>
        </motion.div>

        {/* Interactive Screenshot Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: isMobile ? '40px' : '60px' }}
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
            <img
              src="/trail-four-views.jpg"
              alt="Four synchronized views of a Code Trail"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />

            <style>{`
              @keyframes marchTop    { to { background-position: 16px 0; } }
              @keyframes marchRight  { to { background-position: 0 16px; } }
              @keyframes marchBottom { to { background-position: -16px 0; } }
              @keyframes marchLeft   { to { background-position: 0 -16px; } }
            `}</style>

            {/* Animated Marching Ant Spotlight */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSpotlight.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute',
                  top: currentSpotlight.region.top,
                  left: currentSpotlight.region.left,
                  width: currentSpotlight.region.width,
                  height: currentSpotlight.region.height,
                  borderRadius: '8px',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `repeating-linear-gradient(90deg, ${ORANGE} 0px, ${ORANGE} 10px, transparent 10px, transparent 16px)`, backgroundSize: '16px 3px', animation: 'marchTop 0.7s linear infinite' }} />
                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '3px', background: `repeating-linear-gradient(180deg, ${ORANGE} 0px, ${ORANGE} 10px, transparent 10px, transparent 16px)`, backgroundSize: '3px 16px', animation: 'marchRight 0.7s linear infinite' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: `repeating-linear-gradient(90deg, ${ORANGE} 0px, ${ORANGE} 10px, transparent 10px, transparent 16px)`, backgroundSize: '16px 3px', animation: 'marchBottom 0.7s linear infinite' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px', background: `repeating-linear-gradient(180deg, ${ORANGE} 0px, ${ORANGE} 10px, transparent 10px, transparent 16px)`, backgroundSize: '3px 16px', animation: 'marchLeft 0.7s linear infinite' }} />
              </motion.div>
            </AnimatePresence>

            {/* On-image label */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`label-${currentSpotlight.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute',
                  top: currentSpotlight.labelPos.top,
                  left: currentSpotlight.labelPos.left,
                  zIndex: 15,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                    fontSize: isMobile ? '10px' : '13px',
                    fontWeight: '600',
                    color: ORANGE,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {currentSpotlight.title}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '32px' }}>
            <button
              onClick={() => setActiveSpotlight((prev) => (prev - 1 + spotlights.length) % spotlights.length)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '20px', padding: '4px 8px', lineHeight: 1 }}
            >
              ←
            </button>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {spotlights.map((spotlight, index) => (
                <button
                  key={spotlight.id}
                  onClick={() => setActiveSpotlight(index)}
                  style={{
                    width: index === activeSpotlight ? '36px' : '10px',
                    height: '10px',
                    borderRadius: '5px',
                    background: index === activeSpotlight ? ORANGE : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '20px', padding: '4px 8px', lineHeight: 1 }}
            >
              →
            </button>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Link
            href="/code-trails"
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
            Learn more about Code Trails →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
