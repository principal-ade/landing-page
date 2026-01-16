import type { Meta, StoryObj } from "@storybook/react";
import { SignupForm } from "../SignupForm";

const meta: Meta<typeof SignupForm> = {
  title: "Landing Page/SignupForm",
  component: SignupForm,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SignupForm>;

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
