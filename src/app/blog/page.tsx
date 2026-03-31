"use client";

import React from "react";
import { useTheme } from "@principal-ade/industry-theme";
import Link from "next/link";
import { Footer } from "../../components/Footer";

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
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          height: "100%",
          overflow: "auto",
          backgroundColor: theme.colors.background,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile ? "24px 20px" : "32px 40px",
            width: "100%",
          }}
        >
        {/* Loading State */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: theme.colors.textSecondary,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
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
              fontFamily: "var(--font-inter), system-ui, sans-serif",
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
                      fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                    }}
                  >
                    {post.title}
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "16px",
                      fontSize: "14px",
                      color: theme.colors.textSecondary,
                      fontFamily: "var(--font-inter), system-ui, sans-serif",
                    }}
                  >
                    {post.date && <span style={{ color: theme.colors.primary }}>{post.date}</span>}
                    {post.author && <span style={{ margin: "0 10px" }}>•</span>}
                    {post.author && <span>{post.author}</span>}
                  </div>
                  <p
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.6",
                      color: theme.colors.textSecondary,
                      margin: 0,
                      fontFamily: "var(--font-inter), system-ui, sans-serif",
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
    </div>
  );
}
