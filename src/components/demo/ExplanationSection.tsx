'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { FeatureCarousel } from './FeatureCarousel';

export function ExplanationSection() {
  return (
    <div style={{
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      height: 'calc(100vh - 70px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      scrollSnapAlign: 'start',
      background: 'radial-gradient(ellipse at center 40%, rgba(0, 194, 255, 0.1) 0%, transparent 50%), #0d1b2a',
    }}>
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
      <p style={{
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'Inter, sans-serif',
        color: '#07c0ca',
        margin: 0,
        marginBottom: '16px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}>
        Story-based Monitoring
      </p>

      <h1 style={{
        fontSize: 'clamp(28px, 6vw, 48px)',
        fontWeight: 600,
        fontFamily: 'Inter, sans-serif',
        color: '#ffffff',
        margin: 0,
        marginBottom: '24px',
        textAlign: 'center',
        maxWidth: '800px',
        lineHeight: 1.2,
      }}>
        Craft Traces that tell a story
      </h1>

      <FeatureCarousel />

      <div style={{
        marginTop: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#07c0ca',
      }}>
        <p style={{
          fontSize: '18px',
          fontFamily: 'Inter, sans-serif',
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
    </div>
  );
}

export default ExplanationSection;
