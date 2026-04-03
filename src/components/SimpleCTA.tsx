"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";

interface SimpleCTAProps {
  isMobile?: boolean;
}

const ArrowRight: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export const SimpleCTA: React.FC<SimpleCTAProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const [hovered, setHovered] = React.useState(false);

  return (
    <section
      style={{
        padding: isMobile ? "60px 24px" : "80px 64px",
        borderTop: `1px solid ${theme.colors.border}`,
        background: theme.colors.background,
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: isMobile ? "32px" : "44px",
            fontWeight: "700",
            letterSpacing: "-0.03em",
            color: theme.colors.text,
            marginBottom: "12px",
          }}
        >
          Download Principal. Free.
        </h2>
        <p
          style={{
            fontSize: "18px",
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.body,
            marginBottom: "32px",
          }}
        >
          macOS now. Windows and Linux coming soon.
        </p>

        <a
          href="/download"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "16px 36px",
            background: theme.colors.primary,
            color: "#fff",
            textDecoration: "none",
            borderRadius: "8px",
            fontSize: "17px",
            fontWeight: "600",
            fontFamily: theme.fonts.body,
            boxShadow: hovered
              ? `0 8px 28px ${theme.colors.primary}48`
              : `0 4px 20px ${theme.colors.primary}38`,
            transform: hovered ? "translateY(-2px)" : "translateY(0)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          Download for macOS
          <ArrowRight size={16} />
        </a>

        <p
          style={{
            marginTop: "18px",
            fontSize: "14px",
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.body,
            opacity: 0.75,
          }}
        >
          Team or enterprise?{" "}
          <a
            href="/demo"
            style={{
              color: theme.colors.primary,
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Schedule a demo
          </a>
          <br />
          Design partner?{" "}
          <a
            href="/contact"
            style={{
              color: theme.colors.primary,
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Get in touch
          </a>
        </p>
      </motion.div>
    </section>
  );
};
