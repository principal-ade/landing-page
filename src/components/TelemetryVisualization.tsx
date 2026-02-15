import React from "react";
import { motion } from "framer-motion";

interface TelemetryVisualizationProps {
  isMobile?: boolean;
}

export const TelemetryVisualization: React.FC<TelemetryVisualizationProps> = ({
  isMobile = false,
}) => {
  return (
    <section
      style={{
        padding: isMobile ? "0 24px" : "0 40px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#ec4899",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              Production Monitoring
            </p>
            <h2
              style={{
                fontSize: isMobile ? "28px" : "40px",
                fontWeight: "600",
                color: "#ffffff",
                lineHeight: "1.15",
                letterSpacing: "-0.025em",
                marginBottom: "20px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              See the story, not the logs
            </h2>
            <p
              style={{
                fontSize: isMobile ? "14px" : "15px",
                color: "#9ca3af",
                lineHeight: "1.6",
                marginBottom: "32px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              System Stories turn production behavior into something you can actually read. Expected vs. actual. Where it diverged. Why it broke. <strong style={{ fontWeight: "700", color: "#ffffff" }}>Root cause in minutes, not hours.</strong>
            </p>

            {/* CTA Button */}
            <a
              href="/game"
              style={{
                backgroundColor: "transparent",
                color: "#00C2FF",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid #00C2FF",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                transition: "background-color 0.2s ease, color 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#00C2FF";
                e.currentTarget.style.color = "#000000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#00C2FF";
              }}
            >
              Try the Demo
              <span>→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
