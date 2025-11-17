import type { Meta, StoryObj } from '@storybook/react';
import { ContextEngineering } from '../ContextEngineering';
import ClientThemeProvider from '../providers/ClientThemeProvider';

/**
 * The Context Engineering section explains how PrincipalAI transforms
 * spec debt into spec intelligence through automated context preservation.
 *
 * Features:
 * - Gradient headline with "Spec Intelligence"
 * - Clean typography and spacing
 * - Stats showcase (∞, 0, 100%)
 * - Neural network visualization placeholder
 * - Framer-motion animations
 */

const meta = {
  title: 'Landing Page/Context Engineering',
  component: ContextEngineering,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The Context Engineering section showcases how PrincipalAI automatically preserves context and eliminates spec debt through intelligent documentation.',
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
} satisfies Meta<typeof ContextEngineering>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default Context Engineering section showing the transformation
 * from spec debt to spec intelligence.
 */
export const Default: Story = {
  args: {},
};
