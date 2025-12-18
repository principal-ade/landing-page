import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { LivingDocHomepage } from '../LivingDocHomepage';

/**
 * Living Documentation Focused Homepage
 *
 * Simplified landing page based on the principle:
 * **"Living Documentation is the entry point. Low commitment. Try it and see."**
 *
 * Key Principles from the Strategy:
 * - Living Documentation should be FIRST (not buried)
 * - Simple, not overwhelming with words
 * - Show the "wow factor" that makes people want to try it
 * - Pain point: Trust what AI is doing (doctor analogy)
 * - Benefits: Teams work better, handoffs improve, workflow enhances
 * - Easy to try: Add to your project, no commitment
 *
 * Structure:
 * 1. **Hero**: Universal Workspace for Agentic Work
 * 2. **Living Documentation**: The main feature, front and center
 * 3. **Trust/Pain Point**: The doctor analogy - AI that remembers
 */

const meta = {
  title: 'Landing Page/Living Doc Homepage',
  component: LivingDocHomepage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A simplified homepage focused on Living Documentation as the primary entry point. Less words, more impact. Built for developers who want to try something with low commitment.',
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
} satisfies Meta<typeof LivingDocHomepage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Living Documentation focused homepage.
 *
 * **What Makes This Different:**
 * - No audience selector (removed developers/teams tabs)
 * - Living Documentation is the hero feature
 * - Simpler messaging, fewer words
 * - Clear pain point: "Trust what your AI is doing"
 * - Doctor analogy for trust and memory
 * - Low commitment entry: "Try it in minutes"
 *
 * **Key Sections:**
 * 1. Hero with brand message
 * 2. Living Documentation benefits
 * 3. Demo CTA (Watch Demo)
 * 4. Try It section (Web ADE + Download)
 * 5. Pain point / Trust section
 *
 * This is the version for people who just want to understand:
 * "What is this? Can I try it? Does it solve my problem?"
 */
export const Default: Story = {
  args: {},
};

/**
 * Comparison with the Multi-Audience version.
 *
 * **Multi-Audience Version:**
 * - Developer/Team tabs
 * - Multiple sections teaching about agent development
 * - More comprehensive feature showcase
 * - Good for people who want to explore everything
 *
 * **Living Doc Version (This):**
 * - Single focus: Living Documentation
 * - Simple value prop
 * - Quick entry point
 * - Good for people who want to try something NOW
 */
export const Simplified: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'This simplified version removes complexity and focuses on one thing: getting people to try Living Documentation.',
      },
    },
  },
};

/**
 * Complete Website Story
 *
 * Full landing page with all sections in the optimized order:
 * 1. Hero - The Universal Workspace for Agentic Work
 * 2. Starting Point - Choose your entry point (Gallery featured)
 * 3. Living Documentation - Git-native context layer
 * 4. Visual Supervision - Quality Radar, File City, Architecture
 *
 * This is the complete experience showing the full conversion funnel.
 */
export const CompleteWebsite: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'The complete landing page with all sections in the optimized funnel order.',
      },
    },
  },
};
