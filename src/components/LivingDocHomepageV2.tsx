import React from "react";
import { Logo } from "@principal-ai/logo-component";

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
        minHeight: "auto",
        backgroundColor: "#000000",
        backgroundImage: gridBackground,
        backgroundSize: "100px 100px",
        backgroundPosition: "-1px -1px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: isMobile ? "12px 20px 40px 20px" : "24px 20px 60px 20px",
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
          padding: isMobile ? "0 20px" : "0 40px",
        }}
      >
        {/* Logo - Centered above everything */}
        <div
          style={{
            margin: "0 auto 12px auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Logo
            width={isMobile ? 80 : isConstrainedHeight ? 120 : 140}
            height={isMobile ? 80 : isConstrainedHeight ? 120 : 140}
            color="#00C2FF"
            particleColor="#0098CC"
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
              background: "rgba(0, 194, 255, 0.1)",
              border: "1px solid rgba(0, 194, 255, 0.3)",
              borderRadius: "24px",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                fontFamily: "monospace",
                fontSize: isMobile ? "11px" : "12px",
                color: "#00C2FF",
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
                fontWeight: "600",
                textAlign: "center",
                letterSpacing: "-0.04em",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                lineHeight: "1.05",
                color: "#00C2FF",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              Story-Based Monitoring
            </div>
            <div
              style={{
                fontSize: isMobile ? "36px" : isTablet ? "48px" : "64px",
                fontWeight: "600",
                textAlign: "center",
                letterSpacing: "-0.04em",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                lineHeight: "1.05",
                color: "#86868b",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                opacity: showHeadlineLine2 ? 1 : 0,
                transform: showHeadlineLine2 ? "translateY(0)" : "translateY(20px)",
                transition: showHeadlineLine2 ? "opacity 0.6s ease-out, transform 0.6s ease-out" : "none",
              }}
            >
              for the Agent Era
            </div>
          </div>

          {/* Subheading */}
          <div style={{ margin: "0 auto 48px auto", maxWidth: "700px" }}>
            <div
              style={{
                fontSize: isMobile ? "17px" : "21px",
                fontWeight: "400",
                color: "#ffffff",
                lineHeight: "1.47",
                letterSpacing: "0.007em",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                textAlign: "center",
                opacity: showSubheadingLine1 ? 1 : 0,
                transform: showSubheadingLine1 ? "translateY(0)" : "translateY(20px)",
                transition: showSubheadingLine1 ? "opacity 0.6s ease-out, transform 0.6s ease-out" : "none",
              }}
            >
              AI agents write the code. Tests pass. Deploys go through.
            </div>
            <div
              style={{
                fontSize: isMobile ? "17px" : "21px",
                fontWeight: "400",
                color: "#ffffff",
                lineHeight: "1.47",
                letterSpacing: "0.007em",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                textAlign: "center",
                opacity: showSubheadingLine2 ? 1 : 0,
                transform: showSubheadingLine2 ? "translateY(0)" : "translateY(20px)",
                transition: showSubheadingLine2 ? "opacity 0.6s ease-out, transform 0.6s ease-out" : "none",
              }}
            >
              Nobody knows if it did what you intended.
            </div>
            <div
              style={{
                fontSize: isMobile ? "17px" : "21px",
                fontWeight: "400",
                color: "#00C2FF",
                lineHeight: "1.47",
                letterSpacing: "0.007em",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                textAlign: "center",
                opacity: showSubheadingLine3 ? 1 : 0,
                transform: showSubheadingLine3 ? "translateY(0)" : "translateY(20px)",
                transition: showSubheadingLine3 ? "opacity 0.6s ease-out, transform 0.6s ease-out" : "none",
              }}
            >
              We fix that.
            </div>
          </div>

          {/* Single CTA */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              opacity: showButton ? 1 : 0,
              transform: showButton ? "translateY(0)" : "translateY(20px)",
              transition: showButton ? "opacity 0.6s ease-out, transform 0.6s ease-out" : "none",
            }}
          >
            <a
              href="#early-access"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('early-access');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              style={{
                backgroundColor: "#00C2FF",
                color: "#000000",
                padding: isMobile ? "14px 32px" : "16px 40px",
                borderRadius: "8px",
                fontSize: isMobile ? "17px" : "19px",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                border: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#00d4ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#00C2FF";
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
              transition: showButton ? "opacity 0.6s ease-out" : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: isMobile ? "12px" : "16px",
                flexWrap: "wrap",
                fontSize: isMobile ? "12px" : "13px",
                color: "#9ca3af",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                textAlign: "center",
              }}
            >
              <span>7 patents pending</span>
              <span style={{ color: "#4b5563" }}>|</span>
              <span>Git-native architecture</span>
              <span style={{ color: "#4b5563" }}>|</span>
              <span>Dogfooding in production</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// About Principal AI Section

export const LivingDocHomepageV2: React.FC = () => {
  return (
    <div>
      <HeroSection />
    </div>
  );
};
