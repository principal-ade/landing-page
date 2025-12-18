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

  const featuredPath = {
    title: "Explore the Gallery",
    description: "Explore curated collections of popular open-source projects. See Architecture, File City, and Quality Radar on real code.",
    action: "Browse Gallery",
    href: "#gallery",
    badge: "Recommended",
  };

  const otherPaths = [
    {
      title: "Analyze Your Own Repo",
      description: "Point Principal View at any GitHub repository. Generate architecture and quality insights in minutes.",
      action: null,
      href: null,
      code: "npx principal-view analyze <github-url>",
    },
    {
      title: "Add Living Documentation",
      description: "Install Alexandria to keep documentation synced with code. Give AI agents grounded, always-current context.",
      action: null,
      href: null,
      code: "npm install alexandria-cli",
    },
    {
      title: "Download Principal ADE",
      description: "A native Agentic Development Environment to get the most out of Living Docs, Auto-Architecture, File City, Quality Radar, and your favorite agents too.",
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
            marginBottom: "64px",
            maxWidth: "768px",
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
              margin: "0",
              color: "#ffffff",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
          >
            Choose Your Starting Point
          </motion.h2>
        </div>

        {/* Featured Path - Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onMouseEnter={() => setHoveredCard(0)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            border: `2px solid ${hoveredCard === 0 ? "rgba(6, 182, 212, 0.6)" : "rgba(6, 182, 212, 0.4)"}`,
            borderRadius: "16px",
            padding: isMobile ? "40px 32px" : "48px 40px",
            background: hoveredCard === 0 ? "rgba(6, 182, 212, 0.08)" : "rgba(6, 182, 212, 0.05)",
            transition: "all 0.3s ease",
            marginBottom: "48px",
            position: "relative",
          }}
        >
          {/* Recommended Badge */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "#06b6d4",
              color: "#000000",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            {featuredPath.badge}
          </div>

          <h3
            style={{
              fontSize: isMobile ? "24px" : "28px",
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: "16px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
          >
            {featuredPath.title}
          </h3>
          <p
            style={{
              fontSize: "17px",
              fontWeight: "400",
              color: "#d1d5db",
              lineHeight: "1.6",
              marginBottom: "32px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
            }}
          >
            {featuredPath.description}
          </p>
          <a
            href={featuredPath.href}
            style={{
              display: "inline-block",
              width: isMobile ? "100%" : "auto",
              padding: "16px 32px",
              color: "#000000",
              textAlign: "center",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: "600",
              background: "#06b6d4",
              borderRadius: "8px",
              transition: "all 0.2s ease",
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#22d3ee";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#06b6d4";
            }}
          >
            {featuredPath.action} →
          </a>
        </motion.div>

        {/* Other Ways to Start */}
        <div style={{ marginBottom: "32px" }}>
          <h3
            style={{
              fontSize: isMobile ? "17px" : "20px",
              fontWeight: "400",
              color: "#a0aec0",
              marginBottom: "24px",
              textAlign: "center",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
              lineHeight: "1.6",
            }}
          >
            Other ways to start
          </h3>
        </div>

        {/* Other Paths Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "20px",
          }}
        >
          {otherPaths.map((path, index) => {
            const isHovered = hoveredCard === index + 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                onMouseEnter={() => setHoveredCard(index + 1)}
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

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            textAlign: "center",
            fontSize: isMobile ? "17px" : "20px",
            fontWeight: "400",
            color: "#ffffff",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            letterSpacing: "-0.01em",
            lineHeight: "1.6",
            marginTop: "64px",
          }}
        >
          Optimized for Agents.{" "}
          <span style={{ color: "#06b6d4" }}>Designed for humans.</span>
        </motion.p>

      </div>
    </section>
  );
};
