"use client";

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsHowItWorksStoryProps {
  isMobile?: boolean;
}

export const CodeTrailsHowItWorksStory: React.FC<CodeTrailsHowItWorksStoryProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="how-it-works"
      ref={ref}
      style={{
        background: '#fff',
        padding: isMobile ? '100px 24px' : '140px 40px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? '80px' : '100px',
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? 'clamp(36px, 8vw, 48px)' : 'clamp(48px, 6vw, 64px)',
              fontWeight: '700',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              color: '#1a2842',
              margin: '0 auto 24px',
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            }}
          >
            One click to create.
            <br />
            <span style={{ color: theme.colors.primary }}>One link to share.</span>
          </h2>
          <p
            style={{
              fontSize: isMobile ? '17px' : '20px',
              lineHeight: 1.6,
              color: '#4a6fa5',
              maxWidth: '700px',
              margin: '0 auto',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            From your agent's work to your team's feedback in seconds.
          </p>
        </motion.div>

        {/* Story Flow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '80px' : '120px' }}>
          {/* Step 1: Agent Works */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? '32px' : '80px',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  background: `${theme.colors.primary}10`,
                  borderRadius: '999px',
                  color: theme.colors.primary,
                  fontSize: '13px',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                Step 1
              </div>
              <h3
                style={{
                  fontSize: isMobile ? '28px' : '36px',
                  fontWeight: '700',
                  color: '#1a2842',
                  marginBottom: '20px',
                  lineHeight: 1.2,
                  fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                }}
              >
                Your agent makes changes.
              </h3>
              <p
                style={{
                  fontSize: isMobile ? '17px' : '19px',
                  lineHeight: 1.7,
                  color: '#4a6fa5',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                It touches 8 files. Creates 200 lines of code. You watch it work in File City—files turn orange as it reads, green as it creates.
              </p>
            </div>

            <div
              style={{
                padding: isMobile ? '24px' : '32px',
                background: '#0c1741',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: isMobile ? '13px' : '15px',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.8,
              }}
            >
              <div style={{ marginBottom: '16px', color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ color: '#22d3ee' }}>Agent working...</span>
              </div>
              <div style={{ color: '#c8a2ff' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>✓</span> Read auth/middleware.ts
              </div>
              <div style={{ color: '#c8a2ff' }}>
                <span style={{ color: '#22d3ee' }}>+</span> Created auth/rateLimit.ts
              </div>
              <div style={{ color: '#c8a2ff' }}>
                <span style={{ color: '#22d3ee' }}>+</span> Updated routes/checkout.ts
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', marginTop: '12px', fontSize: '13px' }}>
                6 files touched · 200 lines added
              </div>
            </div>
          </motion.div>

          {/* Step 2: Create Trail */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? '32px' : '80px',
              alignItems: 'center',
            }}
          >
            <div style={{ order: isMobile ? 1 : 2 }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  background: `${theme.colors.primary}10`,
                  borderRadius: '999px',
                  color: theme.colors.primary,
                  fontSize: '13px',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                Step 2
              </div>
              <h3
                style={{
                  fontSize: isMobile ? '28px' : '36px',
                  fontWeight: '700',
                  color: '#1a2842',
                  marginBottom: '20px',
                  lineHeight: 1.2,
                  fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                }}
              >
                One click makes a trail.
              </h3>
              <p
                style={{
                  fontSize: isMobile ? '17px' : '19px',
                  lineHeight: 1.7,
                  color: '#4a6fa5',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                Your agent generates the trail. File City, sequence diagram, code snippets, plain English explanation—all synced together. Copy the link.
              </p>
            </div>

            <div
              style={{
                order: isMobile ? 2 : 1,
                padding: isMobile ? '28px' : '36px',
                background: '#f7fcfd',
                borderRadius: '16px',
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div style={{
                background: '#fff',
                padding: isMobile ? '16px' : '20px',
                borderRadius: '12px',
                marginBottom: '16px',
                border: `1px solid ${theme.colors.border}`,
              }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: theme.colors.textTertiary,
                  marginBottom: '12px',
                  fontFamily: 'var(--font-mono, monospace)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  Trail Created
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  background: '#f7fcfd',
                  borderRadius: '8px',
                  fontSize: isMobile ? '11px' : '12px',
                  fontFamily: 'var(--font-mono, monospace)',
                  color: theme.colors.primary,
                  border: `1px solid ${theme.colors.border}`,
                }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 2.5L8 2.5C9.38071 2.5 10.5 3.61929 10.5 5V5C10.5 6.38071 9.38071 7.5 8 7.5H5C3.61929 7.5 2.5 6.38071 2.5 5V5C2.5 3.61929 3.61929 2.5 5 2.5Z" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M8 6.5L5 6.5C3.61929 6.5 2.5 7.61929 2.5 9V9C2.5 10.3807 3.61929 11.5 5 11.5H8C9.38071 11.5 10.5 10.3807 10.5 9V9C10.5 7.61929 9.38071 6.5 8 6.5Z" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                  trail.principal.ai/rate-limit-fix
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: theme.colors.primary,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '600',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  cursor: 'pointer',
                }}
              >
                Copy Link
              </motion.button>
            </div>
          </motion.div>

          {/* Step 3: Share */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? '32px' : '80px',
              alignItems: 'center',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  background: `${theme.colors.primary}10`,
                  borderRadius: '999px',
                  color: theme.colors.primary,
                  fontSize: '13px',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                Step 3
              </div>
              <h3
                style={{
                  fontSize: isMobile ? '28px' : '36px',
                  fontWeight: '700',
                  color: '#1a2842',
                  marginBottom: '20px',
                  lineHeight: 1.2,
                  fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                }}
              >
                They open it. Anywhere.
              </h3>
              <p
                style={{
                  fontSize: isMobile ? '17px' : '19px',
                  lineHeight: 1.7,
                  color: '#4a6fa5',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                Maya opens it on her iPad. No IDE. No clone. Just clicks the link. The trail animates—she sees exactly what changed, then steps through it herself.
              </p>
            </div>

            <div
              style={{
                padding: isMobile ? '24px' : '32px',
                background: '#fff',
                borderRadius: '16px',
                border: `1px solid ${theme.colors.border}`,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: theme.colors.textTertiary,
                  marginBottom: '8px',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}>
                  Slack · #payments-team
                </div>
                <div style={{
                  padding: '14px 16px',
                  background: '#f7fcfd',
                  borderRadius: '12px 12px 12px 4px',
                  marginBottom: '12px',
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: theme.colors.text,
                    marginBottom: '6px',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  }}>
                    Fernando
                  </div>
                  <div style={{
                    fontSize: '15px',
                    color: theme.colors.text,
                    lineHeight: 1.5,
                    marginBottom: '10px',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  }}>
                    hey can you take a look — rate limit on /checkout, will this collide with your retry logic?
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    background: '#fff',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono, monospace)',
                    color: theme.colors.primary,
                    border: `1px solid ${theme.colors.border}`,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path d="M5 2.5L8 2.5C9.38071 2.5 10.5 3.61929 10.5 5V5C10.5 6.38071 9.38071 7.5 8 7.5H5C3.61929 7.5 2.5 6.38071 2.5 5V5C2.5 3.61929 3.61929 2.5 5 2.5Z" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M8 6.5L5 6.5C3.61929 6.5 2.5 7.61929 2.5 9V9C2.5 10.3807 3.61929 11.5 5 11.5H8C9.38071 11.5 10.5 10.3807 10.5 9V9C10.5 7.61929 9.38071 6.5 8 6.5Z" stroke="currentColor" strokeWidth="1.2"/>
                    </svg>
                    trail.principal.ai/rate-limit-fix
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: '13px',
                color: theme.colors.textTertiary,
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                fontStyle: 'italic',
              }}>
                Maya opens on iPad · No installation needed
              </div>
            </div>
          </motion.div>

          {/* Step 4: Note */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? '32px' : '80px',
              alignItems: 'center',
            }}
          >
            <div style={{ order: isMobile ? 1 : 2 }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '6px 14px',
                  background: `${theme.colors.primary}10`,
                  borderRadius: '999px',
                  color: theme.colors.primary,
                  fontSize: '13px',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                Step 4
              </div>
              <h3
                style={{
                  fontSize: isMobile ? '28px' : '36px',
                  fontWeight: '700',
                  color: '#1a2842',
                  marginBottom: '20px',
                  lineHeight: 1.2,
                  fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                }}
              >
                They drop a note. You ship.
              </h3>
              <p
                style={{
                  fontSize: isMobile ? '17px' : '19px',
                  lineHeight: 1.7,
                  color: '#4a6fa5',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                Her note appears in the trail. It lives there forever. You read it. Your agent reads it. You make the change. Ship with confidence.
              </p>
            </div>

            <div
              style={{
                order: isMobile ? 2 : 1,
                padding: isMobile ? '24px' : '32px',
                background: '#fff',
                borderRadius: '16px',
                border: `2px solid ${theme.colors.primary}`,
                boxShadow: `0 8px 24px ${theme.colors.primary}18`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: theme.colors.secondary,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  M
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.text, fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>Maya</div>
                  <div style={{ fontSize: '12px', color: theme.colors.textTertiary, fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>2 min ago</div>
                </div>
              </div>
              <div style={{
                fontSize: isMobile ? '15px' : '17px',
                lineHeight: 1.6,
                color: theme.colors.text,
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}>
                yes — we retry 3x on 4xx. easiest fix is on our side, we'll back off harder on 429.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
