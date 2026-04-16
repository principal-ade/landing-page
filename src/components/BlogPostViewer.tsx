"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "@principal-ade/industry-theme";
import { DocumentView, parseMarkdownIntoPresentation } from "themed-markdown";
import { ThemedSlidePresentationBook } from "@/components/ThemedSlidePresentationBook";
import mermaid from "mermaid";
import "themed-markdown/dist/index.css";

interface BlogPostViewerProps {
  slug: string;
  content: string;
}

// Process blog content to extract and reformat metadata
function processContent(rawContent: string): { content: string; date: string; author: string } {
  let date = "";
  let author = "";

  // Extract date
  const dateMatch = rawContent.match(/\*\*Published:\*\*\s+(.+)$/m);
  if (dateMatch) {
    date = dateMatch[1].trim();
  }

  // Extract author
  const authorMatch = rawContent.match(/\*\*Author:\*\*\s+(.+)$/m);
  if (authorMatch) {
    author = authorMatch[1].trim();
    // Hide author if it's "Principal Team"
    if (author.toLowerCase().includes("principal team")) {
      author = "";
    }
  }

  // Remove the metadata lines from content
  let content = rawContent
    .replace(/\*\*Published:\*\*\s+.+$/m, "")
    .replace(/\*\*Author:\*\*\s+.+$/m, "")
    .replace(/\*\*Tags:\*\*\s+.+$/m, "");

  // Build the new metadata line
  const metadataParts: string[] = [];
  if (date) metadataParts.push(date);
  if (author) metadataParts.push(author);

  if (metadataParts.length > 0) {
    // Insert metadata after the title (first # heading)
    const titleMatch = content.match(/^(#\s+.+)$/m);
    if (titleMatch) {
      const metadataLine = `\n\n*${metadataParts.join(" • ")}*\n`;
      content = content.replace(titleMatch[0], titleMatch[0] + metadataLine);
    }
  }

  // Clean up extra blank lines
  content = content.replace(/\n{3,}/g, "\n\n");

  return { content, date, author };
}

export function BlogPostViewer({ slug, content: rawContent }: BlogPostViewerProps) {
  const { theme } = useTheme();
  const [isClient, setIsClient] = React.useState(false);
  const [viewMode, _setViewMode] = React.useState<"book" | "single">("book");
  const [slides, setSlides] = React.useState<string[]>([]);

  const { content } = processContent(rawContent);

  // Prevent scroll on mount
  React.useEffect(() => {
    setIsClient(true);
    window.scrollTo(0, 0);

    const preventScroll = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('scroll', preventScroll);
    setTimeout(() => {
      window.removeEventListener('scroll', preventScroll);
    }, 1000);

    return () => {
      window.removeEventListener('scroll', preventScroll);
    };
  }, []);

  // Keep scroll at top when content loads
  React.useEffect(() => {
    if (content) {
      window.scrollTo(0, 0);
    }
  }, [content]);

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

  // Parse slides if this is pitch-deck
  React.useEffect(() => {
    if (slug === "pitch-deck") {
      try {
        const presentation = parseMarkdownIntoPresentation(rawContent);
        const parsedSlides = (presentation?.slides || []).map((s) => s.location.content);
        setSlides(parsedSlides);
      } catch (error) {
        console.error("Error parsing markdown into slides:", error);
        setSlides([rawContent]); // Fallback to single slide
      }
    }
  }, [slug, rawContent]);

  return (
    <div
      style={{
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          height: "100%",
          overflow: "auto",
          backgroundColor: theme.colors.backgroundSecondary,
        }}
      >
        <div style={{ opacity: isClient && content ? 1 : 0, transition: "opacity 0.3s ease-in" }}>
          {slug === "pitch-deck" && viewMode === "book" && slides.length > 0 ? (
            <div style={{
              width: "100%",
              height: "calc(100vh - 120px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px"
            }}>
              <div style={{
                width: "90%",
                height: "100%",
                maxWidth: "1400px",
                border: `2px solid ${theme.colors.border}`,
                borderRadius: "12px",
                overflow: "hidden",
                backgroundColor: theme.colors.background,
              }}>
                <ThemedSlidePresentationBook
                  slides={slides}
                  viewMode="single"
                  showNavigation={true}
                  showSlideCounter={true}
                  showFullscreenButton={true}
                  containerHeight="100%"
                  theme={theme}
                />
              </div>
            </div>
          ) : (
            <div className="blog-post-content">
              <DocumentView
                content={content}
                transparentBackground={true}
                theme={theme}
                maxWidth="100%"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
