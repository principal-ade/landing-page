// Main analytics export - single entry point for all analytics functionality

// Core functionality
export {
  GA_TRACKING_ID,
  isAnalyticsAvailable,
  pageview,
  event,
  trackDownload,
  trackButtonClick,
  trackLinkClick,
  trackFormStart,
  trackFormSubmit,
  trackFormAbandon,
  trackScrollDepth,
  trackTimeOnPage,
  trackNavigation,
  trackSessionStart,
  trackSessionEnd,
} from './core';

// Provider and context
export { AnalyticsProvider, useAnalytics } from './providers/AnalyticsProvider';

// Tracking hooks
export { usePageTracking } from './hooks/usePageTracking';
export { useScrollTracking } from './hooks/useScrollTracking';
export { useTimeTracking } from './hooks/useTimeTracking';
export { useClickTracking } from './hooks/useClickTracking';
export { useFormTracking } from './hooks/useFormTracking';

// Session management
export {
  initSession,
  trackPageNavigation,
  updateSessionActivity,
  endSession,
  getCurrentSession,
  exportSessionData,
} from './journey/sessionManager';

// Types
export type {
  AnalyticsEvent,
  PageViewEvent,
  ButtonClickEvent,
  LinkClickEvent,
  FormEvent,
  FormStartEvent,
  FormSubmitEvent,
  FormAbandonEvent,
  ScrollDepthEvent,
  TimeOnPageEvent,
  SessionStartEvent,
  NavigationEvent,
  SessionEndEvent,
  AnalyticsConfig,
  AnalyticsContextValue,
} from './types';
