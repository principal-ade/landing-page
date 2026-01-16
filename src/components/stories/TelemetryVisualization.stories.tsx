import type { Meta, StoryObj } from '@storybook/react';
import { TelemetryVisualization } from '../TelemetryVisualization';

/**
 * Telemetry Visualization Section
 *
 * Showcases the telemetry visualization feature with a video demo
 * of watching agent execution in real-time.
 */

const meta = {
  title: 'Landing Page/Telemetry Visualization',
  component: TelemetryVisualization,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Section highlighting telemetry visualization capabilities with video demo and early access CTA.',
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TelemetryVisualization>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view of Telemetry Visualization section
 */
export const Default: Story = {
  args: {
    isMobile: false,
  },
};

/**
 * Mobile view of Telemetry Visualization section
 */
export const Mobile: Story = {
  args: {
    isMobile: true,
  },
};
