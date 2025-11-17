import React from "react";
import { useTheme } from "@a24z/industry-theme";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeSwitcher } from "./providers/ClientThemeProvider";
import { Logo } from "@a24z/logo-component";
import {
  CheckCircle2,
  ArrowRight,
  Download,
  Play,
  ChevronDown,
  X,
  Code2,
  GitBranch,
  Zap,
} from "lucide-react";

// Video Modal Component
const VideoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}> = ({ isOpen, onClose, videoId }) => {
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

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.9)",
              zIndex: 9998,
              cursor: "pointer",
            }}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
              width: isMobile ? "calc(100vw - 32px)" : isTablet ? "calc(100vw - 80px)" : "90vw",
              maxWidth: isTablet ? "900px" : "1200px",
              maxHeight: isMobile ? "calc(100vh - 100px)" : "90vh",
              padding: "0",
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: isMobile ? "-50px" : isTablet ? "-55px" : "-60px",
                right: isMobile ? "0" : isTablet ? "0" : "0",
                background: "rgba(0, 194, 255, 0.2)",
                border: "2px solid #00C2FF",
                borderRadius: "50%",
                width: isMobile ? "44px" : isTablet ? "48px" : "48px",
                height: isMobile ? "44px" : isTablet ? "48px" : "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#00C2FF",
                transition: "all 0.2s ease",
                zIndex: 10000,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 194, 255, 0.3)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(0, 194, 255, 0.2)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <X size={isMobile ? 24 : isTablet ? 28 : 28} />
            </button>
            {/* YouTube Embed */}
            <div
              style={{
                width: "100%",
                paddingBottom: "56.25%", // 16:9 aspect ratio
                position: "relative",
                borderRadius: isMobile ? "8px" : isTablet ? "10px" : "12px",
                overflow: "hidden",
                boxShadow: isMobile
                  ? "0 10px 40px rgba(0, 194, 255, 0.3)"
                  : isTablet
                    ? "0 15px 50px rgba(0, 194, 255, 0.35)"
                    : "0 20px 60px rgba(0, 194, 255, 0.3)",
              }}
            >
              <iframe
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="Principal AI Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Minimal Navigation Component
const MinimalNavigation: React.FC = () => {
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
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0, 194, 255, 0.2)",
        padding: isTablet ? "18px 32px" : isMobile ? "14px 20px" : "16px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo/Brand */}
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            fontSize: isTablet ? "22px" : isMobile ? "18px" : "20px",
            fontWeight: "600",
            fontFamily:
              'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          <span style={{ color: "#ffffff" }}>Principal</span>
          <span
            style={{
              fontWeight: "300",
              background: "linear-gradient(135deg, #00C2FF, #0098CC)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI
          </span>
        </a>

        {/* Nav Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isTablet ? "28px" : isMobile ? "20px" : "32px",
          }}
        >
          <a
            href="/about"
            style={{
              color: "#d1d5db",
              textDecoration: "none",
              fontSize: isTablet ? "15px" : isMobile ? "13px" : "14px",
              fontWeight: "500",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#00C2FF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#d1d5db";
            }}
          >
            About
          </a>
          <a
            href="/blog"
            style={{
              color: "#d1d5db",
              textDecoration: "none",
              fontSize: isTablet ? "15px" : isMobile ? "13px" : "14px",
              fontWeight: "500",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#00C2FF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#d1d5db";
            }}
          >
            Blog
          </a>
          <a
            href="https://app.principal-ade.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: isTablet
                ? "10px 24px"
                : isMobile
                  ? "8px 18px"
                  : "8px 20px",
              background: "#00C2FF",
              color: "#000000",
              textDecoration: "none",
              fontSize: isTablet ? "15px" : isMobile ? "13px" : "14px",
              fontWeight: "600",
              borderRadius: isTablet ? "7px" : "6px",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0, 194, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Download Alpha
          </a>
        </div>
      </div>
    </nav>
  );
};


const HeroSection: React.FC = () => {
  const { theme } = useTheme();

  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [windowHeight, setWindowHeight] = React.useState(
    typeof window !== "undefined" ? window.innerHeight : 768,
  );

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isConstrainedHeight = windowHeight < 900;

  const gridBackground = `
    linear-gradient(${theme.colors.border}40 1px, transparent 1px),
    linear-gradient(90deg, ${theme.colors.border}40 1px, transparent 1px)
  `;

  return (
    <div
      style={{
        minHeight: "auto",
        backgroundColor: "#000000",
        backgroundImage: gridBackground,
        backgroundSize: "100px 100px",
        backgroundPosition: "-1px -1px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: isMobile ? "100px 20px 60px 20px" : "140px 20px 100px 20px",
      }}
    >
      {/* Circular gradient */}
      <div
        style={{
          position: "absolute",
          top: isConstrainedHeight ? "calc(50% - 50px)" : "calc(50% - 120px)",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "200%",
          height: "200%",
          background:
            "radial-gradient(circle at center, transparent 0%, #00C2FF20 25%, #0098CC30 50%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at center, transparent 0%, #000000 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "0 20px" : "0 40px",
        }}
      >
        {/* Brand Name with Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: isMobile ? "20px" : isConstrainedHeight ? "24px" : "28px",
            fontWeight: "600",
            margin: "0 0 40px 0",
            textAlign: "center",
            letterSpacing: "-0.02em",
            fontFamily:
              'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          <div>
            <Logo
              width={isMobile ? 40 : isConstrainedHeight ? 48 : 56}
              height={isMobile ? 40 : isConstrainedHeight ? 48 : 56}
              color={theme.colors.primary}
              particleColor={theme.colors.primary}
              opacity={0.9}
            />
          </div>
          <span style={{ fontWeight: "600", color: "#ffffff" }}>Principal</span>
          <span
            style={{
              fontWeight: "300",
              background: "linear-gradient(135deg, #00C2FF, #0098CC)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI
          </span>
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontSize: isMobile
              ? "28px"
              : isConstrainedHeight
                ? "56px"
                : isTablet
                  ? "64px"
                  : "80px",
            fontWeight: "700",
            margin: "0 auto 32px auto",
            textAlign: "center",
            width: "100%",
            maxWidth: isMobile ? "100%" : "1100px",
            letterSpacing: isMobile ? "-0.01em" : "-0.03em",
            fontFamily:
              'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            lineHeight: isMobile ? "1.3" : "1.1",
            background:
              "linear-gradient(90deg, #00D9FF 0%, #0099FF 50%, #0066FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            wordWrap: "break-word",
            overflowWrap: "break-word",
            hyphens: "auto",
          }}
        >
          The Universal Workspace for Agentic Work
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontSize: isMobile ? "18px" : "20px",
            fontWeight: "400",
            margin: "0 0 24px 0",
            color: "#d1d5db",
            lineHeight: "1.6",
            letterSpacing: "-0.01em",
            fontFamily:
              'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            maxWidth: "800px",
          }}
        >
          Every workspace has a core technology. Slack has channels. Figma has multiplayer.
        </p>
        <p
          style={{
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: "600",
            margin: "0",
            color: "#ffffff",
            lineHeight: "1.4",
            letterSpacing: "-0.02em",
            fontFamily:
              'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            maxWidth: "800px",
          }}
        >
          Principal AI has{" "}
          <span
            style={{
              color: "#00C2FF",
            }}
          >
            Living Documentation
          </span>
          .
        </p>
      </div>
    </div>
  );
};

// Living Documentation Hero Section
const LivingDocSection: React.FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = React.useState(false);
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

  const benefits = [
    "Your AI reads accurate context, not stale docs from last quarter",
    "Stop guessing which docs broke when you changed that function",
    "Reviewers see exactly what code the AI referenced",
    "Onboard new engineers in hours, not weeks",
  ];

  return (
    <>
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoId="6GKPWCVs2tU"
      />
      <div
        style={{
          background: "linear-gradient(180deg, #0a1628 0%, #000000 100%)",
          padding: isTablet
            ? "80px 32px"
            : isMobile
              ? "60px 20px"
              : "100px 20px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Main Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: "80px" }}
          >
            <h2
              style={{
                fontSize: "clamp(2.25rem, 6vw, 3.75rem)",
                fontWeight: "700",
                margin: "0 0 32px 0",
                color: "#ffffff",
                letterSpacing: "-0.02em",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                lineHeight: "1.1",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              Living{" "}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #00D9FF 0%, #0099FF 50%, #0066FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Documentation
              </span>
            </h2>
            <p
              style={{
                fontSize: isMobile ? "18px" : isTablet ? "20px" : "24px",
                color: "#ffffff",
                maxWidth: "900px",
                margin: "0 auto 24px auto",
                lineHeight: isMobile ? "1.5" : "1.6",
                fontWeight: "500",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Documentation linked directly to your code. When code changes, you know instantly which docs are affected.
            </p>
            <p
              style={{
                fontSize: isMobile ? "16px" : isTablet ? "18px" : "20px",
                color: "#00C2FF",
                maxWidth: "900px",
                margin: "0 auto 48px auto",
                lineHeight: isMobile ? "1.5" : "1.6",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Everyone knows what changed. Everyone stays aligned.
            </p>

            {/* Benefits Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
                gap: isMobile ? "16px" : "20px",
                marginBottom: isMobile ? "48px" : "60px",
              }}
            >
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    background: "rgba(0, 194, 255, 0.05)",
                    border: "1px solid rgba(0, 194, 255, 0.2)",
                    borderRadius: isMobile ? "10px" : "12px",
                    padding: isMobile ? "20px" : "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? "12px" : "16px",
                    textAlign: "left",
                  }}
                >
                  <CheckCircle2
                    size={24}
                    color="#00C2FF"
                    style={{ flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontSize: isMobile ? "15px" : "16px",
                      color: "#d1d5db",
                      lineHeight: isMobile ? "1.5" : "1.6",
                      fontFamily:
                        'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* How Principal AI Enables Living Documentation */}
            <div
              style={{
                background: "rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(0, 194, 255, 0.3)",
                borderRadius: "16px",
                padding: isTablet
                  ? "50px 32px"
                  : isMobile
                    ? "40px 24px"
                    : "60px 40px",
                marginBottom: isTablet ? "50px" : "60px",
                textAlign: "left",
              }}
            >
              <h3
                style={{
                  fontSize: isMobile ? "24px" : isTablet ? "28px" : "32px",
                  fontWeight: "600",
                  margin: "0 0 32px 0",
                  color: "#ffffff",
                  fontFamily:
                    'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  textAlign: "center",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                How Principal AI Makes It Possible
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isTablet
                    ? "repeat(2, 1fr)"
                    : "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: isTablet ? "28px" : isMobile ? "24px" : "32px",
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#00C2FF",
                      marginBottom: "12px",
                      fontFamily:
                        'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    CodebaseViews
                  </h4>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#d1d5db",
                      lineHeight: "1.7",
                      margin: 0,
                      fontFamily:
                        'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Link documentation directly to specific files and code
                    sections. Principal AI validates these links automatically,
                    so you always know what's current.
                  </p>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#00C2FF",
                      marginBottom: "12px",
                      fontFamily:
                        'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Automated Staleness Detection
                  </h4>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#d1d5db",
                      lineHeight: "1.7",
                      margin: 0,
                      fontFamily:
                        'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Every code change is analyzed. If documentation becomes
                    outdated, you know immediately—before it causes problems.
                  </p>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#00C2FF",
                      marginBottom: "12px",
                      fontFamily:
                        'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Git-Based Workspace
                  </h4>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#d1d5db",
                      lineHeight: "1.7",
                      margin: 0,
                      fontFamily:
                        'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Everything lives in your repository. No external tools, no
                    broken workflows. Living Documentation integrates with how
                    you already work.
                  </p>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#00C2FF",
                      marginBottom: "12px",
                      fontFamily:
                        'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    AI-Powered Context
                  </h4>
                  <p
                    style={{
                      fontSize: "16px",
                      color: "#d1d5db",
                      lineHeight: "1.7",
                      margin: 0,
                      fontFamily:
                        'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Your AI agents get the right context automatically. No more
                    hallucinations from stale docs. No more searching for the
                    right files.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

// Try Living Documentation CTA Section
const TryLivingDocSection: React.FC = () => {
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
    <div
      style={{
        background: "linear-gradient(180deg, #0a1628 0%, #0f1c2e 100%)",
        padding: isTablet ? "60px 32px" : isMobile ? "50px 20px" : "80px 20px",
        borderTop: "1px solid rgba(0, 194, 255, 0.2)",
        borderBottom: "1px solid rgba(0, 194, 255, 0.2)",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
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
              fontSize: isMobile ? "28px" : isTablet ? "32px" : "36px",
              fontWeight: "600",
              margin: "0 0 24px 0",
              color: "#ffffff",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            Get Started
          </h3>
          <p
            style={{
              fontSize: isTablet ? "17px" : isMobile ? "16px" : "18px",
              color: "#d1d5db",
              maxWidth: "700px",
              margin: "0 auto 40px auto",
              lineHeight: "1.7",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Add Living Documentation to your projects in minutes. No commitment required. Experience the
            difference yourself.
          </p>
          <div
            style={{
              display: "flex",
              gap: isTablet ? "18px" : "20px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="https://app.principal-ade.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: isTablet
                  ? "18px 36px"
                  : isMobile
                    ? "14px 28px"
                    : "16px 32px",
                fontSize: isTablet ? "17px" : isMobile ? "15px" : "16px",
                fontWeight: "600",
                background: "#00C2FF",
                color: "#000000",
                border: "none",
                borderRadius: isTablet ? "9px" : "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 194, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Add it to your project
            </a>
            <a
              href="/download"
              style={{
                padding: isTablet
                  ? "18px 36px"
                  : isMobile
                    ? "14px 28px"
                    : "16px 32px",
                fontSize: isTablet ? "17px" : isMobile ? "15px" : "16px",
                fontWeight: "600",
                background: "transparent",
                color: "#00C2FF",
                border: "2px solid #00C2FF",
                borderRadius: isTablet ? "9px" : "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 194, 255, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              Take a tour
            </a>
            <a
              href="#video-section"
              style={{
                padding: isTablet
                  ? "18px 36px"
                  : isMobile
                    ? "14px 28px"
                    : "16px 32px",
                fontSize: isTablet ? "17px" : isMobile ? "15px" : "16px",
                fontWeight: "600",
                background: "linear-gradient(135deg, #0066FF, #0044CC)",
                color: "#ffffff",
                border: "none",
                borderRadius: isTablet ? "9px" : "8px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 102, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Watch Video
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// See How It Works Video Section
const SeeHowItWorksSection: React.FC = () => {
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
    <div
      id="video-section"
      style={{
        background: "#000000",
        padding: isTablet ? "80px 32px" : isMobile ? "60px 20px" : "100px 20px",
        scrollMarginTop: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
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
              margin: "0 0 48px 0",
              color: "#ffffff",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              letterSpacing: "-0.02em",
              lineHeight: "1.2",
              textAlign: "center",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            See How It Works
          </h3>

          {/* Video Container */}
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%", // 16:9 aspect ratio
              height: 0,
              overflow: "hidden",
              borderRadius: "12px",
              border: "1px solid rgba(0, 194, 255, 0.2)",
              background: "#0a1628",
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/6GKPWCVs2tU"
              title="Living Documentation Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </div>

          {/* Video Caption */}
          <p
            style={{
              fontSize: isTablet ? "16px" : isMobile ? "15px" : "17px",
              color: "#9ca3af",
              textAlign: "center",
              marginTop: "24px",
              lineHeight: "1.6",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Watch how Living Documentation keeps your team in sync and your AI agents informed.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// FAQ Section
const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
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

  const faqs = [
    {
      question: "What languages and frameworks are supported?",
      answer:
        "Principal AI works with any Git-based project. Living Documentation supports all major languages including JavaScript/TypeScript, Python, Java, Go, Rust, and more. Framework-agnostic—works with React, Next.js, Django, Spring, and any codebase structure.",
    },
    {
      question: "How long does setup take?",
      answer:
        "Less than 5 minutes. Try the Web ADE instantly in your browser, or download the desktop app and connect your repository. No complex configuration, no external dependencies. Living Documentation starts working immediately.",
    },
    {
      question: "How does staleness detection work?",
      answer:
        "Principal AI validates documentation-to-code links on every commit. When code changes affect linked documentation, you get immediate notifications. CodebaseViews track file dependencies, so you always know what needs updating before it becomes a problem.",
    },
    {
      question: "Is my code secure?",
      answer:
        "Your code stays in your Git repository. Principal AI operates locally on your machine or in your infrastructure. We never store your code on external servers. All processing happens in your environment.",
    },
    {
      question: "How much does Principal AI cost?",
      answer:
        "Principal AI is currently free and open source during our alpha phase. We're building in public and early users get full access at no cost while helping us shape the platform. When we introduce pricing in the future, we'll provide plenty of advance notice and early adopters will receive special consideration.",
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #000000 0%, #0a1628 100%)",
        padding: isTablet ? "60px 32px" : isMobile ? "50px 20px" : "80px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              fontWeight: "600",
              margin: "0 0 48px 0",
              color: "#ffffff",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              letterSpacing: "-0.02em",
              lineHeight: "1.2",
              textAlign: "center",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            Frequently Asked Questions
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: isTablet ? "14px" : "16px",
            }}
          >
            {faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(0, 194, 255, 0.05)",
                  border: "1px solid rgba(0, 194, 255, 0.2)",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  style={{
                    width: "100%",
                    padding: isTablet
                      ? "26px"
                      : isMobile
                        ? "20px"
                        : "24px",
                    background: "transparent",
                    border: "none",
                    color: "#ffffff",
                    fontSize: isTablet ? "19px" : isMobile ? "17px" : "18px",
                    fontWeight: "600",
                    fontFamily:
                      'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  {faq.question}
                  <ChevronDown
                    size={20}
                    style={{
                      flexShrink: 0,
                      color: "#00C2FF",
                      transform:
                        openIndex === index ? "rotate(180deg)" : "rotate(0)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </button>
                {openIndex === index && (
                  <div
                    style={{
                      padding: isTablet
                        ? "0 26px 26px 26px"
                        : isMobile
                          ? "0 20px 20px 20px"
                          : "0 24px 24px 24px",
                      color: "#d1d5db",
                      fontSize: isTablet ? "17px" : isMobile ? "15px" : "16px",
                      lineHeight: "1.7",
                      fontFamily:
                        'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// About Principal AI Section
const AboutSection: React.FC = () => {
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

  const keyPoints = [
    {
      icon: Code2,
      text: "Documentation is Core Infrastructure",
    },
    {
      icon: GitBranch,
      text: "Context Belongs in Git, Not SaaS",
    },
    {
      icon: Zap,
      text: "AI Needs Understanding, Not Just Speed",
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #000000 0%, #0a1628 100%)",
        padding: isTablet ? "60px 32px" : isMobile ? "50px 20px" : "80px 20px",
        borderTop: "1px solid rgba(0, 194, 255, 0.2)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            style={{
              fontSize: "clamp(1.75rem, 5vw, 3.75rem)",
              fontWeight: "700",
              margin: "0 0 60px 0",
              color: "#0066FF",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              letterSpacing: "-0.02em",
              lineHeight: "1.2",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            At <span style={{ fontWeight: "700", color: "#ffffff" }}>Principal</span>
            <span
              style={{
                fontWeight: "300",
                background: "linear-gradient(135deg, #00C2FF, #0098CC)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI
            </span> we believe:
          </h2>

          {/* Key Points */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isTablet || isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: isTablet ? "20px" : "24px",
              marginTop: "48px",
            }}
          >
            {keyPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: "rgba(0, 194, 255, 0.05)",
                    border: "1px solid rgba(0, 194, 255, 0.2)",
                    borderRadius: "12px",
                    padding: isTablet ? "24px" : "28px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <Icon
                    size={isTablet ? 36 : 40}
                    color="#00C2FF"
                  />
                  <p
                    style={{
                      fontSize: isTablet ? "16px" : "17px",
                      color: "#ffffff",
                      fontWeight: "500",
                      margin: 0,
                      fontFamily:
                        'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {point.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const LivingDocHomepage: React.FC = () => {
  return (
    <div>
      <MinimalNavigation />
      <HeroSection />
      <TryLivingDocSection />
      <SeeHowItWorksSection />
      <LivingDocSection />
      <FAQSection />
      <AboutSection />
    </div>
  );
};
