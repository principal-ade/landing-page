"use client";

import React from "react";
import { ThemeProvider, theme as defaultTheme, overrideColors } from "@principal-ade/industry-theme";

// Custom theme with cyan primary color (same as backlog panel storybook)
const themedColors = overrideColors(defaultTheme, {
  primary: '#07c0ca',
  secondary: '#06a8b1',
});

// Override fonts to use Inter
const customTheme = {
  ...themedColors,
  fonts: {
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    monospace: '"Fira Code", "SF Mono", Monaco, Inconsolata, monospace',
  },
};

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={customTheme}>{children as any}</ThemeProvider>
  );
}
