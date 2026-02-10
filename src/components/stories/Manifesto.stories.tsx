import type { Meta, StoryObj } from "@storybook/react";
import { Manifesto } from "../Manifesto";

const meta = {
  title: "Pages/Manifesto",
  component: Manifesto,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Manifesto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
