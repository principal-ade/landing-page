import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../../providers/ClientThemeProvider';
import { CodeTrailsHero } from './CodeTrailsHero';

const meta = {
  title: 'Landing V2/Code Trails Hero',
  component: CodeTrailsHero,
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
} satisfies Meta<typeof CodeTrailsHero>;

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
