import React from 'react';
import { motion } from 'framer-motion';

export const DownloadADE: React.FC = () => {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [selectedPlatform, setSelectedPlatform] = React.useState<'macOS' | 'windows' | 'linux'>('macOS');

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const platforms = [
    {
      id: 'macOS' as const,
      label: 'macOS',
      available: true,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18c-4.51 2-5-2-7-2" />
          <path d="M18.5 8c-1 0-2 .5-2.5 1.5-.5-1-1.5-1.5-2.5-1.5-2 0-3.5 2-3.5 4.5S11.5 17 13.5 17c1 0 2-.5 2.5-1.5.5 1 1.5 1.5 2.5 1.5 2 0 3.5-2 3.5-4.5S20.5 8 18.5 8z" />
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      )
    },
    {
      id: 'windows' as const,
      label: 'Windows',
      available: false,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
        </svg>
      )
    },
    {
      id: 'linux' as const,
      label: 'Linux',
      available: false,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
        </svg>
      )
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1a1a1a",
        padding: isMobile ? "80px 24px 60px 24px" : "120px 40px 80px 40px",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: isMobile ? "48px" : isTablet ? "56px" : "64px",
            fontWeight: "600",
            color: "#06b6d4",
            textAlign: "center",
            marginBottom: "24px",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            letterSpacing: "-0.02em",
            lineHeight: "1.1",
          }}
        >
          Download ADE
        </motion.h1>

        {/* Intro Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          style={{
            textAlign: "center",
            maxWidth: "700px",
            margin: "0 auto 64px auto",
          }}
        >
          <p
            style={{
              fontSize: isMobile ? "14px" : "14px",
              fontWeight: "400",
              color: "#d1d5db",
              lineHeight: "1.6",
              marginBottom: "12px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
            }}
          >
            A native development environment that brings visual supervision and living documentation together.
          </p>
          <p
            style={{
              fontSize: isMobile ? "14px" : "14px",
              fontWeight: "400",
              color: "#a0aec0",
              lineHeight: "1.6",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
            }}
          >
            See File City, Architecture diagrams, and Quality Radar alongside your code. No context switching.
          </p>
        </motion.div>

        {/* Platform Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "80px",
            flexWrap: "wrap",
          }}
        >
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => platform.available && setSelectedPlatform(platform.id)}
              disabled={!platform.available}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: isMobile ? "16px 32px" : "20px 40px",
                background: platform.available && selectedPlatform === platform.id
                  ? "#06b6d4"
                  : platform.available
                  ? "#2a2a2a"
                  : "#1f1f1f",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                fontSize: isMobile ? "16px" : "18px",
                fontWeight: "600",
                color: platform.available ? "#ffffff" : "#6b7280",
                cursor: platform.available ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                letterSpacing: "-0.01em",
                opacity: platform.available ? 1 : 0.5,
              }}
              onMouseEnter={(e) => {
                if (platform.available && selectedPlatform !== platform.id) {
                  e.currentTarget.style.background = "#333333";
                }
              }}
              onMouseLeave={(e) => {
                if (platform.available && selectedPlatform !== platform.id) {
                  e.currentTarget.style.background = "#2a2a2a";
                }
              }}
            >
              <div style={{ display: "flex", alignItems: "center", color: platform.available ? "#ffffff" : "#6b7280" }}>
                {platform.icon}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
                <span>{platform.label}</span>
                {!platform.available && (
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "#6b7280",
                    }}
                  >
                    Coming Soon
                  </span>
                )}
              </div>
            </button>
          ))}
        </motion.div>

        {/* Latest Release Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            background: "#242424",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: isMobile ? "32px 24px" : "40px 48px",
            marginBottom: "64px",
          }}
        >
          {/* Section Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <h2
              style={{
                fontSize: isMobile ? "20px" : "24px",
                fontWeight: "600",
                color: "#ffffff",
                margin: "0",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                letterSpacing: "-0.01em",
              }}
            >
              Latest Release
            </h2>
          </div>

          {/* Release Info and Download Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              flexDirection: isMobile ? "column" : "row",
              gap: "24px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: isMobile ? "28px" : "32px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "8px",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  letterSpacing: "-0.02em",
                }}
              >
                0.0.264
              </div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "400",
                  color: "#a0aec0",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}
              >
                Released December 17, 2025
              </div>
            </div>

            <a
              href="#download"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: isMobile ? "14px 28px" : "16px 32px",
                background: "#06b6d4",
                color: "#000000",
                textDecoration: "none",
                fontSize: isMobile ? "15px" : "16px",
                fontWeight: "600",
                borderRadius: "10px",
                transition: "all 0.2s ease",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                letterSpacing: "-0.01em",
                boxShadow: "0 4px 14px rgba(6, 182, 212, 0.4)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#22d3ee";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(6, 182, 212, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#06b6d4";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(6, 182, 212, 0.4)";
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download (397.7 MB)
            </a>
          </div>
        </motion.div>

        {/* What You Get Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            marginBottom: "64px",
          }}
        >
          <h3
            style={{
              fontSize: isMobile ? "24px" : "28px",
              fontWeight: "600",
              color: "#ffffff",
              textAlign: "center",
              marginBottom: "48px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.02em",
            }}
          >
            What You Get
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(4, 1fr)",
              gap: "24px",
            }}
          >
            {/* Visual Diagrams */}
            <div
              style={{
                background: "#242424",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: isMobile ? "24px" : "28px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "rgba(6, 182, 212, 0.1)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <h4
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "8px",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  letterSpacing: "-0.01em",
                }}
              >
                Visual Diagrams
              </h4>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#a0aec0",
                  lineHeight: "1.6",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  letterSpacing: "-0.01em",
                  margin: "0",
                }}
              >
                File City, Architecture, Quality Radar rendered in real-time
              </p>
            </div>

            {/* Living Documentation */}
            <div
              style={{
                background: "#242424",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: isMobile ? "24px" : "28px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "rgba(6, 182, 212, 0.1)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h4
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "8px",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  letterSpacing: "-0.01em",
                }}
              >
                Living Documentation
              </h4>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#a0aec0",
                  lineHeight: "1.6",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  letterSpacing: "-0.01em",
                  margin: "0",
                }}
              >
                Context-aware docs that stay synced with your code
              </p>
            </div>

            {/* Integrated Chat */}
            <div
              style={{
                background: "#242424",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: isMobile ? "24px" : "28px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "rgba(6, 182, 212, 0.1)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h4
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "8px",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  letterSpacing: "-0.01em",
                }}
              >
                Integrated Chat
              </h4>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#a0aec0",
                  lineHeight: "1.6",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  letterSpacing: "-0.01em",
                  margin: "0",
                }}
              >
                Talk to Claude with full codebase context
              </p>
            </div>

            {/* Multi-Project Support */}
            <div
              style={{
                background: "#242424",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                padding: isMobile ? "24px" : "28px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  background: "rgba(6, 182, 212, 0.1)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h4
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "600",
                  color: "#ffffff",
                  marginBottom: "8px",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  letterSpacing: "-0.01em",
                }}
              >
                Multi-Project Support
              </h4>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#a0aec0",
                  lineHeight: "1.6",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  letterSpacing: "-0.01em",
                  margin: "0",
                }}
              >
                Work across multiple repositories simultaneously
              </p>
            </div>
          </div>
        </motion.div>

        {/* Discord Waitlist Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            textAlign: "center",
            padding: isMobile ? "48px 24px" : "64px 48px",
            background: "#242424",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            marginBottom: "48px",
          }}
        >
          <h3
            style={{
              fontSize: isMobile ? "24px" : "28px",
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: "16px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.02em",
            }}
          >
            Want Windows & Linux Support?
          </h3>
          <p
            style={{
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "400",
              color: "#a0aec0",
              lineHeight: "1.6",
              marginBottom: "32px",
              maxWidth: "600px",
              margin: "0 auto 32px auto",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
            }}
          >
            We're working on builds for all platforms. Join our Discord to get notified when they're ready!
          </p>
          <a
            href="https://discord.gg/principal"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: isMobile ? "14px 28px" : "16px 32px",
              background: "#5865F2",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: isMobile ? "15px" : "16px",
              fontWeight: "600",
              borderRadius: "10px",
              transition: "all 0.2s ease",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
              boxShadow: "0 4px 14px rgba(88, 101, 242, 0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#4752C4";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(88, 101, 242, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#5865F2";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(88, 101, 242, 0.4)";
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Join Waitlist on Discord
          </a>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            textAlign: "center",
            paddingTop: "48px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <p
            style={{
              fontSize: "15px",
              fontWeight: "400",
              color: "#6b7280",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
            }}
          >
            Need help or have questions? Contact our{" "}
            <a
              href="mailto:support@principal.ai"
              style={{
                color: "#06b6d4",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              support team
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
};
