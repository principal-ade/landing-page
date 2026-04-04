import type { Meta, StoryObj } from "@storybook/react";
import { TimelineScrubber } from "../TimelineScrubber";

const meta: Meta<typeof TimelineScrubber> = {
  title: "Principal Feed/TimelineScrubber",
  component: TimelineScrubber,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TimelineScrubber>;

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
