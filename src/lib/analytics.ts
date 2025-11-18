// Google Analytics event tracking utility

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Predefined event tracking functions
export const trackButtonClick = (buttonName: string, destination?: string) => {
  trackEvent('button_click', {
    button_name: buttonName,
    destination: destination,
  });
};

export const trackDownload = (version: string = 'alpha') => {
  trackEvent('download_click', {
    version: version,
  });
};

export const trackNavigation = (section: string) => {
  trackEvent('navigation', {
    section: section,
  });
};

export const trackVideoPlay = (videoTitle: string) => {
  trackEvent('video_play', {
    video_title: videoTitle,
  });
};

export const trackTourOpen = (source: string = 'button') => {
  trackEvent('tour_open', {
    source: source,
  });
};
