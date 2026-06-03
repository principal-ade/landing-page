"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsMakeForProps {
  isMobile?: boolean;
}

const trails = [
  {
    tag: 'Clarity for someone else',
    title: 'How opencode does it',
    description: 'Showing another team how a project actually works, as a link they can open.',
    url: 'https://app.principal-ade.com/trail/dc577428',
  },
  {
    tag: "A second opinion when you're stuck",
    title: "The carousel that wouldn't render",
    description: 'An hour fighting the agent, "I don\'t even know what to ask it." Solved once the right person could see the trail.',
    url: 'https://app.principal-ade.com/trail/346ab185-d876-4f7f-8bdd-2f5b74610b76',
  },
  {
    tag: "When the decision needs context you don't have",
    title: 'Session tracking: client vs server',
    description: 'An architecture choice that needed the customer and budget picture, weighed in on the exact step.',
    url: 'https://app.principal-ade.com/trail/e16d8a04-c898-46d9-8bac-500fb06f1922',
  },
  {
    tag: 'Understanding what your agent did',
    title: 'How video tracking works',
    description: 'Following a real feature through the code, play to analytics, one step at a time.',
    url: 'https://app.principal-ade.com/trail/f191756b-616a-4a9d-b3fb-84fc0bacf642',
  },
];

const examples = [
  'clarity',
  'another opinion',
  'coordination',
  'understanding',
];

export const CodeTrailsMakeFor: React.FC<CodeTrailsMakeForProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % examples.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      style={{
        background: '#0c1741',
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
        {/* Animated Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginBottom: isMobile ? '48px' : '64px',
          }}
        >
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
            Create a Trail when you need:{' '}
            <span
              style={{
                display: 'inline-block',
                position: 'relative',
                minWidth: isMobile ? '280px' : '400px',
                verticalAlign: 'bottom',
                height: isMobile ? '48px' : '64px',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    color: theme.colors.primary,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {examples[currentIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              fontSize: isMobile ? '16px' : '18px',
              lineHeight: 1.6,
              color: '#9DB1BF',
              maxWidth: '800px',
            }}
          >
            Trails are a byproduct of working, not extra work. See an example trail.
          </p>
        </motion.div>

        {/* Trail Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: isMobile ? '20px' : '20px',
          }}
        >
          {trails.map((trail, index) => (
            <motion.a
              key={index}
              href={trail.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              style={{
                background: '#15324A',
                borderRadius: '14px',
                padding: isMobile ? '24px' : '28px',
                textDecoration: 'none',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                transition: 'all 0.18s ease',
                display: 'block',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Orange bar on left */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: theme.colors.primary,
                  opacity: 0,
                  transition: 'opacity 0.18s ease',
                }}
                className="trail-bar"
              />

              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#F0A48B',
                  marginBottom: '14px',
                }}
              >
                {trail.tag}
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  fontSize: '14px',
                  color: '#9DB1BF',
                  lineHeight: 1.55,
                  marginBottom: '18px',
                }}
              >
                {trail.description}
              </p>

              <div
                style={{
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#F0A48B',
                }}
              >
                Open trail →
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      <style jsx>{`
        a:hover .trail-bar {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
};
