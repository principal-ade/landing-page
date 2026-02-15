import type { Meta, StoryObj } from "@storybook/react";
import { LogToEventDecomposition } from "../LogToEventDecomposition";

const meta = {
  title: "Components/LogToEventDecomposition",
  component: LogToEventDecomposition,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#0a0a0a",
        },
      ],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof LogToEventDecomposition>;

export default meta;
type Story = StoryObj<typeof meta>;

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
