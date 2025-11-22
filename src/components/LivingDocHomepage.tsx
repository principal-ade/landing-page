import React from "react";
import { motion } from "framer-motion";
import { Logo } from "@principal-ai/logo-component";
import {
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { LivingDocsTourSection } from "./LivingDocsTourSection";
import { trackButtonClick, trackVideoPlay } from "@/lib/analytics";
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
  const isConstrainedHeight = windowHeight < 850;

  const gridBackground = `
    linear-gradient(rgba(0, 194, 255, 0.25) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 194, 255, 0.25) 1px, transparent 1px)
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
        padding: isMobile ? "40px 20px 60px 20px" : "50px 20px 100px 20px",
      }}
    >
      {/* Circular gradient */}
      <div
        style={{
          position: "absolute",
          top: isConstrainedHeight ? "calc(50% - 50px)" : "calc(50% - 120px)",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "200%",
          height: "200%",
          background:
            "radial-gradient(circle at center, transparent 0%, #00C2FF20 25%, #0098CC30 50%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at center, transparent 0%, #000000 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div
        style={{
          width: "100%",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "0 20px" : "0 40px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            margin: "0",
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

        {/* Main Headline */}
        <h1
          style={{
            fontSize: isMobile
              ? "32px"
              : isConstrainedHeight
                ? "56px"
                : isTablet
                  ? "68px"
                  : "84px",
            fontWeight: "600",
            margin: "0 auto 40px auto",
            textAlign: "center",
            width: "100%",
            maxWidth: isMobile ? "100%" : "1000px",
            letterSpacing: isMobile ? "-0.015em" : "-0.028em",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            lineHeight: isMobile ? "1.2" : "1.05",
            background:
              "linear-gradient(90deg, #00D9FF 0%, #0099FF 50%, #0066FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          The Universal Workspace<br />for Agentic Work
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontSize: isMobile ? "17px" : "21px",
            fontWeight: "400",
            margin: "0 0 20px 0",
            color: "rgba(255, 255, 255, 0.7)",
            lineHeight: "1.5",
            letterSpacing: "-0.011em",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            maxWidth: "740px",
          }}
        >
          Every workspace has a core technology. Slack has channels. Figma has multiplayer.
        </p>
        <p
          style={{
            fontSize: isMobile ? "19px" : "24px",
            fontWeight: "500",
            margin: "0",
            color: "#ffffff",
            lineHeight: "1.3",
            letterSpacing: "-0.015em",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            maxWidth: "740px",
          }}
        >
          Principal{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #00C2FF, #0098CC)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI
          </span>{" "}
          has{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #00D9FF 0%, #0099FF 50%, #0066FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Living Documentation.
          </span>
        </p>
      </div>
    </div>
  );
};

// Living Documentation Section
const LivingDocSection: React.FC = () => {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [hoveredBenefit, setHoveredBenefit] = React.useState<number | null>(null);

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
            Documentation linked directly to your code. When code changes, you understand the context that is affected.
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
            Up-to-date context for your team. Up-to-date understanding for your AI.
          </p>

          {/* Benefits Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: isMobile ? "16px" : "20px",
              maxWidth: "820px",
              margin: "0 auto 80px auto",
            }}
          >
            {benefits.map((benefit, i) => {
              const isHovered = hoveredBenefit === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: i * 0.1
                  }}
                  onMouseEnter={() => setHoveredBenefit(i)}
                  onMouseLeave={() => setHoveredBenefit(null)}
                  style={{
                    background: isHovered
                      ? "rgba(0, 194, 255, 0.08)"
                      : "rgba(0, 194, 255, 0.04)",
                    border: `1px solid ${isHovered ? "rgba(0, 194, 255, 0.3)" : "rgba(0, 194, 255, 0.15)"}`,
                    borderRadius: "14px",
                    padding: isMobile ? "20px" : "24px 28px",
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? "14px" : "18px",
                    textAlign: "left",
                    cursor: "default",
                    transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                    boxShadow: isHovered
                      ? "0 6px 24px rgba(0, 194, 255, 0.1)"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "10px",
                      background: isHovered
                        ? "rgba(0, 194, 255, 0.12)"
                        : "rgba(0, 194, 255, 0.06)",
                      flexShrink: 0,
                      transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <CheckCircle2
                      size={20}
                      color="#00C2FF"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: isMobile ? "15px" : "17px",
                      color: "#ffffff",
                      fontWeight: "500",
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      letterSpacing: "-0.011em",
                      lineHeight: "1.4",
                    }}
                  >
                    {benefit}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Living Docs Tour Section */}
      <LivingDocsTourSection />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        {/* Try Living Documentation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: "900px",
            margin: "80px auto 80px auto",
            textAlign: "center",
          }}
        >
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
              margin: "0 auto 40px auto",
              lineHeight: "1.7",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Add Living Documentation to your projects in minutes. It's as easy as adding linting. And it's free. Experience the
            difference yourself.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: isTablet ? "18px" : "20px",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: isTablet ? "14px" : "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="https://www.npmjs.com/package/@principal-ai/alexandria-cli"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackButtonClick('Add to Project', 'https://www.npmjs.com/package/@principal-ai/alexandria-cli')}
                style={{
                  padding: isTablet
                    ? "18px 36px"
                    : isMobile
                      ? "14px 28px"
                      : "16px 32px",
                  fontSize: isTablet ? "17px" : isMobile ? "15px" : "16px",
                  fontWeight: "600",
                  background: "linear-gradient(135deg, #0055DD, #003399)",
                  color: "#ffffff",
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
                    "0 4px 12px rgba(0, 102, 255, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Add it to your project
              </a>
              <a
                href="/demo"
                onClick={() => trackButtonClick('Book a Demo', '/demo')}
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
                Book a Demo
              </a>
            </div>
            <a
              href="#video-section"
              style={{
                color: "#d1d5db",
                fontSize: isMobile ? "14px" : "15px",
                textDecoration: "none",
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
              Watch two minute demo ↓
            </a>
          </div>
        </motion.div>

        {/* See How It Works Video Section */}
        <motion.div
          id="video-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            marginTop: "80px",
            scrollMarginTop: "80px",
            display: "flex",
            alignItems: "center",
            gap: "60px",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {/* Left side: Text */}
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: "600",
                margin: "0 0 16px 0",
                color: "#ffffff",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                letterSpacing: "-0.02em",
                lineHeight: "1.2",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              See How It Works
            </h3>

            <p
              style={{
                fontSize: "18px",
                color: "#9ca3af",
                lineHeight: "1.6",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Watch how Living Documentation keeps your team in sync and your AI agents informed.
            </p>
          </div>

          {/* Right side: Video Container */}
          <div
            style={{
              flex: isMobile ? "1" : "0 0 500px",
              maxWidth: isMobile ? "100%" : "500px",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%", // 16:9 aspect ratio
                height: 0,
                width: "100%",
                overflow: "hidden",
                borderRadius: "12px",
                border: "1px solid rgba(0, 194, 255, 0.2)",
                background: "#0a1628",
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/6GKPWCVs2tU?rel=0&modestbranding=1&enablejsapi=1"
                title="Living Documentation Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onClick={() => trackVideoPlay('Living Documentation Demo')}
                onMouseEnter={() => trackVideoPlay('Living Documentation Demo')}
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

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", marginTop: "100px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center" }}
        >
          {/* How Principal AI Enables Living Documentation */}
          <div
            style={{
              background: "rgba(0, 0, 0, 0.4)",
              border: "1px solid rgba(0, 194, 255, 0.3)",
              borderRadius: "16px",
              padding: isTablet
                ? "50px 32px"
                : isMobile
                  ? "40px 24px"
                  : "60px 40px",
              textAlign: "left",
            }}
          >
            <h3
              style={{
                fontSize: isMobile ? "24px" : isTablet ? "28px" : "32px",
                fontWeight: "600",
                margin: "0 0 32px 0",
                color: "#ffffff",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                textAlign: "center",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              How Principal AI Makes It Possible
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : isTablet
                    ? "repeat(2, 1fr)"
                    : "repeat(2, 1fr)",
                gap: isTablet ? "28px" : isMobile ? "24px" : "32px",
              }}
            >
              <div>
                <h4
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#00C2FF",
                    marginBottom: "12px",
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  CodebaseViews
                </h4>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#d1d5db",
                    lineHeight: "1.7",
                    margin: 0,
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  Link documentation directly to specific files and code
                  sections. Your coding agent will validate these links automatically,
                  so you always know what's current.
                </p>
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#00C2FF",
                    marginBottom: "12px",
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  Automated Staleness Detection
                </h4>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#d1d5db",
                    lineHeight: "1.7",
                    margin: 0,
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  Every code change is analyzed. If documentation becomes
                  outdated, it's fixed immediately before it causes problems.
                </p>
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#00C2FF",
                    marginBottom: "12px",
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  Git-Based Workspace
                </h4>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#d1d5db",
                    lineHeight: "1.7",
                    margin: 0,
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  Your agent is a git savant, so help him by putting everything in your repository. No external tools, no
                  broken workflows. Living Documentation integrates with how
                  you already work.
                </p>
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#00C2FF",
                    marginBottom: "12px",
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  AI-Powered Context
                </h4>
                <p
                  style={{
                    fontSize: "16px",
                    color: "#d1d5db",
                    lineHeight: "1.7",
                    margin: 0,
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  Your AI agents get the right context automatically. No more
                  hallucinations from stale docs. No more searching for the
                  right files.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// FAQ Section
const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
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

  const faqs = [
    {
      question: "What languages and frameworks are supported?",
      answer:
        "Principal AI works with any Git-based project. Living Documentation supports all major languages including JavaScript/TypeScript, Python, Java, Go, Rust, and more. Framework-agnostic—works with React, Next.js, Django, Spring, and any codebase structure.",
    },
    {
      question: "How long does setup take?",
      answer: (
        <>
          Less than 5 minutes. Just give your agent this link{" "}
          <a
            href="https://www.npmjs.com/package/@principal-ai/alexandria-cli"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#00C2FF",
              textDecoration: "underline",
            }}
          >
            https://www.npmjs.com/package/@principal-ai/alexandria-cli
          </a>
        </>
      ),
    },
    {
      question: "How does staleness detection work?",
      answer:
        "Principal AI validates documentation-to-code links on every commit. When code changes affect linked documentation, you get immediate notifications. CodebaseViews track file dependencies, so you always know what needs updating before it becomes a problem.",
    },
    {
      question: "Is my code secure?",
      answer:
        "Your code stays in your Git repository. Principal AI operates locally on your machine or in your infrastructure. We never store your code on external servers. All processing happens in your environment.",
    },
    {
      question: "How much does Principal AI cost?",
      answer:
        "Principal AI is currently free and open source during our alpha phase. We're building in public and early users get full access at no cost while helping us shape the platform. When we introduce pricing in the future, we'll provide plenty of advance notice and early adopters will receive special consideration.",
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #000000 0%, #0a1628 100%)",
        padding: isTablet ? "60px 32px" : isMobile ? "50px 20px" : "80px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              fontWeight: "600",
              margin: "0 0 48px 0",
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
            Frequently Asked Questions
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: isTablet ? "14px" : "16px",
            }}
          >
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(0, 194, 255, 0.05)",
                  border: "1px solid rgba(0, 194, 255, 0.2)",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  style={{
                    width: "100%",
                    padding: isTablet
                      ? "26px"
                      : isMobile
                        ? "20px"
                        : "24px",
                    background: "transparent",
                    border: "none",
                    color: "#ffffff",
                    fontSize: isTablet ? "19px" : isMobile ? "17px" : "18px",
                    fontWeight: "600",
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  {faq.question}
                  <ChevronDown
                    size={20}
                    style={{
                      flexShrink: 0,
                      color: "#00C2FF",
                      transform:
                        openIndex === index ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </button>
                {openIndex === index && (
                  <div
                    style={{
                      padding: isTablet
                        ? "0 26px 26px 26px"
                        : isMobile
                          ? "0 20px 20px 20px"
                          : "0 24px 24px 24px",
                      color: "#d1d5db",
                      fontSize: isTablet ? "17px" : isMobile ? "15px" : "16px",
                      lineHeight: "1.7",
                      fontFamily:
                        'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// About Principal AI Section

export const LivingDocHomepage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <LivingDocSection />
      <FAQSection />
    </div>
  );
};
