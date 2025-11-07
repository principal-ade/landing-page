import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { CompleteLandingPage } from '../CompleteLandingPage';

/**
 * Complete Landing Page combining all sections in sequence with distinctive backgrounds.
 * Each section has a different shade of navy or deep gray to create visual separation.
 */

const meta = {
  title: 'Landing Page/Complete Landing Page',
  component: CompleteLandingPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The complete landing page with all sections combined in sequence. Each section features a distinct background color (navy or deep gray) for better visual separation.',
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
} satisfies Meta<typeof CompleteLandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete landing page with all sections in sequence:
 * 1. Hero Section - Pure Black (#000000)
 * 2. Context Engineering - Dark Navy (#0a1628)
 * 3. Principal Folder - Deep Gray (#111827)
 * 4. Living Documentation - Navy Variant (#0f1b2e)
 * 5. Features & Benefits (V2) - Darker Gray (#0d1117)
 * 6. Agentic Workspace For (V2) - Dark Navy (#0a1628)
 */
export const Default: Story = {
  args: {},
};
