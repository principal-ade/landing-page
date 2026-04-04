import type { Meta, StoryObj } from "@storybook/react";
import { FileCity } from "../FileCity";

const meta: Meta<typeof FileCity> = {
  title: "Landing Page/FileCity",
  component: FileCity,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FileCity>;

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
