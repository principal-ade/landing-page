// Client-side API wrapper for server-side analytics endpoints

export interface ServerApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  [key: string]: any;
}

// Initialize session on server
export async function initServerSession(
  sessionId: string,
  landingPage: string,
  referrer?: string
): Promise<ServerApiResponse> {
  try {
    const response = await fetch('/api/analytics/session/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        landingPage,
        referrer,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('[ServerAPI] Session init error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// End session on server
export async function endServerSession(sessionId: string): Promise<ServerApiResponse> {
  try {
    const response = await fetch('/api/analytics/session/end', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('[ServerAPI] Session end error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Track page view on server
export async function trackServerPageView(
  sessionId: string,
  pagePath: string,
  pageTitle?: string,
  referrer?: string
): Promise<ServerApiResponse> {
  try {
    const response = await fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        pagePath,
        pageTitle,
        referrer,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('[ServerAPI] Page view error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Track event on server
export async function trackServerEvent(
  sessionId: string,
  eventType: string,
  category: string,
  action: string,
  label?: string,
  value?: number,
  params?: Record<string, any>
): Promise<ServerApiResponse> {
  try {
    const response = await fetch('/api/analytics/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        eventType,
        category,
        action,
        label,
        value,
        params,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('[ServerAPI] Event error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}
