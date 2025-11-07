import type { Meta, StoryObj } from '@storybook/react';
import { FeaturesAndBenefits } from '../FeaturesAndBenefits';
import { FeaturesAndBenefitsV2 } from '../FeaturesAndBenefitsV2';
import ClientThemeProvider from '../providers/ClientThemeProvider';

/**
 * The Features & Benefits section showcases the key features of PrincipalAI's
 * agentic workspace and their corresponding benefits.
 *
 * Features:
 * - Responsive grid layout with feature cards
 * - Animated entrance effects using framer-motion
 * - Cyan color scheme with hover effects
 * - Lucide icons for benefits (Check marks)
 * - "Available Now" and "Coming Soon" badges
 * - Feature/Benefit structure for each card
 */

const meta = {
  title: 'Landing Page/Features And Benefits',
  component: FeaturesAndBenefits,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The Features & Benefits section explains the core features of PrincipalAI workspace: Auto-Sync, Unified Workspace, Excalidraw Integration, and Map/FileTree City View.',
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
} satisfies Meta<typeof FeaturesAndBenefits>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default Features & Benefits section with all feature cards.
 * Shows the 4 main features with their benefits and a "Coming Soon" section.
 */
export const Default: Story = {
  args: {},
};

/**
 * Version 2 of the Features & Benefits section - More visual, less copy.
 * Features larger icons, simplified taglines, and cleaner card design.
 */
export const Version2: StoryObj<typeof FeaturesAndBenefitsV2> = {
  render: () => (
    <ClientThemeProvider>
      <div style={{ backgroundColor: '#000000', minHeight: '100vh', padding: '40px 0' }}>
        <FeaturesAndBenefitsV2 />
      </div>
    </ClientThemeProvider>
  ),
};
