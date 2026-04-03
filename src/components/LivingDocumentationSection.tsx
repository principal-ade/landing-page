"use client";

import { motion } from "framer-motion";
import React from "react";
import { useTheme } from "@principal-ade/industry-theme";

export function LivingDocumentationSection() {
  const { theme } = useTheme();
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <section
      style={{
        padding: isMobile ? "80px 24px" : isTablet ? "100px 40px" : "120px 40px",
        background: "linear-gradient(180deg, #0a0e1a 0%, #1a2332 100%)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "48px" : "80px",
            alignItems: "center",
          }}
        >
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              flex: "1 1 50%",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            {/* Folder Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 24px",
                background: "rgba(6, 182, 212, 0.1)",
                border: "1px solid rgba(6, 182, 212, 0.3)",
                borderRadius: "12px",
                width: "fit-content",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <span
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "600",
                  color: "#ffffff",
                  fontFamily: theme.fonts.body,
                }}
              >
                The <span style={{ color: "#06b6d4" }}>.alexandria/</span> Folder
              </span>
            </div>

            {/* Headline */}
            <h2
              style={{
                fontSize: isMobile ? "32px" : isTablet ? "40px" : "48px",
                fontWeight: "600",
                color: "#ffffff",
                lineHeight: "1.1",
                letterSpacing: "-0.02em",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                margin: "0",
              }}
            >
              Living Documentation is the Key to Context Engineering
            </h2>

            {/* Body Copy */}
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                fontWeight: "400",
                color: "#d1d5db",
                lineHeight: "1.6",
                letterSpacing: "-0.01em",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                margin: "0",
              }}
            >
              Other tools store context in the cloud. We store it in Git.{" "}
              <span style={{ color: "#ffffff" }}>That's not a feature difference—it's architectural.</span> Architecture diagrams, API specs, decision records—all version-controlled with your code. When implementation changes, documentation is flagged for review. Context that stays current.
            </p>

            {/* Quote */}
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                fontWeight: "400",
                color: "#a0aec0",
                lineHeight: "1.6",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                margin: "32px 0 0 0",
                fontStyle: "italic",
              }}
            >
              "Context versioned with code, not buried in Confluence."
            </p>
          </motion.div>

          {/* Right Side - Code Editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              flex: "1 1 50%",
              background: "#0d1117",
              border: "1px solid rgba(6, 182, 212, 0.2)",
              borderRadius: "12px",
              padding: isMobile ? "24px" : "32px",
              fontFamily: "'Monaco', 'Courier New', monospace",
              fontSize: isMobile ? "12px" : "14px",
              color: "#8b949e",
              lineHeight: "1.8",
            }}
          >
            {/* File Tree Header */}
            <div style={{ marginBottom: "20px", color: "#06b6d4", fontSize: "13px" }}>
              # Your Repository
            </div>

            {/* File Tree */}
            <div style={{ paddingLeft: "0" }}>
              <div>repo-root/</div>
              <div style={{ paddingLeft: "20px" }}>├─ src/</div>
              <div style={{ paddingLeft: "20px" }}>├─ tests/</div>
              <div style={{ paddingLeft: "20px" }}>├─ package.json</div>
              <div style={{ paddingLeft: "20px", color: "#06b6d4", marginTop: "8px" }}>
                └─ .alexandria/
              </div>
              <div style={{ paddingLeft: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>├─ app.md</span>
                <span style={{ color: "#58a6ff", fontSize: "12px", fontStyle: "italic" }}>Main entry point</span>
              </div>
              <div style={{ paddingLeft: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>├─ api_gateway.md</span>
                <span style={{ color: "#58a6ff", fontSize: "12px", fontStyle: "italic" }}>API layer</span>
              </div>
              <div style={{ paddingLeft: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>├─ database.md</span>
                <span style={{ color: "#58a6ff", fontSize: "12px", fontStyle: "italic" }}>Data schema</span>
              </div>
              <div style={{ paddingLeft: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>├─ auth_service.md</span>
                <span style={{ color: "#58a6ff", fontSize: "12px", fontStyle: "italic" }}>Authentication</span>
              </div>
              <div style={{ paddingLeft: "40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>└─ metadata.yaml</span>
                <span style={{ color: "#58a6ff", fontSize: "12px", fontStyle: "italic" }}>Keeps it current</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
