"use client";

import React from "react";
import { useTheme } from "@principal-ade/industry-theme";
import { Footer } from "../../components/Footer";
import { Mail, Clock, MessageCircle } from "lucide-react";

export default function ContactPage() {
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
              color: theme.colors.primary,
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Get in Touch
          </h1>
          <p
            style={{
              fontSize: isMobile ? "18px" : "20px",
              color: theme.colors.textSecondary,
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
              background: `${theme.colors.primary}0D`,
              border: `1px solid ${theme.colors.primary}33`,
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
                  background: `${theme.colors.primary}1A`,
                  border: `1px solid ${theme.colors.primary}4D`,
                  marginBottom: "24px",
                }}
              >
                <Mail size={32} style={{ color: theme.colors.primary }} />
              </div>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: theme.colors.text,
                  marginBottom: "16px",
                  fontFamily:
                    'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                }}
              >
                Email Us
              </h2>
              <a
                href="mailto:principalai@noetic-labs.ai"
                style={{
                  fontSize: isMobile ? "20px" : "24px",
                  color: theme.colors.primary,
                  textDecoration: "none",
                  fontFamily:
                    'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  fontWeight: "500",
                  transition: "color 0.2s ease",
                  display: "inline-block",
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

            {/* Info Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "32px",
                paddingTop: "32px",
                borderTop: `1px solid ${theme.colors.primary}33`,
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
                  <Clock size={20} style={{ color: theme.colors.primary }} />
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: theme.colors.text,
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
                    color: theme.colors.textMuted,
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
                  <MessageCircle size={20} style={{ color: theme.colors.primary }} />
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: theme.colors.text,
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
                    color: theme.colors.textMuted,
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
