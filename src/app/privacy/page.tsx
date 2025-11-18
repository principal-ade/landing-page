"use client";

import React from "react";
import { Footer } from "../../components/Footer";
import ReactMarkdown from "react-markdown";

export default function PrivacyPage() {
  const [content, setContent] = React.useState<string>("");

  React.useEffect(() => {
    fetch("/legal/privacy-policy.md")
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch((err) => console.error("Error loading privacy policy:", err));
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#000000" }}>
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
                    color: "#00C2FF",
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
                    color: "#ffffff",
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
                    color: "#ffffff",
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
                    color: "#d1d5db",
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {children}
                </p>
              ),
              strong: ({ children }) => (
                <strong style={{ color: "#00C2FF", fontWeight: "600" }}>
                  {children}
                </strong>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  style={{
                    color: "#00C2FF",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(0, 194, 255, 0.3)",
                    transition: "border-color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#00C2FF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0, 194, 255, 0.3)";
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
                    color: "#d1d5db",
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
