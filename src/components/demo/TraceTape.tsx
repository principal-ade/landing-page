'use client';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import type { RegisteredTrace } from '@principal-ai/principal-view-core';
import type { OtelSpanData } from '@principal-ai/principal-view-core';
import { getSpansFromTrace } from '@industry-theme/principal-view-panels';

/**
 * Represents a single visual marker on the tape (span or event)
 */
interface TapeMarker {
  id: string;
  type: 'span-start' | 'span-end' | 'event';
  timeMs: number;
  spanId: string;
  spanName: string;
  eventName?: string;
}

/**
 * Color configuration for the tape
 */
interface TraceTapeColors {
  line?: string;
  scrubber?: string;
  highlighted?: string;
  background?: string;
}

/**
 * Props for the TraceTape component
 */
export interface TraceTapeProps {
  /** Array of traces to display on the tape */
  traces: RegisteredTrace[];
  /** Currently highlighted span ID (controlled from parent) */
  highlightedSpanId?: string;
  /** Callback when user scrubs to a new span */
  onSpanHighlight: (spanId: string | null, span: OtelSpanData | null) => void;
  /** Height of the tape in pixels */
  height?: number;
  /** Whether the tape is interactive */
  interactive?: boolean;
  /** Color scheme configuration */
  colors?: TraceTapeColors;
}

/**
 * Parse nanosecond timestamp string to milliseconds
 */
function parseNanoTime(nanoStr: string): number {
  const nanos = BigInt(nanoStr);
  return Number(nanos / BigInt(1_000_000));
}

/**
 * Represents a compressed gap in the timeline
 */
interface CompressedGap {
  startTime: number;
  endTime: number;
  originalDuration: number;
  compressedDuration: number;
  displayPosition: number; // percentage where gap indicator shows
}

/**
 * Represents a segment of activity (traces grouped together)
 */
interface TimeSegment {
  startTime: number;
  endTime: number;
  displayStart: number; // percentage
  displayEnd: number;   // percentage
}

/**
 * TraceTape - A horizontal timeline scrubber for navigating trace spans
 *
 * Displays all trace spans and events as vertical lines on a horizontal tape.
 * Dragging the scrubber highlights the nearest span to the left of the cursor.
 */
