/**
 * Code Trails Design System
 * Consistent typography, spacing, and colors across all landing page components
 */

export const typography = {
  // Font sizes - fixed, not clamp()
  size: {
    displayLarge: { mobile: 48, desktop: 64 },  // Hero headlines only
    h1: { mobile: 40, desktop: 56 },            // Section headlines
    h2: { mobile: 32, desktop: 42 },            // Subsections
    h3: { mobile: 20, desktop: 24 },            // Card titles
    bodyLarge: { mobile: 18, desktop: 20 },     // Lead paragraphs
    body: { mobile: 16, desktop: 18 },          // Main body text
    bodySmall: { mobile: 14, desktop: 16 },     // Secondary text
    label: { mobile: 11, desktop: 11 },         // Labels, badges
  },

  // Line heights
  lineHeight: {
    tight: 1.1,    // Headlines
    normal: 1.4,   // Subheadings
    relaxed: 1.6,  // Body copy
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.02em',   // Large headlines
    normal: '0',        // Body text
    wide: '0.05em',     // Labels, uppercase
  },

  // Font weights
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const spacing = {
  // Section padding
  section: {
    mobile: '80px 24px',
    desktop: '100px 40px',
  },

  // Internal spacing
  gap: {
    xs: 16,
    sm: 24,
    md: 48,
    lg: 64,
    xl: 80,
  },
};

export const layout = {
  maxWidth: {
    content: 1280,  // Main content container
    prose: 680,     // Readable text width
  },
};

// Helper functions
export const px = (value: number) => `${value}px`;
export const responsive = (mobile: number, desktop: number, isMobile: boolean) =>
  px(isMobile ? mobile : desktop);
