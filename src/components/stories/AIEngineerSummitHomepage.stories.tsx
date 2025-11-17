import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { AIEngineerSummitHomepage } from '../AIEngineerSummitHomepage';

/**
 * AI Engineer Summit NYC - Living Documentation Focus
 *
 * Landing page specifically designed for AI Engineer Summit NYC (Nov 20-22, 2025) attendees.
 * Highlights the critical production challenges that engineers shipping AI face every day.
 *
 * Key Messaging for Production AI Engineers:
 * - **The Problem**: Your AI agents write code faster than you can review it
 * - **Production Challenges**: Documentation drift, context fragmentation, agent hallucination
 * - **The Solution**: Living Documentation that keeps docs and code in sync
 * - **Call to Action**: Try it now - low commitment, high impact
 *
 * Structure:
 * 1. **Hero**: Conference badge + production problem statement
 * 2. **Production Problems**: 3 real challenges engineers face (drift, fragmentation, hallucination)
 * 3. **Living Documentation Solution**: 4 technical features that solve these problems
 * 4. **Ship Now**: CTAs for trying the product (Web ADE + Download)
 */

const meta = {
  title: 'Landing Page/AI Engineer Summit Homepage',
  component: AIEngineerSummitHomepage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A production-focused homepage for AI Engineer Summit NYC attendees. Speaks directly to engineers shipping AI agents and the real challenges they face: documentation that goes stale, context that gets fragmented, and agents that hallucinate. Living Documentation as the answer.',
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
} satisfies Meta<typeof AIEngineerSummitHomepage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default AI Engineer Summit focused homepage.
 *
 * **Target Audience:**
 * Production AI engineers attending AI Engineer Summit NYC who are:
 * - Shipping AI agents to production
 * - Struggling with documentation that goes stale
 * - Dealing with context fragmentation across their codebase
 * - Fighting agent hallucination due to outdated context
 *
 * **Key Differentiators:**
 * - Conference context badge (AI Engineer Summit NYC)
 * - Production-first problem framing
 * - Technical depth for experienced engineers
 * - Real problems they face daily, not theoretical benefits
 *
 * **Call to Action:**
 * Two paths to try Living Documentation:
 * 1. Try in Browser (Web ADE) - instant access
 * 2. Download Desktop App - full feature set
 */
export const Default: Story = {
  args: {},
};

/**
 * Production Problems Focus
 *
 * This version emphasizes the three core production challenges:
 *
 * 1. **Documentation Drift**
 *    - Docs out of date before PR merges
 *    - Manual updates fall behind code changes
 *    - Reviewers can't trust what they read
 *
 * 2. **Context Fragmentation**
 *    - Knowledge scattered across Slack, Notion, Confluence, PRs
 *    - Agents pull stale context
 *    - Engineers waste time searching
 *
 * 3. **Agent Hallucination**
 *    - AI agents generate code based on outdated docs
 *    - Builds break in CI/CD
 *    - More time fixing than shipping
 *
 * The Living Documentation solution directly addresses each of these.
 */
export const ProductionFocus: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Emphasizes the real production problems that AI engineers face when shipping agents. Each problem maps to a specific Living Documentation feature that solves it.',
      },
    },
  },
};

/**
 * Conference Context
 *
 * **Why AI Engineer Summit NYC?**
 * - Nov 20-22, 2025
 * - Target audience: Engineers shipping production AI
 * - Perfect timing to introduce Living Documentation
 * - Community that understands the pain points immediately
 *
 * **Messaging Adjustments:**
 * - Less educational, more peer-to-peer
 * - "You know this problem" tone
 * - Technical specificity (staleness detection, file-level links, automated validation)
 * - Low commitment entry: "Try it and see"
 */
export const ConferenceEdition: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Tailored specifically for AI Engineer Summit NYC attendees. Uses conference badge and speaks directly to production AI engineers who understand these challenges viscerally.',
      },
    },
  },
};