export function TraceTape({
  traces,
  highlightedSpanId,
  onSpanHighlight,
  height = 48,
  interactive = true,
  colors = {},
}: TraceTapeProps) {
  const tapeRef = useRef<HTMLDivElement>(null);
  const [scrubberPercent, setScrubberPercent] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Merge default colors
  const resolvedColors = {
    line: '#3b82f6',
    scrubber: '#22d3ee',  // cyan
    highlighted: '#ffffff',
    background: 'rgba(0, 0, 0, 0.3)',
    ...colors,
  };

  // Compute time range from all traces
  const timeRange = useMemo(() => {
    if (traces.length === 0) return { min: 0, max: 0 };

    const allStartTimes = traces.map(t => t.startTime);
    const allEndTimes = traces.map(t => t.endTime);

    return {
      min: Math.min(...allStartTimes),
      max: Math.max(...allEndTimes),
    };
  }, [traces]);

  // Compute segments and gaps for compression
  const { segments, gaps } = useMemo(() => {
    if (traces.length === 0) {
      return { segments: [] as TimeSegment[], gaps: [] as CompressedGap[] };
    }

    // Sort traces by start time
    const sortedTraces = [...traces].sort((a, b) => a.startTime - b.startTime);

    // Find contiguous segments (merge overlapping/adjacent traces)
    const rawSegments: { start: number; end: number }[] = [];
    for (const trace of sortedTraces) {
      const last = rawSegments[rawSegments.length - 1];
      // Gap threshold: if gap is > 500ms, treat as separate segment
      const gapThreshold = 500;

      if (!last || trace.startTime > last.end + gapThreshold) {
        rawSegments.push({ start: trace.startTime, end: trace.endTime });
      } else {
        last.end = Math.max(last.end, trace.endTime);
      }
    }

    // If only one segment, no compression needed
    if (rawSegments.length <= 1) {
      return {
        segments: [{
          startTime: timeRange.min,
          endTime: timeRange.max,
          displayStart: 0,
          displayEnd: 100,
        }] as TimeSegment[],
        gaps: [] as CompressedGap[],
      };
    }

    // Calculate compressed layout
    // Each segment keeps its real duration, gaps are compressed to fixed size
    const compressedGapSize = 50; // ms equivalent display width for gaps
    const gapsFound: CompressedGap[] = [];

    let totalRealDuration = 0;
    for (const seg of rawSegments) {
      totalRealDuration += seg.end - seg.start;
    }
    const totalGapDisplay = (rawSegments.length - 1) * compressedGapSize;
    const totalDisplay = totalRealDuration + totalGapDisplay;

    // Build segments with display positions
    const segs: TimeSegment[] = [];
    let displayOffset = 0;

    for (let i = 0; i < rawSegments.length; i++) {
      const raw = rawSegments[i];
      const segDuration = raw.end - raw.start;
      const displayWidth = (segDuration / totalDisplay) * 100;

      segs.push({
        startTime: raw.start,
        endTime: raw.end,
        displayStart: displayOffset,
        displayEnd: displayOffset + displayWidth,
      });

      displayOffset += displayWidth;

      // Add gap after this segment (if not last)
      if (i < rawSegments.length - 1) {
        const nextRaw = rawSegments[i + 1];
        const gapDisplayWidth = (compressedGapSize / totalDisplay) * 100;

        gapsFound.push({
          startTime: raw.end,
          endTime: nextRaw.start,
          originalDuration: nextRaw.start - raw.end,
          compressedDuration: compressedGapSize,
          displayPosition: displayOffset + gapDisplayWidth / 2,
        });

        displayOffset += gapDisplayWidth;
      }
    }

    return { segments: segs, gaps: gapsFound };
  }, [traces, timeRange]);

  // Convert time to display percentage (with gap compression)
  const timeToPercent = useCallback((timeMs: number): number => {
    if (segments.length === 0) return 50;

    // Find which segment this time falls into
    for (const seg of segments) {
      if (timeMs >= seg.startTime && timeMs <= seg.endTime) {
        const segProgress = (timeMs - seg.startTime) / (seg.endTime - seg.startTime);
        return seg.displayStart + segProgress * (seg.displayEnd - seg.displayStart);
      }
    }

    // Time is in a gap - clamp to nearest segment edge
    for (let i = 0; i < gaps.length; i++) {
      const gap = gaps[i];
      if (timeMs > gap.startTime && timeMs < gap.endTime) {
        // Return the gap's display position
        return gap.displayPosition;
      }
    }

    // Before first segment
    if (timeMs < segments[0].startTime) {
      return segments[0].displayStart;
    }

    // After last segment
    return segments[segments.length - 1].displayEnd;
  }, [segments, gaps]);

  // Convert display percentage back to time (with gap compression)
  const percentToTime = useCallback((percent: number): number => {
    if (segments.length === 0) return timeRange.min;

    // Find which segment this percent falls into
    for (const seg of segments) {
      if (percent >= seg.displayStart && percent <= seg.displayEnd) {
        const displayProgress = (percent - seg.displayStart) / (seg.displayEnd - seg.displayStart);
        return seg.startTime + displayProgress * (seg.endTime - seg.startTime);
      }
    }

    // In a gap - return the gap start time
    for (let i = 0; i < gaps.length; i++) {
      const gap = gaps[i];
      const prevSeg = segments[i];
      const nextSeg = segments[i + 1];
      if (percent > prevSeg.displayEnd && percent < nextSeg.displayStart) {
        return gap.startTime;
      }
    }

    // Before first segment
    if (percent < segments[0].displayStart) {
      return segments[0].startTime;
    }

    // After last segment
    return segments[segments.length - 1].endTime;
  }, [segments, gaps, timeRange]);

  // Build span lookup map
  const spanMap = useMemo(() => {
    const map = new Map<string, OtelSpanData>();
    traces.forEach(trace => {
      const spans = getSpansFromTrace(trace);
      spans.forEach(span => map.set(span.spanId, span));
    });
    return map;
  }, [traces]);

  // Extract span bars (for duration display) and event markers
  const { spanBars, eventMarkers } = useMemo(() => {
    const bars: Array<{
      id: string;
      spanId: string;
      spanName: string;
      startMs: number;
      endMs: number;
    }> = [];
    const events: TapeMarker[] = [];

    traces.forEach(trace => {
      const spans = getSpansFromTrace(trace);

      spans.forEach(span => {
        const startMs = parseNanoTime(span.startTimeUnixNano);
        const endMs = parseNanoTime(span.endTimeUnixNano);

        // Add span bar
        bars.push({
          id: span.spanId,
          spanId: span.spanId,
          spanName: span.name,
          startMs,
          endMs,
        });

        // Add event markers
        span.events?.forEach((event, idx) => {
          const eventMs = parseNanoTime(event.timeUnixNano);
          events.push({
            id: `${span.spanId}-event-${idx}`,
            type: 'event',
            timeMs: eventMs,
            spanId: span.spanId,
            spanName: span.name,
            eventName: event.name,
          });
        });
      });
    });

    // Sort bars by start time, events by time
    bars.sort((a, b) => a.startMs - b.startMs);
    events.sort((a, b) => a.timeMs - b.timeMs);

    return { spanBars: bars, eventMarkers: events };
  }, [traces]);

  // Keep markers for backward compatibility (used in findNearestSpanToLeft)
  const markers = useMemo((): TapeMarker[] => {
    const result: TapeMarker[] = [];

    spanBars.forEach(bar => {
      result.push({
        id: `${bar.spanId}-start`,
        type: 'span-start',
        timeMs: bar.startMs,
        spanId: bar.spanId,
        spanName: bar.spanName,
      });
    });

    return result.sort((a, b) => a.timeMs - b.timeMs);
  }, [spanBars]);

  // Get unique span start markers for "nearest to left" search
  const spanStartMarkers = useMemo(() => {
    return markers.filter(m => m.type === 'span-start');
  }, [markers]);

  // Find the nearest span TO THE LEFT of the given time
  const findNearestSpanToLeft = useCallback((timeMs: number): OtelSpanData | null => {
    // Get all span start markers at or before this time
    const eligible = spanStartMarkers.filter(m => m.timeMs <= timeMs);

    if (eligible.length === 0) return null;

    // Find the closest one (highest time that's still <= timeMs)
    const closest = eligible.reduce((prev, curr) =>
      curr.timeMs > prev.timeMs ? curr : prev
    );

    return spanMap.get(closest.spanId) || null;
  }, [spanStartMarkers, spanMap]);

  // Get relative X percentage from mouse/touch event
  const getRelativePercent = useCallback((event: MouseEvent | TouchEvent): number => {
    if (!tapeRef.current) return 0;

    const rect = tapeRef.current.getBoundingClientRect();
    const clientX = 'touches' in event
      ? event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX ?? 0
      : event.clientX;

    const x = clientX - rect.left;
    const percent = (x / rect.width) * 100;

    // Clamp to 0-100
    return Math.max(0, Math.min(100, percent));
  }, []);

  // Handle pointer down - start dragging
  const handlePointerDown = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!interactive) return;

    event.preventDefault();
    setIsDragging(true);

    const percent = getRelativePercent(event.nativeEvent);
    setScrubberPercent(percent);

    const timeMs = percentToTime(percent);
    const span = findNearestSpanToLeft(timeMs);

    onSpanHighlight(span?.spanId || null, span);
  }, [interactive, percentToTime, findNearestSpanToLeft, onSpanHighlight, getRelativePercent]);

  // Handle pointer move - update scrubber position
  const handlePointerMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDragging || !tapeRef.current) return;

    event.preventDefault();

    const percent = getRelativePercent(event);
    setScrubberPercent(percent);

    const timeMs = percentToTime(percent);
    const span = findNearestSpanToLeft(timeMs);

    onSpanHighlight(span?.spanId || null, span);
  }, [isDragging, percentToTime, findNearestSpanToLeft, onSpanHighlight, getRelativePercent]);

  // Handle pointer up - stop dragging
  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Attach/detach global listeners for drag tracking
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove, { passive: false });
      window.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);


  const duration = timeRange.max - timeRange.min;

  // Format relative time for display (offset from start)
  const formatRelativeTime = (ms: number): string => {
    const offset = ms - timeRange.min;
    const totalSeconds = Math.floor(offset / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor(offset % 1000);

    if (minutes > 0) {
      return `${minutes}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
    }
    return `${seconds}.${String(milliseconds).padStart(3, '0')}`;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* Start time label */}
      <div style={{
        fontSize: '11px',
        fontFamily: 'Fira Code, monospace',
        color: '#64748b',
        whiteSpace: 'nowrap',
        minWidth: '60px',
      }}>
        {traces.length > 0 ? '0.000' : '--.---'}
      </div>

      {/* Tape */}
      <div
        ref={tapeRef}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        style={{
          position: 'relative',
          flex: 1,
          height: `${height}px`,
          background: resolvedColors.background,
          borderRadius: '4px',
          overflow: 'visible',
          cursor: interactive ? 'pointer' : 'default',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
      {/* Empty state */}
      {traces.length === 0 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
        }}>
          No traces
        </div>
      )}

      {/* Gap indicators */}
      {gaps.map((gap, i) => (
        <div
          key={`gap-${i}`}
          style={{
            position: 'absolute',
            left: `${gap.displayPosition}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '10px',
            fontFamily: 'Fira Code, monospace',
            color: '#475569',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
          title={`Gap: ${(gap.originalDuration / 1000).toFixed(1)}s`}
        >
          ⋯
        </div>
      ))}

      {/* Span duration bars */}
      {duration > 0 && spanBars.map(bar => {
        const startPercent = timeToPercent(bar.startMs);
        const endPercent = timeToPercent(bar.endMs);
        const widthPercent = Math.max(0.5, endPercent - startPercent); // min width for visibility
        const isHighlighted = bar.spanId === highlightedSpanId;

        return (
          <div
            key={bar.id}
            style={{
              position: 'absolute',
              left: `${startPercent}%`,
              width: `${widthPercent}%`,
              top: '12px',
              bottom: '12px',
              background: isHighlighted ? resolvedColors.highlighted : resolvedColors.line,
              opacity: isHighlighted ? 0.9 : 0.4,
              borderRadius: '2px',
              transition: 'opacity 0.1s',
              pointerEvents: 'none',
            }}
            title={`${bar.spanName} (${(bar.endMs - bar.startMs).toFixed(1)}ms)`}
          />
        );
      })}

      {/* Event markers */}
      {duration > 0 && eventMarkers.map(marker => {
        const percent = timeToPercent(marker.timeMs);
        const isHighlighted = marker.spanId === highlightedSpanId;

        return (
          <div
            key={marker.id}
            style={{
              position: 'absolute',
              left: `${percent}%`,
              top: '4px',
              bottom: '4px',
              width: '2px',
              marginLeft: '-1px',
              background: isHighlighted ? '#fbbf24' : '#f59e0b',
              opacity: isHighlighted ? 1 : 0.6,
              borderRadius: '1px',
              pointerEvents: 'none',
            }}
            title={`${marker.spanName} - ${marker.eventName}`}
          />
        );
      })}

      {/* Scrubber line */}
      {scrubberPercent !== null && (
        <div
          style={{
            position: 'absolute',
            left: `${scrubberPercent}%`,
            top: 0,
            bottom: 0,
            width: '2px',
            marginLeft: '-1px',
            background: resolvedColors.scrubber,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {/* Time label above scrubber */}
          <div
            style={{
              position: 'absolute',
              top: '-24px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              fontFamily: 'Fira Code, monospace',
              color: resolvedColors.scrubber,
              whiteSpace: 'nowrap',
              background: 'rgba(0, 0, 0, 0.8)',
              padding: '2px 6px',
              borderRadius: '3px',
            }}
          >
            {formatRelativeTime(percentToTime(scrubberPercent))}s
          </div>
          {/* Scrubber handle */}
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '-5px',
              width: '12px',
              height: '12px',
              background: resolvedColors.scrubber,
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          />
          {/* Bottom handle */}
          <div
            style={{
              position: 'absolute',
              bottom: '-4px',
              left: '-5px',
              width: '12px',
              height: '12px',
              background: resolvedColors.scrubber,
              borderRadius: '50%',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          />
        </div>
      )}
      </div>

      {/* End time label */}
      <div style={{
        fontSize: '11px',
        fontFamily: 'Fira Code, monospace',
        color: '#64748b',
        whiteSpace: 'nowrap',
        minWidth: '60px',
        textAlign: 'right',
      }}>
        {traces.length > 0 ? formatRelativeTime(timeRange.max) : '--.---'}
      </div>
    </div>
  );
}

export default TraceTape;
