import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { Footer } from '../Footer';

/**
 * Footer Component for Principal AI
 *
 * Features:
 * - Comprehensive link organization (Product, Solutions, Resources, Company)
 * - Social media links with hover animations
 * - Newsletter subscription form
 * - Copyright and legal links
 * - Responsive grid layout
 */

const meta = {
  title: 'Site/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main footer for the Principal AI website. Includes navigation links, social media, newsletter signup, and legal information.',
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
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default footer with all sections and features
 */
export const Default: Story = {
  args: {},
};

/**
 * Footer with context showing how it appears at the bottom of a page
 */
export const WithPageContent: Story = {
  args: {},
  decorators: [
    (Story) => (
      <ClientThemeProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, background: '#000000', padding: '80px 40px', color: '#ffffff', textAlign: 'center' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '24px' }}>Page Content</h1>
            <p style={{ fontSize: '18px', color: '#9ca3af' }}>
              This shows how the footer appears at the bottom of a page
            </p>
          </div>
          <Story />
        </div>
      </ClientThemeProvider>
    ),
  ],
};
