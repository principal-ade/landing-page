"use client";

import React from "react";
import { useTheme } from "@principal-ade/industry-theme";
import { Footer } from "../../components/Footer";
import { Mail, HelpCircle, Clock } from "lucide-react";

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

export default function SupportPage() {
  const { theme } = useTheme();
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
        background: theme.colors.background,
      }}
    >
      <main
        style={{
          flex: 1,
          paddingTop: "120px",
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
                color: theme.colors.primary,
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Support Center
            </h1>
            <p
              style={{
                fontSize: isMobile ? "18px" : "20px",
                color: theme.colors.textSecondary,
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
              background: `${theme.colors.primary}0D`,
              border: `1px solid ${theme.colors.primary}33`,
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
                  background: `${theme.colors.primary}1A`,
                  border: `1px solid ${theme.colors.primary}4D`,
                }}
              >
                <Mail size={28} style={{ color: theme.colors.primary }} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: theme.colors.text,
                    margin: "0 0 8px 0",
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  Email Support
                </h2>
                <a
                  href="mailto:principalai@noetic-labs.ai"
                  style={{
                    fontSize: "18px",
                    color: theme.colors.primary,
                    textDecoration: "none",
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = theme.colors.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = theme.colors.primary;
                  }}
                >
                  principalai@noetic-labs.ai
                </a>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                paddingTop: "24px",
                borderTop: `1px solid ${theme.colors.primary}33`,
              }}
            >
              <Clock size={20} style={{ color: theme.colors.primary }} />
              <p
                style={{
                  fontSize: "14px",
                  color: theme.colors.textMuted,
                  margin: 0,
                  fontFamily:
                    'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                }}
              >
                We typically respond within 24-48 hours during business days
              </p>
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
              <HelpCircle size={32} style={{ color: theme.colors.primary }} />
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: "600",
                  color: theme.colors.text,
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
                    background: `${theme.colors.primary}0D`,
                    border: `1px solid ${theme.colors.primary}33`,
                    borderRadius: "12px",
                    padding: isMobile ? "20px" : "24px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: theme.colors.text,
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
                      color: theme.colors.textMuted,
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
              background: `${theme.colors.primary}0D`,
              border: `1px solid ${theme.colors.primary}33`,
              borderRadius: "16px",
            }}
          >
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: theme.colors.text,
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
                color: theme.colors.textMuted,
                marginBottom: "24px",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Our support team is here to assist you
            </p>
            <a
              href="mailto:principalai@noetic-labs.ai"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                background: theme.colors.primary,
                color: theme.colors.textOnPrimary,
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
                e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}66`;
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
