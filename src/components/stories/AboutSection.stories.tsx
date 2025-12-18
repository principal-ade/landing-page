import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { AboutV2 } from '../AboutV2';
import { LivingDocumentationSection } from '../LivingDocumentationSection';
import { PrincipalFolder } from '../PrincipalFolder';
import { AgenticWorkspaceForV2 } from '../AgenticWorkspaceForV2';
import { FeaturesAndBenefitsV2 } from '../FeaturesAndBenefitsV2';
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
  component: AboutV2,
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
} satisfies Meta<typeof AboutV2>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default About section V2.
 *
 * More concise and visual version with:
 * - Condensed About section with icon-based key points
 * - Visual-focused sections
 * - Better visual hierarchy and spacing
 */
export const Default: Story = {
  args: {},
};

/**
 * Complete About page layout with all sections.
 *
 * Combines the About section V2 with all related sections:
 * - AboutV2
 * - Living Documentation Section
 * - Principal Folder
 * - Agentic Workspace
 * - Features and Benefits
 * - Join The Alpha
 * - FAQ Section
 */
export const CompletePage: Story = {
  render: () => (
    <div style={{ background: '#000000' }}>
      <AboutV2 />
      <LivingDocumentationSection />
      <PrincipalFolder />
      <AgenticWorkspaceForV2 />
      <FeaturesAndBenefitsV2 />
      <JoinTheAlpha />
      <FAQSection />
    </div>
  ),
};
