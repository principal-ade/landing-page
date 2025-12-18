import React from 'react';
import { motion } from 'framer-motion';

export const GalleryCTA: React.FC = () => {
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
        background: "#0a0e1a",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            style={{
              fontSize: isMobile ? "28px" : isTablet ? "36px" : "42px",
              fontWeight: "600",
              margin: "0 0 24px 0",
              color: "#ffffff",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
          >
            See What Principal AI Can Do
          </h2>
          <p
            style={{
              fontSize: isMobile ? "17px" : "20px",
              fontWeight: "400",
              color: "#a0aec0",
              lineHeight: "1.6",
              marginBottom: "40px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
            }}
          >
            Test drive on code you know. Quality Radar, File City, and Architecture applied to React, Next.js, Kubernetes, and more.
          </p>
          <a
            href="#gallery"
            style={{
              display: "inline-block",
              padding: isMobile ? "18px 40px" : "20px 48px",
              color: "#000000",
              textAlign: "center",
              textDecoration: "none",
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "600",
              background: "#06b6d4",
              borderRadius: "10px",
              transition: "all 0.2s ease",
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
              boxShadow: "0 4px 14px rgba(6, 182, 212, 0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#22d3ee";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(6, 182, 212, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#06b6d4";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(6, 182, 212, 0.4)";
            }}
          >
            Explore the Gallery →
          </a>
        </motion.div>
      </div>
    </section>
  );
};
