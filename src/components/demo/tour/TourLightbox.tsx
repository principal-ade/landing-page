'use client';

import React from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { useTour } from './TourProvider';

/**
 * Centered lightbox card overlay for tour steps
 * Shows a white card on top of dimmed background content
 */
export function TourLightbox() {
  const { theme } = useTheme();
  const { currentStep, isActive, next, prev } = useTour();

  // Only show for lightbox steps
  if (!isActive || !currentStep?.lightbox) {
    return null;
  }

  const isFirstStep = currentStep.id === 'welcome';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 150, // Above content but below TourOverlay
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.6)', // Dimmed background
        padding: '40px',
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          background: theme.colors.backgroundSecondary,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '16px',
          padding: '48px',
          maxWidth: '600px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {currentStep.title && (
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              color: theme.colors.primary,
              margin: '0 0 24px 0',
              textAlign: 'center',
            }}
          >
            {currentStep.title}
          </h2>
        )}

        <p
          style={{
            fontSize: '16px',
            fontFamily: 'Inter, sans-serif',
            color: theme.colors.textSecondary,
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
          }}
        >
          {currentStep.description}
        </p>

        <div
          style={{
            marginTop: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Back button - show on all steps except first */}
          {!isFirstStep && (
            <button
              onClick={prev}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 24px',
                minWidth: '100px',
                background: 'transparent',
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '10px',
                color: theme.colors.textSecondary,
                fontSize: '15px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
                e.currentTarget.style.color = theme.colors.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border;
                e.currentTarget.style.color = theme.colors.textSecondary;
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>
          )}

          {/* Next button */}
          <button
            onClick={next}
            data-tour-target="lightbox-next"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 24px',
              minWidth: '100px',
              background: theme.colors.primary,
              border: 'none',
              borderRadius: '10px',
              color: theme.colors.textOnPrimary,
              fontSize: '15px',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              boxShadow: `0 4px 20px ${theme.colors.primary}66`,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 6px 24px ${theme.colors.primary}80`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = `0 4px 20px ${theme.colors.primary}66`;
            }}
          >
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TourLightbox;
