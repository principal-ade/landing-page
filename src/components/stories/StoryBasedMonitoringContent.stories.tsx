import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import { StoryBasedMonitoringSimple } from '../StoryBasedMonitoringSimple';

/**
 * Story-based Monitoring Content (Simplified)
 *
 * A simplified, investor-pitch-style page explaining story-based monitoring.
 * Focuses on clarity over complexity.
 *
 * Features:
 * - Clear problem statement
 * - Product screenshot with simple callout
 * - 3-step "How It Works"
 * - Minimal "Why Now" section
 * - Single strong CTA
 */

const meta = {
  title: 'Pages/Story-based Monitoring Content',
  component: StoryBasedMonitoringSimple,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Simplified page explaining story-based monitoring with investor-pitch clarity.',
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
} satisfies Meta<typeof StoryBasedMonitoringSimple>;

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
