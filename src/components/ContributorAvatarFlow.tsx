"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";

interface Contributor {
  id: string;
  name: string;
  avatar: string;
  color: string;
  isBot?: boolean;
}

interface ContributorAvatarFlowProps {
  isMobile?: boolean;
}

export const ContributorAvatarFlow: React.FC<ContributorAvatarFlowProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();

  const contributorPool: Contributor[] = [
    { id: "1", name: "Alex Chen", avatar: "AC", color: "#3B82F6", isBot: false },
    { id: "2", name: "Sarah Johnson", avatar: "SJ", color: "#EC4899", isBot: false },
    { id: "3", name: "Mike Rodriguez", avatar: "MR", color: "#8B5CF6", isBot: false },
    { id: "4", name: "Claude Code", avatar: "🤖", color: "#A855F7", isBot: true },
    { id: "5", name: "Emily Zhang", avatar: "EZ", color: "#F59E0B", isBot: false },
    { id: "6", name: "David Kim", avatar: "DK", color: "#10B981", isBot: false },
    { id: "7", name: "ghostty-vouch", avatar: "👻", color: "#6366F1", isBot: true },
    { id: "8", name: "Lisa Park", avatar: "LP", color: "#EF4444", isBot: false },
  ];

  const [activeContributors, setActiveContributors] = useState<Contributor[]>([
    contributorPool[0],
    contributorPool[1],
    contributorPool[2],
  ]);

  const [newContributor, setNewContributor] = useState<Contributor | null>(null);

  // Add new contributors flowing in
  useEffect(() => {
    const interval = setInterval(() => {
      const availableContributors = contributorPool.filter(
        c => !activeContributors.find(ac => ac.id === c.id)
      );

      if (availableContributors.length > 0) {
        const randomContributor = availableContributors[
          Math.floor(Math.random() * availableContributors.length)
        ];

        setNewContributor(randomContributor);

        setTimeout(() => {
          setActiveContributors(prev => {
            const updated = [...prev, randomContributor];
            // Keep max 6 contributors
            if (updated.length > 6) {
              return updated.slice(updated.length - 6);
            }
            return updated;
          });
          setNewContributor(null);
        }, 500);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeContributors]);

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
      <div style={{ marginBottom: "20px" }}>
        <h4
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: "600",
            color: theme.colors.text,
            marginBottom: "4px",
          }}
        >
          Contributor Chain
        </h4>
        <p
          style={{
            fontSize: isMobile ? "12px" : "13px",
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.body,
            margin: 0,
          }}
        >
          See everyone who's building, as they commit
        </p>
      </div>

      {/* Avatar Chain Container */}
      <div
        style={{
          position: "relative",
          minHeight: isMobile ? "80px" : "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: theme.colors.background,
          borderRadius: "8px",
          padding: isMobile ? "16px" : "20px",
        }}
      >
        {/* Connection Line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(to right, transparent, ${theme.colors.border}, transparent)`,
            transform: "translateY(-50%)",
          }}
        />

        {/* Avatar Chain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "8px" : "12px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <AnimatePresence mode="popLayout">
            {activeContributors.map((contributor, index) => (
              <motion.div
                key={contributor.id}
                initial={{ scale: 0, x: 100, opacity: 0 }}
                animate={{ scale: 1, x: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  delay: index * 0.05,
                }}
                whileHover={{ scale: 1.2, zIndex: 10 }}
                style={{
                  position: "relative",
                }}
              >
                {/* Avatar Circle */}
                <div
                  style={{
                    width: isMobile ? "48px" : "60px",
                    height: isMobile ? "48px" : "60px",
                    borderRadius: "50%",
                    background: contributor.color,
                    border: `3px solid ${theme.colors.surface}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: contributor.isBot
                      ? (isMobile ? "20px" : "24px")
                      : (isMobile ? "14px" : "16px"),
                    fontWeight: "700",
                    color: "#FFFFFF",
                    fontFamily: theme.fonts.body,
                    cursor: "pointer",
                    position: "relative",
                    boxShadow: `0 2px 8px ${contributor.color}40`,
                  }}
                >
                  {contributor.avatar}

                  {/* Pulse effect for new contributors */}
                  {newContributor?.id === contributor.id && (
                    <motion.div
                      style={{
                        position: "absolute",
                        top: -3,
                        left: -3,
                        right: -3,
                        bottom: -3,
                        borderRadius: "50%",
                        border: `2px solid ${contributor.color}`,
                      }}
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Name tooltip */}
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: theme.colors.background,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: isMobile ? "10px" : "11px",
                    fontFamily: theme.fonts.body,
                    color: theme.colors.text,
                    whiteSpace: "nowrap",
                    opacity: 0,
                    pointerEvents: "none",
                    transition: "opacity 0.2s",
                    zIndex: 20,
                  }}
                  className="contributor-tooltip"
                >
                  {contributor.name}
                  {contributor.isBot && (
                    <span style={{ marginLeft: "4px", opacity: 0.6 }}>• Bot</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "20px",
          padding: isMobile ? "12px" : "16px",
          background: theme.colors.background,
          borderRadius: "8px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: "700",
              fontFamily: theme.fonts.heading,
              color: theme.colors.text,
            }}
          >
            {activeContributors.length}
          </div>
          <div
            style={{
              fontSize: isMobile ? "11px" : "12px",
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
            }}
          >
            Active
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: "700",
              fontFamily: theme.fonts.heading,
              color: theme.colors.text,
            }}
          >
            {activeContributors.filter(c => !c.isBot).length}
          </div>
          <div
            style={{
              fontSize: isMobile ? "11px" : "12px",
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
            }}
          >
            Human
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: "700",
              fontFamily: theme.fonts.heading,
              color: theme.colors.text,
            }}
          >
            {activeContributors.filter(c => c.isBot).length}
          </div>
          <div
            style={{
              fontSize: isMobile ? "11px" : "12px",
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
            }}
          >
            AI/Bot
          </div>
        </div>
      </div>

      <style jsx>{`
        div:hover .contributor-tooltip {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
};
