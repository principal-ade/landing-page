import React from 'react';
import { motion } from 'framer-motion';

export const VisualSupervision: React.FC = () => {
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

  const views = [
    {
      image: "/quality-radar-example.png",
      title: "Quality Radar",
      subtitle: "Know before you invest",
      description: "A Carfax report for code. Six dimensions to know if it's solid before you invest developer time.",
      link: "Gallery: Explore real codebases →",
    },
    {
      image: "/file-city-example.png",
      title: "File City",
      subtitle: "Navigate the landscape",
      description: "Files and directories as a living city map. See size, complexity, and composition in seconds.",
      link: "Gallery: Explore real codebases →",
    },
    {
      image: "/architecture-example.png",
      title: "Architecture",
      subtitle: "See how it connects",
      description: "Auto-generated diagrams showing modules, packages, and dependencies. Understand the system at a glance.",
      link: "Gallery: Explore real codebases →",
    },
  ];

  return (
    <section
      style={{
        padding: isMobile ? "80px 24px" : isTablet ? "100px 40px" : "120px 40px",
        background: "#0a0e1a",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "64px",
            maxWidth: "900px",
            margin: "0 auto 64px auto",
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
              margin: "0 0 24px 0",
              color: "#ffffff",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
          >
            Not just visuals. <span style={{ color: "#06b6d4" }}>Orientation.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: isMobile ? "17px" : "20px",
              fontWeight: "400",
              color: "#a0aec0",
              lineHeight: "1.6",
              margin: "0",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
            }}
          >
            Maps without context are just pretty pictures. Visual supervision paired with living documentation. That's how you actually understand a codebase.
          </motion.p>
        </div>

        {/* Views - Vertical Layout */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: isMobile ? "64px" : "80px",
            marginBottom: "64px",
          }}
        >
          {views.map((view, index) => {
            const isEven = index % 2 === 0;
            const isHovered = hoveredCard === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : isEven ? "row" : "row-reverse",
                  gap: isMobile ? "32px" : "48px",
                  alignItems: "center",
                }}
              >
                {/* Image Side */}
                <div
                  style={{
                    flex: "1 1 60%",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: `1px solid ${isHovered ? "rgba(6, 182, 212, 0.4)" : "rgba(6, 182, 212, 0.2)"}`,
                    background: isHovered
                      ? "rgba(6, 182, 212, 0.05)"
                      : "rgba(6, 182, 212, 0.02)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <img
                    src={view.image}
                    alt={view.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </div>

                {/* Text Side */}
                <div
                  style={{
                    flex: "1 1 40%",
                    textAlign: "left",
                  }}
                >
                  {/* Title */}
                  <h3
                    style={{
                      fontSize: isMobile ? "24px" : "28px",
                      fontWeight: "600",
                      color: "#ffffff",
                      marginBottom: "12px",
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      letterSpacing: "-0.02em",
                      lineHeight: "1.1",
                    }}
                  >
                    {view.title}
                  </h3>

                  {/* Subtitle */}
                  <p
                    style={{
                      fontSize: isMobile ? "15px" : "17px",
                      fontWeight: "400",
                      color: "#06b6d4",
                      marginBottom: "20px",
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      letterSpacing: "-0.01em",
                      lineHeight: "1.6",
                    }}
                  >
                    {view.subtitle}
                  </p>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "17px",
                      fontWeight: "400",
                      color: "#a0aec0",
                      lineHeight: "1.6",
                      marginBottom: "20px",
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {view.description}
                  </p>

                  {/* Dimensions (Quality Radar only) */}
                  {view.dimensions && (
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "400",
                        color: "#6b7280",
                        marginBottom: "20px",
                        fontFamily:
                          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                        letterSpacing: "-0.01em",
                        lineHeight: "1.6",
                      }}
                    >
                      {view.dimensions}
                    </p>
                  )}

                  {/* Link */}
                  <a
                    href="#gallery"
                    style={{
                      fontSize: "15px",
                      fontWeight: "400",
                      color: "#06b6d4",
                      textDecoration: "none",
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {view.link} →
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            textAlign: "center",
            fontSize: isMobile ? "17px" : "20px",
            fontWeight: "400",
            color: "#ffffff",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            letterSpacing: "-0.01em",
            lineHeight: "1.6",
            marginTop: "80px",
          }}
        >
          Not just visuals.{" "}
          <span style={{ color: "#06b6d4" }}>Orientation.</span>
        </motion.p>
      </div>
    </section>
  );
};
