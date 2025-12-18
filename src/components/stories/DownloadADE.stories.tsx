import type { Meta, StoryObj } from "@storybook/react";
import { DownloadADE } from "../DownloadADE";

/**
 * Download ADE Page
 *
 * Full download page for Principal ADE with:
 * - Platform selection (macOS, Windows, Linux)
 * - Latest release version and download
 * - Discord waitlist for upcoming platforms
 * - Support contact footer
 *
 * Features:
 * - macOS is the only available platform (Windows/Linux coming soon)
 * - Responsive design for mobile, tablet, and desktop
 * - Interactive platform buttons with hover states
 * - Download button with version info and file size
 * - Discord integration for waitlist
 */
const meta = {
  title: "Pages/Download ADE",
  component: DownloadADE,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DownloadADE>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default Download ADE Page
 *
 * Complete download page with all sections:
 * - Platform selection buttons
 * - Latest release info (version 0.0.264)
 * - Download button with file size
 * - Windows & Linux waitlist section
 * - Support footer
 */
export const Default: Story = {};

/**
 * Download Page - macOS Available
 *
 * Shows the download page with macOS as the available platform.
 * Windows and Linux are marked as "Coming Soon".
 */
export const MacOSAvailable: Story = {};

/**
 * Download Page - Mobile View
 *
 * Preview the download page on mobile devices.
 * Shows responsive layout with stacked elements and adjusted spacing.
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

/**
 * Download Page - Tablet View
 *
 * Preview the download page on tablet devices.
 * Shows intermediate responsive layout.
 */
export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
