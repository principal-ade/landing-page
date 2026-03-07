'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useTour } from './TourProvider';

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TourSpotlightProps {
  /** Padding around the spotlight target (default: 8) */
  padding?: number;
  /** Border radius for the spotlight cutout (default: 8) */
  borderRadius?: number;
  /** Enable pulse animation on target (default: true) */
  pulse?: boolean;
}

export const TourSpotlight: React.FC<TourSpotlightProps> = ({
  padding = 0,
  borderRadius = 4,
  pulse = true,
}) => {
  const { isActive, currentStep } = useTour();
  const [rect, setRect] = useState<SpotlightRect | null>(null);

  // Find and track the target element
  const updateRect = useCallback(() => {
    const selector = currentStep?.target?.selector;
    if (!selector) {
      setRect(null);
      return;
    }

    const element = document.querySelector(selector);
    if (!element) {
      console.warn('[TourSpotlight] Element not found:', selector);
      setRect(null);
      return;
    }

    const bounds = element.getBoundingClientRect();
    setRect({
      top: bounds.top - padding,
      left: bounds.left - padding,
      width: bounds.width + padding * 2,
      height: bounds.height + padding * 2,
    });
  }, [currentStep?.target?.selector, padding]);

  // Update rect on step change and window resize/scroll
  useEffect(() => {
    if (!isActive) {
      setRect(null);
      return;
    }

    // Initial update
    updateRect();

    // Update on resize and scroll
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    // Also update periodically to catch dynamic content
    const interval = setInterval(updateRect, 500);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
      clearInterval(interval);
    };
  }, [isActive, updateRect]);

  // Don't render if tour is not active or no target
  if (!isActive || !rect) {
    return null;
  }

  return (
    <>
      {/* Spotlight highlight border - no dimming overlay */}
      <div
        style={{
          position: 'fixed',
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: `${borderRadius}px`,
          border: '1px solid rgba(0, 194, 255, 0.6)',
          boxShadow: '0 0 12px rgba(0, 194, 255, 0.25)',
          pointerEvents: 'none',
          zIndex: 9999,
          animation: pulse ? 'tourSpotlightPulse 2s ease-in-out infinite' : undefined,
        }}
      />

      <style>{`
        @keyframes tourSpotlightPulse {
          0%, 100% {
            box-shadow: 0 0 12px rgba(0, 194, 255, 0.25);
          }
          50% {
            box-shadow: 0 0 18px rgba(0, 194, 255, 0.35), 0 0 30px rgba(0, 194, 255, 0.1);
          }
        }
      `}</style>
    </>
  );
};

export default TourSpotlight;
