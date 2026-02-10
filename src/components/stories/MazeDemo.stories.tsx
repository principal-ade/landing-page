import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { MazeDemo } from '../MazeDemo';

/**
 * MazeDemo Component
 *
 * An interactive maze game that demonstrates the difference between different development approaches:
 * - No Agentic Coding: Manual debugging with limited visibility
 * - Agentic Coding: Some assistance but still requires manual investigation
 * - Principal: Full visibility and instant problem detection
 *
 * Features:
 * - Procedurally generated mazes with configurable seeds
 * - Three different gameplay modes
 * - Interactive cell-based exploration
 * - Real-time incident cost tracking
 * - Blockage detection and visualization
 * - Fully themed with industry-theme integration
 */

const meta = {
  title: 'Components/MazeDemo',
  component: MazeDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'An interactive maze component that demonstrates different development paradigms through gameplay. Players navigate through a production incident scenario with varying levels of observability.',
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
        <div style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000'
        }}>
          <Story />
        </div>
      </ClientThemeProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof MazeDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default maze - fills container responsively
 */
export const Default: Story = {
  args: {},
};

/**
 * Maze with a specific seed for reproducible layouts
 */
export const WithSeed: Story = {
  args: {
    mazeSeed: 12345,
  },
};

/**
 * Maze with fixed dimensions
 */
export const FixedSize: Story = {
  args: {
    width: 450,
    height: 620,
  },
};
