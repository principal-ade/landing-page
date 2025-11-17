import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';

export const JoinTheAlpha: React.FC = () => {
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
        background: "linear-gradient(135deg, rgba(0, 194, 255, 0.1), rgba(0, 152, 204, 0.05))",
        padding: isTablet ? "80px 32px" : isMobile ? "60px 20px" : "100px 20px",
        borderTop: "1px solid rgba(0, 194, 255, 0.3)",
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
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              fontWeight: "600",
              margin: "0 0 24px 0",
              color: "#ffffff",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            Join the Alpha
          </h3>
          <p
            style={{
              fontSize: isTablet ? "19px" : isMobile ? "17px" : "20px",
              color: "#d1d5db",
              lineHeight: "1.8",
              marginBottom: "40px",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Be among the first to experience Living Documentation. Add it to your project in minutes and see the difference yourself.
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: "flex",
              gap: isTablet ? "18px" : "20px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="https://app.principal-ade.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: isTablet
                  ? "18px 36px"
                  : isMobile
                    ? "14px 28px"
                    : "16px 32px",
                fontSize: isTablet ? "17px" : isMobile ? "15px" : "16px",
                fontWeight: "600",
                background: "#00C2FF",
                color: "#000000",
                border: "none",
                borderRadius: isTablet ? "9px" : "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                textDecoration: "none",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 194, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Try in Browser
              <ArrowRight size={20} />
            </a>
            <a
              href="/download"
              style={{
                padding: isTablet
                  ? "18px 36px"
                  : isMobile
                    ? "14px 28px"
                    : "16px 32px",
                fontSize: isTablet ? "17px" : isMobile ? "15px" : "16px",
                fontWeight: "600",
                background: "transparent",
                color: "#00C2FF",
                border: "2px solid #00C2FF",
                borderRadius: isTablet ? "9px" : "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                textDecoration: "none",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 194, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Download size={20} />
              Download Alpha
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
