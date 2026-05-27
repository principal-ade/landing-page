'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '../providers/AnalyticsProvider';
import { trackTimeOnPage } from '../core';

/**
 * Hook to track time spent on a page
 * Differentiates between active time (tab visible) and total time
 * Uses Page Visibility API to detect when user is actively viewing
 */
export const useTimeTracking = () => {
  const pathname = usePathname();
  const { isEnabled, config } = useAnalytics();
  const startTimeRef = useRef<number>(0);
  const activeTimeRef = useRef<number>(0);
  const lastVisibleTimeRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  useEffect(() => {
    if (!isEnabled || !config.trackTimeOnPage) return;

    // Initialize timing
    const now = Date.now();
    startTimeRef.current = now;
    lastVisibleTimeRef.current = now;
    activeTimeRef.current = 0;
    isVisibleRef.current = !document.hidden;

    // Handle visibility changes
    const handleVisibilityChange = () => {
      const now = Date.now();
      const wasVisible = isVisibleRef.current;
      const isVisible = !document.hidden;

      if (wasVisible && !isVisible) {
        // Tab became hidden - add active time
        const activeChunk = now - lastVisibleTimeRef.current;
        activeTimeRef.current += activeChunk;
      } else if (!wasVisible && isVisible) {
        // Tab became visible - reset timer
        lastVisibleTimeRef.current = now;
      }

      isVisibleRef.current = isVisible;
    };

    // Send timing data
    const sendTimeData = () => {
      const now = Date.now();

      // Calculate final active time
      let finalActiveTime = activeTimeRef.current;
      if (isVisibleRef.current) {
        finalActiveTime += now - lastVisibleTimeRef.current;
      }

      const totalTime = now - startTimeRef.current;
      const idleTime = totalTime - finalActiveTime;

      // Only send if user spent at least 1 second
      if (totalTime >= 1000) {
        trackTimeOnPage(
          Math.round(totalTime / 1000),
          Math.round(finalActiveTime / 1000),
          Math.round(idleTime / 1000),
          pathname
        );
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Send data on page unload
    window.addEventListener('beforeunload', sendTimeData);

    // Also send periodically for long sessions (every 30 seconds)
    const intervalId = setInterval(() => {
      const now = Date.now();
      const totalTime = now - startTimeRef.current;

      // Only send periodic updates after 30+ seconds
      if (totalTime >= 30000) {
        sendTimeData();
        // Reset counters for next interval
        startTimeRef.current = now;
        activeTimeRef.current = 0;
        lastVisibleTimeRef.current = now;
      }
    }, 30000);

    // Cleanup
    return () => {
      sendTimeData();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', sendTimeData);
      clearInterval(intervalId);
    };
  }, [pathname, isEnabled, config]);
};
