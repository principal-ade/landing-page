import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { Header } from '../Header';

/**
 * Header Component for Principal AI
 *
 * Features:
 * - Fixed navigation bar with Principal AI branding
 * - Product dropdown menu with smooth animations
 * - Navigation links (About, Product, Blog)
 * - Download CTA button
 * - Responsive mobile menu
 * - Active page detection and highlighting
 */

const meta = {
  title: 'Site/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main header navigation for the Principal AI website. Features a dropdown menu for products with File City, Principal Feed, and Story-based Monitoring.',
      },
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
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default header with dropdown menu
 * Hover over "Product" to see the dropdown in action
 */
export const Default: Story = {
  args: {},
};

/**
 * Header with page content below to show the dropdown interaction
 * Hover over "Product" to see the dropdown menu with File City, Principal Feed, and Story-based Monitoring
 */
export const WithPageContent: Story = {
  args: {},
  decorators: [
    (Story) => (
      <ClientThemeProvider>
        <div style={{ minHeight: '100vh' }}>
          <Story />
          <div style={{ padding: '120px 40px 80px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '24px' }}>Page Content</h1>
            <p style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '40px' }}>
              Hover over "Product" in the header to see the dropdown menu
            </p>
            <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left', lineHeight: '1.8', color: '#9ca3af' }}>
              <p style={{ marginBottom: '20px' }}>
                The Product dropdown features smooth animations and an invisible bridge that keeps the menu open
                as you move your mouse from the button to the menu items. This ensures a seamless user experience.
              </p>
              <p style={{ marginBottom: '20px' }}>
                The menu items include:
              </p>
              <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
                <li>File City - Navigate your codebase visually</li>
                <li>Principal Feed - AI-powered development insights</li>
                <li>Story-based Monitoring - Track progress through user stories</li>
              </ul>
              <p>
                Each item features a subtle slide-right animation on hover and maintains proper active state highlighting.
              </p>
            </div>
          </div>
        </div>
      </ClientThemeProvider>
    ),
  ],
};

/**
 * Header on a product page (File City active)
 */
export const OnFileCityPage: Story = {
  args: {},
  decorators: [
    (Story) => (
      <ClientThemeProvider>
        <div style={{ minHeight: '100vh' }}>
          <Story />
          <div style={{ padding: '120px 40px 80px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '48px', marginBottom: '24px' }}>File City</h1>
            <p style={{ fontSize: '18px', color: '#9ca3af' }}>
              Navigate your codebase visually
            </p>
          </div>
        </div>
      </ClientThemeProvider>
    ),
  ],
};
