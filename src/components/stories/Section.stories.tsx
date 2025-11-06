import type { Meta, StoryObj } from '@storybook/react';
import { Section } from '../Section';
import ClientThemeProvider from '../providers/ClientThemeProvider';
import Image from 'next/image';

/**
 * The Section component is the building block for landing page sections.
 * Use it to create consistent, full-viewport sections with text and media content.
 *
 * Each section can have:
 * - Text on the left or right
 * - Different background styles (primary, secondary, or grid)
 * - Media content (images, videos, or custom components)
 * - Mobile-responsive layouts
 */
const meta = {
  title: 'Landing Page/Section',
  component: Section,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Reusable section component for creating landing page sections. Perfect for adding new features or content areas.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ClientThemeProvider>
        <div style={{ minHeight: '100vh' }}>
          <Story />
        </div>
      </ClientThemeProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    textPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of the text content relative to media',
    },
    background: {
      control: 'select',
      options: ['primary', 'secondary', 'grid'],
      description: 'Background style for the section',
    },
    isMobile: {
      control: 'boolean',
      description: 'Enable mobile layout',
    },
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic section with text on the left and an image on the right.
 * This is the default layout for most sections.
 */
export const TextLeft: Story = {
  args: {
    id: 'text-left-section',
    textPosition: 'left',
    background: 'secondary',
    title: 'New Feature Title',
    description: 'This is a description of your new feature. You can explain what it does and why users will love it. Keep it concise but informative.',
    media: (
      <div
        style={{
          width: '100%',
          height: '600px',
          backgroundColor: '#e0e0e0',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          color: '#666',
        }}
      >
        Your media goes here (image, video, or component)
      </div>
    ),
    isMobile: false,
  },
};

/**
 * Section with text on the right and media on the left.
 * Alternating text position creates visual variety.
 */
export const TextRight: Story = {
  args: {
    id: 'text-right-section',
    textPosition: 'right',
    background: 'grid',
    title: 'Another Amazing Feature',
    description: 'Describe this feature and its benefits. The grid background creates a technical, modern look.',
    media: (
      <div
        style={{
          width: '100%',
          height: '600px',
          backgroundColor: '#d0d0d0',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          color: '#666',
        }}
      >
        Media content placeholder
      </div>
    ),
    isMobile: false,
  },
};

/**
 * Section with a video as media content.
 * Perfect for demos and showcasing functionality.
 */
export const WithVideo: Story = {
  args: {
    id: 'video-section',
    textPosition: 'left',
    background: 'secondary',
    title: 'Watch It In Action',
    description: 'Videos are great for demonstrating complex features. They autoplay on loop for continuous engagement.',
    media: (
      <div
        style={{
          width: '100%',
          height: '600px',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        >
          {/* Replace with your video source */}
          <div style={{ color: '#fff', padding: '20px' }}>Video placeholder</div>
        </video>
      </div>
    ),
    isMobile: false,
  },
};

/**
 * Section with grid background for a technical feel.
 * Great for developer-focused content.
 */
export const GridBackground: Story = {
  args: {
    id: 'grid-section',
    textPosition: 'right',
    background: 'grid',
    title: 'Technical Excellence',
    description: 'The grid background gives a technical, precise feel. Perfect for developer tools and technical products.',
    media: (
      <div
        style={{
          width: '100%',
          height: '600px',
          backgroundColor: '#f5f5f5',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          color: '#666',
          border: '2px solid #ddd',
        }}
      >
        Grid background section
      </div>
    ),
    isMobile: false,
  },
};

/**
 * Mobile layout with stacked content.
 * Text and media stack vertically on mobile devices.
 */
export const MobileLayout: Story = {
  args: {
    id: 'mobile-section',
    textPosition: 'left',
    background: 'secondary',
    title: 'Mobile-First Design',
    description: 'On mobile, sections automatically stack vertically for better readability and usability.',
    media: (
      <div
        style={{
          width: '100%',
          height: '400px',
          backgroundColor: '#e0e0e0',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          color: '#666',
        }}
      >
        Media content
      </div>
    ),
    isMobile: true,
  },
};

/**
 * Section with custom JSX content as description.
 * You can use rich content including links, lists, and buttons.
 */
export const WithRichContent: Story = {
  args: {
    id: 'rich-content-section',
    textPosition: 'left',
    background: 'primary',
    title: 'Rich Content Support',
    description: (
      <div>
        <p style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '16px' }}>
          Sections support rich JSX content, not just plain text. You can include:
        </p>
        <ul style={{ fontSize: '16px', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Bullet points</li>
          <li>Links to external resources</li>
          <li>Multiple paragraphs</li>
          <li>Buttons and interactive elements</li>
        </ul>
        <p style={{ fontSize: '16px', lineHeight: '1.8', marginTop: '16px' }}>
          <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>
            Learn more →
          </a>
        </p>
      </div>
    ),
    media: (
      <div
        style={{
          width: '100%',
          height: '600px',
          backgroundColor: '#e8f4f8',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          color: '#666',
        }}
      >
        Interactive content example
      </div>
    ),
    isMobile: false,
  },
};
