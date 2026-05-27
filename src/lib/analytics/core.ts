// Core analytics functionality - consolidated from duplicate utilities

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Check if analytics is available and enabled
export const isAnalyticsAvailable = (): boolean => {
  return !!(typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID);
};

// Debug logging in development
const logDebug = (eventName: string, eventParams?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, eventParams);
  }
};

/**
 * Track page views
 * Called automatically on route changes by usePageTracking hook
 */
export const pageview = (url: string, title?: string): void => {
  if (!isAnalyticsAvailable()) {
    logDebug('pageview (not sent - analytics unavailable)', { url, title });
    return;
  }

  window.gtag!('config', GA_TRACKING_ID!, {
    page_path: url,
    page_title: title || document.title,
  });

  logDebug('pageview', { url, title });
};

/**
 * Generic event tracking
 * Base function for all custom events
 */
export const event = (eventParams: {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: any;
}): void => {
  const { action, category, label, value, ...otherParams } = eventParams;

  if (!isAnalyticsAvailable()) {
    logDebug(`event: ${action} (not sent - analytics unavailable)`, eventParams);
    return;
  }

  window.gtag!('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...otherParams,
  });

  logDebug(`event: ${action}`, eventParams);
};

/**
 * Track downloads
 * Used for tracking file downloads (installers, assets, etc.)
 */
export const trackDownload = ({
  filename,
  platform,
  assetId,
}: {
  filename: string;
  platform: string;
  assetId: number;
}): void => {
  event({
    action: 'download',
    category: 'Downloads',
    label: `${platform} - ${filename}`,
    value: assetId,
    filename,
    platform,
  });
};

/**
 * Track button clicks
 * Can be called manually or automatically by useClickTracking hook
 */
export const trackButtonClick = (
  buttonName: string,
  location?: string,
  destination?: string
): void => {
  event({
    action: 'click',
    category: 'Button',
    label: location ? `${buttonName} - ${location}` : buttonName,
    button_name: buttonName,
    button_location: location,
    destination: destination,
  });
};

/**
 * Track link clicks
 * Automatically called by useClickTracking hook
 */
export const trackLinkClick = (
  linkText: string,
  linkUrl: string,
  linkType: 'internal' | 'external' | 'download'
): void => {
  event({
    action: 'link_click',
    category: 'Navigation',
    label: `${linkType} - ${linkText}`,
    link_text: linkText,
    link_url: linkUrl,
    link_type: linkType,
  });
};

/**
 * Track form interactions
 */
export const trackFormStart = (formId?: string, formName?: string): void => {
  event({
    action: 'form_start',
    category: 'Forms',
    label: formName || formId || 'unknown',
    form_id: formId,
    form_name: formName,
  });
};

export const trackFormSubmit = (
  formId?: string,
  formName?: string,
  success: boolean = true,
  errorMessage?: string
): void => {
  event({
    action: 'form_submit',
    category: 'Forms',
    label: formName || formId || 'unknown',
    form_id: formId,
    form_name: formName,
    success,
    error_message: errorMessage,
  });
};

export const trackFormAbandon = (
  formId?: string,
  fieldName?: string,
  completionPercentage: number = 0,
  timeSpentSeconds: number = 0
): void => {
  event({
    action: 'form_abandon',
    category: 'Forms',
    label: formId || 'unknown',
    form_id: formId,
    field_name: fieldName,
    completion_percentage: completionPercentage,
    time_spent_seconds: timeSpentSeconds,
  });
};

/**
 * Track scroll depth
 * Called by useScrollTracking hook
 */
export const trackScrollDepth = (
  depthPercentage: number,
  pagePath: string,
  depthPixels: number,
  maxDepthPercentage: number
): void => {
  event({
    action: 'scroll_depth',
    category: 'Engagement',
    label: `${depthPercentage}%`,
    value: depthPercentage,
    depth_percentage: depthPercentage,
    depth_pixels: depthPixels,
    max_depth_percentage: maxDepthPercentage,
    page_path: pagePath,
  });
};

/**
 * Track time on page
 * Called by useTimeTracking hook on page unload or visibility change
 */
export const trackTimeOnPage = (
  durationSeconds: number,
  activeTimeSeconds: number,
  idleTimeSeconds: number,
  pagePath: string
): void => {
  event({
    action: 'time_on_page',
    category: 'Engagement',
    label: pagePath,
    value: Math.round(activeTimeSeconds),
    duration_seconds: durationSeconds,
    active_time_seconds: activeTimeSeconds,
    idle_time_seconds: idleTimeSeconds,
    page_path: pagePath,
  });
};

/**
 * Track navigation between pages
 * Called by navigation tracker
 */
export const trackNavigation = (
  fromPage: string,
  toPage: string,
  navigationType: 'link' | 'back' | 'forward' | 'direct'
): void => {
  event({
    action: 'page_navigation',
    category: 'Navigation',
    label: `${fromPage} → ${toPage}`,
    from_page: fromPage,
    to_page: toPage,
    navigation_type: navigationType,
  });
};

/**
 * Track session events
 */
export const trackSessionStart = (
  sessionId: string,
  landingPage: string,
  referrer?: string
): void => {
  event({
    action: 'session_start',
    category: 'Session',
    label: landingPage,
    session_id: sessionId,
    landing_page: landingPage,
    referrer: referrer,
  });
};

export const trackSessionEnd = (
  sessionId: string,
  exitPage: string,
  totalPages: number,
  sessionDurationSeconds: number,
  pagesVisited: string[]
): void => {
  event({
    action: 'session_end',
    category: 'Session',
    label: exitPage,
    value: sessionDurationSeconds,
    session_id: sessionId,
    exit_page: exitPage,
    total_pages: totalPages,
    session_duration_seconds: sessionDurationSeconds,
    pages_visited: pagesVisited.join(' → '),
  });
};
