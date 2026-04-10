import type { Meta, StoryObj } from '@storybook/react';
import { ForTheLoveOfBuildingAnimated } from '../ForTheLoveOfBuildingAnimated';

const meta = {
  title: 'Landing Page/For The Love Of Building Animated',
  component: ForTheLoveOfBuildingAnimated,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Fully animated interactive landing page experience with scroll-triggered animations, interactive File City treemap, animated activity feed, and flowing trace visualization. Shows > tells.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ForTheLoveOfBuildingAnimated>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Complete animated landing page with all interactive sections.',
      },
    },
  },
};

export const FullExperience: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The full scroll experience. Scroll down to see: animated hero with living File City background → interactive File City section with hover tooltips → animated Principal Feed timeline → Story Monitoring trace flow → final CTA.',
      },
    },
  },
};
