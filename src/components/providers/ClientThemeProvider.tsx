"use client";

import React from "react";
import { ThemeProvider } from "@principal-ade/industry-theme";
import { landingPageTheme } from "@principal-ade/industry-theme";

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={landingPageTheme}>{children as any}</ThemeProvider>
  );
}
