import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { CompleteWebsite, FullPageLayout } from '../FullPageLayout';
import { CompleteLandingPage } from '../CompleteLandingPage';
import { CompleteLivingDocWebsite } from '../CompleteLivingDocWebsite';

/**
 * Complete Website with Navigation and Footer
 *
 * This story showcases the full website experience with:
 * - Top navigation bar (fixed position)
 * - Multi-audience homepage content
 * - Footer with all sections
 *
 * This is the complete user experience from landing to browsing.
 */

const meta = {
  title: 'Site/Complete Website',
  component: CompleteWebsite,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The complete Principal AI website experience with navigation, homepage content, and footer. This represents the full landing page as users would see it.',
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
} satisfies Meta<typeof CompleteWebsite>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Living Documentation Focused Website
 *
 * Complete website with navigation between:
 * - Home: Living Doc Homepage (Simplified)
 * - About: About Section V2 with all sections
 *
 * Features:
 * - Click navigation links to switch between pages
 * - Smooth page transitions
 * - Living Documentation as the primary entry point
 * - Full About page with team info and beliefs
 *
 * Try clicking "About" in the navigation to see the full about page!
 */
export const LivingDocFocused: StoryObj = {
  render: () => (
    <ClientThemeProvider>
      <CompleteLivingDocWebsite />
    </ClientThemeProvider>
  ),
};
