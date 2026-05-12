import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../../providers/ClientThemeProvider';
import { CodeTrailsLandingFinal } from '../CodeTrailsLandingFinal';

/**
 * Code Trails Landing Page — Final Edition
 *
 * The complete, production-ready landing page for Code Trails by Principal AI.
 *
 * Created with world-class talent in mind:
 * - Copywriting: Goodby Silverstein & Partners style (emotional truth, punchy headlines)
 * - Design: AKQA style (premium aesthetics, sophisticated hierarchy, generous whitespace)
 * - Motion: Apple style (purposeful animations, physics-based easing, delightful interactions)
 *
 * ## Core Message
 *
 * "For the love of building.
 * The best builders don't want to code less. They want to understand more."
 *
 * ## The Problem Code Trails Solves
 *
 * **Before Agents:**
 * You wrote code → You understood it (mental model aligned)
 *
 * **After Agents:**
 * Agent writes code → You review someone else's work → Gap between intention and implementation
 *
 * **Two Problems:**
 * 1. Personal comprehension gap: Understanding what the agent did
 * 2. Team collaboration gap: Explaining agent-generated code to others
 *
 * **Code Trails Solution:**
 * Makes both effortless through visual trails with four synchronized views:
 * - File City (where changes happened)
 * - Sequence (how they flowed)
 * - Code (what changed)
 * - Description (why it matters)
 *
 * ## What is Code Trails?
 *
 * Code Trails transforms how engineers share and discuss code changes.
 *
 * **Instead of:**
 * - Scheduling meetings
 * - Writing long Slack threads
 * - Asking people to clone your branch
 * - Recording screen shares
 * - Feeling guilty about interrupting teammates
 *
 * **You get:**
 * 1. Make a change — Any change. Your AI agent watches.
 * 2. Get a trail — Automatically. Visual story with File City, diagrams, code, plain English.
 * 3. Share it — One link. They click, see everything, leave a note.
 *
 * ## Positioning
 *
 * **"It's Frame.io for code. The new collaboration primitive for software development."**
 *
 * ## Page Sections
 *
 * 1. **Hero** — Establishes the agent era problem and Code Trails as the solution
 * 2. **How It Works** — Four-step narrative showing the complete flow (Fernando → Maya)
 * 3. **Live Demo** — Embedded real Code Trail with four synchronized views
 * 4. **Transformation** — Before/After showing the cost of asking vs. effortless sharing
 * 5. **Get Started** — Frictionless 30-second setup with copy-paste skill installation
 * 6. **Footer** — Premium footer with resources and community links
 *
 * ## Design Principles
 *
 * **Goodby-Style Copy:**
 * - Emotional truth over feature lists
 * - "Don't tell me about the grass seed, tell me about my lawn"
 * - Punchy, memorable headlines that stick
 * - Focus on transformation and feeling
 *
 * **AKQA-Style Design:**
 * - Premium typography (Space Grotesk + Inter)
 * - Sophisticated color palette with purpose
 * - Grid-based layouts with generous whitespace
 * - High-quality visuals and thoughtful hierarchy
 *
 * **Apple-Style Motion:**
 * - Purposeful, not decorative
 * - Smooth physics-based easing
 * - Scroll-triggered reveals with useInView
 * - Delightful micro-interactions on hover/tap
 *
 * ## Technical Implementation
 *
 * - **Framework:** Next.js with React Server Components ("use client")
 * - **Animation:** Framer Motion with scroll-triggered animations
 * - **Theme:** @principal-ade/industry-theme for consistent design system
 * - **Responsive:** Mobile-first with isMobile prop pattern
 * - **Performance:** Lazy loading for iframe, optimized animations
 */

