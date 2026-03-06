'use client';

import React, { useState } from 'react';
import { useTour } from './TourProvider';

/**
 * Debug panel that displays tour steps and allows navigation
 * Opens as a slide-out panel from the right side
 */
export function TourDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { steps, currentStepIndex, goToStep, isActive, start } = useTour();

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '44px',
          height: '44px',
          borderRadius: '8px',
          background: isOpen ? '#00C2FF' : 'rgba(0, 194, 255, 0.15)',
          border: '1px solid rgba(0, 194, 255, 0.3)',
          color: isOpen ? '#0a0e17' : '#00C2FF',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
        title="Toggle Tour Debug Panel"
        aria-label="Toggle Tour Debug Panel"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </button>

      {/* Side Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '360px',
          background: '#0d1520',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 9998,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 600,
              color: '#00C2FF',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Tour Debug
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                color: isActive ? '#4ade80' : 'rgba(255, 255, 255, 0.5)',
                fontWeight: 500,
              }}
            >
              {isActive ? 'Active' : 'Inactive'}
            </span>
            {!isActive && (
              <button
                onClick={start}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 500,
                  background: 'rgba(0, 194, 255, 0.15)',
                  border: '1px solid rgba(0, 194, 255, 0.3)',
                  borderRadius: '4px',
                  color: '#00C2FF',
                  cursor: 'pointer',
                }}
              >
                Start
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: '8px',
            }}
          >
            Step {isActive ? currentStepIndex + 1 : 0} of {steps.length}
          </div>
          <div
            style={{
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${isActive ? ((currentStepIndex + 1) / steps.length) * 100 : 0}%`,
                background: '#00C2FF',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '8px 0',
          }}
        >
          {steps.map((step, index) => {
            const isCurrent = isActive && index === currentStepIndex;
            const isPast = isActive && index < currentStepIndex;

            return (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: isCurrent ? 'rgba(0, 194, 255, 0.1)' : 'transparent',
                  border: 'none',
                  borderLeft: isCurrent
                    ? '3px solid #00C2FF'
                    : '3px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  {/* Step number */}
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isCurrent
                        ? '#00C2FF'
                        : isPast
                        ? 'rgba(74, 222, 128, 0.2)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: isCurrent
                        ? '#0a0e17'
                        : isPast
                        ? '#4ade80'
                        : 'rgba(255, 255, 255, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {isPast ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Step content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: isCurrent ? 600 : 500,
                        color: isCurrent
                          ? '#00C2FF'
                          : isPast
                          ? 'rgba(255, 255, 255, 0.5)'
                          : 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '4px',
                      }}
                    >
                      {step.title || step.id}
                    </div>

                    {/* Step ID */}
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.4)',
                        fontFamily: 'monospace',
                        marginBottom: '4px',
                      }}
                    >
                      {step.id}
                    </div>

                    {/* Metadata badges */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '4px',
                      }}
                    >
                      {step.tab && (
                        <span
                          style={{
                            padding: '2px 6px',
                            fontSize: '10px',
                            fontWeight: 500,
                            background: 'rgba(139, 92, 246, 0.2)',
                            color: '#a78bfa',
                            borderRadius: '3px',
                          }}
                        >
                          tab: {step.tab}
                        </span>
                      )}
                      {step.target?.selector && (
                        <span
                          style={{
                            padding: '2px 6px',
                            fontSize: '10px',
                            fontWeight: 500,
                            background: 'rgba(251, 191, 36, 0.2)',
                            color: '#fbbf24',
                            borderRadius: '3px',
                          }}
                        >
                          spotlight
                        </span>
                      )}
                      {(step.target?.tourAction || step.target?.panelAction) && (
                        <span
                          style={{
                            padding: '2px 6px',
                            fontSize: '10px',
                            fontWeight: 500,
                            background: 'rgba(34, 211, 238, 0.2)',
                            color: '#22d3ee',
                            borderRadius: '3px',
                          }}
                        >
                          action
                        </span>
                      )}
                      {step.duration === 999999999 && (
                        <span
                          style={{
                            padding: '2px 6px',
                            fontSize: '10px',
                            fontWeight: 500,
                            background: 'rgba(248, 113, 113, 0.2)',
                            color: '#f87171',
                            borderRadius: '3px',
                          }}
                        >
                          manual
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          Click any step to jump to it
        </div>
      </div>

      {/* Backdrop when open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: '360px',
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 9997,
          }}
        />
      )}
    </>
  );
}

export default TourDebugPanel;
