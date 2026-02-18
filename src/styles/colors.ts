/**
 * Principal AI Design System - Color Tokens
 *
 * Refined palette following Apple's design principles:
 * - Minimal, purposeful colors only
 * - Clear hierarchy and relationships
 * - Sophisticated color harmony
 */

export const COLORS = {
  // Brand Primary - Cyan (The hero color)
  primary: "#00C2FF",
  primaryHover: "#00E5FF",
  primaryDark: "#0098CC",

  // Brand Accent - Warm contrast to cool cyan
  // Changed from lime to coral/orange for sophistication
  accent: "#FF6B35",      // Warm coral - complements cyan beautifully
  accentHover: "#FF8555",

  // Alternative: Keep existing if lime is core brand
  accentAlt: "#84CC16",   // Original lime (use sparingly)

  // Semantic Colors (minimal set)
  success: "#10B981",  // Emerald green (softer than bright lime)
  error: "#EF4444",    // Red
  info: "#0891B2",     // Cyan-teal (stays in brand family)

  // Neutrals - Grayscale (essential only)
  white: "#FFFFFF",
  black: "#000000",
  gray100: "#F3F4F6",  // Lightest background
  gray200: "#E5E7EB",  // Subtle borders
  gray400: "#9CA3AF",  // Secondary text
  gray500: "#6B7280",  // Labels
  gray600: "#4B5563",  // Dividers
  gray800: "#1F2937",  // Primary text
  gray900: "#111827",  // Darkest text

  // Special - Navy/Blue for backgrounds
  navyDark: "#1E3A8A",   // Gradient start
  deepBlue: "#0F172A",   // Very dark blue-black
  royalBlue: "#1E40AF",  // Rich blue for quote blocks
} as const;

export type ColorToken = keyof typeof COLORS;
