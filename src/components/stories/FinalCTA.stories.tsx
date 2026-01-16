import type { Meta, StoryObj } from "@storybook/react";
import { FinalCTA } from "../FinalCTA";

const meta: Meta<typeof FinalCTA> = {
  title: "Landing Page/FinalCTA",
  component: FinalCTA,
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
type Story = StoryObj<typeof FinalCTA>;

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
