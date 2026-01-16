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
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}
      >
        {/* Main Headline */}
        <h2
          style={{
            fontSize: isMobile ? "28px" : "40px",
            fontWeight: "600",
            color: "#ffffff",
            lineHeight: "1.15",
            letterSpacing: "-0.025em",
            marginBottom: "24px",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}
        >
          Software is being built by systems,<br />not just individuals
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: "400",
            color: "#9ca3af",
            lineHeight: "1.7",
            marginBottom: "32px",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}
        >
          Agents don't write code like humans. They generate large changes,
          restructure systems, move faster than review processes, and break
          assumptions silently.
        </p>

        {/* Call to action statement */}
        <p
          style={{
            fontSize: isMobile ? "18px" : "20px",
            fontWeight: "500",
            color: "#ffffff",
            lineHeight: "1.6",
            marginBottom: "16px",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}
        >
          We need tools designed for systems that build systems.
        </p>

        {/* Final statement */}
        <p
          style={{
            fontSize: isMobile ? "18px" : "20px",
            fontWeight: "600",
            lineHeight: "1.6",
            color: "#ffffff",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #00C2FF, #0098CC)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Principal AI
          </span>{" "}
          is built for that world.
        </p>
      </motion.div>
    </section>
  );
};
