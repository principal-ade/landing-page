import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { VisualSupervision } from '../VisualSupervision';

/**
 * Visual Supervision Section
 *
 * Shows the three visual supervision layers of Principal View:
 * - Architecture - Auto-generated system views
 * - File City - Living environment visualization
 * - Quality Radar - Behavioral signals at a glance
 *
 * This section emphasizes how Principal adds visual supervision on top of
 * Living Documentation to turn machine-scale systems into human-scale understanding.
 */

const meta = {
  title: 'Landing Page/Visual Supervision',
  component: VisualSupervision,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Visual Supervision for Agentic Development - Architecture, File City, and Quality Radar.',
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
} satisfies Meta<typeof VisualSupervision>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Visual Supervision section.
 *
 * Shows all three visual supervision layers:
 * 1. Architecture - Automatically generated system views that update as code evolves
 * 2. File City - See your codebase as a living environment
 * 3. Quality Radar - Behavioral signals at a glance
 *
 * Key messaging:
 * - "These views turn machine-scale systems into something human-scale"
 * - "Not just visuals. Orientation."
 */
export const Default: Story = {};
