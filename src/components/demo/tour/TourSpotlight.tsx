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
  padding = 8,
  borderRadius = 8,
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

  // Spotlight disabled for now
  // Don't render if tour is not active or no target
  if (!isActive || !rect) {
    return null;
  }

  // Create the spotlight overlay using box-shadow
  // This creates a dark overlay everywhere except the spotlight area
  const shadowSpread = Math.max(window.innerWidth, window.innerHeight) * 2;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      >
        {/* Spotlight cutout */}
        <div
          style={{
            position: 'absolute',
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            borderRadius: `${borderRadius}px`,
            boxShadow: `0 0 0 ${shadowSpread}px rgba(0, 0, 0, 0.7)`,
            transition: 'all 0.3s ease-out',
            pointerEvents: 'none',
          }}
        />

        {/* Spotlight border */}
        <div
          style={{
            position: 'absolute',
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            borderRadius: `${borderRadius}px`,
            border: '2px solid #00C2FF',
            boxShadow: '0 0 20px rgba(0, 194, 255, 0.4)',
            transition: 'all 0.3s ease-out',
            pointerEvents: 'none',
            animation: pulse ? 'tourSpotlightPulse 2s ease-in-out infinite' : undefined,
          }}
        />
      </div>

      <style>{`
        @keyframes tourSpotlightPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(0, 194, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(0, 194, 255, 0.6), 0 0 60px rgba(0, 194, 255, 0.2);
          }
        }
      `}</style>
    </>
  );
};

export default TourSpotlight;
