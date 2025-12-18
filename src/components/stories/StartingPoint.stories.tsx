import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { StartingPoint } from '../StartingPoint';

/**
 * Starting Point Section
 *
 * Shows four different paths for users to experience Principal:
 * - Explore the Gallery
 * - Analyze Your Own Repo
 * - Add Living Documentation
 * - Download the Full ADE
 *
 * This section helps users choose their entry point based on their needs.
 */

const meta = {
  title: 'Landing Page/Starting Point',
  component: StartingPoint,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Choose Your Starting Point section showing four different paths to experience Principal AI.',
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f1419' },
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
} satisfies Meta<typeof StartingPoint>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Starting Point section.
 *
 * Shows all four paths:
 * 1. Explore the Gallery - Browse pre-analyzed projects
 * 2. Analyze Your Own Repo - Point at any GitHub repository
 * 3. Add Living Documentation - Install Alexandria CLI
 * 4. Download the Full ADE - Get the complete environment
 */
export const Default: Story = {};
