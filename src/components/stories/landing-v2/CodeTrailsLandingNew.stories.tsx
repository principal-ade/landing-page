import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../../providers/ClientThemeProvider';
import { CodeTrailsLandingNew } from '../CodeTrailsLandingNew';

/**
 * Code Trails Landing Page (Award-Winning Edition)
 *
 * A premium landing page for Code Trails by Principal AI.
 * Designed with world-class talent:
 * - Copywriting: Goodby Silverstein & Partners style (emotional, punchy, memorable)
 * - Design: AKQA style (premium aesthetics, thoughtful hierarchy, generous whitespace)
 * - Motion: Apple style (purposeful, smooth, delightful)
 *
 * Key Features:
 * - Hero with emotional hook: "Stop asking. Start showing."
 * - Clear value proposition for someone who knows nothing about Code Trails
 * - Three-step "How It Works" with visual demonstrations
 * - Emotional transformation showing before/after
 * - Live embedded demo
 * - Frictionless CTA
 * - Scroll-triggered animations with physics-based easing
 *
 * Value Proposition:
 * "Code Trails turns your changes into a visual story anyone can follow.
 * One link. No setup. Just understanding."
 */

const meta = {
  title: 'Pages/Code Trails Landing (New)',
  component: CodeTrailsLandingNew,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `# Code Trails Landing Page — Award-Winning Edition

This is a complete reimagining of the Code Trails landing page with premium design, compelling copy, and delightful interactions.

## What is Code Trails?

Code Trails transforms how engineers share and discuss code changes. Instead of:
- Scheduling meetings
- Writing long Slack threads
- Asking people to clone your branch
- Recording screen shares

You get:
1. **Make a change** — Any change. Your AI agent watches.
2. **Get a trail** — Automatically. Visual story with File City, diagrams, code, plain English.
3. **Share it** — One link. They click, see everything, leave a note.

## Design Philosophy

**Goodby-style Copy:**
- Emotional truth over feature lists
- Punchy, memorable headlines
- Focus on transformation and feeling
- "Don't tell me about the grass seed, tell me about my lawn"

**AKQA-style Design:**
- Premium typography with generous whitespace
- Sophisticated color palette
- Grid-based layouts
- High-quality visuals

**Apple-style Motion:**
- Purposeful, not decorative
- Smooth physics-based easing
- Scroll-triggered reveals
- Delightful micro-interactions

## Sections

1. **Hero** — Emotional hook with animated previews
2. **How It Works** — Three-step visual explanation
3. **Live Demo** — Embedded real Code Trail
4. **Transformation** — Before/After emotional comparison
5. **Final CTA** — Frictionless start`,
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
} satisfies Meta<typeof CodeTrailsLandingNew>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Full Award-Winning Landing Page
 *
 * The complete experience with all sections:
 * - Fixed minimal navigation
 * - Hero with "Stop asking. Start showing."
 * - How It Works (3 steps)
 * - Live Demo with real trail
 * - Transformation (before/after)
 * - Final CTA with copy-paste
 * - Premium footer
 *
 * Designed to feel premium, explain clearly, and convert effortlessly.
 */
export const Default: Story = {
  args: {},
};

/**
 * Mobile Experience
 *
 * Optimized for mobile devices with:
 * - Stacked layouts
 * - Touch-friendly tap targets
 * - Simplified navigation
 * - Responsive typography
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
 * Mid-sized viewport optimization
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
 * Dark Mode Preview
 *
 * How sections look on dark backgrounds
 * (Note: Some sections use light backgrounds by design)
 */
export const DarkSections: Story = {
  args: {},
  render: () => (
    <ClientThemeProvider>
      <div style={{ background: '#0c1741', minHeight: '100vh', padding: '40px 0' }}>
        <div style={{ textAlign: 'center', color: '#fff', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Dark Background Sections</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>
            Note: The full page alternates between light and dark sections for visual rhythm
          </p>
        </div>
      </div>
    </ClientThemeProvider>
  ),
};

/**
 * Component Breakdown
 *
 * Individual components used in the landing page:
 * - CodeTrailsHeroNew: Emotional hero with animated previews
 * - CodeTrailsHowItWorks: Three-step explanation
 * - CodeTrailsLiveDemo: Embedded demo with browser chrome
 * - CodeTrailsTransformation: Before/After comparison
 * - CodeTrailsFinalCTA: Copy-paste get started
 */
export const ComponentShowcase: Story = {
  render: () => (
    <ClientThemeProvider>
      <div style={{ padding: '40px 24px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '40px', textAlign: 'center' }}>
          Code Trails Components
        </h1>
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#4a6fa5', marginBottom: '80px', maxWidth: '700px', margin: '0 auto 80px' }}>
          Each section is a standalone component with its own animations and interactions.
          See the full Default story for the complete experience.
        </p>
      </div>
    </ClientThemeProvider>
  ),
};
