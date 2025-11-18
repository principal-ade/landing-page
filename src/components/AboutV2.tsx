import React from 'react';
import { motion } from 'framer-motion';
import { Code2, GitBranch, Zap } from 'lucide-react';

export const AboutV2: React.FC = () => {
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

  const keyPoints = [
    {
      icon: Code2,
      text: "Documentation is Core Infrastructure",
    },
    {
      icon: GitBranch,
      text: "Context Belongs in Git, Not SaaS",
    },
    {
      icon: Zap,
      text: "AI Needs Understanding, Not Just Speed",
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #000000 0%, #0a1628 100%)",
        padding: isTablet ? "100px 40px" : isMobile ? "64px 24px" : "120px 40px",
      }}
    >
      <div
        style={{
          maxWidth: "1140px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Who We Are Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: isMobile ? "96px" : "120px" }}
        >
          <h2
            style={{
              fontSize: isMobile ? "32px" : isTablet ? "40px" : "48px",
              fontWeight: "600",
              margin: "0 0 32px 0",
              color: "#ffffff",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              letterSpacing: "-0.025em",
              lineHeight: "1.1",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            Who We Are
          </h2>
          <p
            style={{
              fontSize: isMobile ? "17px" : isTablet ? "19px" : "21px",
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: "1.6",
              maxWidth: "820px",
              margin: "0 auto 28px auto",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontWeight: "400",
            }}
          >
            Engineers and builders who've lived the pain of navigating AI-assisted work. We've shipped AI products at scale, led technical communications at major tech companies, and experienced the frustration of AI development with inadequate tools.
          </p>
          <p
            style={{
              fontSize: isMobile ? "19px" : isTablet ? "21px" : "24px",
              color: "#00C2FF",
              fontWeight: "500",
              lineHeight: "1.35",
              maxWidth: "820px",
              margin: "0 auto",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              letterSpacing: "-0.015em",
            }}
          >
            So we built the fix.
          </p>
        </motion.div>

        {/* We Believe Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <h3
            style={{
              fontSize: isMobile ? "28px" : isTablet ? "32px" : "40px",
              fontWeight: "600",
              margin: "0 0 64px 0",
              color: "#ffffff",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              letterSpacing: "-0.025em",
              lineHeight: "1.1",
            }}
          >
            We believe
          </h3>

          {/* Key Points */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet || isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: isMobile ? "16px" : isTablet ? "20px" : "24px",
              maxWidth: "1100px",
              margin: "0 auto",
            }}
          >
            {keyPoints.map((point, index) => {
              const Icon = point.icon;
              const isHovered = hoveredCard === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.08 + 0.3
                  }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    background: isHovered
                      ? "rgba(0, 194, 255, 0.08)"
                      : "rgba(0, 194, 255, 0.03)",
                    border: `1px solid ${isHovered ? "rgba(0, 194, 255, 0.35)" : "rgba(0, 194, 255, 0.12)"}`,
                    borderRadius: "16px",
                    padding: isMobile ? "36px 24px" : isTablet ? "40px 28px" : "44px 32px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "24px",
                    cursor: "default",
                    transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                    transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                    boxShadow: isHovered
                      ? "0 12px 40px rgba(0, 194, 255, 0.15)"
                      : "0 2px 8px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <div
                    style={{
                      width: isMobile ? "60px" : "68px",
                      height: isMobile ? "60px" : "68px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "14px",
                      background: isHovered
                        ? "rgba(0, 194, 255, 0.15)"
                        : "rgba(0, 194, 255, 0.08)",
                      transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <Icon
                      size={isMobile ? 30 : 34}
                      color="#00C2FF"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: isMobile ? "16px" : isTablet ? "17px" : "18px",
                      color: "#ffffff",
                      fontWeight: "500",
                      margin: 0,
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      letterSpacing: "-0.011em",
                      lineHeight: "1.45",
                      textAlign: "center",
                    }}
                  >
                    {point.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
