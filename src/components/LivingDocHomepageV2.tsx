import React from "react";
import { motion } from "framer-motion";
import { Logo } from "@principal-ai/logo-component";
import {
  ChevronDown,
} from "lucide-react";
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
        padding: isMobile ? "60px 20px 40px 20px" : "80px 20px 60px 20px",
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
            margin: "0 auto 48px auto",
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

        {/* Centered Single Column Layout - No Image */}
        <div
          style={{
            maxWidth: "980px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* Main Headline */}
          <h1
            style={{
              fontSize: isMobile ? "40px" : isTablet ? "56px" : "80px",
              fontWeight: "600",
              margin: "0 0 28px 0",
              textAlign: "center",
              letterSpacing: "-0.04em",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              lineHeight: "1.05",
              color: "#ffffff",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            A picture is worth a thousand <span style={{ color: "#00C2FF", fontWeight: "600" }}>lines of code</span>
          </h1>

          {/* Subheading */}
          <p
            style={{
              fontSize: isMobile ? "17px" : "21px",
              fontWeight: "400",
              margin: "0 auto 48px auto",
              color: "#86868b",
              lineHeight: "1.47",
              letterSpacing: "0.007em",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              textAlign: "center",
              maxWidth: "700px",
            }}
          >
            Principal is a visual-first environment for understanding, building, and validating complex codebases and agent-built systems.
          </p>

          {/* Single CTA */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <a
              href="https://principal.dev/gallery"
              style={{
                backgroundColor: "#0071e3",
                color: "#ffffff",
                padding: isMobile ? "14px 32px" : "16px 40px",
                borderRadius: "980px",
                fontSize: isMobile ? "17px" : "19px",
                fontWeight: "400",
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
                e.currentTarget.style.backgroundColor = "#0077ed";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#0071e3";
              }}
            >
              Get Early Access
            </a>
          </div>
        </div>
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

export const LivingDocHomepageV2: React.FC = () => {
  return (
    <div>
      <HeroSection />
    </div>
  );
};
