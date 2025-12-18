import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { AboutV3 } from '../AboutV3';
import { LivingDocumentationSection } from '../LivingDocumentationSection';
import { AgenticWorkspaceForV2 } from '../AgenticWorkspaceForV2';
import { WhyTeamsUse } from '../WhyTeamsUse';
import { JoinTheAlpha } from '../JoinTheAlpha';
import { FAQSection } from '../LivingDocHomepage';

/**
 * About Principal AI Section V2
 *
 * More concise and visual version with:
 * - Condensed About section with icon-based key points
 * - Visual-focused sections
 * - Better visual hierarchy and spacing
 *
 * This section can be used on landing pages, about pages, or as a footer section.
 */

const meta = {
  title: 'Landing Page/About Section',
  component: AboutV3,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'About section V2 explaining Principal AI\'s mission to build infrastructure for trustworthy AI development through Living Documentation.',
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
} satisfies Meta<typeof AboutV3>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * About December 18
 *
 * Combines the About section V3 with all related sections for testing new content flow.
 * Uses "How Teams Use Principal AI" instead of Features and Benefits.
 */
export const AboutDecember18: Story = {
  render: () => (
    <div style={{ background: '#000000' }}>
      <AboutV3 />
      <LivingDocumentationSection />
      <WhyTeamsUse />
      <AgenticWorkspaceForV2 />
      <JoinTheAlpha />
      <FAQSection />
    </div>
  ),
};
