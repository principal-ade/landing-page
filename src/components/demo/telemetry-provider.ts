/**
 * OpenTelemetry Provider for the Demo Page
 *
 * Sets up a TracerProvider that captures spans from the instrumented
 * Kanban panel and forwards them in OTLP format for trace matching.
 */

import { type Span, type Context } from '@opentelemetry/api';
import {
  WebTracerProvider,
  type SpanProcessor,
  type ReadableSpan,
} from '@opentelemetry/sdk-trace-web';
import { resourceFromAttributes } from '@opentelemetry/resources';
import type {
  OtelExportTraceServiceRequest,
  OtelSpanData,
  OtelKeyValue,
  OtelResourceData,
  OtelScopeSpans,
} from '@principal-ai/principal-view-core';

/**
 * Captured span data for display (simplified format for waterfall view)
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
 * Callback for when spans are captured (simplified format)
 */
export type SpanCaptureCallback = (span: CapturedSpan) => void;

/**
 * Callback for when a complete trace is ready (OTLP format)
 */
export type TraceCaptureCallback = (trace: OtelExportTraceServiceRequest) => void;

/**
 * Convert HrTime [seconds, nanoseconds] to nanoseconds string
 */
function hrTimeToNanos(hrTime: [number, number]): string {
  const nanos = BigInt(hrTime[0]) * BigInt(1_000_000_000) + BigInt(hrTime[1]);
  return nanos.toString();
}

/**
 * Convert HrTime to milliseconds
 */
function hrTimeToMs(hrTime: [number, number]): number {
  return hrTime[0] * 1000 + hrTime[1] / 1_000_000;
}

/**
 * Convert attributes object to OTLP KeyValue array
 */
function toOtelAttributes(attrs: Record<string, unknown>): OtelKeyValue[] {
  return Object.entries(attrs).map(([key, value]) => ({
    key,
    value: toOtelValue(value),
  }));
}

/**
 * Convert a value to OTLP AnyValue format
 */
function toOtelValue(value: unknown): OtelKeyValue['value'] {
  if (typeof value === 'string') {
    return { stringValue: value };
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { intValue: value } : { doubleValue: value };
  }
  if (typeof value === 'boolean') {
    return { boolValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toOtelValue) } };
  }
  return { stringValue: String(value) };
}

/**
 * Convert ReadableSpan to OtelSpanData (OTLP format)
 */
function toOtelSpan(span: ReadableSpan): OtelSpanData {
  const ctx = span.spanContext();
  return {
    traceId: ctx.traceId,
    spanId: ctx.spanId,
    parentSpanId: (span as unknown as { parentSpanId?: string }).parentSpanId,
    name: span.name,
    kind: span.kind,
    startTimeUnixNano: hrTimeToNanos(span.startTime),
    endTimeUnixNano: hrTimeToNanos(span.endTime),
    attributes: toOtelAttributes(span.attributes as Record<string, unknown>),
    events: span.events.map((event) => ({
      timeUnixNano: hrTimeToNanos(event.time),
      name: event.name,
      attributes: event.attributes
        ? toOtelAttributes(event.attributes as Record<string, unknown>)
        : [],
    })),
    status: {
      code: span.status.code,
      message: span.status.message,
    },
  };
}

/**
 * Convert ReadableSpan to CapturedSpan (simplified format)
 */
function toCapturedSpan(span: ReadableSpan): CapturedSpan {
  const ctx = span.spanContext();
  return {
    traceId: ctx.traceId,
    spanId: ctx.spanId,
    parentSpanId: (span as unknown as { parentSpanId?: string }).parentSpanId,
    name: span.name,
    kind: span.kind,
    startTime: hrTimeToMs(span.startTime),
    endTime: hrTimeToMs(span.endTime),
    duration: hrTimeToMs(span.duration),
    status: {
      code: span.status.code,
      message: span.status.message,
    },
    attributes: { ...span.attributes },
    events: span.events.map((event) => ({
      name: event.name,
      time: hrTimeToMs(event.time),
      attributes: event.attributes ? { ...event.attributes } : undefined,
    })),
    resource: span.resource.attributes as Record<string, unknown>,
  };
}

/**
 * Trace accumulator - collects spans and emits complete traces
 */
