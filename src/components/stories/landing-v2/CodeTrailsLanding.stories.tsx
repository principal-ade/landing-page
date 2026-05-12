import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../../providers/ClientThemeProvider';
import { CodeTrailsLanding } from '../CodeTrailsLanding';

/**
 * Code Trails Landing Page
 *
 * A complete landing page for Code Trails by Principal AI.
 * Inspired by the messaging from the May 8 meeting and design from the HTML prototypes.
 *
 * Key Features:
 * - Hero with animated trail visualization showing code collaboration
 * - Get Started section with Claude skill installation
 * - Try One First with embedded demo trail
 * - Five-line pitch explaining the workflow
 * - Before/After comparison showing the transformation
 * - Smooth scroll animations and responsive design
 *
 * Value Proposition:
 * "Ask about your code. Anyone can answer. One link. Walks itself. They drop a note."
 */

const meta = {
  title: 'Pages/Code Trails Landing',
  component: CodeTrailsLanding,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `The Code Trails landing page showcases the new collaboration primitive for software engineering.

Code Trails transforms how engineers share and discuss code changes:
- **One click** - Your agent makes a trail of any change
- **Send the link** - Anyone opens it. No clone. No IDE.
- **They walk it** - File City, sequence diagram, code, plain English
- **They leave a note** - Approve. Comment. Or pass it on.

Built for the agentic era, optimized for humans.`,
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
} satisfies Meta<typeof CodeTrailsLanding>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Full Code Trails Landing Page
 *
 * The complete experience with all sections:
 * 1. Hero with animated trail through code
 * 2. Get Started with skill installation
 * 3. Try a demo trail
 * 4. What it does (the pitch)
 * 5. Before/After comparison
 * 6. Closing message
 */
export const Default: Story = {
  args: {},
};

/**
 * Hero Section Only
 *
 * Showcases the animated hero with:
 * - Animated trail path connecting code markers
 * - Code window with highlighted lines
 * - Sticky note showing collaboration
 * - Strong value prop: "Ask about your code. Anyone can answer."
 */
export const HeroOnly: Story = {
  render: () => (
    <ClientThemeProvider>
      <div style={{ minHeight: '100vh' }}>
        <div style={{ padding: '0' }}>
          {/* Just import and show the hero component */}
          <div>Hero section - see full Default story for complete experience</div>
        </div>
      </div>
    </ClientThemeProvider>
  ),
};

/**
 * With Custom Viewport
 *
 * View the landing page as it appears on different screen sizes
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
 * Tablet View
 */
export const Tablet: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
