import React from "react";
import { motion } from "framer-motion";

interface AgentShiftProps {
  isMobile?: boolean;
}

export const AgentShift: React.FC<AgentShiftProps> = ({ isMobile = false }) => {
  return (
    <section
      style={{
        padding: isMobile ? "0 24px" : "0 40px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            style={{
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: "600",
              color: "#9ca3af",
              marginBottom: "32px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            Not after the fire. Before the smoke.
          </p>
          <h2
            style={{
              fontSize: isMobile ? "32px" : "48px",
              fontWeight: "600",
              lineHeight: "1.15",
              letterSpacing: "-0.025em",
              marginBottom: "32px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            <span style={{ color: "#00C2FF" }}>Three features.</span>
            <br />
            <span style={{ color: "#ffffff" }}>One platform.</span>
          </h2>
          <a
            href="/product"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: isMobile ? "14px 32px" : "16px 40px",
              background: "#00C2FF",
              color: "#000000",
              textDecoration: "none",
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "600",
              borderRadius: "8px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#00d4ff";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 194, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#00C2FF";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            See the product →
          </a>
        </motion.div>
      </div>
    </section>
  );
};