class TraceAccumulator {
  private pendingSpans = new Map<string, { spans: ReadableSpan[]; timeout: ReturnType<typeof setTimeout> }>();
  private traceTimeout: number;
  private onTraceComplete: TraceCaptureCallback;
  private resourceData: OtelResourceData | null = null;

  constructor(onTraceComplete: TraceCaptureCallback, traceTimeoutMs = 1000) {
    this.onTraceComplete = onTraceComplete;
    this.traceTimeout = traceTimeoutMs;
  }

  setResource(resource: OtelResourceData): void {
    this.resourceData = resource;
  }

  addSpan(span: ReadableSpan): void {
    const traceId = span.spanContext().traceId;

    if (!this.pendingSpans.has(traceId)) {
      this.pendingSpans.set(traceId, {
        spans: [],
        timeout: setTimeout(() => this.flushTrace(traceId), this.traceTimeout),
      });
    }

    const pending = this.pendingSpans.get(traceId)!;
    pending.spans.push(span);

    // Reset timeout
    clearTimeout(pending.timeout);
    pending.timeout = setTimeout(() => this.flushTrace(traceId), this.traceTimeout);
  }

  private flushTrace(traceId: string): void {
    const pending = this.pendingSpans.get(traceId);
    if (!pending || pending.spans.length === 0) {
      this.pendingSpans.delete(traceId);
      return;
    }

    const { spans } = pending;
    this.pendingSpans.delete(traceId);

    // Build OTLP structure
    const otelSpans = spans.map(toOtelSpan);

    // Get resource from first span
    const resourceAttrs = spans[0].resource.attributes as Record<string, unknown>;
    const resource: OtelResourceData = this.resourceData || {
      attributes: toOtelAttributes(resourceAttrs),
    };

    // Get scope from first span (assuming all spans have same scope)
    const scopeSpans: OtelScopeSpans = {
      scope: {
        name: spans[0].instrumentationScope?.name || 'unknown',
        version: spans[0].instrumentationScope?.version || '0.0.0',
      },
      spans: otelSpans,
    };

    const otlpTrace: OtelExportTraceServiceRequest = {
      resourceSpans: [
        {
          resource,
          scopeSpans: [scopeSpans],
        },
      ],
    };

    this.onTraceComplete(otlpTrace);
  }

  flush(): void {
    for (const traceId of this.pendingSpans.keys()) {
      this.flushTrace(traceId);
    }
  }
}

/**
 * Custom SpanProcessor that captures completed spans in both formats
 */
class DualFormatSpanProcessor implements SpanProcessor {
  private spanCallback: SpanCaptureCallback;
  private accumulator: TraceAccumulator;

  constructor(onSpan: SpanCaptureCallback, onTrace: TraceCaptureCallback) {
    this.spanCallback = onSpan;
    this.accumulator = new TraceAccumulator(onTrace);
  }

  onStart(_span: Span, _parentContext: Context): void {
    // We capture on end, not start
  }

  onEnd(span: ReadableSpan): void {
    // Emit simplified span immediately (for waterfall view)
    this.spanCallback(toCapturedSpan(span));

    // Accumulate for OTLP trace (for TraceOrchestrator)
    this.accumulator.addSpan(span);
  }

  shutdown(): Promise<void> {
    this.accumulator.flush();
    return Promise.resolve();
  }

  forceFlush(): Promise<void> {
    this.accumulator.flush();
    return Promise.resolve();
  }
}

let providerInstance: WebTracerProvider | null = null;

/**
 * Initialize the telemetry provider for the demo
 *
 * @param onSpanEnd - Callback invoked when individual spans complete (for waterfall)
 * @param onTraceComplete - Callback invoked when a complete trace is ready (for matching)
 * @returns Cleanup function to shutdown the provider
 */
export function initializeTelemetryProvider(
  onSpanEnd: SpanCaptureCallback,
  onTraceComplete?: TraceCaptureCallback
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

  // Default trace callback if not provided
  const traceCallback = onTraceComplete || (() => {});

  // Create the tracer provider with span processor
  const provider = new WebTracerProvider({
    resource,
    spanProcessors: [new DualFormatSpanProcessor(onSpanEnd, traceCallback)],
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
