import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../../providers/ClientThemeProvider';
import { CodeTrailsLandingDark } from '../CodeTrailsLandingDark';

/**
 * Code Trails Landing Page — Dark Theme Edition
 *
 * The complete Code Trails landing page using the dark aesthetic from
 * "For the Love of Building Animated" with:
 *
 * - **Dark navy background** (#1a2842)
 * - **Animated blocks** like File City visualization
 * - **Animated code trails** connecting the blocks (orange dashed lines)
 * - **Orange primary color** (#ff6b35)
 * - **Principal AI logo** at the top
 *
 * ## Design Inspiration
 *
 * This page takes the visual language from "For the Love of Building Animated"
 * and applies it to Code Trails with new copy that explains:
 *
 * 1. **The agent era problem**: Agents made coding fast but comprehension/collaboration hard
 * 2. **Code Trails solution**: Makes both effortless through visual trails
 * 3. **Four synchronized views**: File City (where), Sequence (how), Code (what), Description (why)
 *
 * ## Core Message
 *
 * "For the love of building.
 * The best builders don't want to code less. They want to understand more."
 *
 * ## Sections
 *
 * 1. **Hero** — Dark background with animated blocks and trails, logo, headline, value props
 * 2. **How It Works** — Four-step narrative (Fernando → Maya)
 * 3. **Live Demo** — Embedded real trail with browser chrome
 * 4. **Transformation** — Before/After comparison
 * 5. **Get Started** — 30-second setup with copy-paste
 * 6. **Footer** — Premium footer with links
 *
 * ## Animated Trails
 *
 * The hero section features animated orange dashed lines that connect the File City
 * blocks, creating a "code trail" effect that reinforces the product concept.
 */

const meta = {
  title: 'Pages/Code Trails Landing (Dark)',
  component: CodeTrailsLandingDark,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `# Code Trails Landing Page — Dark Theme Edition

This landing page uses the dark aesthetic from "For the Love of Building Animated"
with animated blocks, code trails, and the Principal AI logo.

## Visual Design

**Color Palette:**
- Navy (#1a2842) - Primary background
- Orange (#ff6b35) - Brand accent, CTA buttons, trails
- Blue gradients - File City blocks
- White text - High contrast on dark background

**Animated Elements:**
1. **File City Blocks** - Procedurally generated blocks that scale in on load
2. **Code Trails** - Animated orange dashed lines connecting blocks
3. **Scroll-triggered animations** - Sections reveal as you scroll

## Copy Strategy

Uses the Goodby/AKQA/Apple approach:
- **Emotional truth over features** - "For the love of building"
- **Problem-first framing** - Agents made coding fast but understanding hard
- **Clear value proposition** - Code Trails makes both effortless
- **Concrete examples** - Fernando → Maya → Ship

## Technical Implementation

- **Dark theme throughout** - Consistent navy background
- **Premium typography** - Space Grotesk for headings, Inter for body
- **Motion design** - Framer Motion for all animations
- **Responsive** - Adapts to mobile, tablet, desktop

## Frame.io Positioning

"It's Frame.io for code. The new collaboration primitive for software development."

This analogy helps people immediately understand what Code Trails does without
needing to explain technical details.`,
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
} satisfies Meta<typeof CodeTrailsLandingDark>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete Dark Landing Page
 *
 * The full experience with:
 * - Dark navy background with animated File City blocks
 * - Animated code trails (orange dashed lines) connecting blocks
 * - Principal AI logo
 * - All content sections with Code Trails copy
 * - Premium footer
 *
 * Scroll through to see all sections and animations.
 */
export const Default: Story = {
  args: {},
};

/**
 * Mobile Experience
 *
 * Dark theme optimized for mobile:
 * - Stacked layouts
 * - Touch-friendly targets
 * - Simplified animations
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
 * Mid-sized viewport with balanced layouts
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
 * Hero Section Focus
 *
 * Shows just the hero with animated blocks and trails.
 * Demonstrates the dark aesthetic and code trail animations.
 */
export const HeroOnly: Story = {
  render: () => (
    <ClientThemeProvider>
      <div style={{ minHeight: '100vh' }}>
        {/* This would show just the hero but we need to import it separately */}
        <CodeTrailsLandingDark />
      </div>
    </ClientThemeProvider>
  ),
};

/**
 * Desktop Wide
 *
 * Large desktop experience (1920px+):
 * - Maximum content width: 1400px
 * - Full animations
 * - Optimal typography scale
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
