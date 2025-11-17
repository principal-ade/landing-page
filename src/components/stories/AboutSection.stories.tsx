import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { About } from '../About';
import { AboutV2 } from '../AboutV2';
import { LivingDocumentationSection } from '../LivingDocumentationSection';
import { PrincipalFolder } from '../PrincipalFolder';
import { AgenticWorkspaceForV2 } from '../AgenticWorkspaceForV2';
import { FeaturesAndBenefitsV2 } from '../FeaturesAndBenefitsV2';
import { WhoWeAre } from '../WhoWeAre';
import { WhoWeAreV2 } from '../WhoWeAreV2';
import { JoinTheAlpha } from '../JoinTheAlpha';

/**
 * About Principal AI Section
 *
 * Simple, focused messaging explaining Principal AI's mission and positioning:
 * - Infrastructure for the next generation of AI development
 * - Focus on understanding over speed
 * - Living Documentation as the core differentiator
 * - Team philosophy and values
 *
 * This section can be used on landing pages, about pages, or as a footer section.
 */

const meta = {
  title: 'Landing Page/About Section',
  component: About,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'About section explaining Principal AI\'s mission to build infrastructure for trustworthy AI development through Living Documentation.',
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
} satisfies Meta<typeof About>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default About section.
 *
 * Key messaging:
 * 1. **Infrastructure positioning**: "We're building the infrastructure for the next generation of AI development"
 * 2. **Problem framing**: Speed vs. Understanding - everyone builds faster tools, we build trust
 * 3. **Solution**: Living Documentation as infrastructure for transparent, confident AI development
 * 4. **Team values**: Better infrastructure over faster tools
 *
 * Design features:
 * - Centered layout with max-width for readability
 * - Progressive disclosure through paragraph breaks
 * - Cyan highlight on final statement for emphasis
 * - Responsive typography and spacing
 */
export const Default: Story = {
  args: {},
};

/**
 * About section with Living Documentation explanation.
 *
 * Combines the About section with the Living Documentation Section
 * to show both the mission and the detailed explanation of what Living Documentation is.
 */
export const WithLivingDocumentation: Story = {
  render: () => (
    <div style={{ background: '#000000' }}>
      <About />
      <LivingDocumentationSection />
      <PrincipalFolder />
      <AgenticWorkspaceForV2 />
      <FeaturesAndBenefitsV2 />
      <WhoWeAre />
      <JoinTheAlpha />
    </div>
  ),
};

/**
 * Version 2 of the complete About page layout.
 *
 * More concise and visual version with:
 * - Condensed About section with icon-based key points
 * - Visual-focused Who We Are section
 * - Same powerful sections but with tighter, more scannable content
 * - Better visual hierarchy and spacing
 */
export const Version2: Story = {
  render: () => (
    <div style={{ background: '#000000' }}>
      <AboutV2 />
      <LivingDocumentationSection />
      <PrincipalFolder />
      <AgenticWorkspaceForV2 />
      <FeaturesAndBenefitsV2 />
      <WhoWeAreV2 />
      <JoinTheAlpha />
    </div>
  ),
};
