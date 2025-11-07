"use client";

import { motion } from "framer-motion";

export function LivingDocumentationSection() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <div
      style={{
        padding: '80px 20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '64px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Left - Animated Folder Icon */}
        <motion.div
          style={{
            flex: '0 0 300px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            order: 1,
            position: 'relative',
            height: '300px',
          }}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Glow effect */}
          <motion.div
            style={{
              position: 'absolute',
              inset: '0',
              borderRadius: '50%',
              filter: 'blur(60px)',
              background: '#00C2FF',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Folder icon with breathing */}
          <motion.div
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <svg
              width="200"
              height="200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00C2FF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              <motion.circle
                cx="12"
                cy="13"
                r="3"
                fill="#00C2FF"
                fillOpacity="0.3"
                animate={{
                  r: [2, 4, 2],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </svg>
          </motion.div>

          {/* Orbital particles */}
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#00C2FF',
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [
                  0,
                  Math.cos((angle * Math.PI) / 180) * 80,
                  0,
                ],
                y: [
                  0,
                  Math.sin((angle * Math.PI) / 180) * 80,
                  0,
                ],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.5,
              }}
            />
          ))}
        </motion.div>

        {/* Right - Content */}
        <motion.div
          style={{
            flex: '1 1 500px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            order: 2,
          }}
          {...fadeIn}
        >
          <h2
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: '700',
              color: '#ffffff',
              lineHeight: '1.2',
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              margin: '0',
            }}
          >
            <span style={{ whiteSpace: 'nowrap' }}>Living Documentation</span> is the Key to{' '}
            <span style={{ whiteSpace: 'nowrap' }}>Context Engineering</span>
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              color: '#d1d5db',
              lineHeight: '1.6',
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            <p style={{ margin: '0' }}>
              Every other tool stores context in the cloud. We store it in Git.{' '}
              <span style={{ color: '#ffffff' }}>
                That's not a feature difference. It's architectural.
              </span>
            </p>
            <p style={{ margin: '0' }}>
              And it means we eliminate third-party tool costs while making context version-controlled
              and agent-accessible.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
