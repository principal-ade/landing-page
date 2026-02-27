'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  initializeTelemetryProvider,
  type CapturedSpan,
} from '@/components/demo/telemetry-provider';
import { WaterfallTraceView } from '@/components/demo/WaterfallTraceView';

// Dynamic import to avoid SSR issues with panel packages
const KanbanPanelWrapper = dynamic(
  () => import('@/components/demo/KanbanPanelWrapper'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#666',
        fontFamily: 'Inter, sans-serif',
      }}>
        Loading Kanban Panel...
      </div>
    ),
  }
);

type ViewMode = 'raw' | 'principal';

export default function ObservabilityDemoPage() {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const [spans, setSpans] = useState<CapturedSpan[]>([]);
  const [providerReady, setProviderReady] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('raw');
  const cleanupRef = useRef<(() => void) | null>(null);

  // Initialize telemetry provider on mount
  useEffect(() => {
    const handleSpan = (span: CapturedSpan) => {
      setSpans(prev => [span, ...prev].slice(0, 100)); // Keep last 100 spans
    };

    cleanupRef.current = initializeTelemetryProvider(handleSpan);
    setProviderReady(true);

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Clear all spans
  const handleClearSpans = () => {
    setSpans([]);
  };

  return (
    <div style={{
      height: 'calc(100vh - 70px)',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0e17',
      overflow: 'hidden',
    }}>
      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        overflow: 'hidden',
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        {/* Left Panel: Trace View */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: isMobile ? '50vh' : 'auto',
          borderRight: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: isMobile ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          overflow: 'hidden',
        }}>
          {/* View Mode Toggle */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{
              fontSize: '12px',
              color: '#666',
              fontFamily: 'Inter, sans-serif',
            }}>
              View:
            </span>
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '6px',
              padding: '2px',
            }}>
              <button
                onClick={() => setViewMode('raw')}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: viewMode === 'raw' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: viewMode === 'raw' ? '#ffffff' : '#666',
                }}
              >
                Raw Traces
              </button>
              <button
                onClick={() => setViewMode('principal')}
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: viewMode === 'principal' ? 'rgba(0, 194, 255, 0.2)' : 'transparent',
                  color: viewMode === 'principal' ? '#00C2FF' : '#666',
                }}
              >
                Principal AI
              </button>
            </div>
          </div>

          {/* View Content */}
          {viewMode === 'raw' ? (
            <WaterfallTraceView spans={spans} onClear={handleClearSpans} />
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              color: '#666',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px',
              }}>
                🚀
              </div>
              <p style={{
                fontSize: '16px',
                color: '#00C2FF',
                margin: 0,
                fontWeight: 500,
              }}>
                Principal AI View
              </p>
              <p style={{
                fontSize: '13px',
                color: '#666',
                margin: '8px 0 0 0',
              }}>
                TraceList panel integration coming soon
              </p>
            </div>
          )}
        </div>

        {/* Right Panel: Kanban */}
        <div style={{
          flex: 1,
          minHeight: isMobile ? '50vh' : 'auto',
          overflow: 'hidden',
        }}>
          {providerReady && <KanbanPanelWrapper />}
        </div>
      </main>
    </div>
  );
}
