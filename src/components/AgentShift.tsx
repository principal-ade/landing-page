"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";

interface AgentShiftProps {
  isMobile?: boolean;
}

export const AgentShift: React.FC<AgentShiftProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();

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
              color: theme.colors.textTertiary,
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
            <span style={{ color: theme.colors.primary }}>Three features.</span>
            <br />
            <span style={{ color: theme.colors.text }}>One platform.</span>
          </h2>
          <a
            href="/product"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: isMobile ? "14px 32px" : "16px 40px",
              background: theme.colors.primary,
              color: theme.colors.textOnPrimary,
              textDecoration: "none",
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "600",
              borderRadius: "8px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(1.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}66`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)";
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
