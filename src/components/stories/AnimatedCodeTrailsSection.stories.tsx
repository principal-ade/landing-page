import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ClientThemeProvider from "../providers/ClientThemeProvider";
import { AnimatedCodeTrailsSection } from "../demo/AnimatedCodeTrailsSection";

/**
 * Animated Code Trails Section
 *
 * This section replaces the Principal Feed section in the home page.
 * Features:
 * - Badge: "02 CODE TRAILS"
 * - Headline: "For the [♥] of knowing how it works."
 * - Interactive trail cards showing code paths
 * - Animated step-by-step flow visualization
 * - Two example trails: Authentication and Payment Processing
 */

const meta = {
  title: "Sections/Animated Code Trails Section",
  component: AnimatedCodeTrailsSection,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "An animated section showcasing Code Trails with step-by-step code flow visualizations. Shows how trails capture knowledge and make complex flows understandable.",
      },
    },
  },
  decorators: [
    (Story) => (
      <ClientThemeProvider>
        <div style={{ background: '#1a2842' }}>
          <Story />
        </div>
      </ClientThemeProvider>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof AnimatedCodeTrailsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default desktop view of the Code Trails section
 *
 * Features:
 * - Heart icon in headline
 * - Two trail cards side by side
 * - Animated step connectors
 * - Color-coded step types (entry, logic, data, output)
 */
export const Default: Story = {
  args: {
    isMobile: false,
  },
};

/**
 * Mobile view with stacked trail cards
 */
export const Mobile: Story = {
  args: {
    isMobile: true,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

/**
 * Tablet view
 */
export const Tablet: Story = {
  args: {
    isMobile: false,
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};
