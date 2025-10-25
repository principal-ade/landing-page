// Google Analytics event tracking utilities

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Track page views
export const pageview = (url: string) => {
  if (!GA_TRACKING_ID || !window.gtag) return

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (!GA_TRACKING_ID || !window.gtag) return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Specialized event trackers
export const trackDownload = ({
  filename,
  platform,
  assetId,
}: {
  filename: string
  platform: string
  assetId: number
}) => {
  event({
    action: 'download',
    category: 'Downloads',
    label: `${platform} - ${filename}`,
    value: assetId,
  })
}

export const trackPageView = (pageName: string) => {
  event({
    action: 'page_view',
    category: 'Navigation',
    label: pageName,
  })
}

export const trackButtonClick = (buttonName: string, location?: string) => {
  event({
    action: 'click',
    category: 'Button',
    label: location ? `${buttonName} - ${location}` : buttonName,
  })
}
