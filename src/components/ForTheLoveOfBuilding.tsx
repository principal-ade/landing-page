"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from '@principal-ade/industry-theme';
import { Logo } from '@principal-ai/logo-component';
import { Download } from 'lucide-react';
import { ExplanationSection } from './demo/ExplanationSection';

export const ForTheLoveOfBuilding: React.FC = () => {
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

  return (
    <div
      style={{
        background: theme.colors.background,
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile ? "80px 24px" : "120px 40px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "32px",
            }}
          >
            <Logo
              width={isMobile ? 80 : 100}
              height={isMobile ? 80 : 100}
              color={theme.colors.primary}
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: isMobile ? "48px" : "72px",
              fontWeight: "700",
              color: theme.colors.text,
              textAlign: "center",
              marginBottom: isMobile ? "32px" : "40px",
              lineHeight: "1.05",
              fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
              letterSpacing: "-0.04em",
            }}
          >
            For the Love<br />of Building.
          </motion.h1>

          {/* Opening */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center" }}
          >
            <p style={{
              fontSize: isMobile ? "18px" : "22px",
              lineHeight: "1.7",
              color: theme.colors.text,
              fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
              maxWidth: "800px",
              margin: "0 auto 32px",
              fontWeight: "400",
            }}>
              The best builders don't want to code less.
              <br />
              They want to understand more.
            </p>
            <p style={{
              fontSize: isMobile ? "16px" : "18px",
              lineHeight: "1.7",
              color: theme.colors.textSecondary,
              fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
              maxWidth: "700px",
              margin: "0 auto 40px",
              fontWeight: "400",
            }}>
              You're coding differently now. It's time to see differently too.
            </p>

            {/* Download CTA */}
            <a
              href="https://principal-ade.com/download"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: theme.colors.primary,
                color: theme.colors.textOnPrimary,
                padding: isMobile ? "14px 32px" : "16px 40px",
                borderRadius: "8px",
                fontSize: isMobile ? "16px" : "17px",
                fontWeight: "600",
                textDecoration: "none",
                fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 16px ${theme.colors.primary}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Download Principal AI
              <Download size={20} strokeWidth={2} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Text Only */}
      <section
        style={{
          padding: isMobile ? "60px 24px 80px" : "80px 40px 120px",
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <div style={{ maxWidth: "740px", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* What is Principal AI */}
            <p style={{
              fontSize: isMobile ? "17px" : "20px",
              lineHeight: "1.7",
              color: theme.colors.text,
              fontFamily: theme.fonts.body,
              marginBottom: "32px",
              fontWeight: "400",
            }}>
              <strong style={{ color: theme.colors.primary }}>Principal AI</strong> makes your codebase visible. In a way you might not be used to. Yet. Not just the code though, the structure, the history, the behavior. Everything agents change, everything humans need to supervise. In development. In production.
            </p>

            <p style={{
              fontSize: isMobile ? "16px" : "18px",
              lineHeight: "1.7",
              color: theme.colors.text,
              fontFamily: theme.fonts.body,
              marginBottom: "12px",
              fontWeight: "600",
            }}>
              Built for agents. Optimized for humans.
            </p>

            <p style={{
              fontSize: isMobile ? "15px" : "17px",
              lineHeight: "1.7",
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.body,
              marginBottom: "56px",
            }}>
              Because you're still the boss of AI.
            </p>

          </motion.div>

          {/* Product Cards */}
          <ExplanationSection />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >

            {/* Closing paragraph */}
            <p style={{
              fontSize: isMobile ? "17px" : "20px",
              lineHeight: "1.7",
              color: theme.colors.text,
              fontFamily: theme.fonts.body,
              marginBottom: "48px",
              fontWeight: "400",
            }}>
              Principal shows you what's actually happening. In your codebase. Right now. The files your agents touched. The behavior they produced. Whether what ran matched what you meant.
            </p>

            {/* CTA */}
            <div style={{ textAlign: "center" }}>
              <p style={{
                fontSize: isMobile ? "18px" : "20px",
                lineHeight: "1.5",
                color: theme.colors.text,
                fontFamily: theme.fonts.body,
                marginBottom: "28px",
                fontWeight: "500",
              }}>
                Ready to see your code differently?
              </p>
              <Link
                href="/#access"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.textOnPrimary,
                  padding: "16px 40px",
                  borderRadius: "8px",
                  fontSize: "17px",
                  fontWeight: "600",
                  textDecoration: "none",
                  fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
                  transition: "all 0.2s ease",
                }}
              >
                Download
                <Download size={20} strokeWidth={2} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};
