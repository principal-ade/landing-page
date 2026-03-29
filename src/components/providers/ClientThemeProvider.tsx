"use client";

import React from "react";
import { ThemeProvider, slateGoldTheme } from "@principal-ade/industry-theme";

// Use slate gold theme with Inter fonts
const customTheme = {
  ...slateGoldTheme,
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
