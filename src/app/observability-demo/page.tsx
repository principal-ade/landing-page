'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Footer } from '@/components/Footer';
import {
  initializeTelemetryProvider,
  type CapturedSpan,
} from '@/components/demo/telemetry-provider';

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

interface DisplaySpan extends CapturedSpan {
  id: string;
}

export default function ObservabilityDemoPage() {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const [spans, setSpans] = useState<DisplaySpan[]>([]);
  const [providerReady, setProviderReady] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Initialize telemetry provider on mount
  useEffect(() => {
    const handleSpan = (span: CapturedSpan) => {
      const displaySpan: DisplaySpan = {
        ...span,
        id: `${span.traceId}-${span.spanId}`,
      };
      setSpans(prev => [displaySpan, ...prev].slice(0, 100)); // Keep last 100 spans
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
  const handleClearSpans = useCallback(() => {
    setSpans([]);
  }, []);

  // Format duration for display
  const formatDuration = (ms: number) => {
    if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // Get status color
  const getStatusColor = (code: number) => {
    switch (code) {
      case 0: return '#94a3b8'; // UNSET
      case 1: return '#10b981'; // OK
      case 2: return '#ef4444'; // ERROR
      default: return '#94a3b8';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#0a0e17',
    }}>
      {/* Header */}
      <div style={{
        padding: isMobile ? '16px' : '24px 32px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.3)',
      }}>
        <h1 style={{
          fontSize: isMobile ? '20px' : '24px',
          fontWeight: 600,
          color: '#ffffff',
          margin: 0,
          fontFamily: 'Inter, sans-serif',
        }}>
          Observability Demo
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#94a3b8',
          margin: '8px 0 0 0',
          fontFamily: 'Inter, sans-serif',
        }}>
          Interact with the Kanban board to generate OpenTelemetry traces
        </p>
      </div>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        overflow: 'hidden',
      }}>
        {/* Left Panel: Kanban */}
        <div style={{
          flex: 1,
          minHeight: isMobile ? '50vh' : 'auto',
          borderRight: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: isMobile ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          overflow: 'hidden',
        }}>
          {providerReady && <KanbanPanelWrapper />}
        </div>

        {/* Right Panel: Trace Log */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: isMobile ? '50vh' : 'auto',
          overflow: 'hidden',
        }}>
          {/* Trace Log Header */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.2)',
          }}>
            <div>
              <h2 style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#ffffff',
                margin: 0,
                fontFamily: 'Inter, sans-serif',
              }}>
                OpenTelemetry Traces
              </h2>
              <span style={{
                fontSize: '12px',
                color: '#94a3b8',
                fontFamily: 'Inter, sans-serif',
              }}>
                {spans.length} spans captured
              </span>
            </div>
            <button
              onClick={handleClearSpans}
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

          {/* Span List */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px',
          }}>
            {spans.length === 0 ? (
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
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                  📊
                </div>
                <p style={{ fontSize: '14px', margin: 0 }}>
                  No traces yet. Interact with the Kanban board to generate telemetry.
                </p>
                <p style={{ fontSize: '12px', margin: '8px 0 0 0', color: '#555' }}>
                  Try dragging a task to another column, or creating a new task.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {spans.map((span) => (
                  <div
                    key={span.id}
                    style={{
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {/* Span Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: getStatusColor(span.status.code),
                        }} />
                        <span style={{
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#00C2FF',
                          fontFamily: 'Fira Code, monospace',
                        }}>
                          {span.name}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        color: '#84CC16',
                        fontFamily: 'Fira Code, monospace',
                      }}>
                        {formatDuration(span.duration)}
                      </span>
                    </div>

                    {/* Span IDs */}
                    <div style={{
                      fontSize: '10px',
                      color: '#666',
                      fontFamily: 'Fira Code, monospace',
                      marginBottom: '8px',
                    }}>
                      trace: {span.traceId.slice(0, 16)}... | span: {span.spanId.slice(0, 8)}
                      {span.parentSpanId && ` | parent: ${span.parentSpanId.slice(0, 8)}`}
                    </div>

                    {/* Events */}
                    {span.events.length > 0 && (
                      <div style={{
                        marginBottom: '8px',
                      }}>
                        <div style={{
                          fontSize: '11px',
                          color: '#94a3b8',
                          marginBottom: '4px',
                        }}>
                          Events:
                        </div>
                        <div style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '4px',
                        }}>
                          {span.events.map((event, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '11px',
                                padding: '2px 6px',
                                background: 'rgba(0, 194, 255, 0.1)',
                                border: '1px solid rgba(0, 194, 255, 0.2)',
                                borderRadius: '4px',
                                color: '#00C2FF',
                                fontFamily: 'Fira Code, monospace',
                              }}
                            >
                              {event.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Attributes */}
                    {Object.keys(span.attributes).length > 0 && (
                      <div style={{
                        fontSize: '11px',
                        color: '#94a3b8',
                        fontFamily: 'Fira Code, monospace',
                        background: 'rgba(0, 0, 0, 0.2)',
                        padding: '8px',
                        borderRadius: '4px',
                        overflow: 'auto',
                        maxHeight: '80px',
                      }}>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {JSON.stringify(span.attributes, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Phase 2 Notice */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 194, 255, 0.05)',
          }}>
            <p style={{
              fontSize: '12px',
              color: '#00C2FF',
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
            }}>
              Phase 2: TraceList panel with workflow matching coming soon
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
