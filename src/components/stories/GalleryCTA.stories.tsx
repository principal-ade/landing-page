import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { GalleryCTA } from '../GalleryCTA';

/**
 * Gallery CTA Section
 *
 * Primary call-to-action section that appears right after the hero.
 * Encourages users to explore the gallery as the main entry point.
 */

const meta = {
  title: 'Landing Page/Gallery CTA',
  component: GalleryCTA,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Simple, focused CTA section to drive users to the gallery. This is the primary conversion path.',
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0a0e1a' },
      ],
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
} satisfies Meta<typeof GalleryCTA>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Gallery CTA
 *
 * Clean, prominent call-to-action encouraging gallery exploration.
 * Features:
 * - Clear headline and description
 * - Large, prominent button
 * - Focus on seeing real code examples
 */
export const Default: Story = {
  args: {},
};
