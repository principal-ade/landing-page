'use client';

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Footer } from '@/components/Footer';

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

interface TelemetryEvent {
  id: string;
  type: string;
  source: string;
  timestamp: number;
  payload: any;
}

export default function ObservabilityDemoPage() {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const [events, setEvents] = useState<TelemetryEvent[]>([]);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Handle events from the Kanban panel
  const handlePanelEvent = useCallback((event: any) => {
    const telemetryEvent: TelemetryEvent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: event.type,
      source: event.source,
      timestamp: event.timestamp,
      payload: event.payload,
    };
    setEvents(prev => [telemetryEvent, ...prev].slice(0, 50)); // Keep last 50 events
  }, []);

  // Clear all events
  const handleClearEvents = useCallback(() => {
    setEvents([]);
  }, []);

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
          Interact with the Kanban board to generate telemetry events
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
          <KanbanPanelWrapper onEvent={handlePanelEvent} />
        </div>

        {/* Right Panel: Event Log (Placeholder for TraceList) */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: isMobile ? '50vh' : 'auto',
          overflow: 'hidden',
        }}>
          {/* Event Log Header */}
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
                Event Log
              </h2>
              <span style={{
                fontSize: '12px',
                color: '#94a3b8',
                fontFamily: 'Inter, sans-serif',
              }}>
                {events.length} events captured
              </span>
            </div>
            <button
              onClick={handleClearEvents}
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

          {/* Event List */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px',
          }}>
            {events.length === 0 ? (
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
                  No events yet. Interact with the Kanban board to generate telemetry.
                </p>
                <p style={{ fontSize: '12px', margin: '8px 0 0 0', color: '#555' }}>
                  Try selecting a task, dragging it to another column, or using the search.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {events.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#00C2FF',
                        fontFamily: 'Fira Code, monospace',
                      }}>
                        {event.type}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: '#666',
                        fontFamily: 'Fira Code, monospace',
                      }}>
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#94a3b8',
                      fontFamily: 'Fira Code, monospace',
                      background: 'rgba(0, 0, 0, 0.2)',
                      padding: '8px',
                      borderRadius: '4px',
                      overflow: 'auto',
                      maxHeight: '100px',
                    }}>
                      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {JSON.stringify(event.payload, null, 2)}
                      </pre>
                    </div>
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
