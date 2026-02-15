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
        padding: isMobile ? "60px 24px" : "80px 40px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: "#9ca3af",
                lineHeight: "1.7",
                marginBottom: "24px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              You get paged at 3am. Dashboards are green. Logs say success. Nothing looks wrong.
            </p>

            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: "#9ca3af",
                lineHeight: "1.7",
                marginBottom: "32px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              Six hours later, finance calls. Payments went through without fraud checks. Thousands of transactions. No alert ever fired.
            </p>

            <p
              style={{
                fontSize: isMobile ? "18px" : "20px",
                color: "#ffffff",
                lineHeight: "1.6",
                marginBottom: "24px",
                fontWeight: "600",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              The system worked perfectly. It just didn't do what anyone intended.
            </p>

            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: "#9ca3af",
                lineHeight: "1.7",
                marginBottom: "24px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              That's a silent failure. Code that passes every check but breaks the business. Your monitoring can't see it because it was never built to ask "did this do what we meant?"
            </p>

            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: "#9ca3af",
                lineHeight: "1.7",
                marginBottom: "32px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              And you're paying $300K+ a month for that blind spot. Most of it storing the same log line repeated millions of times with slightly different variables. When something breaks, you're searching a haystack you paid to build.
            </p>

            <p
              style={{
                fontSize: isMobile ? "18px" : "20px",
                color: "#ffffff",
                lineHeight: "1.6",
                fontWeight: "600",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              More agents. More code. More logs. Same size team. The tools get more expensive and less useful at the same time.
            </p>
          </motion.div>
      </div>
    </section>
  );
};
