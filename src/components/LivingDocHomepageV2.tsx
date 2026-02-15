import React from "react";
import { Logo } from "@principal-ai/logo-component";

const HeroSection: React.FC = () => {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [windowHeight, setWindowHeight] = React.useState(
    typeof window !== "undefined" ? window.innerHeight : 768,
  );
  const [mode, setMode] = React.useState<"development" | "production">("development");
  const [displayMode, setDisplayMode] = React.useState<"development" | "production">("development");
  const [showHeadlineLine2, setShowHeadlineLine2] = React.useState(false);
  const [showSubheadingLine1, setShowSubheadingLine1] = React.useState(false);
  const [showSubheadingLine2, setShowSubheadingLine2] = React.useState(false);
  const [showButton, setShowButton] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    // Initial page load - start animation sequence immediately
    const timer1 = setTimeout(() => setShowHeadlineLine2(true), 800);
    const timer2 = setTimeout(() => setShowSubheadingLine1(true), 2300);
    const timer3 = setTimeout(() => setShowSubheadingLine2(true), 3800);
    const timer4 = setTimeout(() => setShowButton(true), 5300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // Reset all states immediately (no fade out, just disappear)
    setShowHeadlineLine2(false);
    setShowSubheadingLine1(false);
    setShowSubheadingLine2(false);
    setShowButton(false);

    // Update content immediately
    setDisplayMode(mode);

    // Start animation sequence (first line is always visible)
    const timer1 = setTimeout(() => setShowHeadlineLine2(true), 800);
    const timer2 = setTimeout(() => setShowSubheadingLine1(true), 2300);
    const timer3 = setTimeout(() => setShowSubheadingLine2(true), 3800);
    const timer4 = setTimeout(() => setShowButton(true), 5300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [mode]);

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
            width={isMobile ? 100 : isConstrainedHeight ? 140 : 180}
            height={isMobile ? 100 : isConstrainedHeight ? 140 : 180}
            color="#00C2FF"
            particleColor="#0098CC"
            opacity={0.9}
          />
        </div>

        {/* Mode Toggle - Below Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              background: "rgba(0, 194, 255, 0.1)",
              border: "1px solid rgba(0, 194, 255, 0.3)",
              borderRadius: "8px",
              padding: "4px",
              gap: "4px",
            }}
          >
            <button
              onClick={() => setMode("development")}
              style={{
                padding: isMobile ? "8px 16px" : "10px 20px",
                fontSize: isMobile ? "13px" : "14px",
                fontWeight: "500",
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                background: mode === "development" ? "#00C2FF" : "transparent",
                color: mode === "development" ? "#000000" : "#ffffff",
                flex: "1",
                minWidth: isMobile ? "100px" : "120px",
              }}
            >
              Development
            </button>
            <button
              onClick={() => setMode("production")}
              style={{
                padding: isMobile ? "8px 16px" : "10px 20px",
                fontSize: isMobile ? "13px" : "14px",
                fontWeight: "500",
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                background: mode === "production" ? "#00C2FF" : "transparent",
                color: mode === "production" ? "#000000" : "#ffffff",
                flex: "1",
                minWidth: isMobile ? "100px" : "120px",
              }}
            >
              Production
            </button>
          </div>
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
          <div style={{ margin: "0 0 28px 0" }}>
            <div
              style={{
                fontSize: isMobile ? "40px" : isTablet ? "56px" : "80px",
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
                fontSize: isMobile ? "40px" : isTablet ? "56px" : "80px",
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
              {displayMode === "development" ? "Understand agent-built systems with" : "Understanding production systems through"}
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
                opacity: showSubheadingLine2 ? 1 : 0,
                transform: showSubheadingLine2 ? "translateY(0)" : "translateY(20px)",
                transition: showSubheadingLine2 ? "opacity 0.6s ease-out, transform 0.6s ease-out" : "none",
              }}
            >
              {displayMode === "development" ? "story-based development" : "story-based telemetry"}
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
              href={displayMode === "development" ? "/download" : "/demo"}
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
              {displayMode === "development" ? "Download Alpha" : "Book a Demo"}
            </a>
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
