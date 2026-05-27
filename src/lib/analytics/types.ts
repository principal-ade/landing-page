// TypeScript types for analytics system

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

export interface PageViewEvent {
  page_path: string;
  page_title: string;
  page_location: string;
  referrer?: string;
}

export interface ButtonClickEvent {
  button_name: string;
  button_location?: string;
  destination?: string;
  element_type: 'button' | 'link' | 'a';
  page_path: string;
}

export interface LinkClickEvent {
  link_text: string;
  link_url: string;
  link_type: 'internal' | 'external' | 'download';
  page_path: string;
}

export interface FormEvent {
  form_id?: string;
  form_name?: string;
  form_type?: string;
  page_path: string;
}

export interface FormStartEvent extends FormEvent {
  event: 'form_start';
}

export interface FormSubmitEvent extends FormEvent {
  event: 'form_submit';
  success: boolean;
  error_message?: string;
}

export interface FormAbandonEvent extends FormEvent {
  event: 'form_abandon';
  field_name?: string;
  completion_percentage: number;
  time_spent_seconds: number;
}

export interface ScrollDepthEvent {
  depth_percentage: number;
  page_path: string;
  depth_pixels: number;
  max_depth_percentage: number;
}

export interface TimeOnPageEvent {
  duration_seconds: number;
  active_time_seconds: number;
  idle_time_seconds: number;
  page_path: string;
}

export interface SessionStartEvent {
  session_id: string;
  landing_page: string;
  referrer?: string;
  timestamp: number;
}

export interface NavigationEvent {
  from_page: string;
  to_page: string;
  navigation_type: 'link' | 'back' | 'forward' | 'direct';
  session_id: string;
}

export interface SessionEndEvent {
  session_id: string;
  exit_page: string;
  total_pages: number;
  session_duration_seconds: number;
  pages_visited: string[];
}

export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  trackPageViews: boolean;
  trackClicks: boolean;
  trackForms: boolean;
  trackScrollDepth: boolean;
  trackTimeOnPage: boolean;
  scrollThresholds: number[];
}

export interface AnalyticsContextValue {
  config: AnalyticsConfig;
  trackEvent: (eventName: string, eventParams?: Record<string, any>) => void;
  trackPageView: (path: string) => void;
  trackButtonClick: (buttonName: string, location?: string, destination?: string) => void;
  trackDownload: (params: { filename: string; platform: string; assetId: number }) => void;
  isEnabled: boolean;
}
