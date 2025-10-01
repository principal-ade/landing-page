"use client";

import React from "react";
import {
  SlidePresentationBook,
  SlidePresentationBookProps,
  ThemeProvider,
  useTheme
} from "themed-markdown";
import mermaid from "mermaid";
import "themed-markdown/dist/index.css";

export const ThemedSlidePresentationBook: React.FC<SlidePresentationBookProps> = (props) => {
  const { theme } = useTheme();

  // Initialize mermaid
  React.useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
    });
    // @ts-expect-error - Expose mermaid to window for themed-markdown
    window.mermaid = mermaid;
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SlidePresentationBook {...props} />
    </ThemeProvider>
  );
};
