'use client';

import React from 'react';
import { useTour } from './TourProvider';

export const TourOverlay: React.FC = () => {
  const { isActive, currentStep } = useTour();

  // Don't show during intro steps (they have their own UI)
  const introStepIds = ['welcome', 'tab-storyboards', 'tab-backlog', 'tab-story-monitoring', 'tab-traditional-monitoring'];
  if (!isActive || !currentStep || introStepIds.includes(currentStep.id)) {
    return null;
  }

  return (
    <div
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
          maxWidth: '1400px',
          margin: '0 auto',
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
          }}
        >
          {currentStep.description}
        </p>
      </div>
    </div>
  );
};

export default TourOverlay;
