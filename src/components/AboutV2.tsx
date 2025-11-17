import React from 'react';
import { motion } from 'framer-motion';
import { Code2, GitBranch, Zap } from 'lucide-react';

export const AboutV2: React.FC = () => {
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
            {keyPoints.map((point, index) => {
              const Icon = point.icon;
              return (
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
                  <Icon
                    size={isTablet ? 36 : 40}
                    color="#00C2FF"
                  />
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
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
