"use client";

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsGetStartedFinalProps {
  isMobile?: boolean;
}

export const CodeTrailsGetStartedFinal: React.FC<CodeTrailsGetStartedFinalProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [copied, setCopied] = React.useState(false);

  const skillCommand = '@principal-ade/code-trail';

  const handleCopy = () => {
    navigator.clipboard.writeText(skillCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="get-started"
      ref={ref}
      style={{
        background: `linear-gradient(180deg, #fff 0%, #f7fcfd 100%)`,
        padding: isMobile ? '100px 24px' : '140px 40px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? '56px' : '64px',
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? 'clamp(36px, 8vw, 48px)' : 'clamp(48px, 6vw, 64px)',
              fontWeight: '700',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              color: '#1a2842',
              margin: '0 auto 20px',
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            }}
          >
            Start in <span style={{ color: theme.colors.primary }}>30 seconds.</span>
          </h2>
          <p
            style={{
              fontSize: isMobile ? '17px' : '20px',
              lineHeight: 1.6,
              color: theme.colors.textSecondary,
              maxWidth: '700px',
              margin: '0 auto',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            Open Claude. Paste this. Done.
          </p>
        </motion.div>

        {/* Copy-Paste Command */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            position: 'relative',
            maxWidth: '700px',
            margin: '0 auto 64px',
          }}
        >
          <div
            style={{
              background: '#0c1741',
              borderRadius: '16px',
              padding: isMobile ? '32px 24px' : '40px 40px',
              border: `2px solid ${theme.colors.primary}`,
              boxShadow: `0 20px 60px ${theme.colors.primary}20`,
              position: 'relative',
              overflow: 'hidden',
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
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Label */}
              <div
                style={{
                  fontSize: isMobile ? '12px' : '13px',
                  fontWeight: '500',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '16px',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                Install the skill
              </div>

              {/* Command */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: isMobile ? '18px 20px' : '20px 24px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <code
                  style={{
                    flex: 1,
                    fontSize: isMobile ? '16px' : '20px',
                    fontWeight: '500',
                    color: '#fff',
                    fontFamily: 'var(--font-mono, monospace)',
                    wordBreak: 'break-all',
                  }}
                >
                  {skillCommand}
                </code>
                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  style={{
                    padding: isMobile ? '10px 20px' : '12px 24px',
                    background: copied ? theme.colors.primary : '#fff',
                    color: copied ? '#fff' : '#0c1741',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: isMobile ? '14px' : '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    whiteSpace: 'nowrap',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </motion.button>
              </div>

              {/* Steps */}
              <div
                style={{
                  marginTop: '28px',
                  fontSize: isMobile ? '14px' : '15px',
                  lineHeight: 1.8,
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: theme.colors.primary, fontWeight: '600' }}>1.</span> Open Claude Code or any Claude interface
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ color: theme.colors.primary, fontWeight: '600' }}>2.</span> Paste the command above
                </div>
                <div>
                  <span style={{ color: theme.colors.primary, fontWeight: '600' }}>3.</span> Start making trails
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Secondary Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '12px' : '20px',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: isMobile ? '56px' : '72px',
          }}
        >
          {[
            { label: 'Read the docs', href: 'https://docs.principal-ade.com/code-trails' },
            { label: 'View on GitHub', href: 'https://github.com/principalstudio/code-trails' },
            { label: 'Join Discord', href: 'https://discord.gg/principal-ai' },
          ].map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              whileHover={{ color: theme.colors.primary }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize: isMobile ? '15px' : '16px',
                fontWeight: '500',
                color: theme.colors.text,
                textDecoration: 'none',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                cursor: 'pointer',
              }}
            >
              {link.label} →
            </motion.a>
          ))}
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            textAlign: 'center',
            padding: isMobile ? '32px 20px' : '40px 40px',
            background: 'rgba(0,0,0,0.02)',
            borderRadius: '16px',
            borderLeft: `3px solid ${theme.colors.primary}`,
          }}
        >
          <p
            style={{
              fontSize: isMobile ? '15px' : '16px',
              lineHeight: 1.7,
              color: theme.colors.textSecondary,
              margin: 0,
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              fontStyle: 'italic',
            }}
          >
            Built by engineers who got tired of explaining code over seventeen Slack messages.
            <br />
            Now we just send a trail.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
