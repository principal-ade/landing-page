import type { Meta, StoryObj } from "@storybook/react";
import { ContributorAvatarFlow } from "../ContributorAvatarFlow";

const meta: Meta<typeof ContributorAvatarFlow> = {
  title: "Principal Feed/ContributorAvatarFlow",
  component: ContributorAvatarFlow,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ContributorAvatarFlow>;

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
