import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { TraceTape } from '../demo/TraceTape';
import type { RegisteredTrace } from '@principal-ai/principal-view-core';
import type { OtelSpanData } from '@principal-ai/principal-view-core';
import { ThemeProvider, slateTheme } from '@principal-ade/industry-theme';

/**
 * TraceTape - A horizontal timeline scrubber for navigating trace spans
 *
 * Displays all trace spans and events as vertical lines on a horizontal tape.
 * Dragging the scrubber highlights the nearest span to the left of the cursor.
 */

// Mock data generator
function createMockTrace(id: string, baseTime: number): RegisteredTrace {
  const startTime = baseTime;
  const duration = 500 + Math.random() * 1000;

  return {
    traceId: id,
    name: `trace-${id}`,
    startTime,
    endTime: startTime + duration,
    duration,
    spanCount: 5,
    hasErrors: false,
    resources: [],
    scenarioMatches: [],
    storyboardMatches: [],
    unmatchedSpans: { spans: [] },
    otlpData: {
      resourceSpans: [{
        resource: { attributes: [] },
        scopeSpans: [{
          scope: { name: 'test', version: '1.0.0' },
          spans: [
            // Root span
            {
              traceId: id,
              spanId: `${id}-span-1`,
              name: 'root-operation',
              kind: 1,
              startTimeUnixNano: String(startTime * 1_000_000),
              endTimeUnixNano: String((startTime + duration) * 1_000_000),
              attributes: [],
              events: [
                {
                  timeUnixNano: String((startTime + 100) * 1_000_000),
                  name: 'event-start',
                  attributes: [],
                },
                {
                  timeUnixNano: String((startTime + 200) * 1_000_000),
                  name: 'event-processing',
                  attributes: [],
                },
              ],
              status: { code: 0 },
            },
            // Child span 1
            {
              traceId: id,
              spanId: `${id}-span-2`,
              parentSpanId: `${id}-span-1`,
              name: 'database-query',
              kind: 3,
              startTimeUnixNano: String((startTime + 50) * 1_000_000),
              endTimeUnixNano: String((startTime + 150) * 1_000_000),
              attributes: [],
              events: [],
              status: { code: 0 },
            },
            // Child span 2
            {
              traceId: id,
              spanId: `${id}-span-3`,
              parentSpanId: `${id}-span-1`,
              name: 'external-api-call',
              kind: 3,
              startTimeUnixNano: String((startTime + 200) * 1_000_000),
              endTimeUnixNano: String((startTime + 400) * 1_000_000),
              attributes: [],
              events: [
                {
                  timeUnixNano: String((startTime + 300) * 1_000_000),
                  name: 'response-received',
                  attributes: [],
                },
              ],
              status: { code: 0 },
            },
          ],
        }],
      }],
    },
  } as RegisteredTrace;
}

const mockTraces: RegisteredTrace[] = [
  createMockTrace('trace-001', Date.now() - 2000),
  createMockTrace('trace-002', Date.now() - 1000),
  createMockTrace('trace-003', Date.now() - 500),
];

const meta = {
  title: 'Demo/TraceTape',
  component: TraceTape,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A horizontal timeline scrubber for navigating through trace spans and events. Drag across the tape to highlight spans.',
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: slateTheme.colors.background },
      ],
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={slateTheme}>
        <div style={{
          padding: '24px',
          backgroundColor: slateTheme.colors.background,
          minHeight: '200px',
        }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof TraceTape>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view with mock trace data
 */
export const Default: Story = {
  args: {
    traces: mockTraces,
    onSpanHighlight: (spanId, span) => {
      console.log('Highlighted span:', spanId, span?.name);
    },
  },
};

/**
 * Interactive story with controlled state showing the highlighted span details
 */
function InteractiveTraceTape() {
  const [highlightedSpanId, setHighlightedSpanId] = useState<string | null>(null);
  const [highlightedSpan, setHighlightedSpan] = useState<OtelSpanData | null>(null);

  return (
    <ThemeProvider theme={slateTheme}>
      <div>
        <TraceTape
          traces={mockTraces}
          highlightedSpanId={highlightedSpanId ?? undefined}
          onSpanHighlight={(spanId, span) => {
            setHighlightedSpanId(spanId);
            setHighlightedSpan(span);
          }}
        />
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '4px',
          fontFamily: 'Fira Code, monospace',
          fontSize: '13px',
          color: '#94a3b8',
        }}>
          <div><strong style={{ color: '#fff' }}>Highlighted Span ID:</strong> {highlightedSpanId || 'None'}</div>
          <div><strong style={{ color: '#fff' }}>Span Name:</strong> {highlightedSpan?.name || 'None'}</div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export const Interactive: Story = {
  args: {
    traces: mockTraces,
    onSpanHighlight: () => {},
  },
  render: () => <InteractiveTraceTape />,
};

/**
 * Custom color scheme
 */
export const CustomColors: Story = {
  args: {
    traces: mockTraces,
    onSpanHighlight: () => {},
    colors: {
      line: '#8b5cf6',         // Purple
      scrubber: '#22c55e',     // Green
      highlighted: '#fbbf24',  // Yellow
      background: 'rgba(139, 92, 246, 0.1)',
    },
  },
};

/**
 * Taller tape for better visibility
 */
export const TallTape: Story = {
  args: {
    traces: mockTraces,
    onSpanHighlight: () => {},
    height: 80,
  },
};

/**
 * Non-interactive display-only mode
 */
export const NonInteractive: Story = {
  args: {
    traces: mockTraces,
    onSpanHighlight: () => {},
    interactive: false,
  },
};

/**
 * Empty state when no traces are loaded
 */
export const EmptyState: Story = {
  args: {
    traces: [],
    onSpanHighlight: () => {},
  },
};

/**
 * Single trace showing all spans from one operation
 */
export const SingleTrace: Story = {
  args: {
    traces: [createMockTrace('single-trace', Date.now())],
    onSpanHighlight: (spanId, span) => {
      console.log('Highlighted span:', spanId, span?.name);
    },
  },
};

/**
 * Many traces showing a busy timeline
 */
export const ManyTraces: Story = {
  args: {
    traces: Array.from({ length: 10 }, (_, i) =>
      createMockTrace(`trace-${i.toString().padStart(3, '0')}`, Date.now() - (10 - i) * 300)
    ),
    onSpanHighlight: (spanId, span) => {
      console.log('Highlighted span:', spanId, span?.name);
    },
  },
};
