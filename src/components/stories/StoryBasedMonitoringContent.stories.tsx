import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { StoryBasedMonitoringContent } from '../StoryBasedMonitoringContent';

/**
 * Story-based Monitoring Content
 *
 * An editorial-style page explaining the concept of story-based monitoring
 * and how it differs from traditional observability.
 *
 * Features:
 * - Serif typography for headings
 * - Monospace labels and eyebrows
 * - Contrast cards comparing traditional vs. story-based approaches
 * - Numbered steps explaining the process
 * - Callout boxes for key concepts
 * - Grid of benefit cards
 * - Ice tangerine theme styling
 */

const meta = {
  title: 'Pages/Story-based Monitoring Content',
  component: StoryBasedMonitoringContent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Editorial content page explaining story-based monitoring with the ice tangerine theme.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ClientThemeProvider>
        <Story />
      </ClientThemeProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof StoryBasedMonitoringContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default story showing the full story-based monitoring content
 */
export const Default: Story = {
  args: {},
};

/**
 * Full page context with header and footer
 */
export const FullPage: Story = {
  args: {},
  decorators: [
    (Story) => {
      const Header = () => (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '70px',
          background: '#EFF6FB',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
            Principal AI
          </div>
        </div>
      );

      const Footer = () => (
        <div style={{
          background: '#EFF6FB',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          padding: '40px 20px',
          textAlign: 'center',
          fontFamily: 'DM Sans',
          fontSize: '14px',
          color: '#6B6860',
        }}>
          © 2024 Principal AI
        </div>
      );

      return (
        <ClientThemeProvider>
          <div style={{ minHeight: '100vh', background: '#EFF6FB' }}>
            <Header />
            <div style={{ paddingTop: '70px' }}>
              <Story />
            </div>
            <Footer />
          </div>
        </ClientThemeProvider>
      );
    },
  ],
};
