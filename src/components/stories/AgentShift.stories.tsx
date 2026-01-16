import type { Meta, StoryObj } from "@storybook/react";
import { AgentShift } from "../AgentShift";

const meta: Meta<typeof AgentShift> = {
  title: "Landing Page/AgentShift",
  component: AgentShift,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#000000" }],
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AgentShift>;

export const Desktop: Story = {
  args: {
    isMobile: false,
  },
};

export const Mobile: Story = {
  args: {
    isMobile: true,
  },
};
