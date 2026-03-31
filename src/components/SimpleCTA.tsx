import React from "react";
import { motion } from "framer-motion";
import { COLORS } from "../styles/colors";

interface SimpleCTAProps {
  isMobile?: boolean;
}

export const SimpleCTA: React.FC<SimpleCTAProps> = ({ isMobile = false }) => {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? "80px 24px" : "120px 40px",
        textAlign: "center",
        background: COLORS.white,
        borderTop: `1px solid ${COLORS.border}`,
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
            color: COLORS.text,
            marginBottom: "16px",
            lineHeight: "1.2",
            letterSpacing: "-0.02em",
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          Ready to see the story?
        </h2>
        <p
          style={{
            fontSize: isMobile ? "16px" : "18px",
            color: COLORS.textSecondary,
            marginBottom: "32px",
            lineHeight: "1.6",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
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
            background: COLORS.primary,
            color: COLORS.white,
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
            e.currentTarget.style.background = COLORS.primaryHover;
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 107, 53, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = COLORS.primary;
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
            color: COLORS.gray500,
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          Investor or partner?{" "}
          <a
            href="/demo"
            style={{
              color: COLORS.secondary,
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = COLORS.secondaryHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = COLORS.secondary;
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
