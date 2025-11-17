import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { MultiAudienceHomepage } from '../MultiAudienceHomepage';

/**
 * Multi-Audience Homepage for Principal AI
 *
 * This homepage addresses two distinct audiences:
 * - **Developers**: Focus on technical features, agent orchestration, and workspace efficiency
 * - **Teams**: Focus on collaboration, transparency, and living documentation
 *
 * Features:
 * - Universal hero section that speaks to all audiences
 * - Interactive audience selector with two tabs
 * - Dynamic content that changes based on selected audience
 * - Smooth transitions between audience views
 * - Tailored CTAs for each audience type
 */

const meta = {
  title: 'Landing Page/Multi-Audience Homepage',
  component: MultiAudienceHomepage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive homepage that addresses two key audiences: developers and team members. Each audience sees tailored content and calls-to-action while maintaining a consistent brand experience.',
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
} satisfies Meta<typeof MultiAudienceHomepage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view of the multi-audience homepage.
 *
 * The homepage includes:
 * 1. **Hero Section** - Universal message with audience selector
 * 2. **Developer Content** (default) - Git-based workspace, agentic work modes, CodebaseViews
 * 3. **Team Content** - Living Documentation, collaboration features, demo CTA
 *
 * Users can switch between audience views using the interactive selector buttons.
 */
export const Default: Story = {
  args: {},
};

/**
 * This story demonstrates the flexibility of the multi-audience approach:
 * - Each audience sees content relevant to their needs
 * - Smooth animations between audience transitions
 * - Consistent branding and design language throughout
 * - Clear CTAs tailored to each audience's journey
 */
export const Interactive: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Click on the audience selector buttons (Developers, Teams) to see how the content changes for each target audience.',
      },
    },
  },
};
