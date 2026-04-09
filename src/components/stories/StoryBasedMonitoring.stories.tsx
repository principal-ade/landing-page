import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ExplanationSection } from '../demo/ExplanationSection';

/**
 * StoryBasedMonitoring - Landing section explaining story-based monitoring
 *
 * This section introduces users to the concept of story-based monitoring with:
 * - Feature carousel showcasing key capabilities
 * - Visual presentation with grid background
 * - Interactive "Learn More" navigation
 */

const meta = {
  title: 'Landing Page/Story-based Monitoring',
  component: ExplanationSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Story-based monitoring landing section that explains how traces can tell a story. Features an interactive carousel showcasing Story-based Dev, AI Native Validation, and OTel integration.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ExplanationSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view of the story-based monitoring section
 */
export const Default: Story = {
  args: {},
};

/**
 * View in a container to see the full-screen layout
 */
export const InContainer: Story = {
  args: {},
  render: () => (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <ExplanationSection />
    </div>
  ),
};
