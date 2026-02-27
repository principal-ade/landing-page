'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  initializeTelemetryProvider,
  type CapturedSpan,
} from '@/components/demo/telemetry-provider';
import { WaterfallTraceView } from '@/components/demo/WaterfallTraceView';
import { processTrace, preloadSchematic } from '@/components/demo/trace-orchestration';
import type { RegisteredTrace, OtelExportTraceServiceRequest, VersionSnapshot } from '@principal-ai/principal-view-core';

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

// Dynamic import for TraceListPanel wrapper
const TraceListPanelWrapper = dynamic(
  () => import('@/components/demo/TraceListPanelWrapper'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#00C2FF',
        fontFamily: 'Inter, sans-serif',
      }}>
        Loading Trace Panel...
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
  const [registeredTraces, setRegisteredTraces] = useState<RegisteredTrace[]>([]);
  const [schematics, setSchematics] = useState<VersionSnapshot[]>([]);
  const [providerReady, setProviderReady] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('raw');
  const cleanupRef = useRef<(() => void) | null>(null);

  // Handle incoming OTLP trace - process through orchestrator
  const handleTraceComplete = useCallback(async (otlpTrace: OtelExportTraceServiceRequest) => {
    try {
      console.log('[Demo] Processing trace through orchestrator');
      const registered = await processTrace(otlpTrace);
      setRegisteredTraces(prev => [registered, ...prev].slice(0, 50)); // Keep last 50 traces
      console.log('[Demo] Trace processed:', {
        traceId: registered.traceId,
        scenarioMatches: registered.scenarioMatches.length,
        storyboardMatches: registered.storyboardMatches.length,
        unmatchedSpans: registered.unmatchedSpans.spans.length,
      });
    } catch (error) {
      console.error('[Demo] Failed to process trace:', error);
    }
  }, []);

  // Fetch schematic on mount for the Schematics tab
  useEffect(() => {
    const fetchSchematic = async () => {
      try {
        const response = await fetch('/api/schematics/kanban-panel');
        if (response.ok) {
          const schematic: VersionSnapshot = await response.json();
          setSchematics([schematic]);
          console.log('[Demo] Schematic loaded for display:', {
            storyboards: schematic.storyboards?.length || 0,
          });
        }
      } catch (error) {
        console.error('[Demo] Failed to fetch schematic:', error);
      }
    };
    fetchSchematic();
  }, []);

  // Initialize telemetry provider on mount
  useEffect(() => {
    const handleSpan = (span: CapturedSpan) => {
      setSpans(prev => [span, ...prev].slice(0, 100)); // Keep last 100 spans
    };

    // Preload schematic for faster first trace processing
    preloadSchematic().catch(console.error);

    cleanupRef.current = initializeTelemetryProvider(handleSpan, handleTraceComplete);
    setProviderReady(true);

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [handleTraceComplete]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Clear all spans and traces
  const handleClearSpans = () => {
    setSpans([]);
  };

  const handleClearTraces = () => {
    setRegisteredTraces([]);
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
          {/* View Mode Switch */}
          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.3)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <button
              onClick={() => setViewMode('raw')}
              style={{
                flex: 1,
                padding: '16px 16px',
                fontSize: '18px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                border: 'none',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: viewMode === 'raw' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: viewMode === 'raw' ? '#ffffff' : '#666',
              }}
            >
              Traditional Monitoring
            </button>
            <button
              onClick={() => setViewMode('principal')}
              style={{
                flex: 1,
                padding: '16px 16px',
                fontSize: '18px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: viewMode === 'principal' ? 'rgba(0, 194, 255, 0.1)' : 'transparent',
                color: viewMode === 'principal' ? '#00C2FF' : '#666',
              }}
            >
              Story-based Monitoring
            </button>
          </div>

          {/* View Content */}
          {viewMode === 'raw' ? (
            <WaterfallTraceView spans={spans} onClear={handleClearSpans} />
          ) : (
            <TraceListPanelWrapper
              traces={registeredTraces}
              schematics={schematics}
              onClear={handleClearTraces}
            />
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
