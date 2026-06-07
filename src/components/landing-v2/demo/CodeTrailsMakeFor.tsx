"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';
import { EditableText } from '../EditableText';
import siteContent from '../../../content/site-content.json';

interface CodeTrailsMakeForProps {
  isMobile?: boolean;
}

export const CodeTrailsMakeFor: React.FC<CodeTrailsMakeForProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const c = siteContent.makeFor;
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % c.examples.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [c.examples.length]);

  return (
    <section
      style={{
        minHeight: 'calc(100vh - 70px)',
        background: '#0c1741',
        padding: isMobile ? '80px 24px' : '100px 40px 120px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: isMobile ? '48px' : '64px' }}
        >
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
            <EditableText contentKey="makeFor.heading" value={c.heading} />{' '}
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
                  style={{ color: theme.colors.primary, position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap' }}
                >
                  <EditableText contentKey={`makeFor.examples.${currentIndex}`} value={c.examples[currentIndex]} />
                </motion.span>
              </AnimatePresence>
            </span>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              fontSize: isMobile ? '13px' : '18px',
              lineHeight: 1.6,
              color: '#9DB1BF',
              maxWidth: '800px',
            }}
          >
            <EditableText contentKey="makeFor.body" value={c.body} />
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
            gap: '20px',
          }}
        >
          {c.trails.map((trail, index) => (
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
                display: 'block',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: theme.colors.primary, opacity: 0, transition: 'opacity 0.18s ease' }} className="trail-bar" />
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
                <EditableText contentKey={`makeFor.trails.${index}.tag`} value={trail.tag} />
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
                <EditableText contentKey={`makeFor.trails.${index}.description`} value={trail.description} />
              </p>
              <div className="trail-link" style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)', fontSize: '13px', fontWeight: '600', color: '#F0A48B' }}>
                Open trail →
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      <style jsx>{`
        a:hover .trail-bar { opacity: 1 !important; }
        a:hover .trail-link { text-decoration: underline; }
      `}</style>
    </section>
  );
};
