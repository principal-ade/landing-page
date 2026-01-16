import type { Meta, StoryObj } from '@storybook/react';
import { MultipleViews } from '../MultipleViews';

/**
 * Multiple Views Section
 *
 * Showcases the three different visualization lenses in Principal:
 * File City, Architecture Diagrams, and Quality Radar.
 */

const meta = {
  title: 'Landing Page/Multiple Views',
  component: MultipleViews,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Section showcasing multiple orthogonal views for understanding codebases: File City, Architecture Diagrams, and Quality Radar.',
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
} satisfies Meta<typeof MultipleViews>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view showing all three visualization types
 */
export const Default: Story = {
  args: {
    isMobile: false,
  },
};

/**
 * Mobile view
 */
export const Mobile: Story = {
  args: {
    isMobile: true,
  },
};
