import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ClientThemeProvider from "../providers/ClientThemeProvider";
import { LayeredReveal } from "../reveal";
import { DashboardLayer, WorkflowLayer, CanvasLayer } from "../reveal/layers";

const meta = {
  title: "Landing/Layered Reveal",
  component: LayeredReveal,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <ClientThemeProvider>
        <Story />
      </ClientThemeProvider>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof LayeredReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Paper Lift** - The bottom edge of each layer lifts upward like turning a page.
 * Creates a natural "peeling back" effect that reveals what's underneath.
 */
export const PaperLift: Story = {
  args: {
    scrollHeight: "400vh",
  },
};

const LayerPreviewWrapper: React.FC<{ children: React.ReactNode; title: string }> = ({
  children,
  title,
}) => (
  <div
    style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px",
      boxSizing: "border-box",
      background: "#f5f5f5",
    }}
  >
    <h2 style={{ marginBottom: "24px", fontFamily: "system-ui" }}>{title}</h2>
    <div style={{ width: "100%", maxWidth: "600px", height: "500px" }}>{children}</div>
  </div>
);

export const DashboardLayerPreview: Story = {
  render: () => (
    <LayerPreviewWrapper title="Dashboard Layer">
      <DashboardLayer />
    </LayerPreviewWrapper>
  ),
};

export const WorkflowLayerPreview: Story = {
  render: () => (
    <LayerPreviewWrapper title="Workflow Layer">
      <WorkflowLayer />
    </LayerPreviewWrapper>
  ),
};

export const CanvasLayerPreview: Story = {
  render: () => (
    <LayerPreviewWrapper title="Canvas Layer">
      <CanvasLayer />
    </LayerPreviewWrapper>
  ),
};