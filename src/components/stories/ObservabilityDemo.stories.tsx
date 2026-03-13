import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { DemoView } from '../demo/DemoView';
import type { RegisteredTrace, VersionSnapshot } from '@principal-ai/principal-view-core';

/**
 * ObservabilityDemo - Full interactive demo showing Principal's observability features
 *
 * This demo includes:
 * - Storyboard visualization
 * - Backlog.md integration
 * - Traditional OpenTelemetry monitoring
 * - Story-based monitoring
 */

// Mock registered trace data
const createMockTrace = (id: string, baseTime: number): RegisteredTrace => {
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
            {
              traceId: id,
              spanId: `${id}-span-1`,
              name: 'root-operation',
              kind: 1,
              startTimeUnixNano: String(startTime * 1_000_000),
              endTimeUnixNano: String((startTime + duration) * 1_000_000),
              attributes: [],
              events: [],
              status: { code: 0 },
            },
          ],
        }],
      }],
    },
  } as RegisteredTrace;
};

const mockTraces: RegisteredTrace[] = [
  createMockTrace('trace-001', Date.now() - 2000),
  createMockTrace('trace-002', Date.now() - 1000),
  createMockTrace('trace-003', Date.now() - 500),
];

// Mock schematics data
const mockSchematics: VersionSnapshot[] = [];

const meta = {
  title: 'Demo/ObservabilityDemo',
  component: DemoView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Interactive observability demo showcasing Principal\'s monitoring and task management capabilities.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DemoView>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default interactive demo
 */
export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close demo'),
    schematics: mockSchematics,
    providerReady: true,
    registeredTraces: mockTraces,
    onClearTraces: () => console.log('Clear traces'),
  },
};

/**
 * Interactive demo with state management
 */
function InteractiveDemo() {
  const [traces, setTraces] = useState<RegisteredTrace[]>(mockTraces);
  const [providerReady, setProviderReady] = useState(true);

  const handleClearTraces = () => {
    setTraces([]);
    console.log('Traces cleared');
  };

  const handleAddTrace = () => {
    const newTrace = createMockTrace(`trace-${Date.now()}`, Date.now());
    setTraces(prev => [newTrace, ...prev].slice(0, 20));
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10000,
        display: 'flex',
        gap: '8px',
      }}>
        <button
          onClick={handleAddTrace}
          style={{
            padding: '8px 16px',
            background: '#00C2FF',
            color: '#0d1b2a',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Add Trace
        </button>
        <button
          onClick={handleClearTraces}
          style={{
            padding: '8px 16px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Clear All
        </button>
      </div>
      <DemoView
        isOpen={true}
        onClose={() => console.log('Close demo')}
        schematics={mockSchematics}
        providerReady={providerReady}
        registeredTraces={traces}
        onClearTraces={handleClearTraces}
      />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

/**
 * Demo with empty state (no traces)
 */
export const EmptyState: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close demo'),
    schematics: mockSchematics,
    providerReady: true,
    registeredTraces: [],
    onClearTraces: () => {},
  },
};

/**
 * Demo with provider not ready
 */
export const LoadingState: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close demo'),
    schematics: mockSchematics,
    providerReady: false,
    registeredTraces: [],
    onClearTraces: () => {},
  },
};

/**
 * Demo with many traces
 */
export const ManyTraces: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close demo'),
    schematics: mockSchematics,
    providerReady: true,
    registeredTraces: Array.from({ length: 20 }, (_, i) =>
      createMockTrace(`trace-${i.toString().padStart(3, '0')}`, Date.now() - (20 - i) * 500)
    ),
    onClearTraces: () => console.log('Clear traces'),
  },
};
