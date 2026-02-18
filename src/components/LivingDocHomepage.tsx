import React from "react";
import { Logo } from "@principal-ai/logo-component";
import { COLORS } from "../styles/colors";

const HeroSection: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(1024);
  const [windowHeight, setWindowHeight] = React.useState(768);
  const [showHeadlineLine2, setShowHeadlineLine2] = React.useState(false);
  const [showSubheadingLine1, setShowSubheadingLine1] = React.useState(false);
  const [showSubheadingLine2, setShowSubheadingLine2] = React.useState(false);
  const [showSubheadingLine3, setShowSubheadingLine3] = React.useState(false);
  const [showButton, setShowButton] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
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
    setShowSubheadingLine2(true);
    setShowSubheadingLine3(true);
    setShowButton(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isConstrainedHeight = windowHeight < 850;

  const gridBackground = `
    linear-gradient(rgba(0, 194, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 194, 255, 0.08) 1px, transparent 1px)
  `;

  return (
    <div
      style={{
        flex: 1,
        minHeight: "100%",
        background: `linear-gradient(180deg, ${COLORS.navyDark} 0%, ${COLORS.black} 100%)`,
        backgroundImage: gridBackground,
        backgroundSize: "80px 80px",
        backgroundPosition: "-1px -1px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: isMobile ? "16px 24px 40px 24px" : "24px 24px 48px 24px",
      }}
    >
      {/* Subtle circular gradient */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "150%",
          height: "150%",
          background:
            "radial-gradient(circle at center, rgba(0, 194, 255, 0.08) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

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
            color={COLORS.primary}
            particleColor={COLORS.primaryDark}
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
              background: `rgba(0, 194, 255, 0.1)`,
              border: `1px solid rgba(0, 194, 255, 0.3)`,
              borderRadius: "24px",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "12px",
                color: COLORS.primary,
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
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                lineHeight: "1.05",
                color: COLORS.primary,
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
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                lineHeight: "1.05",
                color: COLORS.white,
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
                    color: COLORS.white,
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  <span style={{ color: COLORS.primary, fontSize: "20px" }}>✓</span>
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
                backgroundColor: COLORS.primary,
                color: COLORS.black,
                padding: isMobile ? "16px 32px" : "16px 40px",
                borderRadius: "8px",
                fontSize: isMobile ? "16px" : "20px",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                border: "none",
                boxShadow: "0 4px 12px rgba(0, 194, 255, 0.3)",
                transform: "scale(1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primaryHover;
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 194, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary;
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 194, 255, 0.3)";
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
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
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
                color: COLORS.gray400,
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                textAlign: "center",
              }}
            >
              <span>Built by engineers, for engineers</span>
              <span style={{ color: COLORS.gray600 }}>•</span>
              <span>Dogfooding in production</span>
              <span style={{ color: COLORS.gray600 }}>•</span>
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
