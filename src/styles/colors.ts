/**
 * Principal AI Design System - Color Tokens
 *
 * Ice Tangerine Theme
 * Cool ice blue with hot tangerine contrast
 * Fresh, Vibrant, Summer Tech
 */

export const COLORS = {
  // Ice Tangerine Brand Colors
  primary: "#ff6b35",      // Bright tangerine (primary CTAs)
  primaryHover: "#ff8555", // Lighter tangerine on hover
  primaryDark: "#e55a2a",  // Darker tangerine

  secondary: "#0893d2",    // Bright teal (secondary elements)
  secondaryHover: "#0aa3e3",

  accent: "#ff8755",       // Lighter tangerine (accents)
  accentHover: "#ffa070",

  accent2: "#22d3ee",      // Bright cyan (alternative accent)
  accentAlt: "#22d3ee",    // Bright cyan (for compatibility)

  // Text colors
  text: "#0c1741",         // Very dark navy (primary text)
  textSecondary: "#3e6b77", // Muted teal (secondary text)

  // Backgrounds
  background: "#f7fcfd",   // Very light ice blue
  surface: "#ffffff",      // White
  border: "#dffff5",       // Very light cyan

  // Semantic Colors
  success: "#10B981",      // Emerald green
  error: "#EF4444",        // Red
  info: "#0893d2",         // Bright teal (matches secondary)

  // Neutrals - Grayscale
  white: "#FFFFFF",
  black: "#0c1741",        // Dark navy instead of pure black
  gray100: "#f7fcfd",      // Ice blue tint
  gray200: "#dffff5",      // Light cyan tint
  gray400: "#9CA3AF",      // Secondary text
  gray500: "#6B7280",      // Labels
  gray600: "#3e6b77",      // Muted teal
  gray800: "#0c1741",      // Dark navy
  gray900: "#0a0f2e",      // Darkest navy

  // Special backgrounds for sections
  navyDark: "#0c1741",     // Dark navy
  deepBlue: "#0a0f2e",     // Very dark navy
  royalBlue: "#0893d2",    // Bright teal for quote blocks
} as const;

export type ColorToken = keyof typeof COLORS;
