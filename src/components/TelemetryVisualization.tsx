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
              And you're paying thousands a month for that blind spot. Most of it storing the same log line repeated millions of times with slightly different variables. When something breaks, you're searching a haystack you paid to build.
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

            {/* Comparison Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? "24px" : "32px",
                marginTop: "64px",
              }}
            >
              {/* Traditional Monitoring Card */}
              <div
                style={{
                  background: "rgba(139, 69, 69, 0.15)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "16px",
                  padding: isMobile ? "28px" : "36px",
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? "11px" : "12px",
                    fontWeight: "600",
                    color: "#ef4444",
                    marginBottom: "28px",
                    fontFamily: "monospace",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Traditional Monitoring
                </h3>
                <div
                  style={{
                    fontSize: isMobile ? "14px" : "15px",
                    lineHeight: "2.2",
                    color: "#9ca3af",
                    fontFamily: "monospace",
                  }}
                >
                  <div style={{ color: "#ffffff" }}>Execute code</div>
                  <div style={{ paddingLeft: "20px" }}>↓</div>
                  <div>Emit raw telemetry</div>
                  <div style={{ paddingLeft: "20px" }}>↓</div>
                  <div>Store everything</div>
                  <div style={{ paddingLeft: "20px" }}>↓</div>
                  <div>Something breaks</div>
                  <div style={{ paddingLeft: "20px" }}>↓</div>
                  <div style={{ color: "#ffffff" }}>Search the haystack</div>
                  <div style={{ paddingLeft: "20px" }}>↓</div>
                  <div>Reconstruct what happened</div>
                  <div style={{ paddingLeft: "20px" }}>↓</div>
                  <div>Hope you find it</div>
                </div>
              </div>

              {/* Story-Based Monitoring Card */}
              <div
                style={{
                  background: "rgba(6, 78, 89, 0.3)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(0, 194, 255, 0.4)",
                  borderRadius: "16px",
                  padding: isMobile ? "28px" : "36px",
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? "11px" : "12px",
                    fontWeight: "600",
                    color: "#00C2FF",
                    marginBottom: "28px",
                    fontFamily: "monospace",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Story-Based Monitoring
                </h3>
                <div
                  style={{
                    fontSize: isMobile ? "14px" : "15px",
                    lineHeight: "2.2",
                    color: "#9ca3af",
                    fontFamily: "monospace",
                  }}
                >
                  <div style={{ color: "#ffffff" }}>Start from what should happen</div>
                  <div style={{ paddingLeft: "20px" }}>↓</div>
                  <div>Run the code</div>
                  <div style={{ paddingLeft: "20px" }}>↓</div>
                  <div>See the story of what did</div>
                  <div style={{ paddingLeft: "20px" }}>↓</div>
                  <div style={{ color: "#ffffff" }}>Every divergence surfaced</div>
                  <div style={{ paddingLeft: "20px" }}>↓</div>
                  <div>Root cause in minutes</div>
                  <div style={{ marginTop: "24px", color: "#00C2FF" }}>
                    Not after the fire.
                    <br />
                    Before the smoke.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
      </div>
    </section>
  );
};
