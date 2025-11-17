"use client";

import { motion } from "framer-motion";

export function PrincipalFolder() {
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
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '48px',
      }}
    >
      {/* Headline */}
      <motion.div
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
        {...fadeIn}
      >
        <h2
          style={{
            fontSize: 'clamp(1.75rem, 5vw, 3.75rem)',
            fontWeight: '700',
            margin: '0',
            color: '#ffffff',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            lineHeight: '1.2',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          The{' '}
          <span
            style={{
              color: '#00C2FF',
              fontFamily: 'monospace',
            }}
          >
            .principalMD/
          </span>{' '}
          Folder
        </h2>
        <p
          style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
            color: '#9ca3af',
            margin: '0',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Your repo's living documentation + reasoning hub
        </p>
      </motion.div>

      {/* File Tree */}
      <motion.div
        style={{
          backgroundColor: 'rgba(3, 7, 18, 0.8)',
          border: '1px solid #1f2937',
          borderRadius: '12px',
          padding: '40px',
          width: '100%',
          maxWidth: '800px',
          fontFamily: 'monospace',
          fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
          lineHeight: '1.8',
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div style={{ color: '#00C2FF' }}>repo-root/</div>
        <div style={{ color: '#9ca3af', paddingLeft: '20px' }}>
          ├── <span style={{ color: '#00C2FF' }}>src/</span>
        </div>
        <div style={{ color: '#9ca3af', paddingLeft: '20px' }}>
          ├── <span style={{ color: '#00C2FF' }}>tests/</span>
        </div>
        <div style={{ color: '#9ca3af', paddingLeft: '20px' }}>
          └── <span style={{ color: '#00C2FF' }}>.principalMD/</span>
        </div>
        <div style={{ color: '#9ca3af', paddingLeft: '60px' }}>
          ├── <span style={{ color: '#00C2FF' }}>spec.md</span>
          <span style={{ color: '#6b7280' }}>{'\u00A0\u00A0\u00A0\u00A0'}# Why features exist</span>
        </div>
        <div style={{ color: '#9ca3af', paddingLeft: '60px' }}>
          ├── <span style={{ color: '#00C2FF' }}>map.md</span>
          <span style={{ color: '#6b7280' }}>{'\u00A0\u00A0\u00A0\u00A0\u00A0'}# How components connect</span>
        </div>
        <div style={{ color: '#9ca3af', paddingLeft: '60px' }}>
          ├── <span style={{ color: '#00C2FF' }}>policies/</span>
          <span style={{ color: '#6b7280' }}>{'\u00A0\u00A0\u00A0\u00A0'}# What's safe and compliant</span>
        </div>
        <div style={{ color: '#9ca3af', paddingLeft: '60px' }}>
          └── <span style={{ color: '#00C2FF' }}>decisions/</span>
          <span style={{ color: '#6b7280' }}>{'\u00A0\u00A0'}# Who chose what, when</span>
        </div>
        <div style={{ color: '#9ca3af', paddingLeft: '20px' }}>
          └── <span style={{ color: '#00C2FF' }}>README.md</span>
        </div>
      </motion.div>

      {/* Bottom Tagline */}
      <motion.div
        style={{
          textAlign: 'center',
          fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
          color: '#d1d5db',
          letterSpacing: '-0.02em',
          fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Version-controlled <span style={{ color: '#6b7280' }}>•</span> Machine-readable <span style={{ color: '#6b7280' }}>•</span> Always current
      </motion.div>
    </div>
  );
}
