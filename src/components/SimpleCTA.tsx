"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";

interface SimpleCTAProps {
  isMobile?: boolean;
}

export const SimpleCTA: React.FC<SimpleCTAProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();

  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: isMobile ? "60px 24px" : "100px 40px",
        textAlign: "center",
        background: `linear-gradient(180deg, ${theme.colors.backgroundSecondary} 0%, ${theme.colors.background} 100%)`,
        borderTop: `1px solid ${theme.colors.border}`,
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
            color: theme.colors.text,
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
            color: theme.colors.textTertiary,
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
            background: theme.colors.primary,
            color: theme.colors.textOnPrimary,
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
          Get Early Access →
        </a>
        <p
          style={{
            marginTop: "24px",
            fontSize: isMobile ? "14px" : "15px",
            color: theme.colors.textMuted,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}
        >
          Investor or partner?{" "}
          <a
            href="/demo"
            style={{
              color: theme.colors.primary,
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(1.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)";
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
