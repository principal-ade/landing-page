'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AnalyticsConfig, AnalyticsContextValue } from '../types';
import {
  event,
  pageview,
  trackButtonClick as coreTrackButtonClick,
  trackDownload as coreTrackDownload,
  isAnalyticsAvailable,
} from '../core';
import { initSession, endSession } from '../journey/sessionManager';

// Default configuration
const defaultConfig: AnalyticsConfig = {
  enabled: true,
  debug: process.env.NODE_ENV === 'development',
  trackPageViews: true,
  trackClicks: true,
  trackForms: true,
  trackScrollDepth: true,
  trackTimeOnPage: true,
  scrollThresholds: [25, 50, 75, 90, 100],
};

// Create context
const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
  config?: Partial<AnalyticsConfig>;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({
  children,
  config: userConfig,
}) => {
  const [config] = useState<AnalyticsConfig>({
    ...defaultConfig,
    ...userConfig,
  });

  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check if analytics is available
    setIsEnabled(config.enabled && isAnalyticsAvailable());

    if (config.debug && typeof window !== 'undefined') {
      console.log('[Analytics] Provider initialized', {
        enabled: config.enabled,
        available: isAnalyticsAvailable(),
        config,
      });
    }
  }, [config]);

  // Initialize session on mount
  useEffect(() => {
    if (!isEnabled) return;

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    initSession(currentPath);

    // Clean up session on page unload
    const handleUnload = () => {
      endSession();
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [isEnabled]);

  // Track generic events
  const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    if (!isEnabled) return;

    event({
      action: eventName,
      category: eventParams?.category || 'General',
      label: eventParams?.label,
      value: eventParams?.value,
      ...eventParams,
    });
  };

  // Track page views
  const trackPageView = (path: string) => {
    if (!isEnabled || !config.trackPageViews) return;
    pageview(path);
  };

  // Track button clicks
  const trackButtonClick = (buttonName: string, location?: string, destination?: string) => {
    if (!isEnabled || !config.trackClicks) return;
    coreTrackButtonClick(buttonName, location, destination);
  };

  // Track downloads
  const trackDownload = (params: { filename: string; platform: string; assetId: number }) => {
    if (!isEnabled) return;
    coreTrackDownload(params);
  };

  const value: AnalyticsContextValue = {
    config,
    trackEvent,
    trackPageView,
    trackButtonClick,
    trackDownload,
    isEnabled,
  };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};

// Hook to use analytics context
export const useAnalytics = (): AnalyticsContextValue => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
