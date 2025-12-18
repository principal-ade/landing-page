import React from 'react';
import { motion } from 'framer-motion';

export const TransitionSection: React.FC = () => {
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
    <section
      style={{
        padding: isMobile ? "60px 24px" : isTablet ? "80px 32px" : "100px 40px",
        background: "#000000",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            style={{
              fontSize: isMobile ? "17px" : "20px",
              fontWeight: "400",
              color: "#a0aec0",
              lineHeight: "1.6",
              marginBottom: "16px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
            }}
          >
            Visual supervision and living documentation—working together in Git.
          </p>
          <h3
            style={{
              fontSize: isMobile ? "24px" : isTablet ? "28px" : "32px",
              fontWeight: "600",
              color: "#ffffff",
              margin: "0",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
          >
            Three Views. One Complete Picture.
          </h3>
        </motion.div>
      </div>
    </section>
  );
};
