"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';
import { EditableText } from '../EditableText';
import siteContent from '../../../content/site-content.json';

interface CodeTrailsFrameIoMomentV2Props {
  isMobile?: boolean;
  hasAccess?: boolean;
  textFontSize?: number;
  textFontFamily?: string;
  textColor?: string;
}

const spotlightsMeta = [
  { id: 1, region: { top: '8%', left: '0.4%', width: '28%', height: '31%' }, commentPos: { top: '11%', left: '26%' }, labelPos: { top: '41.5%', left: '1.5%' } },
  { id: 2, region: { top: '19%', left: '29.6%', width: '21%', height: '33%' }, commentPos: { top: '53%', left: '30%' }, labelPos: { top: '53%', left: '35.5%' } },
  { id: 3, region: { top: '15%', left: '54%', width: '19%', height: '28%' }, commentPos: { top: '44%', left: '54%' }, labelPos: { top: '44%', left: '57.5%' } },
  { id: 4, region: { top: '15%', left: '74%', width: '25%', height: '43%' }, commentPos: { top: '60%', left: '74%' }, labelPos: { top: '59%', left: '81%' } },
  { id: 5, region: { top: '59%', left: '26%', width: '48%', height: '37%' }, commentPos: { top: '60%', left: '8%' }, labelPos: { top: '77%', left: '76%' } },
];

export const CodeTrailsFrameIoMomentV2: React.FC<CodeTrailsFrameIoMomentV2Props> = ({
  isMobile = false,
  hasAccess = false,
  textFontSize = 25,
  textFontFamily = 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
  textColor = '#FF6E00',
}) => {
  const { theme } = useTheme();
  const c = siteContent.frameIo;
  const spotlights = spotlightsMeta.map((s, i) => ({ ...s, title: c.spotlights[i] }));
  const [activeSpotlight, setActiveSpotlight] = React.useState(0);
  const [isInView, setIsInView] = React.useState(false);
  const [comments, setComments] = React.useState(c.spotlights);

  const currentSpotlight = spotlights[activeSpotlight];
  const handleNext = () => setActiveSpotlight((prev) => (prev + 1) % spotlights.length);

  return (
    <section
      style={{
        minHeight: 'calc(100vh - 70px)',
        background: '#15324A',
        padding: isMobile ? '80px 24px' : '100px 40px 120px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: isMobile ? '48px' : '72px', textAlign: 'left' }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: isMobile ? '17px' : '28px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: theme.colors.primary,
              marginBottom: '16px',
            }}
          >
            <EditableText contentKey="frameIo.eyebrow" value={c.eyebrow} />
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              fontWeight: '700',
              fontSize: isMobile ? 'clamp(22px, 7vw, 32px)' : 'clamp(42px, 4.5vw, 56px)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '16px',
            }}
          >
            <EditableText contentKey="frameIo.heading" value={c.heading} />
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              fontSize: isMobile ? '13px' : '18px',
              lineHeight: 1.6,
              color: '#9DB1BF',
              maxWidth: '800px',
              margin: 0,
            }}
          >
            <EditableText contentKey="frameIo.body" value={c.body} />
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
          style={{ maxWidth: '1200px', margin: '0 auto' }}
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

            {/* Animated Spotlight */}
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
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `repeating-linear-gradient(90deg, ${theme.colors.primary} 0px, ${theme.colors.primary} 10px, transparent 10px, transparent 16px)`, backgroundSize: '16px 3px', animation: 'marchTop 0.7s linear infinite' }} />
                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '3px', background: `repeating-linear-gradient(180deg, ${theme.colors.primary} 0px, ${theme.colors.primary} 10px, transparent 10px, transparent 16px)`, backgroundSize: '3px 16px', animation: 'marchRight 0.7s linear infinite' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: `repeating-linear-gradient(90deg, ${theme.colors.primary} 0px, ${theme.colors.primary} 10px, transparent 10px, transparent 16px)`, backgroundSize: '16px 3px', animation: 'marchBottom 0.7s linear infinite' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px', background: `repeating-linear-gradient(180deg, ${theme.colors.primary} 0px, ${theme.colors.primary} 10px, transparent 10px, transparent 16px)`, backgroundSize: '3px 16px', animation: 'marchLeft 0.7s linear infinite' }} />
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
                    color: theme.colors.primary,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <EditableText contentKey={`frameIo.spotlights.${activeSpotlight}`} value={currentSpotlight.title} />
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
                    background: index === activeSpotlight ? theme.colors.primary : 'rgba(255,255,255,0.2)',
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
      </div>
    </section>
  );
};
