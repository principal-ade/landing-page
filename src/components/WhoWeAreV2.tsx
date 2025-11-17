import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export const WhoWeAreV2: React.FC = () => {
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
        padding: isTablet ? "60px 32px" : isMobile ? "50px 20px" : "80px 20px",
        borderTop: "1px solid rgba(0, 194, 255, 0.1)",
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
          style={{
            background: "rgba(0, 194, 255, 0.05)",
            border: "1px solid rgba(0, 194, 255, 0.2)",
            borderRadius: "16px",
            padding: isTablet ? "40px 32px" : isMobile ? "32px 24px" : "48px 40px",
            textAlign: "center",
          }}
        >
          <Users
            size={isTablet ? 48 : 56}
            color="#00C2FF"
            style={{ marginBottom: "24px" }}
          />
          <h3
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: "600",
              margin: "0 0 24px 0",
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
              fontSize: isTablet ? "18px" : isMobile ? "16px" : "19px",
              color: "#d1d5db",
              lineHeight: "1.7",
              marginBottom: "0",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Engineers and builders who've lived the pain. We've shipped AI products at scale, led technical communications at major tech companies, and experienced the frustration of AI development with inadequate tools.
          </p>
          <p
            style={{
              fontSize: isTablet ? "19px" : isMobile ? "17px" : "20px",
              fontWeight: "500",
              color: "#00C2FF",
              lineHeight: "1.7",
              marginTop: "24px",
              marginBottom: "0",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Building the infrastructure we wish existed.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
