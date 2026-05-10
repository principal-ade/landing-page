"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface CodeTrailsHeroProps {
  isMobile?: boolean;
}

export const CodeTrailsHero: React.FC<CodeTrailsHeroProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();

  return (
    <section
      style={{
        minHeight: '90vh',
        background: `radial-gradient(1100px 600px at 70% 8%, rgba(255,135,85,0.10), transparent 60%),
                     radial-gradient(900px 600px at 12% 90%, rgba(34,211,238,0.10), transparent 60%),
                     ${theme.colors.background}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Hero Content */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.05fr 1fr',
          gap: isMobile ? '56px' : '80px',
          alignItems: 'center',
          padding: isMobile ? '40px 24px 64px' : '64px 40px 96px',
          maxWidth: '1480px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Left: Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: theme.colors.primary,
                marginBottom: '24px',
              }}
            >
              Code · Trails
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                fontWeight: '700',
                lineHeight: 1.0,
                letterSpacing: '-0.04em',
                color: theme.colors.primary,
                margin: 0,
                fontSize: isMobile ? 'clamp(42px, 11vw, 64px)' : 'clamp(48px, 9.2vw, 120px)',
              }}
            >
              Ask about
              <br />
              your code.
              <br />
              <span
                style={{
                  color: theme.colors.text,
                  fontWeight: '400',
                  display: 'block',
                }}
              >
                Anyone can answer.
              </span>
            </h1>

            <p
              style={{
                marginTop: '32px',
                fontSize: isMobile ? '18px' : '22px',
                lineHeight: 1.5,
                color: theme.colors.text,
                maxWidth: '560px',
                fontWeight: '400',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            >
              One link. Walks itself. <strong>They drop a note.</strong>
            </p>

            <div
              style={{
                marginTop: '40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '16px',
              }}
            >
              <motion.a
                href="#get-started"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 32px',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  fontSize: '17px',
                  fontWeight: '600',
                  color: '#fff',
                  background: theme.colors.primary,
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: `0 4px 20px ${theme.colors.primary}38`,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                Make your first trail →
              </motion.a>

              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: theme.colors.textTertiary,
                }}
              >
                No signup<span style={{ color: theme.colors.accent, padding: '0 6px' }}>·</span>Works with Claude
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right: Visual */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '460px' : '580px',
          }}
        >
          {/* Code Window */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              position: 'absolute',
              top: '36px',
              left: 0,
              right: '36px',
              width: 'auto',
              zIndex: 2,
              background: '#0c1741',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              fontFamily: 'var(--font-mono, monospace)',
              color: 'rgba(255,255,255,0.92)',
            }}
          >
            {/* Title Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: '#131e54',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontSize: isMobile ? '11px' : '12px',
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              <div style={{ display: 'inline-flex', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
              </div>
              <span>payments/checkout.ts · trail/auth-flow</span>
            </div>

            {/* Code Body */}
            <div
              style={{
                padding: '18px 0',
                fontSize: isMobile ? '12px' : '13.5px',
                lineHeight: 1.7,
              }}
            >
              {[
                { ln: 38, code: '<span style="color:#c8a2ff;">function</span> <span style="color:#82d4ff;">verifySession</span><span style="color:rgba(255,255,255,0.7);">(token) {</span>' },
                { ln: 39, code: '  <span style="color:#c8a2ff;">if</span> <span style="color:rgba(255,255,255,0.7);">(!token)</span> <span style="color:#c8a2ff;">return</span> <span style="color:#c8a2ff;">null</span><span style="color:rgba(255,255,255,0.7);">;</span>' },
                { ln: 40, code: '  <span style="color:#c8a2ff;">const</span> claims = <span style="color:#82d4ff;">decode</span><span style="color:rgba(255,255,255,0.7);">(token);</span>' },
                { ln: 41, code: '  <span style="color:#c8a2ff;">if</span> <span style="color:rgba(255,255,255,0.7);">(claims.exp &lt;</span> <span style="color:#82d4ff;">now</span><span style="color:rgba(255,255,255,0.7);">()) {</span>', hl: true },
                { ln: 42, code: '    <span style="color:#c8a2ff;">return</span> <span style="color:#c8a2ff;">null</span><span style="color:rgba(255,255,255,0.7);">;</span> <span style="color:rgba(255,255,255,0.42); font-style:italic;">// silently expire</span>', hl: true },
                { ln: 43, code: '  <span style="color:rgba(255,255,255,0.7);">}</span>' },
                { ln: 44, code: '  <span style="color:#c8a2ff;">return</span> claims<span style="color:rgba(255,255,255,0.7);">;</span>' },
                { ln: 45, code: '<span style="color:rgba(255,255,255,0.7);">}</span>' },
              ].map((line, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '40px 1fr' : '56px 1fr',
                    padding: isMobile ? '1px 12px' : '1px 16px',
                    whiteSpace: 'pre',
                    background: line.hl ? 'rgba(255,107,53,0.18)' : 'transparent',
                    boxShadow: line.hl ? `inset 3px 0 0 ${theme.colors.primary}` : 'none',
                  }}
                >
                  <span style={{ color: line.hl ? theme.colors.primary : 'rgba(255,255,255,0.3)', userSelect: 'none', textAlign: 'right', paddingRight: '16px' }}>
                    {line.ln}
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: line.code }} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Trail SVG Overlay */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 3,
              overflow: 'visible',
            }}
            viewBox="0 0 720 580"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M 36 18 C 240 18, 200 200, 360 200 S 620 380, 540 500"
              fill="none"
              stroke="#14b8a6"
              strokeWidth={3}
              strokeDasharray="6 8"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, delay: 0.3, ease: 'easeInOut' }}
            />
            {[
              { cx: 36, cy: 18, delay: 0.6 },
              { cx: 360, cy: 200, delay: 1.6 },
              { cx: 540, cy: 500, delay: 2.6 },
            ].map((node, i) => (
              <motion.g
                key={i}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: node.delay }}
                style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
              >
                <circle cx={node.cx} cy={node.cy} r={18} fill="rgba(20,184,166,0.18)" />
                <circle cx={node.cx} cy={node.cy} r={11} fill="#14b8a6" stroke="rgba(20,184,166,0.35)" strokeWidth={6} />
                <text
                  x={node.cx}
                  y={node.cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '10px',
                    fill: '#fff',
                    fontWeight: '700',
                  }}
                >
                  {i + 1}
                </text>
              </motion.g>
            ))}
          </svg>

          {/* Sticky Note */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotate: -1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
            transition={{ duration: 0.5, delay: 3.2 }}
            style={{
              position: 'absolute',
              right: isMobile ? '0' : '16px',
              bottom: '12px',
              zIndex: 4,
              background: theme.colors.surface,
              color: theme.colors.text,
              padding: isMobile ? '16px' : '20px 22px',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              border: `1px solid ${theme.colors.border}`,
              maxWidth: isMobile ? '220px' : '280px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                color: theme.colors.textTertiary,
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: theme.colors.secondary,
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                M
              </span>
              <span>Maya · 2 min ago</span>
            </div>
            <div style={{ fontSize: isMobile ? '14px' : '16px', lineHeight: 1.45, color: theme.colors.text }}>
              yes — we retry 3x on 4xx. easiest fix is on our side.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
