import type { Meta, StoryObj } from "@storybook/react";
import { FileCityDemo } from "../FileCityDemo";

const meta: Meta<typeof FileCityDemo> = {
  title: "Principal Feed/FileCityDemo",
  component: FileCityDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FileCityDemo>;

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
