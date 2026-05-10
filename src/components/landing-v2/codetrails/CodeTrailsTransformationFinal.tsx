"use client";

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsTransformationFinalProps {
  isMobile?: boolean;
}

export const CodeTrailsTransformationFinal: React.FC<CodeTrailsTransformationFinalProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      style={{
        background: `linear-gradient(180deg, #f7fcfd 0%, #fff 100%)`,
        padding: isMobile ? '100px 24px' : '140px 40px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
            Remember when asking for code feedback
            <br />
            <span style={{ color: theme.colors.primary }}>meant scheduling a meeting?</span>
          </h2>
        </motion.div>

        {/* The cost of asking */}
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
          <h3
            style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: '700',
              color: '#1a2842',
              marginBottom: isMobile ? '32px' : '40px',
              lineHeight: 1.3,
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            }}
          >
            The cost of asking for feedback was <span style={{ color: theme.colors.primary }}>high.</span>
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: isMobile ? '20px' : '28px',
            }}
          >
            {[
              { icon: '📅', title: 'Schedule time', text: 'Find 30 minutes in their calendar. Next week if you\'re lucky.' },
              { icon: '🎥', title: 'Record a Loom', text: 'Spend 20 minutes explaining context they might not need.' },
              { icon: '💻', title: 'Clone their branch', text: 'Set up their environment. Debug their dependencies. Wait.' },
              { icon: '📝', title: 'Write a doc', text: 'Screenshots. Diagrams. Hope they read it.' },
              { icon: '😤', title: 'Feel guilty', text: 'You\'re interrupting their flow. Again.' },
              { icon: '🤷', title: 'Ship in hope', text: 'Or don\'t ask at all. What could go wrong?' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                style={{
                  padding: isMobile ? '20px' : '24px',
                  background: '#f7fcfd',
                  borderRadius: '12px',
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <div style={{ fontSize: isMobile ? '32px' : '36px', marginBottom: '12px' }}>
                  {item.icon}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? '16px' : '17px',
                    fontWeight: '600',
                    color: theme.colors.text,
                    marginBottom: '8px',
                    fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? '14px' : '15px',
                    lineHeight: 1.5,
                    color: theme.colors.textSecondary,
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  }}
                >
                  {item.text}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* With Code Trails */}
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
          {/* Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-40%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '70%',
              height: '80%',
              background: `radial-gradient(ellipse, ${theme.colors.primary}12 0%, transparent 70%)`,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3
              style={{
                fontSize: isMobile ? '28px' : '40px',
                fontWeight: '700',
                color: '#1a2842',
                marginBottom: isMobile ? '32px' : '40px',
                lineHeight: 1.25,
                fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              }}
            >
              With Code Trails, asking is
              <br />
              <span style={{ color: theme.colors.primary }}>effortless.</span>
            </h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '16px' : '20px',
              maxWidth: '900px',
            }}>
              {[
                { step: '1', text: 'One click → trail created', subtext: 'Your agent did the work' },
                { step: '2', text: 'Copy link → send it', subtext: 'Slack, email, wherever' },
                { step: '3', text: 'They click → they see', subtext: 'File City, sequence, code, explanation' },
                { step: '4', text: 'They drop a note', subtext: '"Ship it" or "Try this instead"' },
                { step: '5', text: 'You ship', subtext: 'Total time: minutes. Not days.' },
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
                    padding: isMobile ? '18px 20px' : '24px 28px',
                    background: '#fff',
                    borderRadius: '12px',
                    border: `1px solid ${theme.colors.border}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    style={{
                      width: isMobile ? '44px' : '52px',
                      height: isMobile ? '44px' : '52px',
                      borderRadius: '50%',
                      background: theme.colors.primary,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: isMobile ? '18px' : '22px',
                      fontWeight: '700',
                      flexShrink: 0,
                      fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                    }}
                  >
                    {item.step}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: isMobile ? '17px' : '20px',
                        fontWeight: '600',
                        lineHeight: 1.4,
                        color: theme.colors.text,
                        fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                      }}
                    >
                      {item.text}
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? '14px' : '15px',
                        color: theme.colors.textSecondary,
                        marginTop: '4px',
                        fontFamily: 'var(--font-inter, Inter, sans-serif)',
                      }}
                    >
                      {item.subtext}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.8 }}
              style={{
                marginTop: isMobile ? '48px' : '64px',
                padding: isMobile ? '28px' : '36px',
                background: 'rgba(255,255,255,0.9)',
                borderRadius: '16px',
                borderLeft: `4px solid ${theme.colors.primary}`,
              }}
            >
              <p
                style={{
                  fontSize: isMobile ? '20px' : '28px',
                  fontWeight: '600',
                  fontStyle: 'italic',
                  color: '#1a2842',
                  lineHeight: 1.4,
                  margin: 0,
                  fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                }}
              >
                "The best builders don't want to code less. They want to understand more."
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
