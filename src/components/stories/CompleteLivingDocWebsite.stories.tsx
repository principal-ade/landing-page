import type { Meta, StoryObj } from "@storybook/react";
import { CompleteLivingDocWebsite } from "../CompleteLivingDocWebsite";

const meta = {
  title: "Pages/Complete Homepage",
  component: CompleteLivingDocWebsite,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CompleteLivingDocWebsite>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
