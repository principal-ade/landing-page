"use client";

import React from "react";
import Link from "next/link";
import { Footer } from "../../components/Footer";
import { Mail, Book, FileText, HelpCircle, Clock } from "lucide-react";

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

const faqs = [
  {
    question: "How do I get started with Principal AI?",
    answer: "Download the alpha version from our website and follow the setup guide. You'll be able to connect your repositories and start creating living documentation right away.",
  },
  {
    question: "What repositories are supported?",
    answer: "Principal AI works with Git-based repositories including GitHub, GitLab, and local Git repositories. We support all major programming languages.",
  },
  {
    question: "Is my code data secure?",
    answer: "Yes. Your code and documentation are stored in Git, not in the cloud. We only process metadata and structure information to provide our services.",
  },
  {
    question: "Can I use Principal AI with my team?",
    answer: "Absolutely! Principal AI is designed for team collaboration. Multiple team members can work on the same repositories and documentation.",
  },
];

const quickLinks = [
  { icon: Book, label: "Documentation", href: "/docs" },
  { icon: FileText, label: "Blog", href: "/blog" },
  { icon: Mail, label: "Contact", href: "/contact" },
];

export default function SupportPage() {
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
            maxWidth: "1200px",
            margin: "0 auto",
            padding: isMobile ? "0 20px" : "0 40px",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
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
              Support Center
            </h1>
            <p
              style={{
                fontSize: isMobile ? "18px" : "20px",
                color: "#d1d5db",
                margin: "0 auto",
                maxWidth: "600px",
                lineHeight: "1.6",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Get help with Principal AI and find answers to common questions
            </p>
          </div>

          {/* Contact Card */}
          <div
            style={{
              background: "rgba(0, 194, 255, 0.05)",
              border: "1px solid rgba(0, 194, 255, 0.2)",
              borderRadius: "16px",
              padding: isMobile ? "32px 24px" : "40px 48px",
              maxWidth: "800px",
              margin: "0 auto 60px auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "rgba(0, 194, 255, 0.1)",
                  border: "1px solid rgba(0, 194, 255, 0.3)",
                }}
              >
                <Mail size={28} style={{ color: "#00C2FF" }} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "#ffffff",
                    margin: "0 0 8px 0",
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  Email Support
                </h2>
                <a
                  href="mailto:info@noetic-labs.com"
                  style={{
                    fontSize: "18px",
                    color: "#00C2FF",
                    textDecoration: "none",
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    transition: "color 0.2s ease",
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
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                paddingTop: "24px",
                borderTop: "1px solid rgba(0, 194, 255, 0.2)",
              }}
            >
              <Clock size={20} style={{ color: "#00C2FF" }} />
              <p
                style={{
                  fontSize: "14px",
                  color: "#9ca3af",
                  margin: 0,
                  fontFamily:
                    'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                }}
              >
                We typically respond within 24-48 hours during business days
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: "32px",
                textAlign: "center",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Quick Links
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: "24px",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "24px",
                      background: "rgba(0, 194, 255, 0.05)",
                      border: "1px solid rgba(0, 194, 255, 0.2)",
                      borderRadius: "12px",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(0, 194, 255, 0.1)";
                      e.currentTarget.style.borderColor = "#00C2FF";
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(0, 194, 255, 0.05)";
                      e.currentTarget.style.borderColor =
                        "rgba(0, 194, 255, 0.2)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <Icon size={32} style={{ color: "#00C2FF" }} />
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "500",
                        color: "#ffffff",
                        fontFamily:
                          'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                      }}
                    >
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                marginBottom: "32px",
              }}
            >
              <HelpCircle size={32} style={{ color: "#00C2FF" }} />
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "600",
                  color: "#ffffff",
                  margin: 0,
                  fontFamily:
                    'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                }}
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    background: "rgba(0, 194, 255, 0.05)",
                    border: "1px solid rgba(0, 194, 255, 0.2)",
                    borderRadius: "12px",
                    padding: isMobile ? "20px" : "24px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: "12px",
                      fontFamily:
                        'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {faq.question}
                  </h3>
                  <p
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.6",
                      color: "#9ca3af",
                      margin: 0,
                      fontFamily:
                        'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div
            style={{
              textAlign: "center",
              marginTop: "60px",
              padding: isMobile ? "40px 20px" : "60px 40px",
              background: "rgba(0, 194, 255, 0.05)",
              border: "1px solid rgba(0, 194, 255, 0.2)",
              borderRadius: "16px",
            }}
          >
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: "16px",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Still need help?
            </h3>
            <p
              style={{
                fontSize: "16px",
                color: "#9ca3af",
                marginBottom: "24px",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Our support team is here to assist you
            </p>
            <a
              href="mailto:info@noetic-labs.com"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                background: "#00C2FF",
                color: "#000000",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "8px",
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
              <Mail size={20} />
              Contact Support
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
