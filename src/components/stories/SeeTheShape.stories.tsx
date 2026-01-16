import type { Meta, StoryObj } from '@storybook/react';
import { SeeTheShape } from '../SeeTheShape';

/**
 * See the Shape Section
 *
 * A section that encourages users to visualize their codebase
 * through File City mapping.
 */

const meta = {
  title: 'Landing Page/See the Shape',
  component: SeeTheShape,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Section promoting File City visualization of codebases with a free repo mapping form.',
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0e1a' },
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SeeTheShape>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view of See the Shape section
 */
export const Default: Story = {
  args: {
    isMobile: false,
  },
};

/**
 * Mobile view of See the Shape section
 */
export const Mobile: Story = {
  args: {
    isMobile: true,
  },
};
