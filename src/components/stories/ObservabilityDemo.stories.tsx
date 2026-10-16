import type { Meta, StoryObj } from '@storybook/react';
import { DemoView } from '../demo/DemoView';
import { ThemeProvider, slateTheme } from '@principal-ade/industry-theme';

/**
 * ObservabilityDemo - Interactive demo of the live Backlog.md Kanban panel.
 *
 * This demo includes:
 * - The live Backlog.md Kanban board
 * - A guided tour driving the board
 */

const meta = {
  title: 'Demo/ObservabilityDemo',
  component: DemoView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Interactive demo showcasing Principal\'s live task management view (Backlog.md Kanban).',
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={slateTheme}>
        <Story />
      </ThemeProvider>
    ),
  ],
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
    providerReady: true,
  },
};

/**
 * Demo shown before the panel is ready
 */
export const LoadingState: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('Close demo'),
    providerReady: false,
  },
};
