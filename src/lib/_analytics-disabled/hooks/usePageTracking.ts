'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAnalytics } from '../providers/AnalyticsProvider';
import { trackPageNavigation } from '../journey/sessionManager';

/**
 * Hook to automatically track page views and navigation
 * Should be used in root layout or individual pages
 */
export const usePageTracking = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { trackPageView, isEnabled, config } = useAnalytics();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isEnabled || !config.trackPageViews) return;

    // Construct full URL with search params
    const url = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // Track page view
    trackPageView(url);

    // Track navigation in session
    const navigationType = previousPathRef.current ? 'link' : 'direct';
    trackPageNavigation(pathname, navigationType);

    // Update previous path
    previousPathRef.current = pathname;
  }, [pathname, searchParams, trackPageView, isEnabled, config.trackPageViews]);
};
