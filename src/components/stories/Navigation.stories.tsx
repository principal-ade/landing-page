import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { Navigation } from '../Navigation';

/**
 * Top Navigation Bar for Principal AI
 *
 * Features:
 * - Fixed position with blur backdrop
 * - Animated logo that cycles through themes on click
 * - Dropdown menus for Product and Solutions
 * - Responsive mobile menu
 * - Primary and secondary CTAs (Download Alpha, Watch Demo)
 * - Scroll-based styling changes
 */

const meta = {
  title: 'Site/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main navigation bar for the Principal AI website. Features a fixed position, dropdown menus, responsive mobile navigation, and animated logo.',
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
        <div style={{ minHeight: '200vh', background: '#000000' }}>
          <Story />
          <div style={{ padding: '100px 40px', color: '#ffffff', textAlign: 'center' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '24px' }}>Scroll to see navigation effects</h1>
            <p style={{ fontSize: '18px', color: '#9ca3af' }}>
              The navigation bar changes its background and border when you scroll down.
            </p>
          </div>
        </div>
      </ClientThemeProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default navigation bar state.
 * - Hover over Product or Solutions to see dropdown menus
 * - Click the logo to cycle through available themes
 * - Resize the window to see mobile navigation
 */
export const Default: Story = {
  args: {},
};

/**
 * Navigation bar with instructions for testing all features
 */
export const Interactive: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Try these interactions:\n- Hover over "Product" or "Solutions" to see dropdown menus\n- Click the animated logo to switch themes\n- Resize your browser to see the mobile menu\n- Scroll down to see the navigation background change',
      },
    },
  },
};
