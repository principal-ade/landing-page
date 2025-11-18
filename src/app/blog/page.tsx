"use client";

import React from "react";
import { useTheme } from "@a24z/industry-theme";
import Link from "next/link";
import { Footer } from "../../components/Footer";

// Minimal Navigation Component (matching homepage)
const MinimalNavigation: React.FC = () => {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0, 194, 255, 0.2)",
        padding: isTablet ? "18px 32px" : isMobile ? "14px 20px" : "16px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo/Brand */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            fontSize: isTablet ? "22px" : isMobile ? "18px" : "20px",
            fontWeight: "600",
            fontFamily:
              'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          <span style={{ color: "#ffffff" }}>Principal</span>
          <span
            style={{
              fontWeight: "300",
              background: "linear-gradient(135deg, #00C2FF, #0098CC)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI
          </span>
        </Link>

        {/* Nav Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isTablet ? "28px" : isMobile ? "20px" : "32px",
          }}
        >
          <Link
            href="/about"
            style={{
              color: "#d1d5db",
              textDecoration: "none",
              fontSize: isTablet ? "15px" : isMobile ? "13px" : "14px",
              fontWeight: "500",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#00C2FF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#d1d5db";
            }}
          >
            About
          </Link>
          <Link
            href="/blog"
            style={{
              color: "#00C2FF",
              textDecoration: "none",
              fontSize: isTablet ? "15px" : isMobile ? "13px" : "14px",
              fontWeight: "500",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              transition: "color 0.2s ease",
            }}
          >
            Blog
          </Link>
          <a
            href="/demo"
            style={{
              padding: isTablet
                ? "10px 24px"
                : isMobile
                  ? "8px 18px"
                  : "8px 20px",
              background: "transparent",
              color: "#00C2FF",
              border: "1px solid #00C2FF",
              textDecoration: "none",
              fontSize: isTablet ? "15px" : isMobile ? "13px" : "14px",
              fontWeight: "600",
              borderRadius: isTablet ? "7px" : "6px",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(0, 194, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Book a Demo
          </a>
          <a
            href="https://principal-ade.com/download"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: isTablet
                ? "10px 24px"
                : isMobile
                  ? "8px 18px"
                  : "8px 20px",
              background: "#00C2FF",
              color: "#000000",
              textDecoration: "none",
              fontSize: isTablet ? "15px" : isMobile ? "13px" : "14px",
              fontWeight: "600",
              borderRadius: isTablet ? "7px" : "6px",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0, 194, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Download Alpha
          </a>
        </div>
      </div>
    </nav>
  );
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
}

export default function BlogPage() {
  const { theme } = useTheme();
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blog posts:", error);
        setLoading(false);
      });
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.colors.background,
      }}
    >
      <MinimalNavigation />

      <div
        style={{
          flex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "104px 20px 40px 20px" : "124px 40px 60px 40px",
          width: "100%",
        }}
      >
        {/* Page Title */}
        <h1
          style={{
            fontSize: isMobile ? "32px" : "48px",
            fontWeight: "700",
            color: theme.colors.text,
            marginBottom: isMobile ? "32px" : "48px",
            textAlign: "center",
          }}
        >
          Blog
        </h1>

        {/* Loading State */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: theme.colors.textSecondary,
            }}
          >
            Loading blog posts...
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: theme.colors.textSecondary,
            }}
          >
            No blog posts found.
          </div>
        )}

        {/* Blog Posts Grid */}
        {!loading && posts.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "32px",
            }}
          >
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  textDecoration: "none",
                  display: "block",
                }}
              >
                <article
                  style={{
                    backgroundColor: theme.colors.backgroundSecondary,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: "12px",
                    padding: "24px",
                    height: "100%",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 8px 24px ${theme.colors.primary}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.border;
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <h2
                    style={{
                      fontSize: "24px",
                      fontWeight: "600",
                      color: theme.colors.text,
                      margin: "0 0 12px 0",
                    }}
                  >
                    {post.title}
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      marginBottom: "16px",
                      fontSize: "14px",
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {post.date && <span>{post.date}</span>}
                    {post.author && <span>• {post.author}</span>}
                  </div>
                  <p
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.6",
                      color: theme.colors.textSecondary,
                      margin: 0,
                    }}
                  >
                    {post.excerpt}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
