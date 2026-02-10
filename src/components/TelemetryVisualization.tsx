import React from "react";
import { motion } from "framer-motion";

interface TelemetryVisualizationProps {
  isMobile?: boolean;
}

export const TelemetryVisualization: React.FC<TelemetryVisualizationProps> = ({
  isMobile = false,
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handlePlayClick = () => {
    setIsModalOpen(true);
    // Small delay to ensure modal is rendered before playing
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 100);
  };

  const handleCloseModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsModalOpen(false);
  };

  return (
    <section
      style={{
        padding: isMobile ? "0 24px" : "0 40px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Two Column Layout */}
        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "48px" : "60px",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {/* Left side - Title and Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#ec4899",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              Production Monitoring
            </p>
            <h2
              style={{
                fontSize: isMobile ? "28px" : "40px",
                fontWeight: "600",
                color: "#ffffff",
                lineHeight: "1.15",
                letterSpacing: "-0.025em",
                marginBottom: "20px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              See the story, not the logs
            </h2>
            <p
              style={{
                fontSize: isMobile ? "14px" : "15px",
                color: "#9ca3af",
                lineHeight: "1.6",
                marginBottom: "32px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              System Stories turn production behavior into something you can actually read. Expected vs. actual. Where it diverged. Why it broke. <strong style={{ fontWeight: "700", color: "#ffffff" }}>Root cause in minutes, not hours.</strong>
            </p>

            {/* CTA Button */}
            <a
              href="https://app.principal-ade.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "transparent",
                color: "#00C2FF",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "1px solid #00C2FF",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                transition: "background-color 0.2s ease, color 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#00C2FF";
                e.currentTarget.style.color = "#000000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#00C2FF";
              }}
            >
              Get Early Access
              <span>→</span>
            </a>
          </motion.div>

          {/* Right side - Video Thumbnail */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: "16px",
              border: "1px solid rgba(0, 194, 255, 0.2)",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 4px 16px rgba(0, 194, 255, 0.08)",
              cursor: "pointer",
              background: "rgba(17, 24, 39, 0.6)",
              backdropFilter: "blur(12px)",
            }}
            onClick={handlePlayClick}
          >
            {/* Video thumbnail */}
            <video
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "16px",
                backgroundColor: "rgba(17, 24, 39, 0.6)",
              }}
              muted
            >
              <source src="/SystemStories.mov" type="video/mp4" />
            </video>

            {/* Play Button Overlay */}
            <button
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: isMobile ? "60px" : "70px",
                height: isMobile ? "60px" : "70px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #14b8a6, #0891b2)",
                opacity: "0.6",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(-50%, -50%) scale(1)";
              }}
              onClick={handlePlayClick}
            >
              <svg
                width={isMobile ? "24" : "28"}
                height={isMobile ? "24" : "28"}
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3" fill="white" stroke="none" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && (
        <>
          {/* Close Button */}
          <div
            style={{
              position: "fixed",
              top: isMobile ? "20px" : "40px",
              right: isMobile ? "20px" : "40px",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              border: "none",
              color: "#000000",
              fontSize: "32px",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 99999,
              transition: "all 0.2s ease",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.8)",
            }}
            onClick={handleCloseModal}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#ff4444";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.color = "#000000";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ×
          </div>

          {/* Modal Backdrop */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: isMobile ? "20px" : "40px",
            }}
            onClick={handleCloseModal}
          >
            {/* Video Container */}
            <div
              style={{
                maxWidth: "1400px",
                width: "100%",
                aspectRatio: "16 / 9",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <video
                ref={videoRef}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "12px",
                }}
                controls
                autoPlay
                muted
              >
                <source src="/SystemStories.mov" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </>
      )}
    </section>
  );
};
