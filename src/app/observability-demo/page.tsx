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

export default function ObservabilityDemoPage() {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const [spans, setSpans] = useState<CapturedSpan[]>([]);
  const [providerReady, setProviderReady] = useState(false);
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
        {/* Left Panel: Trace Waterfall */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: isMobile ? '50vh' : 'auto',
          borderRight: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: isMobile ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          overflow: 'hidden',
        }}>
          <WaterfallTraceView spans={spans} onClear={handleClearSpans} />
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
