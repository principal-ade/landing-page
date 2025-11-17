import type { Meta, StoryObj } from '@storybook/react';
import { PrincipalFolder } from '../PrincipalFolder';
import ClientThemeProvider from '../providers/ClientThemeProvider';

/**
 * The Principal Folder section explains the .principalMD/ folder structure
 * that serves as the repo's living documentation and reasoning hub.
 *
 * Features:
 * - Centered headline with cyan ".principalMD/" text
 * - File tree visualization with comments
 * - Monospace font for code-like appearance
 * - Animated entrance effects using framer-motion
 * - Bottom tagline with bullet separators
 */

const meta = {
  title: 'Landing Page/Principal Folder',
  component: PrincipalFolder,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The Principal Folder section showcases the .principalMD/ folder structure that contains living documentation, specs, maps, policies, and decisions.',
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
} satisfies Meta<typeof PrincipalFolder>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default Principal Folder section with file tree visualization.
 */
export const Default: Story = {
  args: {},
};
