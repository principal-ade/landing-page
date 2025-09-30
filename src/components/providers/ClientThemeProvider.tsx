"use client";

import { ThemeProvider } from "themed-markdown";
import {
  terminalTheme,
  regalTheme,
  glassmorphismTheme,
  matrixTheme,
  matrixMinimalTheme,
  slateTheme,
  defaultMarkdownTheme,
  defaultEditorTheme,
  defaultTerminalTheme,
} from "@a24z/industry-theme";

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const themes = {
    terminal: terminalTheme,
    regal: regalTheme,
    glassmorphism: glassmorphismTheme,
    matrix: matrixTheme,
    "matrix-minimal": matrixMinimalTheme,
    slate: slateTheme,
    markdown: defaultMarkdownTheme,
    editor: defaultEditorTheme,
    "terminal-default": defaultTerminalTheme,
  };

  return (
    <ThemeProvider themes={themes} defaultTheme="markdown">
      {children as any}
    </ThemeProvider>
  );
}
