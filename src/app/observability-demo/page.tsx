'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { initializeTelemetryProvider } from '@/components/demo/telemetry-provider';
import { processTrace, preloadSchematic } from '@/components/demo/trace-orchestration';
import type { RegisteredTrace, OtelExportTraceServiceRequest, VersionSnapshot } from '@principal-ai/principal-view-core';
import { ExplanationSection } from '@/components/demo/ExplanationSection';
import { BacklogBackgroundSection } from '@/components/demo/BacklogBackgroundSection';
import { DemoExplanationSection } from '@/components/demo/DemoExplanationSection';

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

// Dynamic import for WaterfallTraceView to avoid SSR issues with panel packages
const WaterfallTraceView = dynamic(
  () => import('@/components/demo/WaterfallTraceView'),
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
        Loading Trace View...
      </div>
    ),
  }
);

export default function ObservabilityDemoPage() {
  const [registeredTraces, setRegisteredTraces] = useState<RegisteredTrace[]>([]);
  const [schematics, setSchematics] = useState<VersionSnapshot[]>([]);
  const [providerReady, setProviderReady] = useState(false);
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

  // Fetch schematics on mount for the Schematics tab
  useEffect(() => {
    const fetchSchematics = async () => {
      const schematicEndpoints = [
        '/api/schematics/kanban-panel',
        '/api/schematics/backlog-core',
      ];

      const loadedSchematics: VersionSnapshot[] = [];

      for (const endpoint of schematicEndpoints) {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            const schematic: VersionSnapshot = await response.json();
            loadedSchematics.push(schematic);
            console.log(`[Demo] Schematic loaded from ${endpoint}:`, {
              storyboards: schematic.storyboards?.length || 0,
            });
          }
        } catch (error) {
          console.error(`[Demo] Failed to fetch schematic from ${endpoint}:`, error);
        }
      }

      if (loadedSchematics.length > 0) {
        setSchematics(loadedSchematics);
      }
    };
    fetchSchematics();
  }, []);

  // Initialize telemetry provider on mount
  useEffect(() => {
    // Preload schematic for faster first trace processing
    preloadSchematic().catch(console.error);

    // Pass no-op for span callback since we only use complete traces now
    cleanupRef.current = initializeTelemetryProvider(() => {}, handleTraceComplete);
    setProviderReady(true);

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [handleTraceComplete]);

  // Clear all traces
  const handleClearTraces = () => {
    setRegisteredTraces([]);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: '#1a1c1e',
      overflowY: 'auto',
      height: 'calc(100vh - 70px)',
      scrollSnapType: 'y mandatory',
    }}>
      {/* Main Content */}
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
      }}>
        {/* Explanation Section */}
        <ExplanationSection />

        {/* Demo Explanation Section */}
        <DemoExplanationSection />

        {/* Backlog Background Section */}
        <BacklogBackgroundSection />

        {/* Backlog Panel Section */}
        <div
          id="kanban-section"
          style={{
            height: 'calc(100vh - 70px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            scrollSnapAlign: 'start',
          }}
        >
          {providerReady && <KanbanPanelWrapper />}
        </div>

        {/* Traditional Monitoring Section */}
        <div style={{
          height: 'calc(100vh - 70px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          scrollSnapAlign: 'start',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <div style={{
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h2 style={{
              fontSize: '24px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: '#ffffff',
              margin: 0,
              textAlign: 'center',
            }}>
              Traditional Monitoring
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: 0,
              marginTop: '8px',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
            }}>
              Standard trace view - technical span data without business context
            </p>
          </div>
          <WaterfallTraceView traces={registeredTraces} onClear={handleClearTraces} />
        </div>

        {/* Story-based Monitoring Section */}
        <div style={{
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          height: 'calc(100vh - 70px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          scrollSnapAlign: 'start',
          background: 'rgb(10, 10, 10)',
        }}>
          <div style={{
            padding: '16px',
            background: 'rgba(0, 194, 255, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h2 style={{
              fontSize: '24px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: '#00C2FF',
              margin: 0,
              textAlign: 'center',
            }}>
              Story-based Monitoring
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: 0,
              marginTop: '8px',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
            }}>
              Traces matched against business scenarios
            </p>
          </div>
          <div style={{ maxWidth: '1400px', width: '100%', height: '100%', margin: '0 auto', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <TraceListPanelWrapper
              traces={registeredTraces}
              schematics={schematics}
              onClear={handleClearTraces}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
