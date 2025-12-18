import React from 'react';
import { motion } from 'framer-motion';

export const StartingPoint: React.FC = () => {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [hoveredCard, setHoveredCard] = React.useState<number | null>(null);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const onboardingSteps = [
    {
      title: "1. See Your Codebase Quality",
      description: "Point Principal View at any GitHub repository. Generate Quality Radar to see your codebase quality instantly.",
      action: null,
      href: null,
      code: "npx @principal-ai/quality-lens-cli init",
    },
    {
      title: "2. Add Living Documentation",
      description: "Install Alexandria to unlock full metrics. Keep documentation synced with code and give AI agents grounded context.",
      action: null,
      href: null,
      code: "npx @principal-ai/alexandria-cli init",
    },
    {
      title: "3. Download Principal ADE",
      description: "Get the full experience with File City and Architecture diagrams. A native Agentic Development Environment built for supervision.",
      action: "Download Principal ADE",
      href: "#download",
      code: null,
      badge: "Alpha",
    },
  ];

  return (
    <section
      style={{
        padding: isMobile ? "70px 24px" : isTablet ? "90px 32px" : "120px 40px",
        background: "#141b2d",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "48px",
            maxWidth: "768px",
            margin: "0 auto 48px auto",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: isMobile ? "32px" : isTablet ? "40px" : "48px",
              fontWeight: "600",
              margin: "0 0 16px 0",
              color: "#06b6d4",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
          >
            Do It
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: isMobile ? "24px" : isTablet ? "28px" : "32px",
              fontWeight: "500",
              color: "#a0aec0",
              lineHeight: "1.3",
              margin: "0",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
            }}
          >
            Get Started with Your Own Code
          </motion.p>
        </div>

        {/* Onboarding Steps Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {onboardingSteps.map((path, index) => {
            const isHovered = hoveredCard === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  border: `1px solid ${isHovered ? "rgba(6, 182, 212, 0.4)" : "rgba(255, 255, 255, 0.1)"}`,
                  borderRadius: "12px",
                  padding: "28px",
                  background: isHovered ? "#1a2332" : "#1a2332",
                  transition: "all 0.3s ease",
                  position: "relative",
                }}
              >
                {/* Badge if present */}
                {path.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      background: "rgba(6, 182, 212, 0.2)",
                      color: "#06b6d4",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {path.badge}
                  </div>
                )}

                <h3
                  style={{
                    fontSize: isMobile ? "20px" : "24px",
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: "12px",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    letterSpacing: "-0.02em",
                    lineHeight: "1.1",
                  }}
                >
                  {path.title}
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: "400",
                    color: "#a0aec0",
                    lineHeight: "1.6",
                    marginBottom: "20px",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                    letterSpacing: "-0.01em",
                  }}
                >
                  {path.description}
                </p>

                {/* Code Block */}
                {path.code && (
                  <div
                    style={{
                      background: "#0d1117",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "6px",
                      padding: "12px 14px",
                      fontFamily: "monospace",
                      fontSize: "12px",
                    }}
                  >
                    <code style={{ color: "#06b6d4" }}>{path.code}</code>
                  </div>
                )}

                {/* Button */}
                {path.action && path.href && (
                  <a
                    href={path.href}
                    style={{
                      display: "inline-block",
                      width: "100%",
                      padding: "12px 16px",
                      color: "#000000",
                      textAlign: "center",
                      textDecoration: "none",
                      fontSize: "13px",
                      fontWeight: "500",
                      background: "#06b6d4",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                      fontFamily: "monospace",
                      boxSizing: "border-box",
                      lineHeight: "1",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#22d3ee";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#06b6d4";
                    }}
                  >
                    {path.action}
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
