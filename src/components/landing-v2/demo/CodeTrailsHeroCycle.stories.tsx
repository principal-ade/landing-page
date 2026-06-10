import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../../providers/ClientThemeProvider';
import { CodeTrailsHeroCycle } from './CodeTrailsHeroCycle';

const meta = {
  title: 'Landing V2/Code Trails Hero Cycle',
  component: CodeTrailsHeroCycle,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ClientThemeProvider>
        <Story />
      </ClientThemeProvider>
    ),
  ],
} satisfies Meta<typeof CodeTrailsHeroCycle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {
    isMobile: false,
  },
};

export const Mobile: Story = {
  args: {
    isMobile: true,
  },
};
