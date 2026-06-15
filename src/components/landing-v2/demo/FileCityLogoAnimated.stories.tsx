import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../../providers/ClientThemeProvider';
import { FileCityLogoAnimated } from '@principal-ai/logo-component';
import { useTheme } from '@principal-ade/industry-theme';

/**
 * FileCityLogoAnimated - Animated file-city glyph with heatmap build effect
 *
 * Trail documentation: https://principal.ai/trails/00697c8c-f987-467a-88f6-6035930c85a4
 *
 * Key Features:
 * - Self-contained animated SVG with auto-play on mount
 * - Configurable timing: batch sizes, cell delays, pause between groups
 * - Optional connector trail lines threading through each group
 * - Respects prefers-reduced-motion (jumps to finished state)
 * - playKey prop for manual replay control
 * - No canvas, no animation library - pure React + SVG
 *
 * Dependencies:
 * - React 18/19 (only required peer dependency)
 * - Optional: @principal-ade/industry-theme for theming
 *
 * Usage:
 * ```tsx
 * <FileCityLogoAnimated mark="P" width={220} height={220} />
 * ```
 */

const FileCityLogoAnimatedDemo: React.FC<{
  mark?: 'P' | 'AI' | 'PAI' | 'lockup' | 'none';
  width?: number;
  height?: number;
  autoPlay?: boolean;
  batchMin?: number;
  batchMax?: number;
  cellMs?: number;
  pauseMs?: number;
  connectors?: boolean;
  buildSteps?: number;
}> = (props) => {
  const { theme } = useTheme();
  const [playKey, setPlayKey] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        padding: '40px',
      }}
    >
      <FileCityLogoAnimated
        {...props}
        theme={theme}
        playKey={playKey}
        onComplete={() => {
          setCompleted(true);
          console.log('Animation completed!');
        }}
      />

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            setPlayKey(prev => prev + 1);
            setCompleted(false);
          }}
          style={{
            padding: '12px 24px',
            background: theme.colors.primary,
            color: theme.colors.background,
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Replay Animation
        </button>

        {completed && (
          <div
            style={{
              padding: '12px 24px',
              background: theme.colors.surface,
              color: theme.colors.success,
              border: `1px solid ${theme.colors.success}`,
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            ✓ Animation Complete
          </div>
        )}
      </div>

      <div
        style={{
          maxWidth: '600px',
          textAlign: 'center',
          color: theme.colors.textMuted,
          fontSize: '14px',
          lineHeight: '1.6',
        }}
      >
        <p style={{ margin: '0 0 12px 0' }}>
          <strong style={{ color: theme.colors.text }}>Trail:</strong>{' '}
          <a
            href="https://principal.ai/trails/00697c8c-f987-467a-88f6-6035930c85a4"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: theme.colors.primary, textDecoration: 'none' }}
          >
            FileCityLogoAnimated Documentation
          </a>
        </p>
        <p style={{ margin: 0 }}>
          Auto-plays a heatmap build of the file-city glyph. Change playKey to restart.
          Respects prefers-reduced-motion.
        </p>
      </div>
    </div>
  );
};

const meta = {
  title: 'Landing V2/File City Logo Animated',
  component: FileCityLogoAnimatedDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `The FileCityLogoAnimated component is a self-contained animated SVG that auto-plays a heatmap build effect of the file-city glyph.

**Key Features:**
- Auto-plays on mount (configurable with \`autoPlay={false}\`)
- Configurable timing: \`batchMin\`/\`batchMax\` (cells per group), \`cellMs\` (185ms between cells), \`pauseMs\` (900ms between groups)
- Optional connector trails: \`connectors={true}\` draws lines threading through each group
- Replay control: change \`playKey\` prop to restart animation
- Accessibility: respects \`prefers-reduced-motion\` by jumping to finished state
- Pure SVG: no canvas, no animation library, just React hooks + CSS keyframes

**Trail Documentation:** https://principal.ai/trails/00697c8c-f987-467a-88f6-6035930c85a4`,
      },
    },
  },
  decorators: [
    (Story) => (
      <ClientThemeProvider>
        <Story />
      </ClientThemeProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    mark: {
      control: 'select',
      options: ['P', 'AI', 'PAI', 'lockup', 'none'],
      description: 'Which glyph to render',
    },
    width: {
      control: { type: 'range', min: 100, max: 500, step: 10 },
      description: 'Width in pixels',
    },
    height: {
      control: { type: 'range', min: 100, max: 500, step: 10 },
      description: 'Height in pixels',
    },
    autoPlay: {
      control: 'boolean',
      description: 'Auto-play animation on mount',
    },
    batchMin: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
      description: 'Minimum cells revealed per group',
    },
    batchMax: {
      control: { type: 'range', min: 1, max: 20, step: 1 },
      description: 'Maximum cells revealed per group',
    },
    cellMs: {
      control: { type: 'range', min: 50, max: 500, step: 10 },
      description: 'Milliseconds between individual cells',
    },
    pauseMs: {
      control: { type: 'range', min: 200, max: 2000, step: 100 },
      description: 'Milliseconds pause between groups',
    },
    connectors: {
      control: 'boolean',
      description: 'Show connector trail lines',
    },
    buildSteps: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
      description: 'How gradually letter cells fill in',
    },
  },
} satisfies Meta<typeof FileCityLogoAnimatedDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default animated logo with Principal "P" mark
 * Auto-plays on mount with default timing
 */
export const Default: Story = {
  args: {
    mark: 'P',
    width: 220,
    height: 220,
    autoPlay: true,
  },
};

/**
 * Large lockup version with slower animation
 * Shows the full Principal AI wordmark + icon
 */
export const LargeLockup: Story = {
  args: {
    mark: 'lockup',
    width: 400,
    height: 400,
    cellMs: 250,
    pauseMs: 1200,
    autoPlay: true,
  },
};

/**
 * With connector trails
 * Draws lines threading through each revealed group
 */
export const WithConnectors: Story = {
  args: {
    mark: 'PAI',
    width: 300,
    height: 300,
    connectors: true,
    autoPlay: true,
  },
};

/**
 * Fast animation with small batches
 * Quick, snappy reveal effect
 */
export const FastAnimation: Story = {
  args: {
    mark: 'AI',
    width: 220,
    height: 220,
    batchMin: 1,
    batchMax: 3,
    cellMs: 80,
    pauseMs: 300,
    autoPlay: true,
  },
};

/**
 * Slow dramatic build
 * Large batches with long pauses between groups
 */
export const SlowDramatic: Story = {
  args: {
    mark: 'P',
    width: 300,
    height: 300,
    batchMin: 5,
    batchMax: 12,
    cellMs: 300,
    pauseMs: 1500,
    buildSteps: 5,
    autoPlay: true,
  },
};

/**
 * No auto-play - static resolved state
 * Renders the finished glyph immediately
 */
export const NoAutoPlay: Story = {
  args: {
    mark: 'P',
    width: 220,
    height: 220,
    autoPlay: false,
  },
};
