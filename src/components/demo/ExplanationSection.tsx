'use client';

import React from 'react';
import { Bot, ChevronDown } from 'lucide-react';
import { Logo } from '@principal-ai/logo-component';

export function ExplanationSection() {
  return (
    <div style={{
      height: 'calc(100vh - 70px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '48px',
      paddingTop: '120px',
      scrollSnapAlign: 'start',
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
            <Logo width={48} height={48} color="#07c0ca" />
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
          <div style={{ height: '56px', marginBottom: '16px', paddingBottom: '10px', color: '#07c0ca', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
            <Bot size={32} />
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
            <img src="/otel-logo.png" alt="OpenTelemetry" width={32} height={32} />
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
        marginTop: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#07c0ca',
      }}>
        <p style={{
          fontSize: '14px',
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
          <ChevronDown size={36} />
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
