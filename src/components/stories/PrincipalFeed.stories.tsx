import type { Meta, StoryObj } from "@storybook/react";
import { PrincipalFeed } from "../PrincipalFeed";

const meta: Meta<typeof PrincipalFeed> = {
  title: "Landing Page/PrincipalFeed",
  component: PrincipalFeed,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PrincipalFeed>;

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