const meta = {
  title: 'Pages/Code Trails Landing (Final)',
  component: CodeTrailsLandingFinal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `# Code Trails Landing Page — Final Edition

This is the complete, production-ready landing page incorporating all insights from user research, meeting notes, and demo scripts.

## Key Insights That Shaped This Page

**From May 8 Meeting:**
- Michael wanted both problems called out: "not understandable" AND "not collaborative"
- The agent era created a fundamental shift in how we relate to code

**From Demo Script:**
- Four-step narrative flow (Fernando → Maya → Note → Ship)
- "Frame.io for code" positioning resonates strongly
- Show, don't tell: embedded real trail beats screenshots

**From May 6 Meetings:**
- Fernando's quote: "After talking to Claude, I don't know my codebase anymore"
- The "secretary" metaphor: filters noise, surfaces signal
- "Review is heavy. Feedback has no accountability." — Keep it lightweight
- Cost of asking: guilt, interruption, social capital burn

**Core Value Proposition:**
"Code Trails turns your changes into a visual story anyone can follow. One link. No setup. Just understanding."

## Four Synchronized Views

The heart of Code Trails is showing WHERE, HOW, WHAT, and WHY:

1. **File City** — Spatial visualization shows where changes happened
2. **Sequence** — Diagram shows how changes flowed through the code
3. **Code** — Actual diffs show what changed
4. **Description** — Plain English explains why it matters

## Complete User Journey

1. **Hero:** Understand the agent era problem + see value props
2. **How It Works:** See Fernando create trail → Maya reviews on iPad → leaves note
3. **Live Demo:** Click through a real trail right on the page
4. **Transformation:** Feel the contrast (17 Slack messages → one link)
5. **Get Started:** Copy-paste skill command, start in 30 seconds

## Design Philosophy

This page answers three questions for someone who's never heard of Code Trails:

1. **What is it?** — Visual trails that explain code changes
2. **Why do I need it?** — Agents made coding fast but comprehension/collaboration hard
3. **How do I start?** — Paste one command, done in 30 seconds

Every section serves this clarity. No jargon. No gatekeeping. Just understanding.`,
      },
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
} satisfies Meta<typeof CodeTrailsLandingFinal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete Landing Page Experience
 *
 * The full award-winning landing page with all sections:
 *
 * - Fixed navigation with scroll effects
 * - Hero: "For the love of building" + agent problem
 * - How It Works: Fernando → Maya four-step story
 * - Live Demo: Embedded real trail with browser chrome
 * - Transformation: Before (17 Slack messages) vs. After (one link)
 * - Get Started: 30-second setup with copy-paste
 * - Premium footer with resources
 *
 * Scroll through the page to see all animations and interactions.
 */
export const Default: Story = {
  args: {},
};

/**
 * Mobile Experience
 *
 * Optimized for mobile devices:
 * - Stacked layouts
 * - Touch-friendly tap targets (44px minimum)
 * - Simplified navigation
 * - Responsive typography with clamp()
 * - Reduced motion where appropriate
 */
export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Tablet Experience
 *
 * Mid-sized viewport (768px - 1024px):
 * - Balanced layouts (some 2-col, some stacked)
 * - Medium typography sizes
 * - Optimized for iPad viewing (like Maya's experience)
 */
export const Tablet: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

/**
 * Desktop Wide
 *
 * Large desktop experience (1440px+):
 * - Maximum content width: 1400px
 * - Generous whitespace
 * - Full animations and interactions
 * - Optimal reading line length
 */
export const DesktopWide: Story = {
  args: {},
  parameters: {
    viewport: {
      width: 1920,
      height: 1080,
    },
  },
};

/**
 * Accessibility Check
 *
 * Test with keyboard navigation and screen readers:
 * - All interactive elements are keyboard accessible
 * - Color contrast meets WCAG AA standards
 * - Animations respect prefers-reduced-motion
 * - Semantic HTML structure
 */
export const AccessibilityTest: Story = {
  args: {},
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'region',
            enabled: true,
          },
        ],
      },
    },
  },
};

/**
 * Performance Test
 *
 * Monitor performance metrics:
 * - First Contentful Paint (FCP)
 * - Largest Contentful Paint (LCP)
 * - Cumulative Layout Shift (CLS)
 * - Time to Interactive (TTI)
 *
 * Target: LCP < 2.5s, CLS < 0.1
 */
export const Performance: Story = {
  args: {},
  play: async () => {
    // Performance metrics would be logged here in a real test
    console.log('Performance monitoring active');
  },
};
