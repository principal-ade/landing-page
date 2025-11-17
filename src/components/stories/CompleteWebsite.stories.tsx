import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { CompleteWebsite, FullPageLayout } from '../FullPageLayout';
import { CompleteLandingPage } from '../CompleteLandingPage';

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
 * Complete website with multi-audience homepage.
 *
 * Features the full site navigation experience:
 * 1. Fixed top navigation with dropdown menus
 * 2. Multi-audience homepage (Developers, Investors, Teams)
 * 3. Comprehensive footer
 *
 * Try these interactions:
 * - Click on audience tabs to see different content
 * - Hover over navigation dropdown menus
 * - Scroll to see navigation effects
 * - Click the logo to cycle through themes
 */
export const MultiAudienceHomepage: Story = {
  args: {},
};

/**
 * Complete website with the original landing page sections.
 *
 * This version uses the sequential landing page with all sections:
 * - Hero Section
 * - Context Engineering
 * - Principal Folder
 * - Living Documentation
 * - Features & Benefits
 * - Agentic Workspace For
 */
export const OriginalLandingPage: StoryObj = {
  render: () => (
    <ClientThemeProvider>
      <FullPageLayout>
        <CompleteLandingPage />
      </FullPageLayout>
    </ClientThemeProvider>
  ),
};

/**
 * Just the page layout without any content (useful for testing)
 */
export const EmptyLayout: StoryObj = {
  render: () => (
    <ClientThemeProvider>
      <FullPageLayout>
        <div style={{ minHeight: '70vh', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: '#ffffff' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '24px' }}>Your Content Here</h1>
            <p style={{ fontSize: '18px', color: '#9ca3af' }}>
              This layout includes navigation and footer, ready for any page content.
            </p>
          </div>
        </div>
      </FullPageLayout>
    </ClientThemeProvider>
  ),
};
