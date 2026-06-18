"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';
import { EditableText } from '../EditableText';
import siteContent from '../../../content/site-content.json';

interface CodeTrailsFlowRhythmProps {
  isMobile?: boolean;
}

export const CodeTrailsFlowRhythm: React.FC<CodeTrailsFlowRhythmProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const c = siteContent.flowRhythm;

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
            <EditableText contentKey="flowRhythm.eyebrow" value={c.eyebrow} />
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              fontWeight: '700',
              fontSize: isMobile ? 'clamp(24px, 7vw, 36px)' : 'clamp(48px, 5vw, 72px)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#fff',
              marginBottom: '24px',
            }}
          >
            <EditableText contentKey="flowRhythm.heading" value={c.heading} />
            <br />
            <span style={{ color: theme.colors.primary }}>
              <EditableText contentKey="flowRhythm.headingHighlight" value={c.headingHighlight} />
            </span>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              fontSize: isMobile ? '13px' : '20px',
              lineHeight: 1.6,
              color: '#9DB1BF',
              maxWidth: '900px',
            }}
          >
            <EditableText contentKey="flowRhythm.body" value={c.body} />
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '20px' : '24px',
          }}
        >
          {c.cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: '#15324A',
                borderRadius: '12px',
                padding: isMobile ? '28px' : '32px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '20px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: theme.colors.primary,
                  marginBottom: '20px',
                }}
              >
                <EditableText contentKey={`flowRhythm.cards.${index}.number`} value={card.number} />
                {' '}
                <EditableText contentKey={`flowRhythm.cards.${index}.label`} value={card.label} />
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                  fontWeight: '700',
                  fontSize: isMobile ? '20px' : '36px',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  color: '#fff',
                  marginBottom: '16px',
                }}
              >
                {card.title ? (
                  <EditableText contentKey={`flowRhythm.cards.${index}.title`} value={card.title} />
                ) : (
                  <>
                    <EditableText contentKey={`flowRhythm.cards.${index}.titleBase`} value={card.titleBase ?? ''} />
                    {' '}
                    <span style={{ color: '#FF6B35' }}>
                      <EditableText contentKey={`flowRhythm.cards.${index}.titleHighlight`} value={card.titleHighlight ?? ''} />
                    </span>
                  </>
                )}
              </h3>

              <p
                style={{
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  fontSize: '15px',
                  lineHeight: 1.6,
                  color: '#9DB1BF',
                  marginBottom: '32px',
                }}
              >
                <EditableText contentKey={`flowRhythm.cards.${index}.description`} value={card.description} />
              </p>

              <div style={{ height: '80px', display: 'flex', alignItems: 'center' }}>
                {index === 0 && (
                  <svg width="100%" height="60" viewBox="0 0 300 60" fill="none">
                    <path d="M 10 30 Q 75 10, 150 30 T 290 30" stroke={theme.colors.primary} strokeWidth="3" strokeLinecap="round" fill="none" />
                  </svg>
                )}
                {index === 1 && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                    {[20, 30, 60, 25, 35, 70, 30, 40, 75].map((height, i) => (
                      <div key={i} style={{ width: '24px', height: `${height}px`, background: [2, 5, 8].includes(i) ? theme.colors.primary : '#2A4A5E', borderRadius: '2px' }} />
                    ))}
                  </div>
                )}
                {index === 2 && (
                  <div style={{ width: '100%', position: 'relative', height: '40px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: '#2A4A5E' }} />
                    {[15, 40, 65].map((pos, i) => (
                      <div key={i} style={{ position: 'absolute', left: `${pos}%`, width: '16px', height: '16px', borderRadius: '50%', background: theme.colors.primary, border: '3px solid #15324A', transform: 'translateX(-50%)' }} />
                    ))}
                    {[5, 25, 50, 75, 85, 95].map((pos, i) => (
                      <div key={i} style={{ position: 'absolute', left: `${pos}%`, width: '6px', height: '6px', borderRadius: '50%', background: '#2A4A5E', transform: 'translateX(-50%)' }} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
