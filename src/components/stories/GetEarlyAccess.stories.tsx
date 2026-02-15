import type { Meta, StoryObj } from '@storybook/react';
import { GetEarlyAccess } from '../GetEarlyAccess';

/**
 * Get Early Access Form
 *
 * Alpha access signup form with email, role, and team size fields.
 * Shows success state after submission.
 */

const meta = {
  title: 'Pages/Get Early Access',
  component: GetEarlyAccess,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Full-page form for early access signup with role and team size selection.',
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
} satisfies Meta<typeof GetEarlyAccess>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default desktop view of the Get Early Access form
 */
export const Default: Story = {
  args: {
    isMobile: false,
  },
};

/**
 * Mobile view of the Get Early Access form
 */
export const Mobile: Story = {
  args: {
    isMobile: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
