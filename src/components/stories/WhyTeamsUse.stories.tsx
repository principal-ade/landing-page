import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { WhyTeamsUse } from '../WhyTeamsUse';

/**
 * How Teams Use Principal AI Section
 *
 * Replaces "Features and Benefits" with a more concrete, use-case focused section.
 * Shows six key ways teams use Principal AI:
 * - Visual Code Understanding
 * - Quality Radar
 * - Living Documentation
 * - Optimized for Agents
 * - Multi-Project Workspaces
 * - Live Team Collaboration
 *
 * Features:
 * - Alternating cyan/blue color scheme for visual variety
 * - Hover effects with smooth transitions
 * - Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)
 * - Bottom tagline about understanding as the bottleneck
 */

const meta = {
  title: 'Landing Page/Why Teams Use',
  component: WhyTeamsUse,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Section explaining how teams use Principal AI, with six key use cases presented in an interactive grid.',
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
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
} satisfies Meta<typeof WhyTeamsUse>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default "How Teams Use Principal AI" section.
 *
 * Shows all six use cases with interactive hover states.
 */
export const Default: Story = {};

/**
 * Mobile view.
 *
 * Preview on mobile devices with single-column layout.
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet view.
 *
 * Preview on tablet devices with two-column layout.
 */
export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
