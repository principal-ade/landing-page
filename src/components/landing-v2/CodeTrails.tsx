"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";

interface CodeTrailsProps {
  isMobile?: boolean;
  title?: string;
  description?: string;
}

export const CodeTrails: React.FC<CodeTrailsProps> = ({
  isMobile = false,
  title = "Code Trails",
  description = "Visualize the journey of your code through execution paths and dependencies",
}) => {
  const { theme } = useTheme();
  const [activeTrail, setActiveTrail] = React.useState<number | null>(null);

  const trails = [
    {
      id: 1,
      name: "Authentication Flow",
      steps: ["Login", "Validate", "Token", "Success"],
      color: theme.colors.primary,
    },
    {
      id: 2,
      name: "Data Pipeline",
      steps: ["Fetch", "Transform", "Validate", "Store"],
      color: "#10b981",
    },
    {
      id: 3,
      name: "API Request",
      steps: ["Route", "Middleware", "Handler", "Response"],
      color: "#f59e0b",
    },
  ];

  return (
    <section
      style={{
        padding: isMobile ? "60px 24px" : "80px 64px",
        background: theme.colors.background,
        minHeight: "600px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "60px" }}
      >
        <h2
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: isMobile ? "36px" : "48px",
            fontWeight: "700",
            letterSpacing: "-0.03em",
            color: theme.colors.text,
            marginBottom: "16px",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: isMobile ? "16px" : "20px",
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.body,
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          {description}
        </p>
      </motion.div>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "32px" : "48px",
          justifyContent: "center",
          alignItems: "flex-start",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {trails.map((trail, trailIndex) => (
          <motion.div
            key={trail.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: trailIndex * 0.1 }}
            onMouseEnter={() => setActiveTrail(trail.id)}
            onMouseLeave={() => setActiveTrail(null)}
            style={{
              flex: 1,
              padding: "24px",
              borderRadius: "12px",
              border: `1px solid ${
                activeTrail === trail.id ? trail.color : theme.colors.border
              }`,
              background:
                activeTrail === trail.id
                  ? `${trail.color}08`
                  : theme.colors.backgroundSecondary,
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
          >
            <h3
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: "20px",
                fontWeight: "600",
                color: theme.colors.text,
                marginBottom: "24px",
              }}
            >
              {trail.name}
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {trail.steps.map((step, stepIndex) => (
                <React.Fragment key={stepIndex}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: trailIndex * 0.1 + stepIndex * 0.1,
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background:
                          activeTrail === trail.id
                            ? trail.color
                            : theme.colors.border,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: activeTrail === trail.id ? "#fff" : theme.colors.text,
                        transition: "all 0.3s ease",
                        fontFamily: theme.fonts.body,
                      }}
                    >
                      {stepIndex + 1}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        padding: "8px 16px",
                        borderRadius: "6px",
                        background: theme.colors.background,
                        fontSize: "15px",
                        fontFamily: theme.fonts.body,
                        color: theme.colors.text,
                      }}
                    >
                      {step}
                    </div>
                  </motion.div>

                  {stepIndex < trail.steps.length - 1 && (
                    <div
                      style={{
                        width: "2px",
                        height: "16px",
                        background:
                          activeTrail === trail.id
                            ? trail.color
                            : theme.colors.border,
                        marginLeft: "15px",
                        transition: "all 0.3s ease",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
