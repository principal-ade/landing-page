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
                  background: "rgba(255, 255, 255, 0.02)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  padding: isMobile ? "24px" : "32px",
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? "18px" : "20px",
                    fontWeight: "600",
                    color: "#ffffff",
                    marginBottom: "20px",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  Traditional Monitoring
                </h3>
                <pre
                  style={{
                    fontSize: isMobile ? "13px" : "14px",
                    lineHeight: "1.8",
                    color: "#9ca3af",
                    fontFamily: "monospace",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                  }}
                >
<span style={{ color: "#ffffff", fontWeight: "600" }}>Execute code</span>
     ↓
Emit raw telemetry
     ↓
Store everything
     ↓
Something breaks
     ↓
<span style={{ color: "#ffffff", fontWeight: "600" }}>Search the haystack</span>
     ↓
Reconstruct what happened
     ↓
Hope you find it</pre>
              </div>

              {/* Story-Based Monitoring Card */}
              <div
                style={{
                  background: "rgba(0, 194, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(0, 194, 255, 0.2)",
                  borderRadius: "16px",
                  padding: isMobile ? "24px" : "32px",
                }}
              >
                <h3
                  style={{
                    fontSize: isMobile ? "18px" : "20px",
                    fontWeight: "600",
                    color: "#00C2FF",
                    marginBottom: "20px",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  Story-Based Monitoring
                </h3>
                <pre
                  style={{
                    fontSize: isMobile ? "13px" : "14px",
                    lineHeight: "1.8",
                    color: "#9ca3af",
                    fontFamily: "monospace",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                  }}
                >
<span style={{ color: "#ffffff", fontWeight: "600" }}>Start from what should happen</span>
     ↓
Run the code
     ↓
See the story of what did
     ↓
<span style={{ color: "#ffffff", fontWeight: "600" }}>Every divergence surfaced</span>
     ↓
Root cause in minutes

<span style={{ color: "#00C2FF" }}>Not after the fire.
Before the smoke.</span></pre>
              </div>
            </div>
          </motion.div>
      </div>
    </section>
  );
};
