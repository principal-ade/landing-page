import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { CompleteWebsite } from '../FullPageLayout';
import { CompleteLivingDocWebsite } from '../CompleteLivingDocWebsite';
import { CompleteLivingDocWebsiteV2 } from '../CompleteLivingDocWebsiteV2';

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

/**
 * Living Documentation Focused Website (Copy)
 *
 * Duplicate of the Living Documentation Focused Website for comparison.
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
 */
export const LivingDocFocusedCopy: StoryObj = {
  render: () => (
    <ClientThemeProvider>
      <CompleteLivingDocWebsite />
    </ClientThemeProvider>
  ),
};

/**
 * Living Documentation Focused Website V2 (Experimental)
 *
 * Experimental duplicate for making changes to the landing page layout.
 * This version can be edited without affecting the original.
 *
 * Use this to:
 * - Test removing Living Documentation section from landing page
 * - Experiment with new section ordering
 * - Try different content flows
 * - Get feedback before updating the main version
 *
 * Complete website with navigation between:
 * - Home: Living Doc Homepage (can be modified)
 * - About: About Section V2 with all sections
 */
export const LivingDocFocusedV2Experimental: StoryObj = {
  render: () => (
    <ClientThemeProvider>
      <CompleteLivingDocWebsiteV2 />
    </ClientThemeProvider>
  ),
};
