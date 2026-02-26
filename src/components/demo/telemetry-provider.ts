/**
 * OpenTelemetry Provider for the Demo Page
 *
 * Sets up a TracerProvider that captures spans from the instrumented
 * Kanban panel and forwards them to a callback for display.
 */

import { type Span, type Context } from '@opentelemetry/api';
import {
  WebTracerProvider,
  type SpanProcessor,
  type ReadableSpan,
} from '@opentelemetry/sdk-trace-web';
import { resourceFromAttributes } from '@opentelemetry/resources';

/**
 * Captured span data for display
 */
export interface CapturedSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  kind: number;
  startTime: number;
  endTime: number;
  duration: number;
  status: {
    code: number;
    message?: string;
  };
  attributes: Record<string, unknown>;
  events: Array<{
    name: string;
    time: number;
    attributes?: Record<string, unknown>;
  }>;
  resource: Record<string, unknown>;
}

/**
 * Callback for when spans are captured
 */
export type SpanCaptureCallback = (span: CapturedSpan) => void;

/**
 * Custom SpanProcessor that captures completed spans
 */
class CallbackSpanProcessor implements SpanProcessor {
  private callback: SpanCaptureCallback;

  constructor(callback: SpanCaptureCallback) {
    this.callback = callback;
  }

  onStart(_span: Span, _parentContext: Context): void {
    // We capture on end, not start
  }

  onEnd(span: ReadableSpan): void {
    const spanCtx = span.spanContext();
    const capturedSpan: CapturedSpan = {
      traceId: spanCtx.traceId,
      spanId: spanCtx.spanId,
      parentSpanId: (span as unknown as { parentSpanId?: string }).parentSpanId,
      name: span.name,
      kind: span.kind,
      startTime: span.startTime[0] * 1000 + span.startTime[1] / 1e6, // Convert to ms
      endTime: span.endTime[0] * 1000 + span.endTime[1] / 1e6,
      duration: span.duration[0] * 1000 + span.duration[1] / 1e6,
      status: {
        code: span.status.code,
        message: span.status.message,
      },
      attributes: { ...span.attributes },
      events: span.events.map((event) => ({
        name: event.name,
        time: event.time[0] * 1000 + event.time[1] / 1e6,
        attributes: event.attributes ? { ...event.attributes } : undefined,
      })),
      resource: span.resource.attributes,
    };

    this.callback(capturedSpan);
  }

  shutdown(): Promise<void> {
    return Promise.resolve();
  }

  forceFlush(): Promise<void> {
    return Promise.resolve();
  }
}

let providerInstance: WebTracerProvider | null = null;

/**
 * Initialize the telemetry provider for the demo
 *
 * @param onSpanEnd - Callback invoked when spans complete
 * @returns Cleanup function to shutdown the provider
 */
export function initializeTelemetryProvider(
  onSpanEnd: SpanCaptureCallback
): () => void {
  // Clean up any existing provider
  if (providerInstance) {
    providerInstance.shutdown();
  }

  // Create a resource identifying our demo app
  const resource = resourceFromAttributes({
    'service.name': 'observability-demo',
    'service.version': '1.0.0',
  });

  // Create the tracer provider with span processor
  const provider = new WebTracerProvider({
    resource,
    spanProcessors: [new CallbackSpanProcessor(onSpanEnd)],
  });

  // Register as global provider
  provider.register();

  providerInstance = provider;

  console.log('[Telemetry] Provider initialized');

  // Return cleanup function
  return () => {
    if (providerInstance) {
      providerInstance.shutdown();
      providerInstance = null;
      console.log('[Telemetry] Provider shutdown');
    }
  };
}

/**
 * Check if a telemetry provider is currently active
 */
export function isProviderInitialized(): boolean {
  return providerInstance !== null;
}
