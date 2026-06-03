import type { Meta, StoryObj } from '@storybook/react';
import { CodeTrailsFrameIoMomentV2 } from './CodeTrailsFrameIoMomentV2';

const meta = {
  title: 'Landing V2/Frame.io Blade',
  component: CodeTrailsFrameIoMomentV2,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CodeTrailsFrameIoMomentV2>;

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
