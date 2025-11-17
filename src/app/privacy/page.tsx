"use client";

import React from "react";
import Link from "next/link";
import { Footer } from "../../components/Footer";
import { useTheme } from "@a24z/industry-theme";

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
            Blog
          </Link>
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

export default function PrivacyPage() {
  const { theme } = useTheme();
  const [content, setContent] = React.useState<string>("");

  React.useEffect(() => {
    fetch("/legal/privacy-policy.md")
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch((err) => console.error("Error loading privacy policy:", err));
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#000000" }}>
      <MinimalNavigation />
      <main style={{ flex: 1, paddingTop: "100px", paddingBottom: "60px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              color: theme.colors.text,
              fontSize: "16px",
              lineHeight: "1.7",
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>').replace(/^# (.+)$/gm, '<h1 style="font-size: 48px; margin: 0 0 32px 0; color: #00C2FF;">$1</h1>').replace(/^## (.+)$/gm, '<h2 style="font-size: 32px; margin: 48px 0 24px 0; color: #ffffff;">$1</h2>').replace(/^### (.+)$/gm, '<h3 style="font-size: 24px; margin: 32px 0 16px 0; color: #ffffff;">$1</h3>').replace(/^\*\*(.+):\*\*/gm, '<strong style="color: #00C2FF;">$1:</strong>') }} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
