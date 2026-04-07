"use client";

import React from "react";
import { Logo } from "@principal-ai/logo-component";
import { useTheme } from "@principal-ade/industry-theme";
import { Download } from "lucide-react";

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
        background: theme.colors.backgroundPrimary || theme.colors.background,
        backgroundImage: `
          linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.02) 100%),
          linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 150px 150px, 150px 150px",
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
          {/* Main Headline */}
          <div style={{ margin: "0 0 24px 0" }}>
            <div
              style={{
                fontSize: isMobile ? "56px" : isTablet ? "80px" : "120px",
                fontWeight: "700",
                textAlign: "center",
                letterSpacing: "-0.04em",
                fontFamily: theme.fonts.heading,
                lineHeight: "1.05",
                color: theme.colors.primary,
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              Story-Based Monitoring
            </div>
            <div
              style={{
                fontSize: isMobile ? "36px" : isTablet ? "48px" : "64px",
                fontWeight: "400",
                textAlign: "center",
                letterSpacing: "-0.04em",
                fontFamily: theme.fonts.heading,
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

          {/* Subheading */}
          <div style={{ margin: "0 auto 48px auto", maxWidth: "700px" }}>
            <div
              style={{
                opacity: showSubheadingLine1 ? 1 : 0,
                transform: showSubheadingLine1 ? "translateY(0)" : "translateY(20px)",
                transition: showSubheadingLine1 ? "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
                textAlign: "center",
                fontSize: isMobile ? "18px" : "22px",
                fontWeight: "400",
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
              }}
            >
              The code is moving faster than you can read it. <strong>We made it visible.</strong> So you can confidently know it's right.
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
              href="https://principal-ade.com/download"
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
                fontFamily: theme.fonts.body,
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
              Download Alpha
              <Download size={isMobile ? 20 : 24} strokeWidth={2} />
            </a>
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
