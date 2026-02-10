import React from "react";
import { motion } from "framer-motion";

interface FinalCTAProps {
  isMobile?: boolean;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ isMobile = false }) => {
  return (
    <section
      style={{
        padding: isMobile ? "0 24px" : "0 40px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "24px" : "32px",
          }}
        >
          {/* Left Card - Get Mapped Now */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: "rgba(17, 24, 39, 0.4)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(0, 194, 255, 0.2)",
              borderRadius: "16px",
              padding: isMobile ? "32px 24px" : "40px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 16px rgba(0, 194, 255, 0.05)",
            }}
          >
            <h3
              style={{
                fontSize: isMobile ? "20px" : "24px",
                fontWeight: "600",
                color: "#ffffff",
                margin: "0 0 16px 0",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              See Your Codebase
            </h3>
            <p
              style={{
                fontSize: isMobile ? "14px" : "15px",
                color: "#9ca3af",
                lineHeight: "1.6",
                marginBottom: "24px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              Your repo as a city. Free for any public GitHub repo.
            </p>
            <a
              href="/map"
              style={{
                backgroundColor: "#00C2FF",
                color: "#000000",
                padding: "14px 24px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-block",
                textAlign: "center",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                transition: "all 0.2s ease",
                marginTop: "auto",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#00d4ff";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#00C2FF";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Get Your Repo Mapped
            </a>
          </motion.div>

          {/* Right Card - Get Early Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              background: "rgba(17, 24, 39, 0.4)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(0, 194, 255, 0.2)",
              borderRadius: "16px",
              padding: isMobile ? "32px 24px" : "40px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 16px rgba(0, 194, 255, 0.05)",
            }}
          >
            <h3
              style={{
                fontSize: isMobile ? "20px" : "24px",
                fontWeight: "600",
                color: "#ffffff",
                margin: "0 0 16px 0",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              Get Early Access
            </h3>
            <p
              style={{
                fontSize: isMobile ? "14px" : "15px",
                color: "#9ca3af",
                lineHeight: "1.6",
                marginBottom: "24px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              System Stories, File City, Quality Radar — story-based development from code to production.
            </p>
            <a
              href="/waitlist"
              style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                padding: "14px 24px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-block",
                textAlign: "center",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                transition: "all 0.2s ease",
                marginTop: "auto",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ffffff";
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Get Early Access
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
