"use client";

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsLiveDemoProps {
  isMobile?: boolean;
}

export const CodeTrailsLiveDemo: React.FC<CodeTrailsLiveDemoProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="see-it"
      ref={ref}
      style={{
        background: '#0c1741',
        padding: isMobile ? '100px 24px' : '160px 40px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '600px',
          height: '600px',
          background: `radial-gradient(circle, ${theme.colors.primary}20 0%, transparent 70%)`,
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? '60px' : '80px',
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
            Live demo
          </div>
          <h2
            style={{
              fontSize: isMobile ? 'clamp(36px, 8vw, 48px)' : 'clamp(48px, 6vw, 64px)',
              fontWeight: '700',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              color: '#fff',
              margin: '0 auto 24px',
              maxWidth: '900px',
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            }}
          >
            See a real Code Trail.
            <br />
            <span style={{ color: theme.colors.primary }}>Right now.</span>
          </h2>
          <p
            style={{
              fontSize: isMobile ? '17px' : '20px',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '700px',
              margin: '0 auto',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            This is how Principal AI built its own trail system.
            <br />
            Six markers. Click through them.
          </p>
        </motion.div>

        {/* Demo Container */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
            background: '#0a0f24',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Browser chrome */}
          <div
            style={{
              background: '#1a1f38',
              padding: isMobile ? '12px 16px' : '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
            </div>
            <div
              style={{
                flex: 1,
                background: '#0c1741',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: isMobile ? '11px' : '13px',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-mono, monospace)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M5 2.5L8 2.5C9.38071 2.5 10.5 3.61929 10.5 5V5C10.5 6.38071 9.38071 7.5 8 7.5H5C3.61929 7.5 2.5 6.38071 2.5 5V5C2.5 3.61929 3.61929 2.5 5 2.5Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M8 6.5L5 6.5C3.61929 6.5 2.5 7.61929 2.5 9V9C2.5 10.3807 3.61929 11.5 5 11.5H8C9.38071 11.5 10.5 10.3807 10.5 9V9C10.5 7.61929 9.38071 6.5 8 6.5Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              trail.principal.ai/trail-electron-app-tour
            </div>
          </div>

          {/* Iframe */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: isMobile ? '500px' : '700px',
              background: '#0a0f24',
            }}
          >
            <iframe
              src="https://app.principal-ade.com/trail/trail-electron-app-tour"
              style={{
                width: '100%',
                height: '100%',
                border: 0,
                display: 'block',
              }}
              loading="lazy"
              allow="clipboard-write"
              title="Code Trail live demo"
            />
          </div>
        </motion.div>

        {/* CTA below demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{
            textAlign: 'center',
            marginTop: isMobile ? '56px' : '72px',
          }}
        >
          <p
            style={{
              fontSize: isMobile ? '16px' : '18px',
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '24px',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
            }}
          >
            Ready to make your own?
          </p>
          <motion.a
            href="#get-started"
            whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: isMobile ? '16px 36px' : '20px 48px',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '600',
              color: '#0c1741',
              background: '#fff',
              borderRadius: '12px',
              textDecoration: 'none',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              boxShadow: '0 12px 28px rgba(255,255,255,0.1)',
              cursor: 'pointer',
            }}
          >
            Get started — it's free
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
