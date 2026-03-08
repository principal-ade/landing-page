'use client';

import React, { useState, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import type { RegisteredTrace } from '@principal-ai/principal-view-core';
import type { PanelEvent, PanelEventEmitter } from '@principal-ade/panel-framework-core';
import {
  TraceDetailsPanel,
  getSpansFromTrace,
  getRootSpan,
} from '@industry-theme/principal-view-panels';
import { ThemeProvider } from '@principal-ade/industry-theme';
import { TraceTape } from './TraceTape';

interface WaterfallTraceViewProps {
  traces: RegisteredTrace[];
  onClear: () => void;
}

/**
 * Create minimal panel context for TraceDetailsPanel
 */
function usePanelContext() {
  return useMemo(() => ({
    currentScope: {
      type: 'workspace' as const,
      workspace: { name: 'Demo', path: '/demo' },
    },
    slices: new Map(),
    getSlice: () => undefined,
    getWorkspaceSlice: () => undefined,
    getRepositorySlice: () => undefined,
    hasSlice: () => false,
    isSliceLoading: () => false,
    refresh: async () => {},
  }), []);
}

/**
 * Create minimal panel actions for TraceDetailsPanel
 */
function usePanelActions() {
  return useMemo(() => ({}), []);
}

/**
 * Create panel event emitter for TraceDetailsPanel
 */
function usePanelEvents(): PanelEventEmitter {
  return useMemo(() => {
    const listeners = new Map<string, Set<(event: PanelEvent) => void>>();
    return {
      emit: <T,>(event: PanelEvent<T>) => {
        const typeListeners = listeners.get(event.type);
        if (typeListeners) {
          typeListeners.forEach(listener => listener(event as PanelEvent));
        }
      },
      on: <T,>(type: string, handler: (event: PanelEvent<T>) => void) => {
        if (!listeners.has(type)) {
          listeners.set(type, new Set());
        }
        listeners.get(type)!.add(handler as (event: PanelEvent) => void);
        return () => {
          listeners.get(type)?.delete(handler as (event: PanelEvent) => void);
        };
      },
      off: <T,>(type: string, handler: (event: PanelEvent<T>) => void) => {
        listeners.get(type)?.delete(handler as (event: PanelEvent) => void);
      },
    };
  }, []);
}

function formatDuration(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
  if (ms < 1000) return `${ms.toFixed(1)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function WaterfallTraceView({ traces, onClear }: WaterfallTraceViewProps) {
  const [selectedTrace, setSelectedTrace] = useState<RegisteredTrace | null>(null);
  const [highlightedSpanId, setHighlightedSpanId] = useState<string | null>(null);
  const [highlightedTraceId, setHighlightedTraceId] = useState<string | null>(null);
  const [scrubberTime, setScrubberTime] = useState<number | null>(null);
  const [focusTraceId, setFocusTraceId] = useState<string | null>(null);
  const context = usePanelContext();
  const actions = usePanelActions();
  const events = usePanelEvents();

  // Find which trace contains a given span
  const findTraceForSpan = (spanId: string): string | null => {
    for (const trace of traces) {
      const spans = getSpansFromTrace(trace);
      if (spans.some(s => s.spanId === spanId)) {
        return trace.traceId;
      }
    }
    return null;
  };

  // Parse nanosecond timestamp to milliseconds
  const parseNanoTime = (nanoStr: string): number => {
    const nanos = BigInt(nanoStr);
    return Number(nanos / BigInt(1_000_000));
  };

  // Get the start time of a span
  const getSpanStartTime = (spanId: string): number | null => {
    for (const trace of traces) {
      const spans = getSpansFromTrace(trace);
      const span = spans.find(s => s.spanId === spanId);
      if (span) {
        return parseNanoTime(span.startTimeUnixNano);
      }
    }
    return null;
  };

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Trace List */}
      <div style={{
        width: selectedTrace ? '50%' : '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 0.2s ease',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.2)',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#ffffff',
              margin: 0,
              fontFamily: 'Inter, sans-serif',
            }}>
              Traces
            </h2>
          </div>
          <button
            onClick={onClear}
            style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: '#94a3b8',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            Clear
          </button>
        </div>

        {/* TraceTape */}
        <div style={{
          padding: '16px',
          paddingTop: '24px', // extra space for glow
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          flexShrink: 0,
          overflow: 'visible',
        }}>
          <TraceTape
            traces={traces}
            highlightedSpanId={highlightedSpanId ?? undefined}
            selectedTraceId={selectedTrace?.traceId ?? highlightedTraceId ?? undefined}
            focusTraceId={focusTraceId}
            onSpanHighlight={(spanId) => {
              setHighlightedSpanId(spanId);
              setHighlightedTraceId(spanId ? findTraceForSpan(spanId) : null);
              setScrubberTime(spanId ? getSpanStartTime(spanId) : null);
              setFocusTraceId(null); // Clear focus when scrubbing
            }}
          />
        </div>

        {/* Trace List */}
        <div style={{
          flex: 1,
          overflow: 'auto',
        }}>
          {traces.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#666',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
              padding: '40px',
            }}>
              <BarChart3 size={48} strokeWidth={1.5} color="#666" style={{ marginBottom: '16px' }} />
              <p style={{ fontSize: '14px', margin: 0 }}>
                No traces yet. Interact with the Kanban board to generate telemetry.
              </p>
              <p style={{ fontSize: '12px', margin: '8px 0 0 0', color: '#555' }}>
                Try dragging a task to another column, or clicking on a task.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {(() => {
                const sortedFiltered = [...traces]
                  .sort((a, b) => b.startTime - a.startTime)
                  .filter((trace) => scrubberTime === null || trace.startTime <= scrubberTime);
                const total = sortedFiltered.length;
                return sortedFiltered.map((trace, index) => (
                  <TraceRow
                    key={trace.traceId}
                    trace={trace}
                    index={total - index}
                    isSelected={selectedTrace?.traceId === trace.traceId}
                    isHighlighted={highlightedTraceId === trace.traceId}
                    onClick={() => {
                      const newTrace = selectedTrace?.traceId === trace.traceId ? null : trace;
                      setSelectedTrace(newTrace);
                      setFocusTraceId(newTrace?.traceId ?? null);
                    }}
                  />
                ));
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Trace Details Panel */}
      {selectedTrace && (
        <div style={{
          width: '50%',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}>
          <ThemeProvider>
            <TraceDetailsPanel
              selectedTrace={selectedTrace}
              context={context as any}
              actions={actions as any}
              events={events}
            />
          </ThemeProvider>
        </div>
      )}
    </div>
  );
}

function TraceRow({
  trace,
  index,
  isSelected,
  isHighlighted,
  onClick,
}: {
  trace: RegisteredTrace;
  index: number;
  isSelected: boolean;
  isHighlighted: boolean;
  onClick: () => void;
}) {
  const rootSpan = getRootSpan(trace);
  const spans = getSpansFromTrace(trace);
  const spanCount = spans.length;

  const getBackground = () => {
    if (isSelected) return 'rgba(255, 255, 255, 0.08)';
    if (isHighlighted) return 'rgba(59, 130, 246, 0.15)';
    return 'rgba(255, 255, 255, 0.02)';
  };

  const getBorderLeft = () => {
    if (isSelected) return '3px solid #3b82f6';
    if (isHighlighted) return '3px solid #60a5fa';
    return '1px solid rgba(255, 255, 255, 0.08)';
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: getBackground(),
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderLeft: getBorderLeft(),
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Trace Header */}
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            fontSize: '13px',
            fontWeight: 500,
            color: '#666',
            fontFamily: 'Fira Code, monospace',
            minWidth: '24px',
          }}>
            {index}
          </div>
          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#ffffff',
              fontFamily: 'Fira Code, monospace',
            }}>
              {rootSpan?.name || trace.name || 'Unknown'}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#666',
              fontFamily: 'Fira Code, monospace',
              marginTop: '2px',
            }}>
              {trace.traceId}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{
            fontSize: '14px',
            color: '#94a3b8',
            fontFamily: 'Inter, sans-serif',
          }}>
            {spanCount} spans
          </span>
          <span style={{
            fontSize: '15px',
            color: '#84CC16',
            fontFamily: 'Fira Code, monospace',
            fontWeight: 600,
          }}>
            {formatDuration(trace.duration)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default WaterfallTraceView;
