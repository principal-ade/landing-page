import type { Meta, StoryObj } from '@storybook/react';
import ProductPage from '../../app/product/page';

/**
 * Product Page
 *
 * Full product page showcasing Visual Understanding of Software.
 * Features the "Multiple Lenses" section with Quality Radar, File City, and Architecture Diagrams.
 */

const meta = {
  title: 'Pages/Product',
  component: ProductPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Product page showcasing three complementary views to understand any codebase: Quality Radar, File City, and Architecture Diagrams.',
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0d1117' },
      ],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProductPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default product page view
 */
export const Default: Story = {};
