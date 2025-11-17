import React from "react";
import { useTheme } from "@a24z/industry-theme";
import { motion } from "framer-motion";
import { useThemeSwitcher } from "./providers/ClientThemeProvider";
import { Logo } from "@a24z/logo-component";
import { CheckCircle2 } from "lucide-react";

// Minimal Navigation
const MinimalNavigation: React.FC = () => {
  const { theme } = useTheme();
  const { currentTheme, setCurrentTheme, availableThemes } = useThemeSwitcher();

  const handleLogoClick = () => {
    const currentIndex = availableThemes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    setCurrentTheme(availableThemes[nextIndex]);
  };

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
        borderBottom: "1px solid rgba(0, 194, 255, 0.1)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          onClick={handleLogoClick}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <Logo width={32} height={32} />
          <span
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#ffffff",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Principal<span style={{ fontWeight: "300", color: "#00C2FF" }}>AI</span>
          </span>
        </div>
      </div>
    </nav>
  );
};

// Hero Section
const HeroSection: React.FC = () => {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [windowHeight, setWindowHeight] = React.useState(
    typeof window !== "undefined" ? window.innerHeight : 768,
  );

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isConstrainedHeight = windowHeight < 700;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #000000 0%, #0a1628 100%)",
        padding: isTablet ? "120px 32px 80px" : isMobile ? "100px 20px 60px" : "140px 20px 100px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            style={{
              fontSize: isMobile
                ? "28px"
                : isConstrainedHeight
                  ? "56px"
                  : isTablet
                    ? "64px"
                    : "80px",
              fontWeight: "700",
              margin: "0 auto 32px auto",
              textAlign: "center",
              width: "100%",
              maxWidth: isMobile ? "100%" : "1100px",
              letterSpacing: isMobile ? "-0.01em" : "-0.03em",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              lineHeight: isMobile ? "1.3" : "1.1",
              background:
                "linear-gradient(90deg, #00D9FF 0%, #0099FF 50%, #0066FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              hyphens: "auto",
            }}
          >
            The Universal Workspace for Agentic Work
          </h1>

          <p
            style={{
              fontSize: isMobile ? "18px" : "20px",
              fontWeight: "400",
              margin: "0 0 24px 0",
              color: "#d1d5db",
              maxWidth: isMobile ? "100%" : "800px",
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: isMobile ? "1.6" : "1.7",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Code, ship, and scale with AI agents that understand your entire codebase—backed by living documentation that never goes stale.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// What is Living Documentation Section
const WhatIsLivingDocSection: React.FC = () => {
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

  const benefits = [
    "Auto-sync with every commit",
    "Version-controlled in Git",
    "AI-ready context",
    "Never goes stale",
  ];

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #0a1628 0%, #000000 100%)",
        padding: isTablet ? "80px 32px" : isMobile ? "60px 20px" : "100px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center" }}
        >
          <h2
            style={{
              fontSize: "clamp(2.25rem, 6vw, 3.75rem)",
              fontWeight: "700",
              margin: "0 0 32px 0",
              color: "#ffffff",
              letterSpacing: "-0.02em",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              lineHeight: "1.1",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            Living{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, #00D9FF 0%, #0099FF 50%, #0066FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Documentation
            </span>
          </h2>
          <p
            style={{
              fontSize: isMobile ? "18px" : isTablet ? "20px" : "24px",
              color: "#ffffff",
              maxWidth: "900px",
              margin: "0 auto 24px auto",
              lineHeight: isMobile ? "1.5" : "1.6",
              fontWeight: "500",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Documentation linked directly to your code. When code changes, you know instantly which docs are affected.
          </p>
          <p
            style={{
              fontSize: isMobile ? "16px" : isTablet ? "18px" : "20px",
              color: "#00C2FF",
              maxWidth: "900px",
              margin: "0 auto 48px auto",
              lineHeight: isMobile ? "1.5" : "1.6",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Your team stays in sync. Your AI stays informed.
          </p>

          {/* Benefits Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
              gap: isMobile ? "16px" : "20px",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: "rgba(0, 194, 255, 0.05)",
                  border: "1px solid rgba(0, 194, 255, 0.2)",
                  borderRadius: isMobile ? "10px" : "12px",
                  padding: isMobile ? "20px" : "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? "12px" : "16px",
                  textAlign: "left",
                }}
              >
                <CheckCircle2
                  size={24}
                  color="#00C2FF"
                  style={{ flexShrink: 0 }}
                />
                <span
                  style={{
                    fontSize: isMobile ? "15px" : "16px",
                    color: "#d1d5db",
                    fontWeight: "500",
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {benefit}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Combined CTA and Video Section
const CTAAndVideoSection: React.FC = () => {
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
    <div
      style={{
        background: "linear-gradient(180deg, #0a1628 0%, #0f1c2e 100%)",
        padding: isTablet ? "80px 32px" : isMobile ? "60px 20px" : "100px 20px",
        borderTop: "1px solid rgba(0, 194, 255, 0.2)",
        borderBottom: "1px solid rgba(0, 194, 255, 0.2)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* CTAs */}
          <div style={{ textAlign: "center", marginBottom: isMobile ? "40px" : "60px" }}>
            <h3
              style={{
                fontSize: isMobile ? "28px" : isTablet ? "32px" : "36px",
                fontWeight: "600",
                margin: "0 0 24px 0",
                color: "#ffffff",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              Get Started
            </h3>
            <p
              style={{
                fontSize: isTablet ? "17px" : isMobile ? "16px" : "18px",
                color: "#d1d5db",
                maxWidth: "700px",
                margin: "0 auto 32px auto",
                lineHeight: "1.7",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Add it to your project in minutes or take a guided tour
            </p>
            <div
              style={{
                display: "flex",
                gap: isTablet ? "18px" : "20px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="https://app.principal-ade.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: isTablet
                    ? "18px 36px"
                    : isMobile
                      ? "14px 28px"
                      : "16px 32px",
                  fontSize: isTablet ? "17px" : isMobile ? "15px" : "16px",
                  fontWeight: "600",
                  background: "#00C2FF",
                  color: "#000000",
                  border: "none",
                  borderRadius: isTablet ? "9px" : "8px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
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
                Add it to your project
              </a>
              <a
                href="/download"
                style={{
                  padding: isTablet
                    ? "18px 36px"
                    : isMobile
                      ? "14px 28px"
                      : "16px 32px",
                  fontSize: isTablet ? "17px" : isMobile ? "15px" : "16px",
                  fontWeight: "600",
                  background: "transparent",
                  color: "#00C2FF",
                  border: "2px solid #00C2FF",
                  borderRadius: isTablet ? "9px" : "8px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  fontFamily:
                    'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0, 194, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Take a tour
              </a>
            </div>
          </div>

          {/* Video */}
          <div>
            <h3
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: "600",
                margin: "0 0 32px 0",
                color: "#ffffff",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                letterSpacing: "-0.02em",
                lineHeight: "1.2",
                textAlign: "center",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              See How It Works
            </h3>

            {/* Video Container */}
            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%", // 16:9 aspect ratio
                height: 0,
                overflow: "hidden",
                borderRadius: "12px",
                border: "1px solid rgba(0, 194, 255, 0.2)",
                background: "#0a1628",
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/6GKPWCVs2tU"
                title="Living Documentation Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// About Section
const AboutSection: React.FC = () => {
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

  const keyPoints = [
    {
      icon: "📝",
      text: "Documentation is Core Infrastructure",
    },
    {
      icon: "🔀",
      text: "Context Belongs in Git, Not SaaS",
    },
    {
      icon: "⚡",
      text: "AI Needs Understanding, Not Just Speed",
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #000000 0%, #0a1628 100%)",
        padding: isTablet ? "60px 32px" : isMobile ? "50px 20px" : "80px 20px",
        borderTop: "1px solid rgba(0, 194, 255, 0.2)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            style={{
              fontSize: "clamp(1.75rem, 5vw, 3.75rem)",
              fontWeight: "700",
              margin: "0 0 60px 0",
              color: "#0066FF",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              letterSpacing: "-0.02em",
              lineHeight: "1.2",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            At <span style={{ fontWeight: "700", color: "#ffffff" }}>Principal</span>
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
            </span> we believe:
          </h2>

          {/* Key Points */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet || isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: isTablet ? "20px" : "24px",
            }}
          >
            {keyPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                style={{
                  background: "rgba(0, 194, 255, 0.05)",
                  border: "1px solid rgba(0, 194, 255, 0.2)",
                  borderRadius: "12px",
                  padding: isTablet ? "24px" : "28px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div style={{ fontSize: "48px" }}>{point.icon}</div>
                <p
                  style={{
                    fontSize: isTablet ? "16px" : "17px",
                    color: "#ffffff",
                    fontWeight: "500",
                    margin: 0,
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {point.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const LivingDocHomepageV2: React.FC = () => {
  return (
    <div>
      <MinimalNavigation />
      <HeroSection />
      <WhatIsLivingDocSection />
      <CTAAndVideoSection />
      <AboutSection />
    </div>
  );
};
