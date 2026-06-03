'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAnalytics } from '../providers/AnalyticsProvider';
import { trackButtonClick, trackLinkClick } from '../core';
import { updateSessionActivity } from '../journey/sessionManager';

/**
 * Hook to automatically track clicks on buttons and links
 * Uses event delegation for efficiency
 * Supports data-track-* attributes for custom tracking
 * Respects data-track-ignore to opt-out
 */
export const useClickTracking = () => {
  const pathname = usePathname();
  const { isEnabled, config } = useAnalytics();

  useEffect(() => {
    if (!isEnabled || !config.trackClicks) return;

    const handleClick = (event: MouseEvent) => {
      // Find the clicked element or closest trackable parent
      let target = event.target as HTMLElement;
      let depth = 0;
      const maxDepth = 5; // Don't traverse too far up

      while (target && depth < maxDepth) {
        // Check if tracking is explicitly disabled
        if (target.hasAttribute('data-track-ignore')) {
          return;
        }

        // Check if this is a trackable element
        const isButton = target.tagName === 'BUTTON';
        const isLink = target.tagName === 'A';
        const hasRole = target.getAttribute('role') === 'button' || target.getAttribute('role') === 'link';

        if (isButton || isLink || hasRole) {
          // Update session activity
          updateSessionActivity();

          // Get tracking data from attributes or element content
          const trackName = target.getAttribute('data-track-name');
          const trackLocation = target.getAttribute('data-track-location');
          const trackDestination = target.getAttribute('data-track-destination');

          // Get element text content
          const elementText =
            trackName || target.textContent?.trim().substring(0, 50) || 'Unknown';

          // Get destination
          let destination = trackDestination;
          if (isLink) {
            const href = (target as HTMLAnchorElement).href;
            destination = destination || href;
          }

          // Determine element type
          const elementType = isLink ? 'link' : 'button';

          // Track based on type
          if (isLink) {
            const href = (target as HTMLAnchorElement).href;
            const linkType = getLinkType(href);

            trackLinkClick(elementText, href, linkType);
          } else {
            trackButtonClick(elementText, trackLocation || pathname, destination || undefined);
          }

          // Only track the first matching element
          return;
        }

        // Move up to parent
        target = target.parentElement as HTMLElement;
        depth++;
      }
    };

    // Add click listener to document
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [pathname, isEnabled, config]);
};

/**
 * Determine if a link is internal, external, or a download
 */
const getLinkType = (href: string): 'internal' | 'external' | 'download' => {
  try {
    const url = new URL(href, window.location.origin);

    // Check if it's a download (file extension or download attribute)
    const downloadExtensions = ['.pdf', '.zip', '.dmg', '.exe', '.msi', '.deb', '.rpm', '.AppImage'];
    if (downloadExtensions.some((ext) => url.pathname.toLowerCase().endsWith(ext))) {
      return 'download';
    }

    // Check if same origin
    if (url.origin === window.location.origin) {
      return 'internal';
    }

    return 'external';
  } catch {
    // If URL parsing fails, assume internal
    return 'internal';
  }
};
