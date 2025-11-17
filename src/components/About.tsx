import React from 'react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
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
        background: "#000000",
        padding: isTablet ? "90px 32px" : isMobile ? "70px 20px" : "100px 20px",
        borderTop: "1px solid rgba(0, 194, 255, 0.2)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: isTablet ? "800px" : "900px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: "600",
              margin: "0 0 32px 0",
              color: "#ffffff",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              lineHeight: "1.2",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            About Principal AI
          </h3>
          <p
            style={{
              fontSize: isTablet ? "18px" : isMobile ? "16px" : "20px",
              color: "#d1d5db",
              lineHeight: isMobile ? "1.6" : "1.8",
              marginBottom: "24px",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            We're building the infrastructure for the next generation of AI development.
          </p>
          <p
            style={{
              fontSize: isTablet ? "18px" : isMobile ? "16px" : "20px",
              color: "#d1d5db",
              lineHeight: isMobile ? "1.6" : "1.8",
              marginBottom: "24px",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            When AI agents write code faster than humans can review it, the problem isn't speed—it's understanding. Everyone's building faster AI tools. We're building the infrastructure that makes AI development trustworthy.
          </p>
          <p
            style={{
              fontSize: isTablet ? "18px" : isMobile ? "16px" : "20px",
              color: "#d1d5db",
              lineHeight: "1.8",
              marginBottom: "32px",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Living Documentation is that infrastructure. Context that stays synchronized with your code. Agents that work transparently. Teams that ship with confidence.
          </p>
          <p
            style={{
              fontSize: isTablet ? "21px" : isMobile ? "19px" : "22px",
              fontWeight: "500",
              color: "#00C2FF",
              lineHeight: "1.7",
              marginBottom: "0",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Built by a team that believes the future of software development needs better infrastructure, not just faster tools.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
