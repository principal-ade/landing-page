import type { Meta, StoryObj } from '@storybook/react';
import { ANewMedium } from '../ANewMedium';

/**
 * A New Medium Section
 *
 * A philosophical section explaining how Principal is building
 * the visual language of software for the agentic development era.
 */

const meta = {
  title: 'Landing Page/A New Medium',
  component: ANewMedium,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Vision section comparing the emergence of film language to agentic development, positioning Principal as the visual language builder.',
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
} satisfies Meta<typeof ANewMedium>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view of A New Medium section
 */
export const Default: Story = {
  args: {
    isMobile: false,
  },
};

/**
 * Mobile view of A New Medium section
 */
export const Mobile: Story = {
  args: {
    isMobile: true,
  },
};
