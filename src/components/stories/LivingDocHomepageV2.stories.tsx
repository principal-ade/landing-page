import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { LivingDocHomepageV2 } from '../LivingDocHomepageV2';

/**
 * Living Documentation Homepage - Version 2
 *
 * Streamlined layout focusing on clarity and conversion:
 * 1. Hero Section - Main value proposition
 * 2. What is Living Documentation - Quick explanation with benefits
 * 3. Combined CTA & Video Section - Get started or watch demo
 * 4. About Principal AI - Core beliefs
 */

const meta = {
  title: 'Landing Page/Living Doc Homepage V2',
  component: LivingDocHomepageV2,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Version 2 of the Living Documentation homepage with a clearer structure and combined CTA/video section.',
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
} satisfies Meta<typeof LivingDocHomepageV2>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete V2 homepage layout
 *
 * Key improvements:
 * - Clear progression: Hero → What is it → Get started/Demo → About
 * - Combined CTA and video section for better conversion
 * - Streamlined content with focus on Living Documentation benefits
 * - Cleaner visual hierarchy
 */
export const Default: Story = {
  args: {},
};
