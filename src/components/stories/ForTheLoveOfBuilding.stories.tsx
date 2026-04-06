import type { Meta, StoryObj } from "@storybook/react";
import { ForTheLoveOfBuilding } from "../ForTheLoveOfBuilding";

const meta = {
  title: "Pages/For the Love of Building",
  component: ForTheLoveOfBuilding,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ForTheLoveOfBuilding>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
