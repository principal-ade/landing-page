"use client";

import React from "react";
import { ThemeProvider, Theme } from "@a24z/industry-theme";
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

export const themes: Record<string, Theme> = {
  terminal: terminalTheme,
  regal: regalTheme,
  matrix: matrixTheme,
  "matrix-minimal": matrixMinimalTheme,
  slate: slateTheme,
  markdown: defaultMarkdownTheme,
  editor: defaultEditorTheme,
  "terminal-default": defaultTerminalTheme,
};

// Create a context for theme switching
interface ThemeSwitcherContextValue {
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  availableThemes: string[];
}

const ThemeSwitcherContext = React.createContext<
  ThemeSwitcherContextValue | undefined
>(undefined);

export const useThemeSwitcher = () => {
  const context = React.useContext(ThemeSwitcherContext);
  if (!context) {
    throw new Error(
      "useThemeSwitcher must be used within ClientThemeProvider"
    );
  }
  return context;
};

export default function ClientThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTheme, setCurrentTheme] = React.useState("slate");
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Load theme from localStorage on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("ade-theme");
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
    setIsHydrated(true);
  }, []);

  // Save theme to localStorage when it changes
  React.useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("ade-theme", currentTheme);
    }
  }, [currentTheme, isHydrated]);

  const value: ThemeSwitcherContextValue = {
    currentTheme,
    setCurrentTheme,
    availableThemes: Object.keys(themes),
  };

  return (
    <ThemeSwitcherContext.Provider value={value}>
      <ThemeProvider theme={themes[currentTheme]}>
        {children as any}
      </ThemeProvider>
    </ThemeSwitcherContext.Provider>
  );
}
