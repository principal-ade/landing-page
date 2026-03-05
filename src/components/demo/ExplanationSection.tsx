'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '@principal-ade/industry-theme';
import { FeatureCarousel } from './FeatureCarousel';

export function ExplanationSection() {
  const { theme } = useTheme();

  return (
    <div style={{
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      height: 'calc(100vh - 70px)',
      borderBottom: `1px solid ${theme.colors.border}`,
      scrollSnapAlign: 'start',
      background: `linear-gradient(180deg, ${theme.colors.backgroundSecondary} 0%, ${theme.colors.background} 100%)`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grid layer with radial fade */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${theme.colors.primary}14 1px, transparent 1px),
            linear-gradient(90deg, ${theme.colors.primary}14 1px, transparent 1px)
          `,
          backgroundSize: '300px 300px',
          backgroundPosition: '50% calc(50% + 5px)',
          maskImage: 'radial-gradient(ellipse 70% 60% at center, black 0%, black 50%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at center, black 0%, black 50%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Subtle circular glow underneath */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120%',
          height: '120%',
          background: `radial-gradient(circle at center, ${theme.colors.primary}10 0%, transparent 40%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
        transform: 'translateY(-80px)',
      }}>
      <p style={{
        fontSize: theme.fontSizes[2],
        fontWeight: theme.fontWeights.medium,
        fontFamily: theme.fonts.body,
        color: theme.colors.primary,
        margin: 0,
        marginBottom: '16px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}>
        Story-based Monitoring
      </p>

      <h1 style={{
        fontSize: 'clamp(28px, 6vw, 48px)',
        fontWeight: theme.fontWeights.semibold,
        fontFamily: theme.fonts.body,
        color: theme.colors.text,
        margin: 0,
        marginBottom: '24px',
        textAlign: 'center',
        maxWidth: '800px',
        lineHeight: 1.2,
      }}>
        Craft Traces that tell a story
      </h1>

      <FeatureCarousel />
      </div>

      {/* Learn More - positioned at bottom */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: theme.colors.primary,
        zIndex: 2,
      }}>
        <p style={{
          fontSize: theme.fontSizes[4],
          fontFamily: theme.fonts.body,
          margin: 0,
          marginBottom: '8px',
        }}>
          Learn More
        </p>
        <div
          onClick={() => {
            const el = document.getElementById('demo-explanation-section');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          style={{
            animation: 'bounce 2s ease-in-out infinite',
            cursor: 'pointer',
          }}
        >
          <ChevronDown size={48} />
        </div>
        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(6px); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default ExplanationSection;
