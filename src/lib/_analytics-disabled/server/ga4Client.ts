// GA4 Measurement Protocol client for server-to-server event tracking
// https://developers.google.com/analytics/devguides/collection/protocol/ga4

const GA4_ENDPOINT = 'https://www.google-analytics.com/mp/collect';
const GA4_DEBUG_ENDPOINT = 'https://www.google-analytics.com/debug/mp/collect';

export interface GA4Event {
  name: string;
  params?: Record<string, any>;
}

export interface GA4ClientConfig {
  measurementId: string;
  apiSecret: string;
  debug?: boolean;
}

export interface GA4Response {
  success: boolean;
  validationMessages?: Array<{
    fieldPath: string;
    description: string;
    validationCode: string;
  }>;
}

export class GA4MeasurementProtocol {
  private measurementId: string;
  private apiSecret: string;
  private debug: boolean;

  constructor(config: GA4ClientConfig) {
    this.measurementId = config.measurementId;
    this.apiSecret = config.apiSecret;
    this.debug = config.debug || false;
  }

  /**
   * Send event to GA4 via Measurement Protocol
   */
  async sendEvent(
    clientId: string,
    events: GA4Event | GA4Event[],
    userProperties?: Record<string, any>
  ): Promise<GA4Response> {
    const endpoint = this.debug ? GA4_DEBUG_ENDPOINT : GA4_ENDPOINT;
    const url = `${endpoint}?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`;

    const payload = {
      client_id: clientId,
      events: Array.isArray(events) ? events : [events],
      user_properties: userProperties,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('[GA4] HTTP error:', response.status, response.statusText);
        return {
          success: false,
          validationMessages: [{
            fieldPath: 'response',
            description: `HTTP ${response.status}: ${response.statusText}`,
            validationCode: 'HTTP_ERROR',
          }],
        };
      }

      if (this.debug) {
        const validationResult = await response.json();
        return {
          success: validationResult.validationMessages?.length === 0,
          validationMessages: validationResult.validationMessages,
        };
      }

      // Production endpoint returns 204 No Content on success
      return { success: true };
    } catch (error) {
      console.error('[GA4] Network error:', error);
      return {
        success: false,
        validationMessages: [{
          fieldPath: 'network',
          description: error instanceof Error ? error.message : 'Unknown error',
          validationCode: 'NETWORK_ERROR',
        }],
      };
    }
  }

  /**
   * Send page view event
   */
  async sendPageView(
    clientId: string,
    pagePath: string,
    pageTitle?: string,
    referrer?: string
  ): Promise<GA4Response> {
    return this.sendEvent(clientId, {
      name: 'page_view',
      params: {
        page_path: pagePath,
        page_title: pageTitle,
        page_referrer: referrer,
      },
    });
  }

  /**
   * Send custom event
   */
  async sendCustomEvent(
    clientId: string,
    eventName: string,
    params?: Record<string, any>
  ): Promise<GA4Response> {
    return this.sendEvent(clientId, {
      name: eventName,
      params,
    });
  }

  /**
   * Send session start event
   */
  async sendSessionStart(
    clientId: string,
    sessionId: string,
    landingPage: string,
    referrer?: string,
    userProperties?: Record<string, any>
  ): Promise<GA4Response> {
    return this.sendEvent(
      clientId,
      {
        name: 'session_start',
        params: {
          session_id: sessionId,
          landing_page: landingPage,
          page_referrer: referrer,
        },
      },
      userProperties
    );
  }

  /**
   * Send session end event
   */
  async sendSessionEnd(
    clientId: string,
    sessionId: string,
    exitPage: string,
    totalPages: number,
    sessionDuration: number,
    pagesVisited: string[]
  ): Promise<GA4Response> {
    return this.sendEvent(clientId, {
      name: 'session_end',
      params: {
        session_id: sessionId,
        exit_page: exitPage,
        total_pages: totalPages,
        session_duration_seconds: sessionDuration,
        pages_visited: pagesVisited.join(' → '),
      },
    });
  }

  /**
   * Batch send multiple events
   */
  async sendBatch(
    clientId: string,
    events: GA4Event[],
    userProperties?: Record<string, any>
  ): Promise<GA4Response> {
    return this.sendEvent(clientId, events, userProperties);
  }
}

// Singleton instance
let ga4Client: GA4MeasurementProtocol | null = null;

export function getGA4Client(): GA4MeasurementProtocol | null {
  if (!ga4Client) {
    const measurementId = process.env.NEXT_PUBLIC_GA_ID;
    const apiSecret = process.env.GA4_API_SECRET;

    if (!measurementId || !apiSecret) {
      console.warn('[GA4] Missing configuration. Set NEXT_PUBLIC_GA_ID and GA4_API_SECRET');
      return null;
    }

    ga4Client = new GA4MeasurementProtocol({
      measurementId,
      apiSecret,
      debug: process.env.NODE_ENV === 'development',
    });
  }

  return ga4Client;
}
