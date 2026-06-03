"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsFlowRhythmProps {
  isMobile?: boolean;
}

const cards = [
  {
    number: '01',
    label: 'SHARED AWARENESS',
    title: 'Everyone sees what got built.',
    description: 'Why it matters, where it lives, how it works. The context that makes code make sense, available to the whole team.',
    visual: 'curve',
  },
  {
    number: '02',
    label: 'DURABLE KNOWLEDGE',
    title: (
      <>
        Understanding that <span style={{ color: '#FF6B35' }}>compounds.</span>
      </>
    ),
    description: 'Every trail makes the next one easier. One link at a time, your team gets smarter about its own code.',
    visual: 'blocks',
  },
  {
    number: '03',
    label: 'COLLECTIVE CONFIDENCE',
    title: (
      <>
        Code everyone can <span style={{ color: '#FF6B35' }}>stand behind.</span>
      </>
    ),
    description: 'When understanding is shared, confidence is too. Decisions stop living in one head and become something the whole team owns.',
    visual: 'timeline',
  },
];

export const CodeTrailsFlowRhythm: React.FC<CodeTrailsFlowRhythmProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();

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
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginBottom: isMobile ? '48px' : '64px',
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
            BUILT FOR TEAMS THAT BUILD TOGETHER
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              fontWeight: '700',
              fontSize: isMobile ? 'clamp(32px, 9vw, 48px)' : 'clamp(48px, 5vw, 72px)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#fff',
              marginBottom: '24px',
            }}
          >
            When the whole team understands it,
            <br />
            <span style={{ color: theme.colors.primary }}>the whole team owns it.</span>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              fontSize: isMobile ? '16px' : '20px',
              lineHeight: 1.6,
              color: '#9DB1BF',
              maxWidth: '900px',
            }}
          >
            Agents made one person fast. Code Trails make the whole team keep pace. One link at a time, understanding stops living in one head and starts compounding into something everyone can find, follow, and build on.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '20px' : '24px',
          }}
        >
          {cards.map((card, index) => (
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
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: theme.colors.primary,
                  marginBottom: '20px',
                }}
              >
                {card.number} {card.label}
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                  fontWeight: '700',
                  fontSize: isMobile ? '22px' : '28px',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  color: '#fff',
                  marginBottom: '16px',
                }}
              >
                {card.title}
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
                {card.description}
              </p>

              {/* Visual */}
              <div style={{ height: '80px', display: 'flex', alignItems: 'center' }}>
                {card.visual === 'curve' && (
                  <svg width="100%" height="60" viewBox="0 0 300 60" fill="none">
                    <path
                      d="M 10 30 Q 75 10, 150 30 T 290 30"
                      stroke={theme.colors.primary}
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                )}
                {card.visual === 'blocks' && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                    {[20, 30, 60, 25, 35, 70, 30, 40, 75].map((height, i) => (
                      <div
                        key={i}
                        style={{
                          width: '24px',
                          height: `${height}px`,
                          background: [2, 5, 8].includes(i) ? theme.colors.primary : '#2A4A5E',
                          borderRadius: '2px',
                        }}
                      />
                    ))}
                  </div>
                )}
                {card.visual === 'timeline' && (
                  <div style={{ width: '100%', position: 'relative', height: '40px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: '#2A4A5E' }} />
                    {[15, 40, 65].map((pos, i) => (
                      <div
                        key={i}
                        style={{
                          position: 'absolute',
                          left: `${pos}%`,
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: theme.colors.primary,
                          border: '3px solid #15324A',
                          transform: 'translateX(-50%)',
                        }}
                      />
                    ))}
                    {[5, 25, 50, 75, 85, 95].map((pos, i) => (
                      <div
                        key={i}
                        style={{
                          position: 'absolute',
                          left: `${pos}%`,
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#2A4A5E',
                          transform: 'translateX(-50%)',
                        }}
                      />
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
