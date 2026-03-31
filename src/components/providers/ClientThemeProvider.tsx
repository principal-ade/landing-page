"use client";

import React from "react";
import { ThemeProvider, iceTangerineTheme } from "@principal-ade/industry-theme";

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={iceTangerineTheme}>{children as any}</ThemeProvider>
  );
}
