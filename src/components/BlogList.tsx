"use client";

import React, { useState } from "react";
import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags?: string[];
}

interface BlogListProps {
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract all unique tags from posts
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  ).sort();

  // Get hero post (newest one)
  const heroPost = posts[0];

  // Get remaining posts for grid (excluding hero)
  const gridPosts = posts.slice(1);

  // Filter posts based on selected tag
  const filteredGridPosts = selectedTag
    ? gridPosts.filter((post) => post.tags?.includes(selectedTag))
    : gridPosts;

  // Check if hero post matches selected tag
  const showHero = !selectedTag || heroPost?.tags?.includes(selectedTag);

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "32px 40px",
        width: "100%",
      }}
    >
      {/* Hero Section */}
      {showHero && heroPost && (
        <Link
          href={`/blog/${heroPost.slug}`}
          style={{
            textDecoration: "none",
            display: "block",
            marginBottom: "48px",
          }}
        >
          <article
            style={{
              backgroundColor: "#ffffff",
              border: "2px solid #dffff5",
              borderRadius: "16px",
              padding: "48px",
              transition: "all 0.3s ease",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
            }}
            className="hero-post-card"
          >
            {/* Featured Badge */}
            <div
              style={{
                display: "inline-block",
                backgroundColor: "#ff6b35",
                color: "#ffffff",
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "20px",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              Featured
            </div>

            <h1
              style={{
                fontSize: "42px",
                fontWeight: "700",
                color: "#0c1741",
                margin: "0 0 16px 0",
                lineHeight: "1.2",
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              {heroPost.title}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
                fontSize: "16px",
                color: "#5a8a96",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              {heroPost.date && (
                <span style={{ color: "#ff6b35", fontWeight: "500" }}>
                  {heroPost.date}
                </span>
              )}
              {heroPost.author && <span style={{ margin: "0 10px" }}>•</span>}
              {heroPost.author && <span>{heroPost.author}</span>}
            </div>

            <p
              style={{
                fontSize: "20px",
                lineHeight: "1.7",
                color: "#5a8a96",
                margin: "0 0 24px 0",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              {heroPost.excerpt}
            </p>

            {/* Tags */}
            {heroPost.tags && heroPost.tags.length > 0 && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {heroPost.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      backgroundColor: "#f0f9fb",
                      color: "#2d6a7a",
                      padding: "6px 14px",
                      borderRadius: "16px",
                      fontSize: "13px",
                      fontWeight: "500",
                      fontFamily: "var(--font-inter), system-ui, sans-serif",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        </Link>
      )}

      {/* Tag Filter Bar */}
      {allTags.length > 0 && (
        <div
          style={{
            marginBottom: "40px",
            paddingBottom: "24px",
            borderBottom: "1px solid #dffff5",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#5a8a96",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                marginRight: "8px",
              }}
            >
              Filter by:
            </span>

            {/* All Posts Button */}
            <button
              onClick={() => setSelectedTag(null)}
              style={{
                backgroundColor: selectedTag === null ? "#ff6b35" : "#ffffff",
                color: selectedTag === null ? "#ffffff" : "#5a8a96",
                border: `2px solid ${selectedTag === null ? "#ff6b35" : "#dffff5"}`,
                padding: "8px 20px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
              className="tag-button"
            >
              All Posts
            </button>

            {/* Tag Buttons */}
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  backgroundColor:
                    selectedTag === tag ? "#ff6b35" : "#ffffff",
                  color: selectedTag === tag ? "#ffffff" : "#5a8a96",
                  border: `2px solid ${selectedTag === tag ? "#ff6b35" : "#dffff5"}`,
                  padding: "8px 20px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                }}
                className="tag-button"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredGridPosts.length === 0 && !showHero && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#5a8a96",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          No posts found for this tag.
        </div>
      )}

      {/* Blog Posts Grid */}
      {filteredGridPosts.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "32px",
          }}
        >
          {filteredGridPosts.map((post) => (
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
                  backgroundColor: "#ffffff",
                  border: "1px solid #dffff5",
                  borderRadius: "12px",
                  padding: "24px",
                  height: "100%",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                className="blog-post-card"
              >
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "#0c1741",
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
                    color: "#5a8a96",
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                  }}
                >
                  {post.date && (
                    <span style={{ color: "#ff6b35" }}>{post.date}</span>
                  )}
                  {post.author && <span style={{ margin: "0 10px" }}>•</span>}
                  {post.author && <span>{post.author}</span>}
                </div>
                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.6",
                    color: "#5a8a96",
                    margin: "0 0 16px 0",
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                  }}
                >
                  {post.excerpt}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div
                    style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
                  >
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          backgroundColor: "#f0f9fb",
                          color: "#2d6a7a",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          fontFamily: "var(--font-inter), system-ui, sans-serif",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </Link>
          ))}
        </div>
      )}

      <style jsx global>{`
        .blog-post-card:hover {
          border-color: #ff6b35 !important;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(255, 107, 53, 0.2);
        }

        .hero-post-card:hover {
          border-color: #ff6b35 !important;
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(255, 107, 53, 0.25);
        }

        .tag-button:hover {
          border-color: #ff6b35 !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
