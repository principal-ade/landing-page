import React from 'react';
import { motion } from 'framer-motion';

export const WhoWeAre: React.FC = () => {
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
        padding: isTablet ? "80px 32px" : isMobile ? "60px 20px" : "100px 20px",
        borderTop: "1px solid rgba(0, 194, 255, 0.1)",
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
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: "600",
              margin: "0 0 32px 0",
              color: "#ffffff",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            Who We Are
          </h3>
          <p
            style={{
              fontSize: isTablet ? "19px" : isMobile ? "17px" : "20px",
              color: "#d1d5db",
              lineHeight: "1.8",
              marginBottom: "24px",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            A team of engineers and builders who have lived the pain from different sides. We've shipped AI products at scale. We've led technical communications at major tech companies. We've experienced the frustration of trying to make AI development work with tools that weren't built for it.
          </p>
          <p
            style={{
              fontSize: isTablet ? "19px" : isMobile ? "17px" : "20px",
              color: "#d1d5db",
              lineHeight: "1.8",
              marginBottom: "24px",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            We realized that context should live in Git, not scattered across external tools. That AI agents need memory that persists. That teams need transparency when code is being written faster than humans can review it.
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
            We're building the infrastructure we wish existed when we were solving these problems ourselves.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
