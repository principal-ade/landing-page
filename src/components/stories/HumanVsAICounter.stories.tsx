import type { Meta, StoryObj } from "@storybook/react";
import { HumanVsAICounter } from "../HumanVsAICounter";

const meta: Meta<typeof HumanVsAICounter> = {
  title: "Principal Feed/HumanVsAICounter",
  component: HumanVsAICounter,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HumanVsAICounter>;

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
