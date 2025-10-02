"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useTheme } from "@a24z/industry-theme";
import { DocumentView } from "themed-markdown";
import Link from "next/link";
import { Logo } from "@a24z/logo-component";
import { useThemeSwitcher } from "@/components/providers/ClientThemeProvider";
import mermaid from "mermaid";
import "themed-markdown/dist/index.css";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { theme } = useTheme();
  const { currentTheme, setCurrentTheme, availableThemes } = useThemeSwitcher();
  const [content, setContent] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isClient, setIsClient] = React.useState(false);
  const [fontSizeScale, setFontSizeScale] = React.useState(1);
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load font size from localStorage
  React.useEffect(() => {
    const savedFontSize = localStorage.getItem("blogFontSizeScale");
    if (savedFontSize) {
      setFontSizeScale(parseFloat(savedFontSize));
    }
  }, []);

  const increaseFontSize = () => {
    const newScale = Math.min(fontSizeScale + 0.1, 2);
    setFontSizeScale(newScale);
    localStorage.setItem("blogFontSizeScale", newScale.toString());
  };

  const decreaseFontSize = () => {
    const newScale = Math.max(fontSizeScale - 0.1, 0.5);
    setFontSizeScale(newScale);
    localStorage.setItem("blogFontSizeScale", newScale.toString());
  };

  const resetFontSize = () => {
    setFontSizeScale(1);
    localStorage.setItem("blogFontSizeScale", "1");
  };

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
        setContent(data.content || "");
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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.colors.background,
      }}
    >
      {/* Header with Logo */}
      <div
        style={{
          flexShrink: 0,
          borderBottom: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.backgroundSecondary,
        }}
      >
        <div
          style={{
	    maxWidth: "80%",
            margin: "0 auto",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link
              href="/blog"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Logo
                width={isMobile ? 60 : 80}
                height={isMobile ? 60 : 80}
                color={theme.colors.primary}
                particleColor={theme.colors.accent}
                opacity={0.9}
              />
            </Link>
            <div>
              <h1
                style={{
                  fontSize: isMobile ? "24px" : "32px",
                  fontWeight: "700",
                  color: theme.colors.text,
                  margin: 0,
                }}
              >
                Blog
              </h1>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Theme Selector */}
            {!isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    color: theme.colors.textSecondary,
                    fontWeight: "500",
                  }}
                >
                  Theme:
                </span>
                <select
                  value={currentTheme}
                  onChange={(e) => setCurrentTheme(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: theme.colors.backgroundSecondary,
                    color: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.border;
                  }}
                >
                  {availableThemes.map((themeName) => (
                    <option key={themeName} value={themeName}>
                      {themeName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Font Size Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                onClick={decreaseFontSize}
                style={{
                  padding: "8px 12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  backgroundColor: "transparent",
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  lineHeight: "1",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.color = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border;
                  e.currentTarget.style.color = theme.colors.text;
                }}
              >
                A−
              </button>
              <button
                onClick={resetFontSize}
                style={{
                  padding: "8px 12px",
                  fontSize: "14px",
                  fontWeight: "600",
                  backgroundColor: "transparent",
                  color: theme.colors.textSecondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  lineHeight: "1",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.color = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border;
                  e.currentTarget.style.color = theme.colors.textSecondary;
                }}
                title="Reset font size"
              >
                Reset
              </button>
              <button
                onClick={increaseFontSize}
                style={{
                  padding: "8px 12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  backgroundColor: "transparent",
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  lineHeight: "1",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.color = theme.colors.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border;
                  e.currentTarget.style.color = theme.colors.text;
                }}
              >
                A+
              </button>
            </div>

            <Link
              href="/blog"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: isMobile ? "8px 16px" : "10px 20px",
                fontSize: isMobile ? "14px" : "15px",
                fontWeight: "600",
                backgroundColor: "transparent",
                color: theme.colors.text,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
                e.currentTarget.style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border;
                e.currentTarget.style.color = theme.colors.text;
              }}
            >
              Back to List
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflow: "auto",
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
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${theme.colors.primary}40`;
              }}
              onMouseLeave={(e) => {
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
            <DocumentView
              content={content}
              fontSizeScale={fontSizeScale}
              transparentBackground={true}
              theme={theme}
              maxWidth="70%"
            />
          </div>
        )}
      </div>
    </div>
  );
}
