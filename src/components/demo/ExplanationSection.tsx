'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Logo } from '@principal-ai/logo-component';

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
        justifyContent: 'flex-start',
        padding: '48px',
        paddingTop: '120px',
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
        Story Based Monitoring Demo
      </p>

      <h1 style={{
        fontSize: '48px',
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

      <div style={{
        marginTop: '64px',
        display: 'flex',
        gap: '64px',
      }}>
        <div style={{ textAlign: 'center', width: '240px' }}>
          <div style={{ height: '56px', marginBottom: '16px', color: '#07c0ca', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
            <Logo width={90} height={90} color="#07c0ca" />
          </div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            color: '#ffffff',
            margin: 0,
            marginBottom: '8px',
          }}>
            Story-based Dev
          </h3>
          <p style={{
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            color: '#6b7280',
            margin: 0,
            lineHeight: 1.5,
          }}>
            Design your systems expected behaviors first
          </p>
        </div>

        <div style={{ textAlign: 'center', width: '240px' }}>
          <div style={{ height: '56px', marginBottom: '16px', paddingBottom: '10px', color: '#07c0ca', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '12px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#13120a', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, position: 'relative' }}>
              <img src="/cursor-logo.svg" alt="Cursor" width={38} height={38} />
            </div>
            <div style={{ width: 58, height: 58, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-28px', transform: 'translateY(-3px)', zIndex: 3, position: 'relative' }}>
              <img src="/claude-logo.svg" alt="Claude" width={36} height={36} />
            </div>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-28px', zIndex: 1, position: 'relative' }}>
              <img src="/openai-logo.svg" alt="OpenAI Codex" width={38} height={38} />
            </div>
          </div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            color: '#ffffff',
            margin: 0,
            marginBottom: '8px',
          }}>
            AI Native Validation
          </h3>
          <p style={{
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            color: '#6b7280',
            margin: 0,
            lineHeight: 1.5,
          }}>
            Confirm agent code changes in development
          </p>
        </div>

        <div style={{ textAlign: 'center', width: '240px' }}>
          <div style={{ height: '56px', marginBottom: '16px', paddingBottom: '10px', color: '#07c0ca', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
            <img src="/otel-logo.png" alt="OpenTelemetry" width={54} height={54} />
          </div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            color: '#ffffff',
            margin: 0,
            marginBottom: '8px',
          }}>
            Built on OTel
          </h3>
          <p style={{
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            color: '#6b7280',
            margin: 0,
            lineHeight: 1.5,
          }}>
            Works with your existing OpenTelemetry setup
          </p>
        </div>
      </div>

      <div style={{
        marginTop: '140px',
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
          Try it yourself
        </p>
        <div
          onClick={() => {
            const el = document.getElementById('kanban-section');
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
