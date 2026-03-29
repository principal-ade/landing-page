"use client";

import React from "react";
import { useTheme } from "@principal-ade/industry-theme";
import { Footer } from "../../components/Footer";
import ReactMarkdown from "react-markdown";

export default function TermsPage() {
  const { theme } = useTheme();
  const [content, setContent] = React.useState<string>("");

  React.useEffect(() => {
    fetch("/legal/terms-of-service.md")
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch((err) => console.error("Error loading terms of service:", err));
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: theme.colors.background }}>
      <main style={{ flex: 1, paddingTop: "120px", paddingBottom: "60px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1
                  style={{
                    fontSize: "48px",
                    fontWeight: "700",
                    margin: "0 0 32px 0",
                    color: theme.colors.primary,
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2
                  style={{
                    fontSize: "32px",
                    fontWeight: "600",
                    margin: "48px 0 24px 0",
                    color: theme.colors.text,
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    margin: "32px 0 16px 0",
                    color: theme.colors.text,
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.7",
                    margin: "0 0 16px 0",
                    color: theme.colors.textSecondary,
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong style={{ color: theme.colors.primary, fontWeight: "600" }}>
                  {children}
                </strong>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  style={{
                    color: theme.colors.primary,
                    textDecoration: "none",
                    borderBottom: `1px solid ${theme.colors.primary}4D`,
                    transition: "border-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = `${theme.colors.primary}4D`;
                  }}
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul
                  style={{
                    margin: "0 0 16px 0",
                    paddingLeft: "24px",
                    color: theme.colors.textSecondary,
                  }}
                >
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.7",
                    marginBottom: "8px",
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {children}
                </li>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </main>
      <Footer />
    </div>
  );
}
