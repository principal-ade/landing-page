import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ClientThemeProvider from "../providers/ClientThemeProvider";
import { DownloadADECodeTrails } from "../DownloadADECodeTrails";

/**
 * Code Trails-Focused Download Page
 *
 * This is a redesigned version of the download page that leads with Code Trails
 * as the primary value proposition. Key changes:
 *
 * - Hero focuses on learning and knowledge sharing pain points
 * - Main screenshot shows Code Trails in action
 * - Section 2 addresses the tribal knowledge problem
 * - Code Trails is first in the feature cards
 * - CTA emphasizes learning and knowledge over monitoring
 *
 * Compare this with the original Download ADE story to see the difference.
 */

const meta = {
  title: "Pages/Download ADE - Code Trails Focused",
  component: DownloadADECodeTrails,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A Code Trails-first version of the download page. Emphasizes knowledge sharing, learning, and understanding code flows over activity monitoring.",
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
  tags: ["autodocs"],
} satisfies Meta<typeof DownloadADECodeTrails>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default desktop view - Code Trails focused
 *
 * Key messaging:
 * - Hero: "From 'where do I start?' to 'now I get it'"
 * - Problem: Knowledge loss and tribal knowledge
 * - Solution: Interactive code trails that preserve understanding
 */
export const Default: Story = {};

/**
 * Mobile view of the Code Trails-focused page
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

/**
 * Tablet view of the Code Trails-focused page
 */
export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};

/**
 * Comparison: What Changed from Original
 *
 * To compare this with the original, open both stories side by side:
 * - Original: "Download ADE" -> "Default"
 * - This: "Download ADE - Code Trails Focused" -> "Default"
 *
 * Major differences:
 *
 * 1. HERO SECTION
 *    - Before: "Download Principal AI" + Garry Tan quote
 *    - After: "From 'where do I start?' to 'now I get it'"
 *    - Before: Activity Feed screenshot
 *    - After: Code Trails screenshot
 *
 * 2. SECTION 2 ("THE TURN")
 *    - Before: "That's the part that gets you in the door / This is the part that makes you stay"
 *    - After: "Your senior dev explains once / It's gone when they walk away"
 *    - Before: Story-based Monitoring focus
 *    - After: Knowledge preservation focus
 *
 * 3. FEATURE CARDS
 *    - Before: Activity Feed first
 *    - After: Code Trails first
 *
 * 4. CLOSING CTA
 *    - Before: "See the work. Read the story. Know if it went right."
 *    - After: "Learn faster. Share knowledge. Build with confidence."
 */
export const ComparisonNotes: Story = {
  render: () => (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "24px" }}>Code Trails-Focused Redesign</h1>
      <p style={{ fontSize: "18px", marginBottom: "24px" }}>
        This page demonstrates how to reposition the download page around Code
        Trails as the hero feature.
      </p>

      <h2 style={{ marginBottom: "16px", marginTop: "32px" }}>
        Key Changes:
      </h2>

      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "#7C3AED", marginBottom: "8px" }}>
          1. Hero Section
        </h3>
        <ul style={{ lineHeight: "1.8" }}>
          <li>
            <strong>Before:</strong> Generic "Download Principal AI" with
            Garry Tan quote about polymaths
          </li>
          <li>
            <strong>After:</strong> Specific pain → solution: "From 'where do
            I start?' to 'now I get it'"
          </li>
          <li>Screenshot changed from Activity Feed to Code Trails</li>
        </ul>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "#7C3AED", marginBottom: "8px" }}>
          2. The Turn (Section 2)
        </h3>
        <ul style={{ lineHeight: "1.8" }}>
          <li>
            <strong>Before:</strong> Story-based Monitoring as the "sticky"
            feature
          </li>
          <li>
            <strong>After:</strong> Tribal knowledge problem & Code Trails as
            solution
          </li>
          <li>
            Quote changed: "Documentation tells you about the code / Code
            Trails ARE the code"
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "#7C3AED", marginBottom: "8px" }}>
          3. Feature Hierarchy
        </h3>
        <ul style={{ lineHeight: "1.8" }}>
          <li>Code Trails moved to first position in cards</li>
          <li>Activity Feed moved to last position</li>
          <li>
            All copy emphasizes learning and knowledge sharing over monitoring
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ color: "#7C3AED", marginBottom: "8px" }}>4. CTA Copy</h3>
        <ul style={{ lineHeight: "1.8" }}>
          <li>
            <strong>Before:</strong> "See the work. Read the story. Know if it
            went right."
          </li>
          <li>
            <strong>After:</strong> "Learn faster. Share knowledge. Build with
            confidence."
          </li>
        </ul>
      </div>

      <h2 style={{ marginBottom: "16px", marginTop: "32px" }}>
        Target Audience Shift:
      </h2>
      <ul style={{ lineHeight: "1.8" }}>
        <li>
          <strong>Before:</strong> Teams managing AI agents, monitoring AI
          work
        </li>
        <li>
          <strong>After:</strong> Developers onboarding, teams sharing
          knowledge, polymaths learning
        </li>
      </ul>

      <p
        style={{
          marginTop: "32px",
          padding: "16px",
          background: "#F3F4F6",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        <strong>Note:</strong> The screenshots referenced (
        <code>/code-trails-example.png</code>, <code>/trail-browser.png</code>
        ) are placeholder paths. You'll need actual Code Trails screenshots to
        replace the Activity Feed images.
      </p>
    </div>
  ),
};
