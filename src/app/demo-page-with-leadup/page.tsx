'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { initializeTelemetryProvider } from '@/components/demo/telemetry-provider';
import { processTrace, preloadSchematic } from '@/components/demo/trace-orchestration';
import type { RegisteredTrace, OtelExportTraceServiceRequest, VersionSnapshot } from '@principal-ai/principal-view-core';
import { ExplanationSection } from '@/components/demo/ExplanationSection';
import { BacklogBackgroundSection } from '@/components/demo/BacklogBackgroundSection';
import { DemoExplanationSectionMobile } from '@/components/demo/DemoExplanationSectionMobile';
import { DemoView } from '@/components/demo/DemoView';

export default function ObservabilityDemoPage() {
  const [registeredTraces, setRegisteredTraces] = useState<RegisteredTrace[]>([]);
  const [schematics, setSchematics] = useState<VersionSnapshot[]>([]);
  const [providerReady, setProviderReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Track window width for responsive rendering
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle incoming OTLP trace - process through orchestrator
  const handleTraceComplete = useCallback(async (otlpTrace: OtelExportTraceServiceRequest) => {
    try {
      console.log('[Demo] Processing trace through orchestrator');
      const registered = await processTrace(otlpTrace);
      setRegisteredTraces(prev => [registered, ...prev].slice(0, 50));
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

  // Fetch schematics on mount
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
              repositoryUrl: schematic.repositoryUrl,
              commitSha: schematic.commitSha,
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
    let mounted = true;

    const init = async () => {
      await preloadSchematic();

      if (!mounted) return;

      cleanupRef.current = initializeTelemetryProvider(() => {}, handleTraceComplete);
      setProviderReady(true);
    };

    init().catch(console.error);

    return () => {
      mounted = false;
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

  // Open demo view
  const handleStartDemo = () => {
    setIsDemoOpen(true);
  };

  // Close demo view
  const handleCloseDemo = () => {
    setIsDemoOpen(false);
  };

  return (
    <>
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
          <DemoExplanationSectionMobile showExpandedText={!isMobile} />

          {/* Backlog Background Section - starts the demo on click */}
          <BacklogBackgroundSection onStartTour={handleStartDemo} />
        </main>
      </div>

      {/* Fullscreen Demo View */}
      <DemoView
        isOpen={isDemoOpen}
        onClose={handleCloseDemo}
        schematics={schematics}
        providerReady={providerReady}
        registeredTraces={registeredTraces}
        onClearTraces={handleClearTraces}
      />
    </>
  );
}
