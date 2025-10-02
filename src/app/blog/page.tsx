"use client";

import React from "react";
import { useTheme } from "@a24z/industry-theme";
import Link from "next/link";
import { Logo } from "@a24z/logo-component";

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
        backgroundColor: theme.colors.background,
      }}
    >
      {/* Header with Logo */}
      <div
        style={{
          borderBottom: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.backgroundSecondary,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Link
            href="/"
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
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "40px 20px" : "60px 40px",
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
    </div>
  );
}
