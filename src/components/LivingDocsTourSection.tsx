"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useTheme } from "@principal-ade/industry-theme";
import { X } from "lucide-react";
import "@principal-ade/living-documentation-tour/styles.css";
import "driver.js/dist/driver.css";

// Dynamically import the tour component to avoid SSR issues
const TourableEditorLayout = dynamic(
  () =>
    import("@principal-ade/living-documentation-tour").then(
      (mod) => mod.TourableEditorLayout,
    ),
  { ssr: false },
);

export const LivingDocsTourSection: React.FC = () => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <>
      {/* Button Section */}
      <div
        id="interactive-tour-section"
        style={{
          background: "#000000",
          padding: "100px 20px",
          scrollMarginTop: "80px",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: "600",
                margin: "0 0 16px 0",
                color: "#ffffff",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                letterSpacing: "-0.02em",
                lineHeight: "1.2",
              }}
            >
              Experience Living Documentation
            </h3>

            <p
              style={{
                fontSize: "18px",
                color: "#9ca3af",
                marginBottom: "32px",
                lineHeight: "1.6",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Take an interactive tour to see how documentation, code
              visualization, and AI work together in a unified interface
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                padding: "16px 32px",
                fontSize: "18px",
                fontWeight: "600",
                color: "#ffffff",
                background: "linear-gradient(135deg, #00c2ff 0%, #0080ff 100%)",
                border: "none",
                cursor: "pointer",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 20px rgba(0, 194, 255, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 30px rgba(0, 194, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0, 194, 255, 0.3)";
              }}
            >
              Take a Tour
            </button>
          </motion.div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              background: "#000000",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                zIndex: 10000,
                background: "rgba(0, 0, 0, 0.8)",
                border: "1px solid rgba(0, 194, 255, 0.3)",
                borderRadius: "50%",
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 194, 255, 0.2)";
                e.currentTarget.style.borderColor = "#00c2ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.8)";
                e.currentTarget.style.borderColor = "rgba(0, 194, 255, 0.3)";
              }}
            >
              <X size={24} color="#ffffff" />
            </button>

            {/* Tour Content */}
            <div style={{ width: "100%", height: "100vh" }}>
              {mounted && (
                <TourableEditorLayout
                  autoStart={true}
                  theme="dark"
                  onTourComplete={() => {
                    console.log("Tour completed!");
                    setIsModalOpen(false);
                  }}
                  onTourClose={() => {
                    console.log("Tour closed!");
                    setIsModalOpen(false);
                  }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
