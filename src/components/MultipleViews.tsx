import React from "react";
import { motion } from "framer-motion";

interface ViewShowcaseProps {
  icon: string;
  question: string;
  title: string;
  description: string;
  screenshotUrl: string;
  linkText: string;
  label: string;
  index: number;
  imageScale?: number;
}

interface MultipleViewsProps {
  isMobile?: boolean;
}

export const MultipleViews: React.FC<MultipleViewsProps> = ({ isMobile = false }) => {
  const views = [
    {
      icon: "📡",
      question: "HOW HEALTHY IS IT?",
      title: "Quality Radar",
      description:
        "A Carfax report for code. Six dimensions to know if it's solid before you invest developer time.",
      screenshotUrl: "/quality-radar.png",
      linkText: "Gallery: Explore real codebases",
      label: "gemini-cli",
      imageScale: 1.2,
    },
    {
      icon: "🏙️",
      question: "WHAT EXISTS?",
      title: "File City",
      description:
        "Files and directories as a living city map. See size, complexity, and composition in seconds.",
      screenshotUrl: "/file-city.png",
      linkText: "Gallery: Explore real codebases",
      label: "gemini-cli",
    },
    {
      icon: "🔷",
      question: "HOW IS IT SHAPED?",
      title: "Architecture Diagrams",
      description:
        "Auto-generated from your code showing modules, packages, and dependencies. Understand the system at a glance.",
      screenshotUrl: "/architecture-diagram.png",
      linkText: "Gallery: Explore real codebases",
      label: "System Overview",
    },
  ];

  return (
    <section
      style={{
        padding: isMobile ? "0 24px" : "0 40px",
      }}
      id="views"
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: "800px", marginBottom: isMobile ? "56px" : "72px" }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "11px",
              color: "#00C2FF",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            Multiple Lenses
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
            Different questions require different views
          </h2>
          <p
            style={{
              fontSize: isMobile ? "15px" : "17px",
              color: "#9ca3af",
              lineHeight: "1.6",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            Principal isn't a single visualization. It's a multi-view workspace.
            <br /><br />
            One shared reality.
          </p>
        </motion.div>

        {/* Views Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? "24px" : "32px",
          }}
        >
          {views.map((view, index) => (
            <ViewShowcase key={view.title} {...view} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

function ViewShowcase({
  question,
  title,
  description,
  screenshotUrl,
  linkText,
  label,
  imageScale = 1,
  index,
}: ViewShowcaseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "18px",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Screenshot */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          background: "#000000",
          overflow: "hidden",
        }}
      >
        <img
          src={screenshotUrl}
          alt={`${title} visualization`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.6,
            transform: `scale(${imageScale})`,
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: "24px" }}>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: "8px",
          }}
        >
          {question}
        </p>
        <h3
          style={{
            fontSize: "20px",
            fontWeight: "400",
            marginBottom: "12px",
            color: "#ffffff",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: "#9ca3af",
            lineHeight: "1.6",
            marginBottom: "20px",
            fontSize: "14px",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}
        >
          {description}
        </p>
        <a
          href="https://app.principal-ade.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#00C2FF",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
            transition: "color 0.2s ease",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#00d4ff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#00C2FF";
          }}
        >
          <span>{linkText}</span>
          <span>→</span>
        </a>
      </div>
    </motion.div>
  );
}
