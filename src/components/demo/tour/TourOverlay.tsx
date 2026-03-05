'use client';

import React from 'react';
import { useTour } from './TourProvider';
import { TourControls } from './TourControls';

interface TourOverlayProps {
  /** Position of the overlay */
  position?: 'bottom' | 'top';
}

export const TourOverlay: React.FC<TourOverlayProps> = ({
  position = 'bottom',
}) => {
  const { isActive, currentStep, skip } = useTour();

  // Don't show during intro steps (they have their own UI)
  const introStepIds = ['welcome', 'tab-storyboards', 'tab-backlog', 'tab-story-monitoring', 'tab-traditional-monitoring'];
  if (!isActive || !currentStep || introStepIds.includes(currentStep.id)) {
    return null;
  }

  const positionStyles =
    position === 'bottom'
      ? { bottom: 0, borderTop: '1px solid rgba(0, 194, 255, 0.2)' }
      : { top: 0, borderBottom: '1px solid rgba(0, 194, 255, 0.2)' };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          ...positionStyles,
          background: 'rgba(10, 14, 23, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '20px 32px',
          zIndex: 10000,
          fontFamily: 'Inter, sans-serif',
          animation: 'tourOverlaySlideIn 0.3s ease-out',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
          }}
        >
          {/* Left: Controls */}
          <TourControls />

          {/* Center: Step Content */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            {currentStep.title && (
              <h3
                style={{
                  margin: '0 0 4px 0',
                  color: '#00C2FF',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}
              >
                {currentStep.title}
              </h3>
            )}
            <p
              style={{
                margin: 0,
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '15px',
                lineHeight: 1.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentStep.description}
            </p>
          </div>

          {/* Right: Skip Button */}
          <button
            onClick={skip}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              padding: '8px 16px',
              fontSize: '13px',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
            }}
          >
            Skip Tour
          </button>
        </div>
      </div>

      <style>{`
        @keyframes tourOverlaySlideIn {
          from {
            opacity: 0;
            transform: translateY(${position === 'bottom' ? '100%' : '-100%'});
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default TourOverlay;
