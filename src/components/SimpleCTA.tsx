import React from "react";
import { motion } from "framer-motion";

interface SimpleCTAProps {
  isMobile?: boolean;
}

export const SimpleCTA: React.FC<SimpleCTAProps> = ({ isMobile = false }) => {
  return (
    <section
      style={{
        padding: isMobile ? "60px 24px" : "100px 40px",
        textAlign: "center",
        background: "linear-gradient(180deg, #0d1b2a 0%, #0a0d12 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "32px" : "44px",
            fontWeight: "600",
            color: "#ffffff",
            marginBottom: "16px",
            lineHeight: "1.2",
            letterSpacing: "-0.02em",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}
        >
          Ready to see the story?
        </h2>
        <p
          style={{
            fontSize: isMobile ? "16px" : "18px",
            color: "#9ca3af",
            marginBottom: "32px",
            lineHeight: "1.6",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}
        >
          Our alpha is live. We're onboarding now.
        </p>
        <a
          href="/early-access"
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
            cursor: "pointer",
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
          Get Early Access →
        </a>
        <p
          style={{
            marginTop: "24px",
            fontSize: isMobile ? "14px" : "15px",
            color: "#6b7280",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}
        >
          Investor or partner?{" "}
          <a
            href="/demo"
            style={{
              color: "#00C2FF",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#00d4ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#00C2FF";
            }}
          >
            Schedule a demo
          </a>
          .
        </p>
      </motion.div>
    </section>
  );
};
