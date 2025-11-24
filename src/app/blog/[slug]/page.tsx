"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTheme } from "@principal-ade/industry-theme";
import { DocumentView, parseMarkdownIntoPresentation } from "themed-markdown";
import { ThemedSlidePresentationBook } from "@/components/ThemedSlidePresentationBook";
import mermaid from "mermaid";
import "themed-markdown/dist/index.css";

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
    .replace(/\*\*Author:\*\*\s+.+$/m, "");

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

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { theme } = useTheme();
  const [content, setContent] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [viewMode, _setViewMode] = React.useState<"book" | "single">("book");
  const [slides, setSlides] = React.useState<string[]>([]);
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  React.useEffect(() => {
    if (!slug) return;

    fetch(`/api/blog/${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Blog post not found");
        }
        return res.json();
      })
      .then((data) => {
        const { content: processedContent } = processContent(data.content || "");
        setContent(processedContent);

        // If this is the pitch-deck, parse it into slides
        if (slug === "pitch-deck") {
          try {
            const presentation = parseMarkdownIntoPresentation(data.content);
            const parsedSlides = (presentation?.slides || []).map((s) => s.location.content);
            setSlides(parsedSlides);
          } catch (error) {
            console.error("Error parsing markdown into slides:", error);
            setSlides([data.content]); // Fallback to single slide
          }
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blog post:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [slug]);

  const isMobile = windowWidth < 768;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.colors.backgroundSecondary,
      }}
    >
      {/* Main Content */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          paddingTop: "84px",
        }}
      >

        {/* Loading State */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: theme.colors.textSecondary,
            }}
          >
            Loading blog post...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
            }}
          >
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "700",
                color: theme.colors.text,
                marginBottom: "16px",
              }}
            >
              Blog Post Not Found
            </h1>
            <p
              style={{
                fontSize: "18px",
                color: theme.colors.textSecondary,
                marginBottom: "24px",
              }}
            >
              The blog post you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/blog"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "600",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${theme.colors.primary}40`;
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Back to Blog
            </Link>
          </div>
        )}

        {/* Blog Content */}
        {!loading && !error && content && (
          <div style={{ opacity: isClient && content ? 1 : 0, transition: "opacity 0.3s ease-in", paddingTop: "20px" }}>
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
                  maxWidth={isMobile ? "95%" : "70%"}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
