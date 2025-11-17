"use client";

import React from "react";
import Link from "next/link";
import { Footer } from "../../components/Footer";
import { Mail, Clock, MessageCircle } from "lucide-react";

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

export default function ContactPage() {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#000000",
      }}
    >
      <MinimalNavigation />
      <main
        style={{
          flex: 1,
          paddingTop: "140px",
          paddingBottom: "80px",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: isMobile ? "0 20px" : "0 40px",
            textAlign: "center",
          }}
        >
          {/* Header */}
          <h1
            style={{
              fontSize: isMobile ? "40px" : "56px",
              fontWeight: "700",
              margin: "0 0 24px 0",
              background: "linear-gradient(135deg, #00C2FF, #0098CC)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Get in Touch
          </h1>
          <p
            style={{
              fontSize: isMobile ? "18px" : "20px",
              color: "#d1d5db",
              margin: "0 auto 60px auto",
              maxWidth: "600px",
              lineHeight: "1.6",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Have questions about Principal AI? We'd love to hear from you.
          </p>

          {/* Contact Card */}
          <div
            style={{
              background: "rgba(0, 194, 255, 0.05)",
              border: "1px solid rgba(0, 194, 255, 0.2)",
              borderRadius: "16px",
              padding: isMobile ? "40px 24px" : "60px 48px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            {/* Email Section */}
            <div style={{ marginBottom: "48px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(0, 194, 255, 0.1)",
                  border: "1px solid rgba(0, 194, 255, 0.3)",
                  marginBottom: "24px",
                }}
              >
                <Mail size={32} style={{ color: "#00C2FF" }} />
              </div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "16px",
                  fontFamily:
                    'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                }}
              >
                Email Us
              </h2>
              <a
                href="mailto:info@noetic-labs.com"
                style={{
                  fontSize: isMobile ? "20px" : "24px",
                  color: "#00C2FF",
                  textDecoration: "none",
                  fontFamily:
                    'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  fontWeight: "500",
                  transition: "color 0.2s ease",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#00C2FF";
                }}
              >
                info@noetic-labs.com
              </a>
            </div>

            {/* Info Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "32px",
                paddingTop: "32px",
                borderTop: "1px solid rgba(0, 194, 255, 0.2)",
              }}
            >
              <div style={{ textAlign: isMobile ? "center" : "left" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isMobile ? "center" : "flex-start",
                    gap: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <Clock size={20} style={{ color: "#00C2FF" }} />
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: 0,
                      fontFamily:
                        'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Response Time
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#9ca3af",
                    margin: 0,
                    lineHeight: "1.6",
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  Within 24-48 hours
                </p>
              </div>

              <div style={{ textAlign: isMobile ? "center" : "left" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isMobile ? "center" : "flex-start",
                    gap: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <MessageCircle size={20} style={{ color: "#00C2FF" }} />
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#ffffff",
                      margin: 0,
                      fontFamily:
                        'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Support
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#9ca3af",
                    margin: 0,
                    lineHeight: "1.6",
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  General inquiries & support
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
