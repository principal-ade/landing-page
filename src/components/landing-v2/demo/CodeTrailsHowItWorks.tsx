"use client";

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsHowItWorksProps {
  isMobile?: boolean;
}

export const CodeTrailsHowItWorks: React.FC<CodeTrailsHowItWorksProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const steps = [
    {
      number: '01',
      title: 'Make a change.',
      description: 'Any change. A bug fix. A new feature. A refactor. Your AI agent watches.',
      visual: (
        <div style={{
          background: '#0c1741',
          borderRadius: '12px',
          padding: isMobile ? '20px' : '28px',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: isMobile ? '12px' : '14px',
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.8,
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div><span style={{ color: '#c8a2ff' }}>function</span> <span style={{ color: '#82d4ff' }}>checkout</span>() {'{'}</div>
          <div style={{ marginLeft: '16px', background: 'rgba(34,211,238,0.15)', marginRight: '-28px', paddingRight: '28px', borderLeft: '3px solid #22d3ee' }}>
            <span style={{ color: '#22d3ee' }}>+ </span><span style={{ color: '#c8a2ff' }}>const</span> verified = <span style={{ color: '#82d4ff' }}>verify</span>()
          </div>
          <div style={{ marginLeft: '16px' }}>
            <span style={{ color: '#c8a2ff' }}>if</span> (verified) processPayment()
          </div>
          <div>{'}'}</div>
        </div>
      ),
    },
    {
      number: '02',
      title: 'Get a trail.',
      description: 'Automatically. Your change becomes a visual story—File City, diagrams, code snippets, plain English.',
      visual: (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: isMobile ? '20px' : '28px',
          border: `1px solid ${theme.colors.border}`,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '16px',
          }}>
            <div style={{
              background: '#f7fcfd',
              borderRadius: '8px',
              padding: isMobile ? '12px' : '16px',
              fontSize: isMobile ? '10px' : '11px',
              fontWeight: '600',
              color: theme.colors.textTertiary,
              textAlign: 'center',
              fontFamily: 'var(--font-mono, monospace)',
              letterSpacing: '0.05em',
            }}>
              FILE CITY
            </div>
            <div style={{
              background: '#f7fcfd',
              borderRadius: '8px',
              padding: isMobile ? '12px' : '16px',
              fontSize: isMobile ? '10px' : '11px',
              fontWeight: '600',
              color: theme.colors.textTertiary,
              textAlign: 'center',
              fontFamily: 'var(--font-mono, monospace)',
              letterSpacing: '0.05em',
            }}>
              FLOW
            </div>
          </div>
          <div style={{
            background: 'rgba(255,107,53,0.08)',
            borderRadius: '8px',
            padding: isMobile ? '12px' : '16px',
            fontSize: isMobile ? '13px' : '15px',
            color: theme.colors.text,
            lineHeight: 1.5,
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            borderLeft: `3px solid ${theme.colors.primary}`,
          }}>
            "Added payment verification before processing checkout."
          </div>
        </div>
      ),
    },
    {
      number: '03',
      title: 'Share it.',
      description: 'One link. They click. They see everything. They leave a note. No clone. No context switching. Just clarity.',
      visual: (
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: isMobile ? '20px' : '28px',
          border: `1px solid ${theme.colors.border}`,
          position: 'relative',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f7fcfd',
            padding: isMobile ? '8px 14px' : '10px 18px',
            borderRadius: '8px',
            fontSize: isMobile ? '11px' : '13px',
            fontFamily: 'var(--font-mono, monospace)',
            color: theme.colors.primary,
            marginBottom: '16px',
            border: `1px solid ${theme.colors.border}`,
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6.5 3.5L9.5 3.5C10.6046 3.5 11.5 4.39543 11.5 5.5V5.5C11.5 6.60457 10.6046 7.5 9.5 7.5H6.5C5.39543 7.5 4.5 6.60457 4.5 5.5V5.5C4.5 4.39543 5.39543 3.5 6.5 3.5Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9.5 8.5L6.5 8.5C5.39543 8.5 4.5 9.39543 4.5 10.5V10.5C4.5 11.6046 5.39543 12.5 6.5 12.5H9.5C10.6046 12.5 11.5 11.6046 11.5 10.5V10.5C11.5 9.39543 10.6046 8.5 9.5 8.5Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            trail.principal.ai/checkout-fix
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            {[
              { initial: 'T', name: 'Tom', message: 'Looks good!', delay: 0 },
              { initial: 'A', name: 'Anna', message: 'Did you test edge cases?', delay: 0.1 },
              { initial: 'M', name: 'Maya', message: 'Ship it 🚀', delay: 0.2 },
            ].map((comment, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 1 + comment.delay }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: isMobile ? '8px' : '10px',
                  background: '#f7fcfd',
                  borderRadius: '8px',
                }}
              >
                <div style={{
                  width: isMobile ? '28px' : '32px',
                  height: isMobile ? '28px' : '32px',
                  borderRadius: '50%',
                  background: ['#0893d2', '#14b8a6', theme.colors.primary][i],
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: isMobile ? '11px' : '13px',
                  fontWeight: '600',
                  flexShrink: 0,
                }}>
                  {comment.initial}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: isMobile ? '11px' : '12px',
                    fontWeight: '600',
                    color: theme.colors.text,
                    marginBottom: '2px',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  }}>
                    {comment.name}
                  </div>
                  <div style={{
                    fontSize: isMobile ? '12px' : '14px',
                    color: theme.colors.textSecondary,
                    lineHeight: 1.4,
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  }}>
                    {comment.message}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={ref}
      style={{
        background: '#fff',
        padding: isMobile ? '100px 24px' : '160px 40px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? '80px' : '120px',
          }}
        >
          <div
            style={{
              fontSize: isMobile ? '11px' : '12px',
              fontWeight: '600',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: theme.colors.primary,
              marginBottom: '20px',
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            How it works
          </div>
          <h2
            style={{
              fontSize: isMobile ? 'clamp(36px, 8vw, 48px)' : 'clamp(48px, 6vw, 72px)',
              fontWeight: '700',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#1a2842',
              margin: '0 auto',
              maxWidth: '900px',
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            }}
          >
            Three steps.
            <br />
            <span style={{ color: theme.colors.primary }}>Zero friction.</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '80px' : '120px',
        }}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : index % 2 === 0 ? '1.2fr 1fr' : '1fr 1.2fr',
                gap: isMobile ? '32px' : '80px',
                alignItems: 'center',
              }}
            >
              {/* Content */}
              <div style={{ order: isMobile ? 1 : (index % 2 === 0 ? 1 : 2) }}>
                <div
                  style={{
                    fontSize: isMobile ? '56px' : '80px',
                    fontWeight: '700',
                    color: 'rgba(255,107,53,0.1)',
                    lineHeight: 1,
                    marginBottom: '16px',
                    fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                  }}
                >
                  {step.number}
                </div>
                <h3
                  style={{
                    fontSize: isMobile ? '28px' : '36px',
                    fontWeight: '700',
                    color: '#1a2842',
                    marginBottom: '16px',
                    lineHeight: 1.2,
                    fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: isMobile ? '17px' : '20px',
                    lineHeight: 1.6,
                    color: '#4a6fa5',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  }}
                >
                  {step.description}
                </p>
              </div>

              {/* Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                style={{
                  order: isMobile ? 2 : (index % 2 === 0 ? 2 : 1),
                }}
              >
                {step.visual}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
