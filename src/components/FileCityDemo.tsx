"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";

interface FileBlock {
  id: string;
  name: string;
  size: number;
  color: "default" | "modified" | "new";
}

interface FileCityDemoProps {
  isMobile?: boolean;
}

export const FileCityDemo: React.FC<FileCityDemoProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();

  const [files, setFiles] = useState<FileBlock[]>([
    { id: "1", name: "App.tsx", size: 150, color: "default" },
    { id: "2", name: "index.ts", size: 80, color: "default" },
    { id: "3", name: "utils.ts", size: 120, color: "default" },
    { id: "4", name: "api.ts", size: 200, color: "default" },
    { id: "5", name: "styles.css", size: 100, color: "default" },
    { id: "6", name: "config.json", size: 60, color: "default" },
    { id: "7", name: "README.md", size: 90, color: "default" },
    { id: "8", name: "types.ts", size: 110, color: "default" },
    { id: "9", name: "hooks.ts", size: 130, color: "default" },
    { id: "10", name: "components", size: 180, color: "default" },
    { id: "11", name: "server.ts", size: 140, color: "default" },
    { id: "12", name: "db.ts", size: 95, color: "default" },
  ]);

  const [activeCommit, setActiveCommit] = useState<string | null>(null);

  // Simulate commits coming in
  useEffect(() => {
    const commitInterval = setInterval(() => {
      const fileIndex = Math.floor(Math.random() * files.length);
      const isNew = Math.random() > 0.8;

      setFiles(prev => prev.map((file, index) => {
        if (index === fileIndex) {
          const newColor = isNew ? "new" : "modified";
          setActiveCommit(file.id);

          // Reset after animation
          setTimeout(() => {
            setActiveCommit(null);
          }, 1500);

          return { ...file, color: newColor };
        }
        return file;
      }));

      // Reset colors after a while
      setTimeout(() => {
        setFiles(prev => prev.map((file, index) =>
          index === fileIndex ? { ...file, color: "default" } : file
        ));
      }, 3000);
    }, 2500);

    return () => clearInterval(commitInterval);
  }, [files.length]);

  const getColor = (color: "default" | "modified" | "new") => {
    switch (color) {
      case "modified":
        return "#FF8C42"; // Orange
      case "new":
        return "#4ADE80"; // Green
      default:
        return theme.colors.border;
    }
  };

  // Calculate grid layout
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <div
      style={{
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "12px",
        padding: isMobile ? "20px" : "24px",
        marginBottom: "32px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <h4
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: "600",
            color: theme.colors.text,
            marginBottom: "4px",
          }}
        >
          Live File City Map Demo
        </h4>
        <p
          style={{
            fontSize: isMobile ? "12px" : "13px",
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.body,
            margin: 0,
          }}
        >
          Watch files light up as commits arrive
        </p>
      </div>

      {/* Treemap Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "8px",
          marginBottom: "16px",
          background: theme.colors.background,
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        {files.map((file) => {
          const flexSize = (file.size / totalSize) * 12;

          return (
            <motion.div
              key={file.id}
              style={{
                gridColumn: `span ${Math.max(1, Math.round(flexSize))}`,
                background: getColor(file.color),
                borderRadius: "4px",
                padding: isMobile ? "12px" : "16px",
                border: activeCommit === file.id
                  ? `2px solid ${file.color === "new" ? "#4ADE80" : "#FF8C42"}`
                  : `1px solid ${theme.colors.border}`,
                position: "relative",
                overflow: "hidden",
                minHeight: isMobile ? "60px" : "80px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              animate={{
                scale: activeCommit === file.id ? 1.05 : 1,
                boxShadow: activeCommit === file.id
                  ? `0 0 20px ${file.color === "new" ? "rgba(74, 222, 128, 0.4)" : "rgba(255, 140, 66, 0.4)"}`
                  : "none",
              }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* File name */}
              <span
                style={{
                  fontSize: isMobile ? "10px" : "11px",
                  fontFamily: theme.fonts.body,
                  fontWeight: "600",
                  color: file.color !== "default" ? "#FFFFFF" : theme.colors.text,
                  wordBreak: "break-word",
                  opacity: 0.9,
                }}
              >
                {file.name}
              </span>

              {/* Size indicator */}
              <span
                style={{
                  fontSize: isMobile ? "9px" : "10px",
                  fontFamily: "monospace",
                  color: file.color !== "default" ? "#FFFFFF" : theme.colors.textSecondary,
                  opacity: 0.7,
                }}
              >
                {file.size} lines
              </span>

              {/* Pulse effect on active */}
              <AnimatePresence>
                {activeCommit === file.id && (
                  <motion.div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: file.color === "new"
                        ? "rgba(74, 222, 128, 0.2)"
                        : "rgba(255, 140, 66, 0.2)",
                      borderRadius: "4px",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, repeat: 1 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: isMobile ? "12px" : "16px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "2px",
              background: "#FF8C42",
            }}
          />
          <span
            style={{
              fontSize: isMobile ? "11px" : "12px",
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
            }}
          >
            Modified
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "2px",
              background: "#4ADE80",
            }}
          />
          <span
            style={{
              fontSize: isMobile ? "11px" : "12px",
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
            }}
          >
            New File
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "2px",
              background: theme.colors.border,
            }}
          />
          <span
            style={{
              fontSize: isMobile ? "11px" : "12px",
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
            }}
          >
            Unchanged
          </span>
        </div>
      </div>
    </div>
  );
};
