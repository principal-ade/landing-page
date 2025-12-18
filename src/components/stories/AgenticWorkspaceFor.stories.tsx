import type { Meta, StoryObj } from '@storybook/react';
import { AgenticWorkspaceFor } from '../AgenticWorkspaceFor';

const meta = {
  title: 'Components/AgenticWorkspaceFor',
  component: AgenticWorkspaceFor,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AgenticWorkspaceFor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
