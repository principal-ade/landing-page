import React from "react";
import { motion } from "framer-motion";
import { Logo } from "@principal-ai/logo-component";
import {
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { VisualSupervision } from "./VisualSupervision";
import { StartingPoint } from "./StartingPoint";
import { LivingDocumentationSection } from "./LivingDocumentationSection";
import { GalleryCTA } from "./GalleryCTA";
import { TransitionSection } from "./TransitionSection";
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
            fontSize: isMobile ? "40px" : isTablet ? "56px" : "72px",
            fontWeight: "600",
            margin: "0 auto 40px auto",
            textAlign: "center",
            width: "100%",
            maxWidth: isMobile ? "100%" : "1000px",
            letterSpacing: "-0.02em",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            lineHeight: "1.1",
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
            fontSize: isMobile ? "17px" : "20px",
            fontWeight: "400",
            margin: "0",
            color: "#ffffff",
            lineHeight: "1.6",
            letterSpacing: "-0.01em",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            maxWidth: "740px",
          }}
        >
          Agents write code faster than you can review it.
          <br />
          Visual diagrams and living docs give you supervision at scale.
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

          {/* Benefits List */}
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 auto 60px auto",
              maxWidth: "600px",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: isMobile ? "12px" : "24px",
            }}
          >
            {benefits.map((benefit, i) => (
              <li
                key={i}
                style={{
                  fontSize: isMobile ? "15px" : "16px",
                  color: "#ffffff",
                  fontWeight: "400",
                  fontFamily:
                    'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ color: "#06b6d4", fontSize: "18px" }}>•</span>
                {benefit}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Visual Supervision Section */}
      <VisualSupervision />

      {/* Starting Point Section */}
      <StartingPoint />

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

// Video and How It Works Section
const VideoAndHowItWorksSection: React.FC = () => {
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
        background: "linear-gradient(180deg, #0a1628 0%, #000000 100%)",
        padding: isTablet ? "80px 32px" : isMobile ? "60px 20px" : "100px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center" }}
        >
          {/* How Principal AI Works */}
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
                  Git-Native
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
                  Context lives in your repository. No cloud databases. No third-party dependencies.
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
                  Auto-Updated
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
                  Architecture and quality views regenerate on every commit. Always current.
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
                  Unified Quality
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
                  Test coverage, linting, formatting — normalized across languages. One view.
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
                  Agent-Ready Supervision
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
                  Built for AI-generated code. Understand changes at the intent level, not line-by-line.
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
export const FAQSection: React.FC = () => {
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
      <GalleryCTA />
      <StartingPoint />
      <VisualSupervision />
      <LivingDocumentationSection />
    </div>
  );
};
