import React from "react";
import { motion } from "framer-motion";

interface AgentShiftProps {
  isMobile?: boolean;
}

export const AgentShift: React.FC<AgentShiftProps> = ({ isMobile = false }) => {
  const features = [
    {
      label: "PRODUCTION",
      labelColor: "#00C2FF",
      title: "System Stories",
      description: "Your production system tells its own story. Expected vs. actual behavior. Where it diverged. Why it broke. Root cause in minutes, not hours of log diving.",
    },
    {
      label: "UNDERSTANDING",
      labelColor: "#10b981",
      title: "File City",
      description: "Your codebase as an interactive city. Structure, composition, complexity, what's changing — all visible at once. Understand in seconds what used to take weeks of onboarding.",
    },
    {
      label: "HEALTH",
      labelColor: "#a855f7",
      title: "Quality Radar",
      description: "Continuous code health assessment. Surface comprehension debt before it compounds. See which parts of your system are understood and which are drifting.",
    },
  ];

  return (
    <section
      style={{
        padding: isMobile ? "0 24px" : "0 40px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: "900px", margin: "0 auto 64px auto", textAlign: "center" }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: isMobile ? "11px" : "12px",
              color: "#00C2FF",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            Three products. One platform.
          </p>
          <h2
            style={{
              fontSize: isMobile ? "32px" : "48px",
              fontWeight: "600",
              color: "#ffffff",
              lineHeight: "1.15",
              letterSpacing: "-0.025em",
              marginBottom: "24px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            Story-based software from dev to production.
          </h2>
          <a
            href="/product"
            style={{
              fontSize: isMobile ? "15px" : "16px",
              fontWeight: "500",
              color: "#00C2FF",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#00d4ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#00C2FF";
            }}
          >
            See all products →
          </a>
        </motion.div>

        {/* Feature Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? "24px" : "32px",
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: isMobile ? "28px" : "32px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  background: `${feature.labelColor}33`,
                  borderRadius: "6px",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: feature.labelColor,
                    letterSpacing: "0.1em",
                    fontFamily: "monospace",
                  }}
                >
                  {feature.label}
                </span>
              </div>
              <h3
                style={{
                  fontSize: isMobile ? "24px" : "28px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "16px",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: isMobile ? "15px" : "16px",
                  color: "#9ca3af",
                  lineHeight: "1.7",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
