'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';

// Color palette
const NAVY = '#1a2842';
const BLUE_LIGHT = '#6b9bd1';
const ORANGE = '#ff6b35';

interface CodeTrailsValuePropBladeProps {
  isMobile?: boolean;
}

export function CodeTrailsValuePropBlade({ isMobile = false }: CodeTrailsValuePropBladeProps) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      style={{
        background: NAVY,
        padding: isMobile ? '80px 24px' : '120px 40px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Value Props - Three Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '16px' : '24px',
            marginBottom: isMobile ? '48px' : '64px',
          }}
        >
          {[
            {
              title: 'Understand',
              description: 'See what your agent touched. File City shows where, sequence shows how, code shows what.',
            },
            {
              title: 'Share',
              description: 'One link. No clone. No IDE. Anyone reviews—on their phone if they want.',
            },
            {
              title: 'Collaborate',
              description: 'They leave a note. It lives with the trail. Your agent can read it too.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(255,107,53,0.2)' }}
              style={{
                padding: isMobile ? '24px' : '28px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                border: `1px solid rgba(255,255,255,0.1)`,
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3
                style={{
                  fontSize: isMobile ? '20px' : '22px',
                  fontWeight: '700',
                  color: ORANGE,
                  marginBottom: '12px',
                  fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: isMobile ? '15px' : '16px',
                  lineHeight: 1.6,
                  color: BLUE_LIGHT,
                  margin: 0,
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '16px' : '20px',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: isMobile ? '48px' : '56px',
          }}
        >
          <motion.a
            href="#see-it"
            whileHover={{ scale: 1.03, boxShadow: `0 20px 40px ${ORANGE}66` }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: isMobile ? '18px 40px' : '22px 52px',
              fontSize: isMobile ? '17px' : '18px',
              fontWeight: '700',
              color: '#fff',
              background: ORANGE,
              borderRadius: '12px',
              textDecoration: 'none',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              boxShadow: `0 12px 28px ${ORANGE}40`,
              cursor: 'pointer',
            }}
          >
            See a live trail
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>

          <motion.a
            href="#get-started"
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            transition={{ duration: 0.2 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: isMobile ? '18px 40px' : '22px 52px',
              fontSize: isMobile ? '17px' : '18px',
              fontWeight: '600',
              color: '#fff',
              background: 'transparent',
              borderRadius: '12px',
              textDecoration: 'none',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              border: `2px solid rgba(255,255,255,0.2)`,
              cursor: 'pointer',
            }}
          >
            Get started — it's free
          </motion.a>
        </motion.div>

        {/* Frame.io positioning */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{
            textAlign: 'center',
            fontSize: isMobile ? '15px' : '17px',
            color: '#8ba3c7',
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            fontStyle: 'italic',
          }}
        >
          It's Frame.io for code. The new collaboration primitive for software development.
        </motion.p>
      </div>
    </section>
  );
}
