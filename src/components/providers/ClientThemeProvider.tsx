"use client";

import React from "react";
import { ThemeProvider, theme as defaultTheme, overrideColors } from "@principal-ade/industry-theme";

// Custom theme with cyan primary color (same as backlog panel storybook)
const customTheme = overrideColors(defaultTheme, {
  primary: '#07c0ca',
  secondary: '#06a8b1',
});

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={customTheme}>{children as any}</ThemeProvider>
  );
}
