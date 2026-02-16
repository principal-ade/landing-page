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
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
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
              color: "#ffffff",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            Three features. One platform.
          </p>
          <h2
            style={{
              fontSize: isMobile ? "32px" : "48px",
              fontWeight: "600",
              lineHeight: "1.15",
              letterSpacing: "-0.025em",
              marginBottom: "24px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            <span style={{ color: "#00C2FF" }}>Story-based software</span>
            <br />
            <span style={{ color: "#9ca3af" }}>from dev to production.</span>
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
            See all features →
          </a>
        </motion.div>

        {/* Feature Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? "24px" : "32px",
            width: "100%",
            boxSizing: "border-box",
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
                width: "100%",
                boxSizing: "border-box",
                overflowWrap: "break-word",
                wordBreak: "break-word",
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

        {/* Statistics Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? "24px" : "32px",
            marginTop: isMobile ? "80px" : "120px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {[
            {
              percentage: "59%",
              description: "of developers ship AI code\nthey don't fully understand",
            },
            {
              percentage: "67%",
              description: "more time debugging\nAI-generated code",
            },
            {
              percentage: "91%",
              description: "have unresolved bugs\nthey can't reproduce",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.percentage}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: isMobile ? "32px 28px" : "40px 32px",
                textAlign: "center",
                width: "100%",
                boxSizing: "border-box",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? "48px" : "56px",
                  fontWeight: "600",
                  color: "#00C2FF",
                  marginBottom: "16px",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}
              >
                {stat.percentage}
              </div>
              <p
                style={{
                  fontSize: isMobile ? "14px" : "15px",
                  color: "#9ca3af",
                  lineHeight: "1.6",
                  whiteSpace: "pre-line",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}
              >
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
