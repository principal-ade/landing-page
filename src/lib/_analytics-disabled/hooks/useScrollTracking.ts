'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '../providers/AnalyticsProvider';
import { trackScrollDepth } from '../core';
import { updateSessionActivity } from '../journey/sessionManager';

/**
 * Hook to track scroll depth on a page
 * Uses IntersectionObserver for performance
 * Tracks configured thresholds (default: 25%, 50%, 75%, 90%, 100%)
 */
export const useScrollTracking = () => {
  const pathname = usePathname();
  const { isEnabled, config } = useAnalytics();
  const trackedThresholds = useRef<Set<number>>(new Set());
  const maxDepthReached = useRef<number>(0);

  useEffect(() => {
    if (!isEnabled || !config.trackScrollDepth) return;

    // Reset tracked thresholds when page changes
    trackedThresholds.current.clear();
    maxDepthReached.current = 0;

    // Debounce scroll events
    let scrollTimeout: NodeJS.Timeout;
    let lastScrollTime = 0;
    const DEBOUNCE_MS = 300;

    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollTime < DEBOUNCE_MS) {
        clearTimeout(scrollTimeout);
      }

      scrollTimeout = setTimeout(() => {
        lastScrollTime = now;

        // Calculate scroll depth
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollBottom = scrollTop + windowHeight;

        // Calculate percentage scrolled
        const scrollableHeight = documentHeight - windowHeight;
        const scrollPercentage =
          scrollableHeight > 0 ? Math.round((scrollTop / scrollableHeight) * 100) : 100;

        // Update max depth
        if (scrollPercentage > maxDepthReached.current) {
          maxDepthReached.current = scrollPercentage;
        }

        // Update session activity
        updateSessionActivity();

        // Check if any threshold has been crossed
        config.scrollThresholds.forEach((threshold) => {
          if (scrollPercentage >= threshold && !trackedThresholds.current.has(threshold)) {
            trackedThresholds.current.add(threshold);

            // Track this milestone
            trackScrollDepth(threshold, pathname, Math.round(scrollTop), maxDepthReached.current);
          }
        });
      }, DEBOUNCE_MS);
    };

    // Add passive event listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track initial state (in case user lands at bottom)
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [pathname, isEnabled, config]);
};
