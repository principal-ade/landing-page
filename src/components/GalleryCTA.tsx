import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const GalleryCTA: React.FC = () => {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const galleryImages = [
    '/gallery-opencode-1.png',
    '/gallery-opencode-2.png',
    '/gallery-opencode-3.png',
    '/gallery-opencode-4.png',
    '/gallery-opencode-5.png',
  ];

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <section
      style={{
        padding: isMobile ? "60px 24px" : isTablet ? "80px 32px" : "100px 40px",
        background: "#0a0e1a",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center" }}
        >
          <h2
            style={{
              fontSize: isMobile ? "32px" : isTablet ? "40px" : "48px",
              fontWeight: "600",
              margin: "0 0 16px 0",
              color: "#06b6d4",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.02em",
              lineHeight: "1.1",
            }}
          >
            See It
          </h2>
          <p
            style={{
              fontSize: isMobile ? "24px" : isTablet ? "28px" : "32px",
              fontWeight: "500",
              color: "#a0aec0",
              lineHeight: "1.3",
              marginBottom: "24px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
            }}
          >
            Explore on Real Codebases
          </p>
          <p
            style={{
              fontSize: isMobile ? "17px" : "20px",
              fontWeight: "400",
              color: "#a0aec0",
              lineHeight: "1.6",
              marginBottom: "40px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
            }}
          >
            Browse popular open-source projects and instantly see code quality, structure, and architecture.
          </p>

          {/* Gallery Carousel */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "900px",
              margin: "0 auto 40px auto",
              borderRadius: "12px",
              overflow: "hidden",
              background: "#000000",
              aspectRatio: "16 / 9",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={galleryImages[currentImageIndex]}
                alt="Gallery preview"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 0 }}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  transform: "scale(0.95)",
                }}
              />
            </AnimatePresence>

            {/* Carousel indicators */}
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "8px",
                zIndex: 10,
              }}
            >
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setIsPaused(true);
                  }}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    border: "none",
                    background: index === currentImageIndex
                      ? "#06b6d4"
                      : "rgba(255, 255, 255, 0.4)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: 0,
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <a
            href="#gallery"
            style={{
              display: "inline-block",
              padding: isMobile ? "18px 40px" : "20px 48px",
              color: "#000000",
              textAlign: "center",
              textDecoration: "none",
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "600",
              background: "#06b6d4",
              borderRadius: "10px",
              transition: "all 0.2s ease",
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
              boxShadow: "0 4px 14px rgba(6, 182, 212, 0.4)",
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
            Explore Gallery →
          </a>
        </motion.div>
      </div>
    </section>
  );
};
