import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { AboutV3 } from '../AboutV3';
import { LivingDocumentationSection } from '../LivingDocumentationSection';
import { PrincipalFolder } from '../PrincipalFolder';
import { AgenticWorkspaceForV2 } from '../AgenticWorkspaceForV2';
import { WhyTeamsUse } from '../WhyTeamsUse';
import { JoinTheAlpha } from '../JoinTheAlpha';
import { FAQSection } from '../LivingDocHomepage';

/**
 * About Principal AI Section V3 (Experimental)
 *
 * Experimental version for exploring new content and design ideas.
 * This is a duplicate of V2 that can be modified without affecting the production version.
 *
 * Use this story to:
 * - Test new copy and messaging
 * - Experiment with layout changes
 * - Try different visual treatments
 * - Get feedback before updating the main version
 */

const meta = {
  title: 'Experimental/About Section V3',
  component: AboutV3,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Experimental About section V3 for testing new content ideas.',
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
 * Default About section V3 (Experimental).
 *
 * Starting point for new content experiments.
 * Currently identical to V2 but ready for modifications.
 */
export const Default: Story = {
  args: {},
};

/**
 * Complete About page V3 with all sections.
 *
 * Full page layout for testing content flow:
 * - AboutV3 (experimental)
 * - Living Documentation Section
 * - Principal Folder
 * - Agentic Workspace
 * - Why Teams Use Principal AI (NEW)
 * - Join The Alpha
 * - FAQ Section
 */
export const CompletePage: Story = {
  render: () => (
    <div style={{ background: '#000000' }}>
      <AboutV3 />
      <LivingDocumentationSection />
      <PrincipalFolder />
      <AgenticWorkspaceForV2 />
      <WhyTeamsUse />
      <JoinTheAlpha />
      <FAQSection />
    </div>
  ),
};

/**
 * About V3 Only (for focused editing).
 *
 * Isolated view of just the About section for easier editing and review.
 */
export const AboutOnly: Story = {
  render: () => (
    <div style={{ background: '#000000' }}>
      <AboutV3 />
    </div>
  ),
};
