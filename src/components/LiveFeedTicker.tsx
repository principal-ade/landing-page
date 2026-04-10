"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";

interface TickerItem {
  id: string;
  text: string;
}

const generateTickerItems = (): TickerItem[] => {
  const commits = [
    "sarah/react-hooks: feat: add useLocalStorage",
    "alex/api-server: fix authentication bug",
    "jordan/mobile-app: refactor navigation",
    "casey/dashboard: add dark mode support",
    "morgan/analytics: optimize queries",
    "taylor/design-system: update components",
    "riley/auth-service: improve security",
    "avery/docs: update API guide",
    "quinn/backend: add caching layer",
    "sam/frontend: fix mobile layout",
  ];

  return commits.map((commit, i) => ({
    id: `commit-${i}`,
    text: commit,
  }));
};

export const LiveFeedTicker: React.FC = () => {
  const { theme } = useTheme();
  const [items] = useState(generateTickerItems());

  // Duplicate items for seamless loop
  const allItems = [...items, ...items, ...items];

  return (
    <a
      href="https://app.principal-ade.com/"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        width: "100%",
        background: "#0d274d",
        padding: "14px 0",
        overflow: "hidden",
        position: "relative",
        borderTop: "1px solid #0d274d",
        borderBottom: "1px solid #0d274d",
        cursor: "pointer",
        textDecoration: "none",
        transition: "background 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#0d274ddd";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#0d274d";
      }}
    >
      <motion.div
        style={{
          display: "flex",
          gap: "48px",
          alignItems: "center",
          whiteSpace: "nowrap",
        }}
        animate={{
          x: [0, -1920], // Adjust based on content width
        }}
        transition={{
          x: {
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {allItems.map((item, index) => (
          <React.Fragment key={`${item.id}-${index}`}>
            {/* Commit Item */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: "#FFFFFF",
                  fontFamily: theme.fonts.body,
                  fontWeight: "500",
                }}
              >
                {item.text}
              </span>
            </div>

            {/* Live Now Indicator between each commit */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: theme.colors.primary,
                  fontFamily: theme.fonts.body,
                }}
              >
                •
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: theme.colors.primary,
                  fontFamily: theme.fonts.body,
                }}
              >
                Watch Now
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: theme.colors.primary,
                  fontFamily: theme.fonts.body,
                }}
              >
                •
              </span>
            </div>
          </React.Fragment>
        ))}
      </motion.div>

    </a>
  );
};
