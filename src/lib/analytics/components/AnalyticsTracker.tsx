'use client';

import { usePageTracking } from '../hooks/usePageTracking';
import { useScrollTracking } from '../hooks/useScrollTracking';
import { useTimeTracking } from '../hooks/useTimeTracking';
import { useClickTracking } from '../hooks/useClickTracking';
import { useFormTracking } from '../hooks/useFormTracking';

/**
 * Component that activates all tracking hooks
 * Add this to your layout to enable automatic tracking
 */
export const AnalyticsTracker: React.FC = () => {
  usePageTracking();
  useScrollTracking();
  useTimeTracking();
  useClickTracking();
  useFormTracking();

  return null;
};
