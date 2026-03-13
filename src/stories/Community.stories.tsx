import type { Meta, StoryObj } from "@storybook/react";
import CommunityPage from "../app/community/page";

const meta = {
  title: "Pages/Community",
  component: CommunityPage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CommunityPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
