import type { Meta, StoryObj } from '@storybook/react';
import { EngineeringContextSection } from '../EngineeringContextSection';
import ClientThemeProvider from '../providers/ClientThemeProvider';

/**
 * The EngineeringContextSection displays file trees for multiple repositories.
 * It provides two viewing modes:
 * - Single tree view with repository selector
 * - Multi-tree view showing all repositories simultaneously
 */
const meta = {
  title: 'Landing Page/EngineeringContextSection',
  component: EngineeringContextSection,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Interactive file tree viewer for showcasing engineering context across repositories.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ClientThemeProvider>
        <div style={{ padding: '20px', minHeight: '600px' }}>
          <Story />
        </div>
      </ClientThemeProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    isMobile: {
      control: 'boolean',
      description: 'Enable mobile layout',
    },
    useMultiTree: {
      control: 'boolean',
      description: 'Use multi-tree view instead of single tree with selector',
    },
  },
} satisfies Meta<typeof EngineeringContextSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default single-tree view with repository selector.
 * Users can switch between different repositories.
 */
export const SingleTreeView: Story = {
  args: {
    isMobile: false,
    useMultiTree: false,
  },
};

/**
 * Multi-tree view showing all repositories at once.
 * Great for comparing structures across multiple projects.
 */
export const MultiTreeView: Story = {
  args: {
    isMobile: false,
    useMultiTree: true,
  },
};

/**
 * Mobile layout with compact file trees.
 * Optimized for smaller screens.
 */
export const MobileView: Story = {
  args: {
    isMobile: true,
    useMultiTree: false,
  },
};

/**
 * Mobile multi-tree view.
 * Shows all repositories in a stacked layout on mobile.
 */
export const MobileMultiTree: Story = {
  args: {
    isMobile: true,
    useMultiTree: true,
  },
};
