'use client';

import React from 'react';
import { useTour } from './TourProvider';

export const TourOverlay: React.FC = () => {
  const { isActive, currentStep, prev, next, currentStepIndex, steps } = useTour();

  // Don't show during intro steps (they have their own UI)
  const introStepIds = ['welcome', 'tab-storyboards', 'tab-backlog', 'tab-story-monitoring', 'tab-traditional-monitoring'];
  if (!isActive || !currentStep || introStepIds.includes(currentStep.id)) {
    return null;
  }

  // Don't show during lightbox steps (they have their own overlay)
  if (currentStep.lightbox) {
    return null;
  }

  const isFirstInteractiveStep = currentStepIndex === introStepIds.length;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div
      data-tour-target="tour-overlay"
      style={{
        background: 'rgba(10, 14, 23, 0.95)',
        borderTop: '1px solid rgba(0, 194, 255, 0.2)',
        padding: '16px 24px',
        fontFamily: 'Inter, sans-serif',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        {/* Previous button */}
        <button
          onClick={prev}
          disabled={isFirstInteractiveStep}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 16px',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: isFirstInteractiveStep ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.8)',
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            cursor: isFirstInteractiveStep ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        {/* Text content */}
        <div
          style={{
            flex: 1,
            textAlign: 'center',
          }}
        >
          {currentStep.title && (
            <h3
              style={{
                margin: '0 0 6px 0',
                color: '#00C2FF',
                fontSize: '18px',
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
              color: currentStep.descriptionColor || 'rgba(255, 255, 255, 0.85)',
              fontSize: '17px',
              lineHeight: 1.5,
              minHeight: '51px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {currentStep.description}
          </p>
        </div>

        {/* Next button */}
        <button
          onClick={next}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #00C2FF 0%, #0088CC 100%)',
            border: 'none',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
        >
          {isLastStep ? 'Finish' : 'Next'}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TourOverlay;
