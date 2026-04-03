"use client";

import React from "react";
import { Logo } from "@principal-ai/logo-component";
import { useTheme } from "@principal-ade/industry-theme";

const HeroSection: React.FC = () => {
  const { theme } = useTheme();
  const [windowWidth, setWindowWidth] = React.useState(1024);
  const [windowHeight, setWindowHeight] = React.useState(900);
  const [showHeadlineLine2, setShowHeadlineLine2] = React.useState(false);
  const [showSubheadingLine1, setShowSubheadingLine1] = React.useState(false);
  const [showButton, setShowButton] = React.useState(false);

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    // Show all elements immediately - no delays
    setShowHeadlineLine2(true);
    setShowSubheadingLine1(true);
    setShowButton(true);
  }, []);


  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isConstrainedHeight = windowHeight < 850;

  return (
    <div
      style={{
        flex: 1,
        minHeight: "100%",
        background: "transparent",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: isMobile ? "16px 24px 40px 24px" : "24px 24px 48px 24px",
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          padding: isMobile ? "0 24px" : "0 40px",
        }}
      >
        {/* Logo - Centered above everything */}
        <div
          style={{
            margin: "0 auto 16px auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Logo
            width={isMobile ? 80 : isConstrainedHeight ? 120 : 140}
            height={isMobile ? 80 : isConstrainedHeight ? 120 : 140}
            color={theme.colors.accent}
            particleColor={theme.colors.primary}
            letterColor={theme.colors.text}
            opacity={0.9}
          />
        </div>

        {/* Centered Single Column Layout - No Image */}
        <div
          style={{
            maxWidth: "980px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              background: `${theme.colors.primary}1A`,
              border: `1px solid ${theme.colors.primary}4D`,
              borderRadius: "24px",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "12px",
                color: theme.colors.primary,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                fontWeight: "600",
              }}
            >
              Alpha — Now onboarding
            </span>
          </div>

          {/* Main Headline */}
          <div style={{ margin: "0 0 24px 0" }}>
            <div
              style={{
                fontSize: isMobile ? "36px" : isTablet ? "48px" : "64px",
                fontWeight: "700",
                textAlign: "center",
                letterSpacing: "-0.04em",
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                lineHeight: "1.05",
                color: theme.colors.accent,
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              Story-Based Monitoring
            </div>
            <div
              style={{
                fontSize: isMobile ? "36px" : isTablet ? "48px" : "64px",
                fontWeight: "700",
                textAlign: "center",
                letterSpacing: "-0.04em",
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                lineHeight: "1.05",
                color: theme.colors.text,
                wordWrap: "break-word",
                overflowWrap: "break-word",
                opacity: showHeadlineLine2 ? 1 : 0,
                transform: showHeadlineLine2 ? "translateY(0)" : "translateY(20px)",
                transition: showHeadlineLine2 ? "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
              }}
            >
              for the Agent Era
            </div>
          </div>

          {/* Key Benefits */}
          <div style={{ margin: "0 auto 48px auto", maxWidth: "700px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                opacity: showSubheadingLine1 ? 1 : 0,
                transform: showSubheadingLine1 ? "translateY(0)" : "translateY(20px)",
                transition: showSubheadingLine1 ? "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
              }}
            >
              {[
                "Reduce monthly database costs by storing context in Git",
                "Verify AI agent work without reviewing every line of code",
                "Debug production issues in minutes instead of hours",
              ].map((benefit, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: "400",
                    color: theme.colors.text,
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                  }}
                >
                  <span style={{ color: theme.colors.primary, fontSize: "20px" }}>✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Single CTA */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              opacity: showButton ? 1 : 0,
              transform: showButton ? "translateY(0)" : "translateY(20px)",
              transition: showButton ? "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            }}
          >
            <a
              href="/early-access"
              style={{
                backgroundColor: theme.colors.primary,
                color: theme.colors.textOnPrimary,
                padding: isMobile ? "16px 32px" : "16px 40px",
                borderRadius: "8px",
                fontSize: isMobile ? "16px" : "20px",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                border: "none",
                boxShadow: `0 4px 12px ${theme.colors.primary}4D`,
                transform: "scale(1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(1.1)";
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = `0 6px 16px ${theme.colors.primary}66`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "brightness(1)";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}4D`;
              }}
            >
              Get Early Access
            </a>
          </div>

          {/* Proof Bar */}
          <div
            style={{
              marginTop: "48px",
              paddingTop: "24px",
              borderTop: `1px solid ${theme.colors.border}`,
              opacity: showButton ? 1 : 0,
              transition: showButton ? "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: isMobile ? "12px" : "16px",
                flexWrap: "wrap",
                fontSize: isMobile ? "12px" : "14px",
                color: theme.colors.textTertiary,
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                textAlign: "center",
              }}
            >
              <span>Built by engineers, for engineers</span>
              <span style={{ color: theme.colors.textMuted }}>•</span>
              <span>Dogfooding in production</span>
              <span style={{ color: theme.colors.textMuted }}>•</span>
              <span>7 patents pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// About Principal AI Section

export const LivingDocHomepage: React.FC = () => {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <HeroSection />
    </div>
  );
};
