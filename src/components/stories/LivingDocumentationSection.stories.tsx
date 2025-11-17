import type { Meta, StoryObj } from '@storybook/react';
import { LivingDocumentationSection } from '../LivingDocumentationSection';
import ClientThemeProvider from '../providers/ClientThemeProvider';

/**
 * The Living Documentation Section explains how PrincipalAI stores context
 * in Git rather than in the cloud, making it version-controlled and agent-accessible.
 *
 * Features:
 * - Two-column responsive layout
 * - Animated GlowingFolder component on the left
 * - Content with headline and body copy on the right
 * - Framer-motion animations for entrance effects
 * - Whitespace-nowrap on key phrases
 */

const meta = {
  title: 'Landing Page/Living Documentation Section',
  component: LivingDocumentationSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The Living Documentation Section showcases the architectural difference of storing context in Git, with an animated folder visualization.',
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
} satisfies Meta<typeof LivingDocumentationSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default Living Documentation section with animated folder and content.
 */
export const Default: Story = {
  args: {},
};
