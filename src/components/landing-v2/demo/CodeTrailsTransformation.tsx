"use client";

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsTransformationProps {
  isMobile?: boolean;
}

export const CodeTrailsTransformation: React.FC<CodeTrailsTransformationProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      style={{
        background: `linear-gradient(180deg, #f7fcfd 0%, #fff 100%)`,
        padding: isMobile ? '100px 24px' : '160px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Section Header */}
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
              fontSize: isMobile ? 'clamp(32px, 8vw, 44px)' : 'clamp(48px, 6vw, 64px)',
              fontWeight: '700',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              color: '#1a2842',
              margin: '0 auto 24px',
              maxWidth: '1000px',
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            }}
          >
            Remember when asking a simple question
            <br />
            <span style={{ color: theme.colors.primary }}>meant scheduling a meeting?</span>
          </h2>
          <p
            style={{
              fontSize: isMobile ? '18px' : '22px',
              lineHeight: 1.6,
              color: '#4a6fa5',
              maxWidth: '700px',
              margin: '0 auto',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            Those days are over.
          </p>
        </motion.div>

        {/* The old way - emotional pain */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            background: '#fff',
            borderRadius: '20px',
            padding: isMobile ? '40px 28px' : '60px 60px',
            marginBottom: isMobile ? '32px' : '48px',
            border: `2px solid ${theme.colors.border}`,
            boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              fontSize: isMobile ? '11px' : '12px',
              fontWeight: '600',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: theme.colors.textTertiary,
              marginBottom: '24px',
              fontFamily: 'var(--font-mono, monospace)',
            }}
          >
            The old way
          </div>

          <h3
            style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: '700',
              color: '#1a2842',
              marginBottom: isMobile ? '32px' : '48px',
              lineHeight: 1.3,
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            }}
          >
            You had a question about someone's code.
            <br />
            <span style={{ color: theme.colors.textSecondary, fontSize: isMobile ? '20px' : '26px' }}>
              Here's what you did:
            </span>
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
              gap: isMobile ? '20px' : '28px',
            }}
          >
            {[
              { icon: '📅', text: 'Found 30 minutes in their calendar. Next week.' },
              { icon: '💬', text: 'Sent 14 Slack messages asking them to explain.' },
              { icon: '💻', text: 'Cloned their branch. Waited for dependencies. Set up their environment.' },
              { icon: '🎥', text: 'Recorded a 8-minute Loom walking through your confusion.' },
              { icon: '😤', text: 'Felt guilty for interrupting them.' },
              { icon: '🤷', text: 'Gave up and guessed.' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: isMobile ? '16px' : '20px',
                  background: '#f7fcfd',
                  borderRadius: '12px',
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <div style={{ fontSize: isMobile ? '24px' : '28px', lineHeight: 1 }}>
                  {item.icon}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? '15px' : '17px',
                    lineHeight: 1.5,
                    color: theme.colors.text,
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  }}
                >
                  {item.text}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* The new way - liberation */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{
            background: `linear-gradient(135deg, ${theme.colors.primary}08 0%, rgba(34,211,238,0.08) 100%)`,
            borderRadius: '20px',
            padding: isMobile ? '40px 28px' : '60px 60px',
            border: `2px solid ${theme.colors.primary}`,
            boxShadow: `0 20px 60px ${theme.colors.primary}15`,
            position: 'relative',
          }}
        >
          {/* Glow effect */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              height: '100%',
              background: `radial-gradient(ellipse, ${theme.colors.primary}15 0%, transparent 70%)`,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                fontSize: isMobile ? '11px' : '12px',
                fontWeight: '600',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: theme.colors.primary,
                marginBottom: '24px',
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              With Code Trails
            </div>

            <h3
              style={{
                fontSize: isMobile ? '28px' : '40px',
                fontWeight: '700',
                color: '#1a2842',
                marginBottom: isMobile ? '32px' : '48px',
                lineHeight: 1.25,
                fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              }}
            >
              You send a link.
              <br />
              <span style={{ color: theme.colors.primary }}>They understand immediately.</span>
            </h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '16px' : '20px',
              maxWidth: '800px',
            }}>
              {[
                { step: '1', text: 'Your agent creates the trail. Automatic.' },
                { step: '2', text: 'You copy the link. Done.' },
                { step: '3', text: 'They click. See File City. Read the flow. Get it.' },
                { step: '4', text: 'They leave a note. "Ship it." Or "Try this instead."' },
                { step: '5', text: 'You both move on with your day.' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: isMobile ? '16px 20px' : '20px 28px',
                    background: '#fff',
                    borderRadius: '12px',
                    border: `1px solid ${theme.colors.border}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    style={{
                      width: isMobile ? '36px' : '44px',
                      height: isMobile ? '36px' : '44px',
                      borderRadius: '50%',
                      background: theme.colors.primary,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? '16px' : '20px',
                      fontWeight: '700',
                      flexShrink: 0,
                      fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                    }}
                  >
                    {item.step}
                  </div>
                  <div
                    style={{
                      fontSize: isMobile ? '16px' : '19px',
                      lineHeight: 1.5,
                      color: theme.colors.text,
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    }}
                  >
                    {item.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.8 }}
              style={{
                marginTop: isMobile ? '40px' : '56px',
                padding: isMobile ? '24px' : '32px',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '12px',
                borderLeft: `4px solid ${theme.colors.primary}`,
              }}
            >
              <p
                style={{
                  fontSize: isMobile ? '18px' : '24px',
                  fontWeight: '600',
                  fontStyle: 'italic',
                  color: '#1a2842',
                  lineHeight: 1.5,
                  margin: 0,
                  fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                }}
              >
                "This isn't just faster. It's frictionless."
              </p>
              <p
                style={{
                  fontSize: isMobile ? '14px' : '15px',
                  color: theme.colors.textSecondary,
                  marginTop: '12px',
                  marginBottom: 0,
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                — Every engineer who's used it
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
