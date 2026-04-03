import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";

interface ANewMediumProps {
  isMobile?: boolean;
}

export const ANewMedium: React.FC<ANewMediumProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  return (
    <section
      style={{
        padding: isMobile ? "0 24px" : "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "1000px", textAlign: "center" }}>
        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: isMobile ? "28px" : "48px",
            fontWeight: "600",
            color: "#ffffff",
            lineHeight: "1.15",
            letterSpacing: "-0.025em",
            marginBottom: isMobile ? "56px" : "80px",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          A new workflow for an
          <br />
          agent-driven world.
        </motion.h2>

        {/* Three-step workflow */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? "40px" : "48px",
            marginBottom: isMobile ? "56px" : "80px",
            textAlign: "center",
          }}
        >
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div
              style={{
                fontSize: isMobile ? "48px" : "64px",
                fontWeight: "600",
                color: "#0099FF",
                marginBottom: "16px",
                fontFamily: theme.fonts.body,
              }}
            >
              1
            </div>
            <p
              style={{
                fontSize: isMobile ? "18px" : "20px",
                fontWeight: "500",
                color: "#ffffff",
                marginBottom: "8px",
                fontFamily: theme.fonts.body,
              }}
            >
              See the system
            </p>
            <p
              style={{
                fontSize: isMobile ? "14px" : "15px",
                fontWeight: "400",
                color: "#9ca3af",
                lineHeight: "1.5",
                fontFamily: theme.fonts.body,
              }}
            >
              Map the codebase. Understand the shape.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              style={{
                fontSize: isMobile ? "48px" : "64px",
                fontWeight: "600",
                color: "#0099FF",
                marginBottom: "16px",
                fontFamily: theme.fonts.body,
              }}
            >
              2
            </div>
            <p
              style={{
                fontSize: isMobile ? "18px" : "20px",
                fontWeight: "500",
                color: "#ffffff",
                marginBottom: "8px",
                fontFamily: theme.fonts.body,
              }}
            >
              Let agents build
            </p>
            <p
              style={{
                fontSize: isMobile ? "14px" : "15px",
                fontWeight: "400",
                color: "#9ca3af",
                lineHeight: "1.5",
                fontFamily: theme.fonts.body,
              }}
            >
              Let them move fast.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div
              style={{
                fontSize: isMobile ? "48px" : "64px",
                fontWeight: "600",
                color: "#0099FF",
                marginBottom: "16px",
                fontFamily: theme.fonts.body,
              }}
            >
              3
            </div>
            <p
              style={{
                fontSize: isMobile ? "18px" : "20px",
                fontWeight: "500",
                color: "#ffffff",
                marginBottom: "8px",
                fontFamily: theme.fonts.body,
              }}
            >
              Review what actually happened
            </p>
            <p
              style={{
                fontSize: isMobile ? "14px" : "15px",
                fontWeight: "400",
                color: "#9ca3af",
                lineHeight: "1.5",
                fontFamily: theme.fonts.body,
              }}
            >
              Not in diffs. Not in logs. In behavior.
            </p>
          </motion.div>
        </div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p
            style={{
              fontSize: isMobile ? "18px" : "22px",
              fontWeight: "500",
              color: "#ffffff",
              lineHeight: "1.5",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            You don't read logs.
            <br />
            You watch the system run.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
