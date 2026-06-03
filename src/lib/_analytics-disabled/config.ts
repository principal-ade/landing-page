// Analytics configuration
// Toggle between client-side and server-side tracking

export type TrackingMode = 'client' | 'server' | 'hybrid';

export interface AnalyticsConfig {
  mode: TrackingMode;
  enableQueue: boolean; // Enable event queue for retry logic
  enableBotFiltering: boolean; // Filter bot traffic (server-side only)
  debug: boolean;
}

// Get tracking mode from environment variable
// NEXT_PUBLIC_ANALYTICS_MODE can be 'client', 'server', or 'hybrid'
// Defaults to 'client' for backward compatibility
export const getTrackingMode = (): TrackingMode => {
  const mode = process.env.NEXT_PUBLIC_ANALYTICS_MODE as TrackingMode;

  if (mode === 'server' || mode === 'hybrid') {
    return mode;
  }

  return 'client';
};

// Check if server-side tracking is enabled
export const isServerSideEnabled = (): boolean => {
  const mode = getTrackingMode();
  return mode === 'server' || mode === 'hybrid';
};

// Check if client-side tracking is enabled
export const isClientSideEnabled = (): boolean => {
  const mode = getTrackingMode();
  return mode === 'client' || mode === 'hybrid';
};

// Get analytics configuration
export const getAnalyticsConfig = (): AnalyticsConfig => {
  const mode = getTrackingMode();

  return {
    mode,
    enableQueue: mode === 'client' || mode === 'hybrid',
    enableBotFiltering: mode === 'server' || mode === 'hybrid',
    debug: process.env.NODE_ENV === 'development',
  };
};

// Export for convenience
export const analyticsConfig = getAnalyticsConfig();
