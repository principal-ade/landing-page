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

const trackEvent = (
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
