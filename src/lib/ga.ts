// Minimal Google Analytics helper (no deprecated analytics module).

export function trackGAEvent(
  action: string,
  params: Record<string, unknown> = {},
): void {
  if (typeof window !== 'undefined') {
    const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag === 'function') {
      gtag('event', action, params);
    }
  }
}