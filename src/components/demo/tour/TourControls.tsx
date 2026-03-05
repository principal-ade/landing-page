'use client';

import React from 'react';
import { useTour } from './TourProvider';

interface TourControlsProps {
  /** Show step counter text (e.g., "Step 2 of 5") */
  showStepCounter?: boolean;
}

export const TourControls: React.FC<TourControlsProps> = ({
  showStepCounter = true,
}) => {
  const {
    isPlaying,
    currentStepIndex,
    steps,
    progress,
    play,
    pause,
    next,
    prev,
    goToStep,
  } = useTour();

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* Previous Button */}
      <button
        onClick={prev}
        disabled={isFirstStep}
        style={{
          background: 'transparent',
          border: 'none',
          color: isFirstStep ? 'rgba(255, 255, 255, 0.3)' : '#00C2FF',
          cursor: isFirstStep ? 'not-allowed' : 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s ease',
        }}
        aria-label="Previous step"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={isPlaying ? pause : play}
        style={{
          background: 'rgba(0, 194, 255, 0.1)',
          border: '1px solid rgba(0, 194, 255, 0.3)',
          borderRadius: '50%',
          color: '#00C2FF',
          cursor: 'pointer',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}
        aria-label={isPlaying ? 'Pause tour' : 'Play tour'}
      >
        {isPlaying ? (
          // Pause icon
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          // Play icon
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21" />
          </svg>
        )}
      </button>

      {/* Next Button */}
      <button
        onClick={next}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#00C2FF',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s ease',
        }}
        aria-label={isLastStep ? 'Finish tour' : 'Next step'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Progress Dots */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginLeft: '8px',
        }}
      >
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <button
              key={step.id}
              onClick={() => goToStep(index)}
              style={{
                width: isActive ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
                position: 'relative',
                overflow: 'hidden',
                background: isCompleted
                  ? '#00C2FF'
                  : isActive
                  ? 'rgba(0, 194, 255, 0.3)'
                  : 'rgba(255, 255, 255, 0.2)',
              }}
              aria-label={`Go to step ${index + 1}`}
            >
              {/* Progress fill for active step */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${progress * 100}%`,
                    background: '#00C2FF',
                    borderRadius: '4px',
                    transition: 'width 0.05s linear',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Step Counter */}
      {showStepCounter && (
        <span
          style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
            marginLeft: '8px',
          }}
        >
          Step {currentStepIndex + 1} of {steps.length}
        </span>
      )}

      <style>{`
        button:hover:not(:disabled) {
          opacity: 0.8;
        }
        button:active:not(:disabled) {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default TourControls;
