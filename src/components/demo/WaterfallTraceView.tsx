'use client';

import React, { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import type { CapturedSpan } from './telemetry-provider';

interface WaterfallTraceViewProps {
  spans: CapturedSpan[];
  onClear: () => void;
}

interface TraceGroup {
  traceId: string;
  spans: CapturedSpan[];
  rootSpan: CapturedSpan | null;
  startTime: number;
  endTime: number;
  duration: number;
}

interface SpanNode {
  span: CapturedSpan;
  children: SpanNode[];
  depth: number;
}

/**
 * Build a tree structure from flat spans based on parentSpanId
 */
function buildSpanTree(spans: CapturedSpan[]): SpanNode[] {
  const spanMap = new Map<string, SpanNode>();
  const roots: SpanNode[] = [];

  // Create nodes for all spans
  spans.forEach(span => {
    spanMap.set(span.spanId, { span, children: [], depth: 0 });
  });

  // Build tree structure
  spans.forEach(span => {
    const node = spanMap.get(span.spanId)!;
    if (span.parentSpanId && spanMap.has(span.parentSpanId)) {
      const parent = spanMap.get(span.parentSpanId)!;
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  // Calculate depths
  function setDepths(node: SpanNode, depth: number) {
    node.depth = depth;
    node.children.forEach(child => setDepths(child, depth + 1));
  }
  roots.forEach(root => setDepths(root, 0));

  // Sort children by start time
  function sortChildren(node: SpanNode) {
    node.children.sort((a, b) => a.span.startTime - b.span.startTime);
    node.children.forEach(sortChildren);
  }
  roots.forEach(sortChildren);

  return roots;
}

/**
 * Flatten tree to ordered list for rendering
 */
function flattenTree(roots: SpanNode[]): SpanNode[] {
  const result: SpanNode[] = [];
  function traverse(node: SpanNode) {
    result.push(node);
    node.children.forEach(traverse);
  }
  roots.sort((a, b) => a.span.startTime - b.span.startTime);
  roots.forEach(traverse);
  return result;
}

/**
 * Group spans by trace ID
 */
function groupByTrace(spans: CapturedSpan[]): TraceGroup[] {
  const groups = new Map<string, CapturedSpan[]>();

  spans.forEach(span => {
    if (!groups.has(span.traceId)) {
      groups.set(span.traceId, []);
    }
    groups.get(span.traceId)!.push(span);
  });

  return Array.from(groups.entries()).map(([traceId, traceSpans]) => {
    const startTime = Math.min(...traceSpans.map(s => s.startTime));
    const endTime = Math.max(...traceSpans.map(s => s.endTime));
    const rootSpan = traceSpans.find(s => !s.parentSpanId) || traceSpans[0];

    return {
      traceId,
      spans: traceSpans,
      rootSpan,
      startTime,
      endTime,
      duration: endTime - startTime,
    };
  }).sort((a, b) => b.startTime - a.startTime); // Most recent first
}

function formatDuration(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
  if (ms < 1000) return `${ms.toFixed(1)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function getStatusColor(code: number): string {
  switch (code) {
    case 0: return '#94a3b8'; // UNSET
    case 1: return '#10b981'; // OK
    case 2: return '#ef4444'; // ERROR
    default: return '#94a3b8';
  }
}

// Generate deterministic color for service/span name
function getSpanColor(name: string): string {
  const colors = [
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#f97316', // orange
    '#14b8a6', // teal
    '#84cc16', // lime
    '#06b6d4', // cyan
    '#f59e0b', // amber
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash = hash & hash;
  }
  return colors[Math.abs(hash) % colors.length];
}

export function WaterfallTraceView({ spans, onClear }: WaterfallTraceViewProps) {
  const traceGroups = useMemo(() => groupByTrace(spans), [spans]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(0, 0, 0, 0.2)',
        flexShrink: 0,
      }}>
        <div>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#ffffff',
            margin: 0,
            fontFamily: 'Inter, sans-serif',
          }}>
            Trace Waterfall
          </h2>
                  </div>
        <button
          onClick={onClear}
          style={{
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            color: '#94a3b8',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          Clear
        </button>
      </div>

      {/* Trace List */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '16px',
      }}>
        {traceGroups.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#666',
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
            padding: '40px',
          }}>
            <BarChart3 size={48} strokeWidth={1.5} color="#666" style={{ marginBottom: '16px' }} />
            <p style={{ fontSize: '14px', margin: 0 }}>
              No traces yet. Interact with the Kanban board to generate telemetry.
            </p>
            <p style={{ fontSize: '12px', margin: '8px 0 0 0', color: '#555' }}>
              Try dragging a task to another column, or clicking on a task.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {traceGroups.map((trace) => (
              <TraceWaterfall key={trace.traceId} trace={trace} />
            ))}
          </div>
        )}
      </div>

      {/* Footer notice */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(255, 255, 255, 0.02)',
        flexShrink: 0,
      }}>
        <p style={{
          fontSize: '11px',
          color: '#666',
          margin: 0,
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
        }}>
          Standard trace view - technical span data without business context
        </p>
      </div>
    </div>
  );
}

function TraceWaterfall({ trace }: { trace: TraceGroup }) {
  const tree = useMemo(() => buildSpanTree(trace.spans), [trace.spans]);
  const flatSpans = useMemo(() => flattenTree(tree), [tree]);
  const [expanded, setExpanded] = React.useState(true);

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      {/* Trace Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '12px 16px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderBottom: expanded ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            color: '#666',
            fontSize: '12px',
            transition: 'transform 0.2s',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          }}>
            ▶
          </span>
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#ffffff',
              fontFamily: 'Fira Code, monospace',
            }}>
              {trace.rootSpan?.name || 'Unknown'}
            </div>
            <div style={{
              fontSize: '10px',
              color: '#666',
              fontFamily: 'Fira Code, monospace',
              marginTop: '2px',
            }}>
              {trace.traceId.slice(0, 16)}...
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{
            fontSize: '11px',
            color: '#94a3b8',
            fontFamily: 'Inter, sans-serif',
          }}>
            {trace.spans.length} spans
          </span>
          <span style={{
            fontSize: '12px',
            color: '#84CC16',
            fontFamily: 'Fira Code, monospace',
            fontWeight: 600,
          }}>
            {formatDuration(trace.duration)}
          </span>
        </div>
      </div>

      {/* Waterfall */}
      {expanded && (
        <div style={{ padding: '8px 0' }}>
          {flatSpans.map((node) => (
            <WaterfallRow
              key={node.span.spanId}
              node={node}
              traceStart={trace.startTime}
              traceDuration={trace.duration}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WaterfallRow({
  node,
  traceStart,
  traceDuration,
}: {
  node: SpanNode;
  traceStart: number;
  traceDuration: number;
}) {
  const { span, depth } = node;
  const offsetPercent = traceDuration > 0
    ? ((span.startTime - traceStart) / traceDuration) * 100
    : 0;
  const widthPercent = traceDuration > 0
    ? (span.duration / traceDuration) * 100
    : 100;

  const barColor = getSpanColor(span.name);
  const statusColor = getStatusColor(span.status.code);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '4px 16px',
      fontSize: '12px',
      fontFamily: 'Fira Code, monospace',
    }}>
      {/* Span name with indentation */}
      <div style={{
        width: '40%',
        minWidth: '200px',
        paddingLeft: `${depth * 16}px`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflow: 'hidden',
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: statusColor,
          flexShrink: 0,
        }} />
        <span style={{
          color: '#e2e8f0',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }} title={span.name}>
          {span.name}
        </span>
      </div>

      {/* Timeline bar */}
      <div style={{
        flex: 1,
        height: '20px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '2px',
        position: 'relative',
        marginRight: '12px',
      }}>
        <div style={{
          position: 'absolute',
          left: `${offsetPercent}%`,
          width: `${Math.max(widthPercent, 0.5)}%`,
          height: '100%',
          background: barColor,
          borderRadius: '2px',
          opacity: 0.8,
          minWidth: '2px',
        }} />
      </div>

      {/* Duration */}
      <div style={{
        width: '70px',
        textAlign: 'right',
        color: '#94a3b8',
        fontSize: '11px',
        flexShrink: 0,
      }}>
        {formatDuration(span.duration)}
      </div>
    </div>
  );
}

export default WaterfallTraceView;
