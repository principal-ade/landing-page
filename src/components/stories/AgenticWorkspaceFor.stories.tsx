import type { Meta, StoryObj } from '@storybook/react';
import { AgenticWorkspaceFor } from '../AgenticWorkspaceFor';
import { AgenticWorkspaceForV2 } from '../AgenticWorkspaceForV2';
import ClientThemeProvider from '../providers/ClientThemeProvider';

/**
 * The Agentic Workspace For section showcases how PrincipalAI's
 * agentic workspace serves different personas and roles.
 *
 * Features:
 * - Responsive grid layout with persona cards
 * - Animated entrance effects using framer-motion
 * - Cyan and blue color scheme alternating
 * - Lucide icons for each persona
 * - Hover effects on cards
 * - Gradient headline on "Agentic Workspace"
 */

const meta = {
  title: 'Landing Page/Agentic Workspace For',
  component: AgenticWorkspaceFor,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The Agentic Workspace For section explains who benefits from PrincipalAI\'s workspace: Solo Developers, Small Teams, Engineering, Product, Communications, and Leadership.',
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <ClientThemeProvider>
        <div style={{ backgroundColor: '#000000', minHeight: '100vh', padding: '40px 0' }}>
          <Story />
        </div>
      </ClientThemeProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof AgenticWorkspaceFor>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default Agentic Workspace For section with all persona cards.
 * Shows how different roles benefit from the agentic workspace.
 */
export const Default: Story = {
  args: {},
};

/**
 * Version 2 of the Agentic Workspace For section - More concise descriptions.
 * Keeps titles and subtitles but shortens the description text for better scannability.
 */
export const Version2: StoryObj<typeof AgenticWorkspaceForV2> = {
  render: () => (
    <ClientThemeProvider>
      <div style={{ backgroundColor: '#000000', minHeight: '100vh', padding: '40px 0' }}>
        <AgenticWorkspaceForV2 />
      </div>
    </ClientThemeProvider>
  ),
};
