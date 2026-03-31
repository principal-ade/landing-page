"use client";

import React from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

export default function CommunityPage() {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0e17",
        color: "#f1f5f9",
      }}
    >
      <Header />

      {/* Page Header */}
      <section
        style={{
          padding: isMobile ? "7rem 1.5rem 2rem" : "8rem 2rem 3rem",
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? "2rem" : "3rem",
            fontWeight: "700",
            lineHeight: "1.15",
            letterSpacing: "-0.03em",
            marginBottom: "1rem",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          The conversation is <em style={{ fontStyle: "normal", color: "#22d3ee" }}>happening</em>
        </h1>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "1.1rem",
            maxWidth: "550px",
            margin: "0 auto",
            lineHeight: "1.7",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          Engineers, founders, and CTOs are rethinking how we monitor agent-written code. Here's where it's playing out.
        </p>
      </section>

      {/* Social Section */}
      <section
        style={{
          padding: isMobile ? "3rem 1.5rem 5rem" : "3rem 2rem 5rem",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: "1.25rem",
            color: "#22d3ee",
          }}
        >
          Social
        </div>
        <h2
          style={{
            fontSize: isMobile ? "1.5rem" : "2rem",
            fontWeight: "700",
            letterSpacing: "-0.02em",
            marginBottom: "2.5rem",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          What people are saying
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: "1.25rem",
          }}
        >
          {/* Post 1 */}
          <a
            href="https://www.linkedin.com/posts/REPLACE_WITH_POST_ID"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              background: "#111827",
              border: "1px solid rgba(148, 163, 184, 0.1)",
              borderRadius: "14px",
              overflow: "hidden",
              textDecoration: "none",
              color: "inherit",
              transition: "border-color 0.3s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <img
              src="/images/social/michael-datadog-post.png"
              alt="Michael Flannery's LinkedIn post about Anthropic's Datadog deal"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
              }}
            />
            <div
              style={{
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "0.65rem",
                    flexShrink: 0,
                    background: "rgba(34, 211, 238, 0.15)",
                    color: "#22d3ee",
                  }}
                >
                  MF
                </div>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                  }}
                >
                  Michael Flannery
                </span>
              </div>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#64748b",
                  padding: "0.15rem 0.5rem",
                  border: "1px solid rgba(148, 163, 184, 0.1)",
                  borderRadius: "4px",
                }}
              >
                LinkedIn
              </span>
            </div>
          </a>

          {/* Post 2 */}
          <a
            href="https://x.com/FileCityAI/status/REPLACE_WITH_POST_ID"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              background: "#111827",
              border: "1px solid rgba(148, 163, 184, 0.1)",
              borderRadius: "14px",
              overflow: "hidden",
              textDecoration: "none",
              color: "inherit",
              transition: "border-color 0.3s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <img
              src="/images/social/filecity-tours-post.png"
              alt="FileCity's X post about File City Tours"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
              }}
            />
            <div
              style={{
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "0.65rem",
                    flexShrink: 0,
                    background: "rgba(52, 211, 153, 0.15)",
                    color: "#34d399",
                  }}
                >
                  FC
                </div>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                  }}
                >
                  FileCity
                </span>
              </div>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#64748b",
                  padding: "0.15rem 0.5rem",
                  border: "1px solid rgba(148, 163, 184, 0.1)",
                  borderRadius: "4px",
                }}
              >
                X
              </span>
            </div>
          </a>

          {/* Post 3 */}
          <a
            href="https://x.com/Principal_ADE/status/REPLACE_WITH_POST_ID"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              background: "#111827",
              border: "1px solid rgba(148, 163, 184, 0.1)",
              borderRadius: "14px",
              overflow: "hidden",
              textDecoration: "none",
              color: "inherit",
              transition: "border-color 0.3s, transform 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(34, 211, 238, 0.15)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <img
              src="/images/social/fernando-event-templates.png"
              alt="Fernando's X post about Event Templates vs Logs"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderBottom: "1px solid rgba(148, 163, 184, 0.1)",
              }}
            />
            <div
              style={{
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "0.65rem",
                    flexShrink: 0,
                    background: "rgba(168, 85, 247, 0.12)",
                    color: "#a855f7",
                  }}
                >
                  FR
                </div>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                  }}
                >
                  Fernando Ramirez
                </span>
              </div>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#64748b",
                  padding: "0.15rem 0.5rem",
                  border: "1px solid rgba(148, 163, 184, 0.1)",
                  borderRadius: "4px",
                }}
              >
                X
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* Try It Section */}
      <section
        style={{
          padding: isMobile ? "4rem 1.5rem 5rem" : "4rem 2rem 5rem",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: "1.25rem",
            color: "#fbbf24",
          }}
        >
          Interactive
        </div>

        <div
          style={{
            background: "#111827",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            borderRadius: "20px",
            overflow: "hidden",
            transition: "border-color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.25)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(148, 163, 184, 0.1)";
          }}
        >
          {/* Visual */}
          <div
            style={{
              background: "linear-gradient(135deg, #0f1a2e 0%, #111827 50%, #0d1520 100%)",
              padding: isMobile ? "2rem" : "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              minHeight: isMobile ? "200px" : "260px",
              overflow: "hidden",
              backgroundImage: `
                linear-gradient(90deg, rgba(34, 211, 238, 0.03) 1px, transparent 1px),
                linear-gradient(rgba(34, 211, 238, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          >
            <div
              style={{
                width: isMobile ? "160px" : "200px",
                height: isMobile ? "160px" : "200px",
                position: "relative",
                zIndex: 1,
              }}
            >
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="198" height="198" rx="4" stroke="rgba(34,211,238,0.2)" strokeWidth="1" />
                <line x1="0" y1="40" x2="140" y2="40" stroke="rgba(34,211,238,0.15)" strokeWidth="1.5" />
                <line x1="60" y1="40" x2="60" y2="80" stroke="rgba(34,211,238,0.15)" strokeWidth="1.5" />
                <line x1="40" y1="80" x2="160" y2="80" stroke="rgba(34,211,238,0.15)" strokeWidth="1.5" />
                <line x1="120" y1="80" x2="120" y2="120" stroke="rgba(34,211,238,0.15)" strokeWidth="1.5" />
                <line x1="0" y1="120" x2="140" y2="120" stroke="rgba(34,211,238,0.15)" strokeWidth="1.5" />
                <line x1="80" y1="120" x2="80" y2="160" stroke="rgba(34,211,238,0.15)" strokeWidth="1.5" />
                <line x1="40" y1="160" x2="200" y2="160" stroke="rgba(34,211,238,0.15)" strokeWidth="1.5" />
                <line x1="140" y1="40" x2="140" y2="120" stroke="rgba(34,211,238,0.15)" strokeWidth="1.5" />
                <line x1="40" y1="80" x2="40" y2="160" stroke="rgba(34,211,238,0.15)" strokeWidth="1.5" />
                <line x1="160" y1="80" x2="160" y2="180" stroke="rgba(34,211,238,0.15)" strokeWidth="1.5" />
                <circle cx="15" cy="15" r="5" fill="#22d3ee" />
                <circle cx="185" cy="185" r="5" fill="#f87171" />
              </svg>
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: isMobile ? "2rem 1.5rem" : "2.5rem" }}>
            <h2
              style={{
                fontSize: isMobile ? "1.5rem" : "1.75rem",
                fontWeight: "700",
                letterSpacing: "-0.02em",
                marginBottom: "0.75rem",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              Try it yourself
            </h2>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "1rem",
                lineHeight: "1.7",
                marginBottom: "1.5rem",
                maxWidth: "520px",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              A maze. A bug. No map. That's what debugging agent-written code feels like without stories. Play two rounds and feel the difference.
            </p>

            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                marginBottom: "2rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#fbbf24",
                  }}
                />
                2 minutes
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#fbbf24",
                  }}
                />
                No signup
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.75rem",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#fbbf24",
                  }}
                />
                Mobile friendly
              </span>
            </div>

            <a
              href="/game"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                background: "#fbbf24",
                color: "#0a0e17",
                padding: "0.75rem 1.75rem",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "0.95rem",
                textDecoration: "none",
                transition: "opacity 0.2s, transform 0.2s",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Play Now →
            </a>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section
        style={{
          padding: isMobile ? "4rem 1.5rem" : "5rem 2rem",
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "1.5rem" : "1.75rem",
            fontWeight: "700",
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          Join the conversation
        </h2>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "1rem",
            marginBottom: "2rem",
            lineHeight: "1.7",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          We're building in public. Follow along, push back, tell us what we're getting wrong.
        </p>

        <a
          href="https://app.principal-ade.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#22d3ee",
            color: "#0a0e17",
            padding: "0.75rem 2rem",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "1rem",
            textDecoration: "none",
            transition: "opacity 0.2s, transform 0.2s",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Get Early Access →
        </a>

        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            justifyContent: "center",
            marginTop: "2rem",
            flexWrap: "wrap",
          }}
        >
          <a
            href="https://x.com/Principal_ADE"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#64748b",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: "500",
              transition: "color 0.2s",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#94a3b8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748b";
            }}
          >
            𝕏 Follow on X
          </a>
          <a
            href="https://linkedin.com/company/principalai"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#64748b",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: "500",
              transition: "color 0.2s",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#94a3b8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748b";
            }}
          >
            in Follow on LinkedIn
          </a>
          <a
            href="https://github.com/principal-ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#64748b",
              textDecoration: "none",
              fontSize: "0.85rem",
              fontWeight: "500",
              transition: "color 0.2s",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#94a3b8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748b";
            }}
          >
            ⌘ GitHub
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
