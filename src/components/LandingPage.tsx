import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@a24z/industry-theme";
import { Logo } from "@principal-ai/logo-component";
import { useThemeSwitcher } from "./providers/ClientThemeProvider";
import { ThemedSlidePresentationBook } from "./ThemedSlidePresentationBook";
import { parseMarkdownIntoPresentation } from "themed-markdown";
import { Section } from "./Section";
import { EngineeringContextSection } from "./EngineeringContextSection";
import { GlowingFolder } from "./GlowingFolder";
import { NeuralNetwork } from "./NeuralNetwork";

interface LandingPageProps {
  onExploreGithub: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({}) => {
  const { theme } = useTheme();
  const { currentTheme, setCurrentTheme, availableThemes } = useThemeSwitcher();

  const handleLogoClick = () => {
    const currentIndex = availableThemes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    setCurrentTheme(availableThemes[nextIndex]);
  };

  // Markdown content state
  const [slides, setSlides] = React.useState<string[]>([]);
  const [isClient, setIsClient] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"book" | "single">("book");
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Responsive breakpoints with React hooks
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

  // Set client-side flag and ensure scroll position stays at top
  React.useEffect(() => {
    setIsClient(true);
    // Force scroll to top on mount and lock it briefly
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      // Prevent any scroll for a brief moment
      const preventScroll = () => {
        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
        }
      };
      containerRef.current.addEventListener('scroll', preventScroll);
      setTimeout(() => {
        containerRef.current?.removeEventListener('scroll', preventScroll);
      }, 1000);
    }
  }, []);

  // Keep scroll at top when slides load
  React.useEffect(() => {
    if (slides.length > 0 && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [slides.length]);

  // Fetch markdown content
  React.useEffect(() => {
    fetch("/content.md")
      .then((response) => response.text())
      .then((text) => {
        console.log("Loaded markdown content:", text);
        // Parse markdown into slides
        try {
          const presentation = parseMarkdownIntoPresentation(text);
          console.log("Parsed presentation:", presentation);
          const parsedSlides = (presentation?.slides || []).map((s) => s.location.content);
          console.log("Parsed slides:", parsedSlides);
          setSlides(parsedSlides);
        } catch (error) {
          console.error("Error parsing markdown:", error);
          setSlides([text]); // Fallback to single slide
        }
      })
      .catch((error) => console.error("Error loading markdown:", error));
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // iPad landscape (1024x768) has constrained height
  const isConstrainedHeight = windowHeight < 900;

  // Create a subtle grid pattern
  const gridBackground = `
    linear-gradient(${theme.colors.border}40 1px, transparent 1px),
    linear-gradient(90deg, ${theme.colors.border}40 1px, transparent 1px)
  `;

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100vh", overflow: "auto", scrollSnapType: "y proximity" }}>
      {/* Hero Section */}
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: theme.colors.background,
          backgroundImage: gridBackground,
          backgroundSize: "100px 100px",
          backgroundPosition: "-1px -1px",
          position: "relative",
          scrollSnapAlign: "start",
          scrollSnapStop: "always",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          padding: isMobile ? "40px 0" : "60px 0",
        }}
      >
        {/* Circular gradient emanating from logo center */}
        <div
          style={{
            position: "absolute",
            top: isConstrainedHeight ? "calc(50% - 50px)" : "calc(50% - 120px)",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "200%",
            height: "200%",
            background: `radial-gradient(circle at center, transparent 0%, ${theme.colors.primary}30 25%, ${theme.colors.primary}50 50%)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Gradient overlay for better contrast */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at center, transparent 0%, ${theme.colors.background}99 100%)`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        <div
          style={{
            maxWidth: "1400px",
            width: "100%",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? "20px" : isConstrainedHeight ? "40px" : "80px",
            padding: isMobile ? "0 20px" : "0 40px",
          }}
        >
          {/* Left Quick Links */}
          {!isMobile && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: isConstrainedHeight ? "30px" : "60px",
                flex: "0 0 auto",
              }}
            >
              <div
                onClick={() => {
                  const section = document.getElementById("trust-crisis");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                style={{
                  cursor: "pointer",
                  fontSize: isConstrainedHeight ? "13px" : "16px",
                  fontWeight: "600",
                  color: theme.colors.text,
                  transition: "all 0.3s ease",
                  textDecoration: "none",
                  padding: isConstrainedHeight ? "8px 12px" : "12px 16px",
                  backgroundColor: `${theme.colors.background}80`,
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  border: `1px solid ${theme.colors.border}40`,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.primary;
                  e.currentTarget.style.transform = "translateX(8px)";
                  e.currentTarget.style.backgroundColor = `${theme.colors.background}95`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.colors.text;
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.backgroundColor = `${theme.colors.background}80`;
                }}
              >
                Why Principal-ade
              </div>
              <div
                onClick={() => {
                  const section = document.getElementById("living-documentation-personas");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                style={{
                  cursor: "pointer",
                  fontSize: isConstrainedHeight ? "13px" : "16px",
                  fontWeight: "600",
                  color: theme.colors.text,
                  transition: "all 0.3s ease",
                  textDecoration: "none",
                  padding: isConstrainedHeight ? "8px 12px" : "12px 16px",
                  backgroundColor: `${theme.colors.background}80`,
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  border: `1px solid ${theme.colors.border}40`,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.primary;
                  e.currentTarget.style.transform = "translateX(8px)";
                  e.currentTarget.style.backgroundColor = `${theme.colors.background}95`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.colors.text;
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.backgroundColor = `${theme.colors.background}80`;
                }}
              >
                For Your Role
              </div>
            </div>
          )}

          {/* Center: Logo and Titles */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: isMobile ? "12px" : isConstrainedHeight ? "16px" : "20px",
              flex: "0 0 auto",
            }}
          >
            <h1
              style={{
                fontSize: isMobile ? "28px" : isConstrainedHeight ? "32px" : isTablet ? "36px" : "42px",
                fontWeight: "700",
                margin: "0",
                color: theme.colors.accent,
                textAlign: "center",
                lineHeight: "1.3",
                maxWidth: "900px",
              }}
            >
              The Universal Workspace
              <br />
              for Agentic Work
            </h1>

            {/* Logo */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                margin: isMobile ? "12px 0" : "20px 0",
              }}
            >
            <div
              onClick={handleLogoClick}
              style={{
                width: isMobile ? "160px" : isConstrainedHeight ? "180px" : "220px",
                height: isMobile ? "160px" : isConstrainedHeight ? "180px" : "220px",
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Logo
                width={isMobile ? 160 : isConstrainedHeight ? 180 : 220}
                height={isMobile ? 160 : isConstrainedHeight ? 180 : 220}
                color={theme.colors.primary}
                particleColor={theme.colors.accent}
                opacity={0.9}
              />
            </div>
          </div>

          <h2
            style={{
              fontSize: isMobile ? "20px" : isConstrainedHeight ? "22px" : isTablet ? "24px" : "28px",
              fontWeight: "600",
              margin: "0",
              color: theme.colors.primary,
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            Where Strategy, Code, and Context Flow Together
          </h2>

          <p
            style={{
              fontSize: isMobile ? "15px" : isConstrainedHeight ? "16px" : "18px",
              fontWeight: "500",
              margin: "12px 0 0 0",
              color: theme.colors.text,
              textAlign: "center",
              maxWidth: "900px",
              lineHeight: "1.7",
            }}
          >
            Every other tool stores context in the cloud. We store it in Git.<br/>
            That's not a feature difference—it's architectural.
          </p>
          <p
            style={{
              fontSize: isMobile ? "14px" : isConstrainedHeight ? "15px" : "16px",
              fontWeight: "400",
              margin: "16px 0 0 0",
              color: theme.colors.textSecondary,
              textAlign: "center",
              maxWidth: "800px",
              lineHeight: "1.6",
            }}
          >
            And it means <span style={{ color: '#00C2FF' }}>we eliminate third-party tool complexity</span> while making context<br/>
            version-controlled and agent-accessible.
          </p>
          </div>

          {/* Right Quick Links */}
          {!isMobile && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: isConstrainedHeight ? "30px" : "60px",
                flex: "0 0 auto",
              }}
            >
              <div
                onClick={() => {
                  const section = document.getElementById("whats-different");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                style={{
                  cursor: "pointer",
                  fontSize: isConstrainedHeight ? "13px" : "16px",
                  fontWeight: "600",
                  color: theme.colors.text,
                  transition: "all 0.3s ease",
                  textDecoration: "none",
                  padding: isConstrainedHeight ? "8px 12px" : "12px 16px",
                  backgroundColor: `${theme.colors.background}80`,
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  border: `1px solid ${theme.colors.border}40`,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.primary;
                  e.currentTarget.style.transform = "translateX(-8px)";
                  e.currentTarget.style.backgroundColor = `${theme.colors.background}95`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.colors.text;
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.backgroundColor = `${theme.colors.background}80`;
                }}
              >
                How It Works
              </div>
              <div
                onClick={() => {
                  const section = document.getElementById("agents-and-more");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                style={{
                  cursor: "pointer",
                  fontSize: isConstrainedHeight ? "13px" : "16px",
                  fontWeight: "600",
                  color: theme.colors.text,
                  transition: "all 0.3s ease",
                  textDecoration: "none",
                  padding: isConstrainedHeight ? "8px 12px" : "12px 16px",
                  backgroundColor: `${theme.colors.background}80`,
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  border: `1px solid ${theme.colors.border}40`,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.primary;
                  e.currentTarget.style.transform = "translateX(-8px)";
                  e.currentTarget.style.backgroundColor = `${theme.colors.background}95`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.colors.text;
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.backgroundColor = `${theme.colors.background}80`;
                }}
              >
                Features
              </div>
              <div
                onClick={() => {
                  const section = document.getElementById("founder-story");
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                style={{
                  cursor: "pointer",
                  fontSize: isConstrainedHeight ? "13px" : "16px",
                  fontWeight: "600",
                  color: theme.colors.text,
                  transition: "all 0.3s ease",
                  textDecoration: "none",
                  padding: isConstrainedHeight ? "8px 12px" : "12px 16px",
                  backgroundColor: `${theme.colors.background}80`,
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  border: `1px solid ${theme.colors.border}40`,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.colors.primary;
                  e.currentTarget.style.transform = "translateX(-8px)";
                  e.currentTarget.style.backgroundColor = `${theme.colors.background}95`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.colors.text;
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.backgroundColor = `${theme.colors.background}80`;
                }}
              >
                About
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            marginTop: isMobile ? "40px" : isConstrainedHeight ? "60px" : "80px",
            zIndex: 3,
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: isMobile ? "90%" : "auto",
          }}
        >
          <a
            href="/download"
            style={{
              padding: isMobile ? "8px 16px" : isConstrainedHeight ? "8px 16px" : "10px 20px",
              fontSize: isMobile ? "14px" : isConstrainedHeight ? "13px" : "15px",
              fontWeight: "600",
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              border: `1px solid ${theme.colors.primary}`,
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              width: isMobile ? "100px" : isConstrainedHeight ? "150px" : "200px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${theme.colors.primary}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Download Alpha
          </a>
          <a
            href="https://principal-ai-vmmsup2.gamma.site/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: isMobile ? "8px 16px" : isConstrainedHeight ? "8px 16px" : "10px 20px",
              fontSize: isMobile ? "14px" : isConstrainedHeight ? "13px" : "15px",
              fontWeight: "600",
              backgroundColor: theme.colors.accent,
              color: theme.colors.background,
              border: `1px solid ${theme.colors.accent}`,
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              width: isMobile ? "100px" : isConstrainedHeight ? "150px" : "200px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${theme.colors.accent}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            PitchDeck
          </a>
          <Link
            href="/sessions"
            style={{
              padding: isMobile ? "8px 16px" : isConstrainedHeight ? "8px 16px" : "10px 20px",
              fontSize: isMobile ? "14px" : isConstrainedHeight ? "13px" : "15px",
              fontWeight: "600",
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              border: `1px solid ${theme.colors.primary}`,
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              width: isMobile ? "100px" : isConstrainedHeight ? "150px" : "200px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${theme.colors.primary}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Sessions
          </Link>
          <Link
            href="/observatory"
            style={{
              padding: isMobile ? "8px 16px" : isConstrainedHeight ? "8px 16px" : "10px 20px",
              fontSize: isMobile ? "14px" : isConstrainedHeight ? "13px" : "15px",
              fontWeight: "600",
              backgroundColor: theme.colors.accent,
              color: theme.colors.background,
              border: `1px solid ${theme.colors.accent}`,
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              width: isMobile ? "100px" : isConstrainedHeight ? "150px" : "200px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${theme.colors.accent}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Observatory
          </Link>
          <Link
            href="/markdown-editor"
            style={{
              padding: isMobile ? "8px 16px" : isConstrainedHeight ? "8px 16px" : "10px 20px",
              fontSize: isMobile ? "14px" : isConstrainedHeight ? "13px" : "15px",
              fontWeight: "600",
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              border: `1px solid ${theme.colors.primary}`,
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              width: isMobile ? "100px" : isConstrainedHeight ? "150px" : "200px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${theme.colors.primary}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Markdown Editor
          </Link>
          <a
            href="https://app.principal-ade.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: isMobile ? "8px 16px" : isConstrainedHeight ? "8px 16px" : "10px 20px",
              fontSize: isMobile ? "14px" : isConstrainedHeight ? "13px" : "15px",
              fontWeight: "600",
              backgroundColor: theme.colors.accent,
              color: theme.colors.background,
              border: `1px solid ${theme.colors.accent}`,
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              width: isMobile ? "100px" : isConstrainedHeight ? "150px" : "200px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${theme.colors.accent}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Web Workspace
          </a>
        </div>

        {/* Animated Components */}
        <div style={{ marginTop: "60px", zIndex: 3 }}>
          <GlowingFolder />
          <NeuralNetwork />
        </div>
      </div>

      {/* Trust Crisis Section */}
      <Section
        id="trust-crisis"
        textPosition="left"
        background="grid"
        title="The Coherence Problem: When Strategy and Code Don't Know About Each Other"
        description={
          <div>
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: theme.colors.textSecondary,
                lineHeight: "1.8",
                marginBottom: "24px",
              }}
            >
              Your marketing team writes messaging in Google Docs.<br/>
              Your engineering team writes code in GitHub.<br/>
              Your AI agents work in isolated silos.
            </p>
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: theme.colors.textSecondary,
                lineHeight: "1.8",
                marginBottom: "24px",
              }}
            >
              When strategy changes, nobody tells the code.<br/>
              When code changes, nobody tells the docs.<br/>
              When agents make decisions, nobody knows why.
            </p>
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: theme.colors.textSecondary,
                lineHeight: "1.8",
                marginBottom: "24px",
              }}
            >
              Every other tool stores AI context in the cloud—fragmented, ephemeral,
              gone when the session ends. Your institutional knowledge evaporates.
              Your competitive advantage lives on someone else's servers.
            </p>
            <p
              style={{
                fontSize: isMobile ? "18px" : "20px",
                color: theme.colors.primary,
                lineHeight: "1.8",
                fontWeight: "600",
              }}
            >
              That's not a workflow problem. That's an architecture problem.
            </p>
          </div>
        }
        media={
          <div
            style={{
              width: "100%",
              height: "600px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              backgroundColor: `${theme.colors.background}80`,
              borderRadius: "12px",
              border: `2px solid ${theme.colors.border}`,
            }}
          >
            <div
              style={{
                padding: "32px",
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: "12px",
                borderLeft: `4px solid ${theme.colors.accent}`,
                maxWidth: "600px",
              }}
            >
              <p
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  color: theme.colors.text,
                  lineHeight: "1.8",
                  fontStyle: "italic",
                  margin: "0 0 16px 0",
                }}
              >
                "We've reached the point where it's not one assistant writing code—it's a team of agents, each doing a part of the job. The challenge now is coordination and understanding what they actually did."
              </p>
              <p
                style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.textSecondary,
                  margin: 0,
                  fontWeight: "600",
                }}
              >
                — Szczepan Faber, Agentic Coding at Airbnb (DPE 2025)
              </p>
            </div>
          </div>
        }
        isMobile={isMobile}
      />

      {/* What's Different Section */}
      <Section
        id="whats-different"
        textPosition="right"
        background="secondary"
        title="Living Documentation is the Key to Context Engineering and by extension agentic work."
        description={
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{
              padding: "24px",
              backgroundColor: theme.colors.backgroundSecondary,
              borderRadius: "12px",
              border: `2px solid ${theme.colors.primary}`,
            }}>
              <p style={{
                fontSize: isMobile ? "17px" : "20px",
                color: theme.colors.primary,
                lineHeight: "1.7",
                margin: 0,
                fontWeight: "600",
              }}>
                Every other tool stores context in the cloud. We store it in Git.<br/>
                That's not a feature difference—it's architectural.
              </p>
              <p style={{
                fontSize: isMobile ? "15px" : "17px",
                color: theme.colors.text,
                lineHeight: "1.7",
                margin: "16px 0 0 0",
              }}>
                And it means <span style={{ color: '#00C2FF' }}>we eliminate third-party tool complexity</span> while making context
                version-controlled and agent-accessible.
              </p>
            </div>

            <div>
              <h4 style={{
                fontSize: isMobile ? "18px" : "20px",
                color: theme.colors.primary,
                margin: "0 0 12px 0",
                fontWeight: "600",
              }}>
                For Communications: Living Messaging
              </h4>
              <p style={{
                fontSize: isMobile ? "15px" : "17px",
                color: theme.colors.textSecondary,
                lineHeight: "1.7",
                margin: "0 0 12px 0",
              }}>
                Your <code>/comms</code> folder has messaging.md, stats-library.md, quotes.md, use-cases.md
              </p>
              <p style={{
                fontSize: isMobile ? "15px" : "17px",
                color: theme.colors.text,
                lineHeight: "1.7",
                margin: 0,
              }}>
                <strong>Agents can:</strong> Reference this when writing website copy, blog posts, social content, pitch decks<br/>
                <strong>When messaging changes:</strong> Agents flag which pages need updates and maintain voice consistency
              </p>
            </div>

            <div>
              <h4 style={{
                fontSize: isMobile ? "18px" : "20px",
                color: theme.colors.primary,
                margin: "0 0 12px 0",
                fontWeight: "600",
              }}>
                For Engineering: Living Architecture
              </h4>
              <p style={{
                fontSize: isMobile ? "15px" : "17px",
                color: theme.colors.textSecondary,
                lineHeight: "1.7",
                margin: "0 0 12px 0",
              }}>
                Your <code>/docs</code> folder has architecture.md, decisions.md, tradeoffs.md
              </p>
              <p style={{
                fontSize: isMobile ? "15px" : "17px",
                color: theme.colors.text,
                lineHeight: "1.7",
                margin: 0,
              }}>
                <strong>Agents can:</strong> Reference this when writing features, refactoring, reviewing PRs, debugging<br/>
                <strong>When code changes:</strong> Agents flag stale docs, update diagrams, add decision records
              </p>
            </div>

            <div>
              <h4 style={{
                fontSize: isMobile ? "18px" : "20px",
                color: theme.colors.primary,
                margin: "0 0 12px 0",
                fontWeight: "600",
              }}>
                Context Engineering, Not Just Documentation
              </h4>
              <p style={{
                fontSize: isMobile ? "15px" : "17px",
                color: theme.colors.text,
                lineHeight: "1.7",
                margin: 0,
              }}>
                An agent can read your messaging doc while writing website code.
                Read your architecture doc while writing marketing copy. Maintain consistency because it sees the WHOLE picture.
              </p>
              <ul style={{
                fontSize: isMobile ? "15px" : "17px",
                color: theme.colors.text,
                lineHeight: "1.7",
                marginTop: "12px",
              }}>
                <li>Everything version-controlled together</li>
                <li>Zero third-party tool costs for context storage</li>
                <li>Agent-accessible across your entire organization</li>
              </ul>
            </div>

            <div style={{
              padding: "24px",
              backgroundColor: theme.colors.backgroundSecondary,
              borderRadius: "12px",
              borderLeft: `4px solid ${theme.colors.accent}`,
              marginTop: "32px",
            }}>
              <p style={{
                fontSize: isMobile ? "15px" : "17px",
                color: theme.colors.text,
                lineHeight: "1.8",
                fontStyle: "italic",
                margin: "0 0 12px 0",
              }}>
                "Agents are fast, but they don't explain themselves. You can end up with working code that no one understands."
              </p>
              <p style={{
                fontSize: isMobile ? "14px" : "16px",
                color: theme.colors.textSecondary,
                margin: 0,
                fontWeight: "600",
              }}>
                — Mike Nakhimovich, Agentic Coding at Airbnb (DPE 2025)
              </p>
            </div>
          </div>
        }
        media={
          <div
            style={{
              width: "100%",
              height: "600px",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Image
              src="/local_drawing.png"
              alt="Git-based Architecture"
              fill
              style={{
                objectFit: "contain",
              }}
            />
          </div>
        }
        isMobile={isMobile}
      />

      {/* What Living Documentation Means Section */}
      <Section
        id="living-documentation-personas"
        textPosition="left"
        background="grid"
        title="What Living Documentation Means to You"
        description={
          <div>
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: theme.colors.textSecondary,
                lineHeight: "1.8",
                marginBottom: "32px",
              }}
            >
              The value of living documentation changes based on who you are. Here's what it means for each role.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Solo Developers */}
              <div style={{
                padding: "24px",
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: "12px",
                border: `2px solid ${theme.colors.border}`,
              }}>
                <h4 style={{
                  fontSize: isMobile ? "18px" : "20px",
                  color: theme.colors.accent,
                  margin: "0 0 8px 0",
                  fontWeight: "600",
                }}>
                  Solo Developers: Your Personal Time Machine
                </h4>
                <p style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.primary,
                  lineHeight: "1.6",
                  margin: "0 0 12px 0",
                  fontStyle: "italic",
                }}>
                  Your project's institutional memory, even when the institution is just you.
                </p>
                <p style={{
                  fontSize: isMobile ? "15px" : "17px",
                  color: theme.colors.text,
                  lineHeight: "1.7",
                  margin: "0 0 12px 0",
                }}>
                  <strong>Living documentation means:</strong> Never saying "I forgot why I built it this way."
                  The "why" behind every decision, timestamped and searchable. When you come back to code after
                  6 months, the context comes back too.
                </p>
                <p style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.textSecondary,
                  lineHeight: "1.7",
                  margin: 0,
                }}>
                  Memory that doesn't fade • AI that explains itself • Debug trails you can follow
                </p>
              </div>

              {/* Small Teams */}
              <div style={{
                padding: "24px",
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: "12px",
                border: `2px solid ${theme.colors.border}`,
              }}>
                <h4 style={{
                  fontSize: isMobile ? "18px" : "20px",
                  color: theme.colors.accent,
                  margin: "0 0 8px 0",
                  fontWeight: "600",
                }}>
                  Small Teams: Shared Memory Without Meetings
                </h4>
                <p style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.primary,
                  lineHeight: "1.6",
                  margin: "0 0 12px 0",
                  fontStyle: "italic",
                }}>
                  Tribal knowledge that doesn't evaporate when someone's on vacation.
                </p>
                <p style={{
                  fontSize: isMobile ? "15px" : "17px",
                  color: theme.colors.text,
                  lineHeight: "1.7",
                  margin: "0 0 12px 0",
                }}>
                  <strong>Living documentation means:</strong> Your team's shared brain lives in git, not in someone's head.
                  New devs read the decision history instead of asking "why" 50 times. When someone leaves, their reasoning doesn't leave with them.
                </p>
                <p style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.textSecondary,
                  lineHeight: "1.7",
                  margin: 0,
                }}>
                  Async onboarding • Cross-agent coherence • Knowledge preservation
                </p>
              </div>

              {/* Enterprises */}
              <div style={{
                padding: "24px",
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: "12px",
                border: `2px solid ${theme.colors.border}`,
              }}>
                <h4 style={{
                  fontSize: isMobile ? "18px" : "20px",
                  color: theme.colors.accent,
                  margin: "0 0 8px 0",
                  fontWeight: "600",
                }}>
                  Enterprises: Governance at Scale
                </h4>
                <p style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.primary,
                  lineHeight: "1.6",
                  margin: "0 0 12px 0",
                  fontStyle: "italic",
                }}>
                  Institutional knowledge that's auditable, searchable, and enforced by agents.
                </p>
                <p style={{
                  fontSize: isMobile ? "15px" : "17px",
                  color: theme.colors.text,
                  lineHeight: "1.7",
                  margin: "0 0 12px 0",
                }}>
                  <strong>Living documentation means:</strong> Institutional knowledge that scales with your organization,
                  not against it. Every AI decision is logged and auditable for compliance. Architecture standards that
                  agents reference and enforce.
                </p>
                <p style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.textSecondary,
                  lineHeight: "1.7",
                  margin: 0,
                }}>
                  Compliance trails • Policy enforcement • Cross-org visibility
                </p>
              </div>

              {/* Communications/Marketing */}
              <div style={{
                padding: "24px",
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: "12px",
                border: `2px solid ${theme.colors.border}`,
              }}>
                <h4 style={{
                  fontSize: isMobile ? "18px" : "20px",
                  color: theme.colors.accent,
                  margin: "0 0 8px 0",
                  fontWeight: "600",
                }}>
                  Communications: Brand as Code
                </h4>
                <p style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.primary,
                  lineHeight: "1.6",
                  margin: "0 0 12px 0",
                  fontStyle: "italic",
                }}>
                  Messaging that agents reference to maintain voice consistency across all channels.
                </p>
                <p style={{
                  fontSize: isMobile ? "15px" : "17px",
                  color: theme.colors.text,
                  lineHeight: "1.7",
                  margin: "0 0 12px 0",
                }}>
                  <strong>Living documentation means:</strong> Your brand voice is code, not a Google Doc that gets out of sync.
                  AI agents reference <code>/comms/messaging.md</code> when writing copy. Change the messaging doc → agents flag which pages need updates.
                </p>
                <p style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.textSecondary,
                  lineHeight: "1.7",
                  margin: 0,
                }}>
                  Single source of truth • Voice consistency • Automatic updates
                </p>
              </div>

              {/* Engineering */}
              <div style={{
                padding: "24px",
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: "12px",
                border: `2px solid ${theme.colors.border}`,
              }}>
                <h4 style={{
                  fontSize: isMobile ? "18px" : "20px",
                  color: theme.colors.accent,
                  margin: "0 0 8px 0",
                  fontWeight: "600",
                }}>
                  Engineering: Architecture as Context
                </h4>
                <p style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.primary,
                  lineHeight: "1.6",
                  margin: "0 0 12px 0",
                  fontStyle: "italic",
                }}>
                  Technical decisions that agents respect and humans can trace.
                </p>
                <p style={{
                  fontSize: isMobile ? "15px" : "17px",
                  color: theme.colors.text,
                  lineHeight: "1.7",
                  margin: "0 0 12px 0",
                }}>
                  <strong>Living documentation means:</strong> Your architecture decisions inform future code, not just explain past code.
                  Agents check <code>/docs/architecture.md</code> before proposing rewrites. "Why we chose PostgreSQL" is explicit and searchable.
                </p>
                <p style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.textSecondary,
                  lineHeight: "1.7",
                  margin: 0,
                }}>
                  Decision records • Tradeoff visibility • AI that respects history
                </p>
              </div>

              {/* Product */}
              <div style={{
                padding: "24px",
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: "12px",
                border: `2px solid ${theme.colors.border}`,
              }}>
                <h4 style={{
                  fontSize: isMobile ? "18px" : "20px",
                  color: theme.colors.accent,
                  margin: "0 0 8px 0",
                  fontWeight: "600",
                }}>
                  Product: Specs That Reflect Reality
                </h4>
                <p style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.primary,
                  lineHeight: "1.6",
                  margin: "0 0 12px 0",
                  fontStyle: "italic",
                }}>
                  Requirements that update when implementation changes (and vice versa).
                </p>
                <p style={{
                  fontSize: isMobile ? "15px" : "17px",
                  color: theme.colors.text,
                  lineHeight: "1.7",
                  margin: "0 0 12px 0",
                }}>
                  <strong>Living documentation means:</strong> Your specs stay synchronized with reality, not frozen in time.
                  Code changes → spec gets flagged. Spec updates → agents notify engineers. Intent is preserved from user research → implementation.
                </p>
                <p style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.textSecondary,
                  lineHeight: "1.7",
                  margin: 0,
                }}>
                  Bidirectional sync • Intent preservation • Feedback loops
                </p>
              </div>

              {/* Leadership */}
              <div style={{
                padding: "24px",
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: "12px",
                border: `2px solid ${theme.colors.border}`,
              }}>
                <h4 style={{
                  fontSize: isMobile ? "18px" : "20px",
                  color: theme.colors.accent,
                  margin: "0 0 8px 0",
                  fontWeight: "600",
                }}>
                  Leadership: Strategy That Cascades
                </h4>
                <p style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.primary,
                  lineHeight: "1.6",
                  margin: "0 0 12px 0",
                  fontStyle: "italic",
                }}>
                  Strategic context that flows from vision → code → outcomes.
                </p>
                <p style={{
                  fontSize: isMobile ? "15px" : "17px",
                  color: theme.colors.text,
                  lineHeight: "1.7",
                  margin: "0 0 12px 0",
                }}>
                  <strong>Living documentation means:</strong> Your strategy isn't a PDF—it's context that informs every line of code.
                  OKRs connect to features. Market research informs architecture. "Show me all AI decisions from Q4" is one query, not archaeology.
                </p>
                <p style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.textSecondary,
                  lineHeight: "1.7",
                  margin: 0,
                }}>
                  Strategy → code lineage • Decision accountability • Board-ready audits
                </p>
              </div>
            </div>

            {/* Universal Definition */}
            <div style={{
              marginTop: "40px",
              padding: "32px",
              backgroundColor: `${theme.colors.primary}15`,
              borderRadius: "12px",
              border: `2px solid ${theme.colors.primary}`,
            }}>
              <h4 style={{
                fontSize: isMobile ? "18px" : "22px",
                color: theme.colors.primary,
                margin: "0 0 16px 0",
                fontWeight: "700",
                textAlign: "center",
              }}>
                The Universal Truth
              </h4>
              <p style={{
                fontSize: isMobile ? "16px" : "19px",
                color: theme.colors.text,
                lineHeight: "1.8",
                margin: 0,
                textAlign: "center",
                fontWeight: "500",
              }}>
                For <strong>all roles</strong>, living documentation means:<br/>
                Context that's version-controlled alongside code, so AI agents can maintain<br/>
                coherence you couldn't achieve manually.
              </p>
            </div>
          </div>
        }
        media={
          <div
            style={{
              width: "100%",
              height: "600px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <div
              style={{
                padding: "32px",
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: "12px",
                borderLeft: `4px solid ${theme.colors.primary}`,
                maxWidth: "600px",
              }}
            >
              <p
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  color: theme.colors.text,
                  lineHeight: "1.8",
                  fontStyle: "italic",
                  margin: "0 0 16px 0",
                }}
              >
                "Anyone who needs to understand what their AI agents built. Solo developers
                trying to track Cursor. Teams coordinating across multiple agents. Enterprises
                trying to govern AI deployments at scale. The problem scales—and so does our solution."
              </p>
              <p
                style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.textSecondary,
                  margin: 0,
                  fontWeight: "600",
                }}
              >
                — Michael Flannery
              </p>
            </div>
          </div>
        }
        isMobile={isMobile}
      />

      {/* Living Coherence Section - NEW */}
      <Section
        id="living-coherence"
        textPosition="left"
        background="secondary"
        title="Living Documentation is Context Engineering"
        description={
          <div>
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: theme.colors.textSecondary,
                lineHeight: "1.8",
                marginBottom: "24px",
              }}
            >
              You didn't just update a Word doc. You updated strategy-planning on your Desktop.
              Then an AI agent read that document and applied those insights to your website code.
            </p>
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: theme.colors.textSecondary,
                lineHeight: "1.8",
                marginBottom: "24px",
              }}
            >
              <strong>This happened because the agent could see both.</strong>
            </p>
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: theme.colors.text,
                lineHeight: "1.8",
                marginBottom: "24px",
              }}
            >
              That's context engineering: When strategy, code, and context live together in git,
              AI agents can maintain consistency across your entire organization. Version-controlled,
              agent-accessible, zero third-party costs.
            </p>
            <div style={{
              padding: "24px",
              backgroundColor: theme.colors.backgroundSecondary,
              borderRadius: "12px",
              border: `2px solid ${theme.colors.primary}`,
              marginTop: "24px",
            }}>
              <p
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  color: theme.colors.primary,
                  lineHeight: "1.8",
                  margin: 0,
                  fontWeight: "600",
                }}
              >
                "Documentation is static. Context is dynamic. When AI changes code, our system
                knows which docs are affected and flags them automatically. That's living memory."
              </p>
              <p
                style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.textSecondary,
                  marginTop: "12px",
                  fontWeight: "600",
                }}
              >
                — Fernando Ramirez, The Agentic Coding at Airbnb (BPE 2025)
              </p>
            </div>
          </div>
        }
        media={
          <div
            style={{
              width: "100%",
              height: "600px",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Image
              src="/local_drawing.png"
              alt="Design and Share"
              fill
              style={{
                objectFit: "contain",
              }}
            />
          </div>
        }
        isMobile={isMobile}
      />

      {/* Engineering Context Section */}
      <Section
        id="engineering-context"
        textPosition="right"
        background="grid"
        title="Engineering Context Across All Your Repositories"
        description="Browse and explore the structure of all your projects from one unified interface. Understand dependencies, architecture, and documentation across your entire engineering organization."
        media={<EngineeringContextSection isMobile={isMobile} useMultiTree={true} />}
        isMobile={isMobile}
      />

      {/* Book Section */}
      <Section
        id="markdown-viewer"
        textPosition="left"
        background="secondary"
        title="Agents Write a lot of Markdown, It Should be easy to read"
        description={
          <>
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: theme.colors.textSecondary,
                lineHeight: "1.8",
                marginBottom: "24px",
              }}
            >
              Customizable themes allow you to read docs in the way you want to read them
            </p>

            {/* View Mode Switch */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: theme.colors.textSecondary,
                  fontWeight: "500",
                }}
              >
                View Mode:
              </span>
              <button
                onClick={() => setViewMode("book")}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  backgroundColor: viewMode === "book" ? theme.colors.primary : "transparent",
                  color: viewMode === "book" ? theme.colors.background : theme.colors.text,
                  border: `1px solid ${viewMode === "book" ? theme.colors.primary : theme.colors.border}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Book
              </button>
              <button
                onClick={() => setViewMode("single")}
                style={{
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  backgroundColor: viewMode === "single" ? theme.colors.primary : "transparent",
                  color: viewMode === "single" ? theme.colors.background : theme.colors.text,
                  border: `1px solid ${viewMode === "single" ? theme.colors.primary : theme.colors.border}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Single
              </button>
            </div>

            {/* Theme Switcher */}
            <div>
              <span
                style={{
                  fontSize: "14px",
                  color: theme.colors.textSecondary,
                  fontWeight: "500",
                  display: "block",
                  marginBottom: "12px",
                }}
              >
                Themes:
              </span>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                {availableThemes.slice(0, 4).map((themeName) => (
                  <button
                    key={themeName}
                    onClick={() => {
                      setCurrentTheme(themeName);
                    }}
                    style={{
                      padding: "8px 16px",
                      backgroundColor:
                        currentTheme === themeName
                          ? theme.colors.primary
                          : theme.colors.backgroundSecondary,
                      color:
                        currentTheme === themeName
                          ? theme.colors.background
                          : theme.colors.text,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (currentTheme !== themeName) {
                        e.currentTarget.style.backgroundColor =
                          theme.colors.backgroundHover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentTheme !== themeName) {
                        e.currentTarget.style.backgroundColor =
                          theme.colors.backgroundSecondary;
                      }
                    }}
                  >
                    {themeName}
                  </button>
                ))}
              </div>
            </div>
          </>
        }
        media={
          <div
            style={{
              width: "100%",
              height: "600px",
              border: `2px solid ${theme.colors.border}`,
              borderRadius: "12px",
              overflow: "hidden",
              position: "relative",
              backgroundColor: theme.colors.background,
            }}
          >
            {!isClient || slides.length === 0 ? (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.colors.textSecondary,
                  backgroundColor: theme.colors.background,
                  zIndex: 10,
                }}
              >
                Loading presentation...
              </div>
            ) : null}
            <div style={{ opacity: isClient && slides.length > 0 ? 1 : 0, transition: "opacity 0.3s ease-in", height: "100%" }}>
              {slides.length > 0 && (
                <ThemedSlidePresentationBook
                  slides={slides}
                  theme={theme}
                  viewMode={viewMode}
                  showNavigation={true}
                  showSlideCounter={true}
                  showFullscreenButton={true}
                  containerHeight="100%"
                />
              )}
            </div>
          </div>
        }
        isMobile={isMobile}
      />

      {/* Agents Section */}
      <Section
        id="agents-and-more"
        textPosition="right"
        background="grid"
        title="Manage Any Local or Remote Agent from one place"
        description={
          <div>
            <p style={{
              fontSize: isMobile ? "16px" : "18px",
              color: theme.colors.textSecondary,
              lineHeight: "1.8",
              marginBottom: "24px",
            }}>
              Bring whatever agent you use and copy and paste tasks to them. All from one unified interface.
            </p>
            <div style={{
              padding: "24px",
              backgroundColor: theme.colors.backgroundSecondary,
              borderRadius: "12px",
              borderLeft: `4px solid ${theme.colors.primary}`,
            }}>
              <p style={{
                fontSize: isMobile ? "16px" : "18px",
                color: theme.colors.text,
                lineHeight: "1.8",
                fontStyle: "italic",
                margin: "0 0 12px 0",
              }}>
                "As these systems scale, observability becomes the new safety. You can't govern what you can't observe."
              </p>
              <p style={{
                fontSize: isMobile ? "14px" : "16px",
                color: theme.colors.textSecondary,
                margin: 0,
                fontWeight: "600",
              }}>
                — Szczepan Faber, Agentic Coding at Airbnb (DPE 2025)
              </p>
            </div>
          </div>
        }
        media={
          <div
            style={{
              width: "100%",
              height: "600px",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            >
              <source src="/agents_and_more.mov" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        }
        isMobile={isMobile}
      />

      {/* Repositories Video Section */}
      <Section
        id="repositories-video"
        textPosition="left"
        background="secondary"
        title="The Environment For All Your Projects"
        description="We watch your projects for changes to make it easy to understand what is happening at a high level"
        media={
          <div
            style={{
              width: "100%",
              height: "600px",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            >
              <source src="/repositories_video.mov" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        }
        isMobile={isMobile}
      />

      {/* Founder Story Section */}
      <Section
        id="founder-story"
        textPosition="left"
        background="secondary"
        title="We Didn't Build an AI Coding Tool. We Built Infrastructure for Coherent Organizations."
        description={
          <div>
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: theme.colors.textSecondary,
                lineHeight: "1.8",
                marginBottom: "20px",
              }}
            >
              Hi, I'm <strong>Julie Allen</strong>, founder of Principal-ade.
            </p>
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: theme.colors.textSecondary,
                lineHeight: "1.8",
                marginBottom: "20px",
              }}
            >
              I started building this because I was frustrated with AI coding tools. But I realized
              the problem was bigger than code. It's about <strong>organizational coherence</strong>.
            </p>
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: theme.colors.textSecondary,
                lineHeight: "1.8",
                marginBottom: "20px",
              }}
            >
              Your marketing team writes messaging. Your product team writes specs. Your engineering
              team writes code. Your AI agents work in silos. None of them know what the others are doing.
            </p>
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: theme.colors.textSecondary,
                lineHeight: "1.8",
                marginBottom: "20px",
              }}
            >
              Every other platform fragments your institutional knowledge across cloud tools—
              Google Docs, Notion, ChatGPT, Cursor. When context is architectural, that means
              your competitive advantage evaporates when the session ends.
            </p>
            <p
              style={{
                fontSize: isMobile ? "18px" : "20px",
                color: theme.colors.primary,
                lineHeight: "1.8",
                fontWeight: "600",
                marginBottom: "20px",
              }}
            >
              Every other tool stores context in the cloud. We store it in Git.
              That's not a feature difference—it's architectural. And it means <span style={{ color: '#00C2FF' }}>we eliminate
              third-party tool costs</span> while making context version-controlled and agent-accessible.
            </p>
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: theme.colors.textSecondary,
                lineHeight: "1.8",
                marginBottom: "20px",
              }}
            >
              That's the breakthrough: We didn't solve "how do we track AI code."
            </p>
            <p
              style={{
                fontSize: isMobile ? "18px" : "20px",
                color: theme.colors.accent,
                lineHeight: "1.8",
                fontWeight: "600",
              }}
            >
              We solved "how do teams maintain coherence when AI agents are doing the work."<br/>
              The answer: Context engineering through living documentation.
            </p>
          </div>
        }
        media={
          <div
            style={{
              width: "100%",
              height: "600px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
            }}
          >
            <div
              onClick={handleLogoClick}
              style={{
                width: isMobile ? "200px" : "300px",
                height: isMobile ? "200px" : "300px",
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Logo
                width={isMobile ? 200 : 300}
                height={isMobile ? 200 : 300}
                color={theme.colors.primary}
                particleColor={theme.colors.accent}
                opacity={0.9}
              />
            </div>
          </div>
        }
        isMobile={isMobile}
      />

      {/* Download Section */}
      <Section
        id="download"
        textPosition="right"
        background="grid"
        title="Ready to Build with Living Coherence?"
        description={
          <div>
            <p
              style={{
                fontSize: isMobile ? "17px" : "20px",
                color: theme.colors.primary,
                lineHeight: "1.7",
                marginBottom: "24px",
                fontWeight: "600",
              }}
            >
              Every other tool stores context in the cloud. We store it in Git.<br/>
              That's not a feature difference—it's architectural.
            </p>
            <p
              style={{
                fontSize: isMobile ? "16px" : "18px",
                color: theme.colors.text,
                lineHeight: "1.6",
                marginBottom: "32px",
              }}
            >
              And it means <span style={{ color: '#00C2FF' }}>we eliminate third-party tool complexity</span> while making context<br/>
              version-controlled and agent-accessible.
            </p>
            <p
              style={{
                fontSize: isMobile ? "15px" : "17px",
                color: theme.colors.textSecondary,
                lineHeight: "1.6",
                marginBottom: "32px",
              }}
            >
              Download the alpha and start practicing context engineering.
            </p>
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.textSecondary,
                  lineHeight: "1.8",
                  marginBottom: "12px",
                }}
              >
                Or explore first:
              </p>
              <ul
                style={{
                  fontSize: isMobile ? "15px" : "17px",
                  color: theme.colors.text,
                  lineHeight: "2",
                  listStyle: "none",
                  padding: 0,
                }}
              >
                <li>→ See how we're using it to build Principal-ade</li>
                <li>→ Read about the universal workspace vision</li>
                <li>→ Browse the pitch deck</li>
                <li>→ Join the alpha community</li>
              </ul>
            </div>
            <p
              style={{
                fontSize: isMobile ? "14px" : "16px",
                color: theme.colors.textSecondary,
                lineHeight: "1.8",
                fontStyle: "italic",
              }}
            >
              Principal-ade: The universal workspace for agentic work.<br/>
              Living documentation is the key to context engineering and by extension agentic work.
            </p>
          </div>
        }
        media={
          <div
            style={{
              width: "100%",
              height: "600px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
            }}
          >
            <a
              href="/download"
              style={{
                padding: "20px 40px",
                fontSize: "22px",
                fontWeight: "700",
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
                boxShadow: `0 4px 16px ${theme.colors.primary}30`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 12px 32px ${theme.colors.primary}50`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 4px 16px ${theme.colors.primary}30`;
              }}
            >
              Download Alpha
            </a>
            <div
              style={{
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <Link
                href="/blog/pitch-deck"
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "600",
                  backgroundColor: "transparent",
                  color: theme.colors.primary,
                  border: `2px solid ${theme.colors.primary}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.colors.primary}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                View Pitch Deck
              </Link>
              <Link
                href="/sessions"
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  fontWeight: "600",
                  backgroundColor: "transparent",
                  color: theme.colors.accent,
                  border: `2px solid ${theme.colors.accent}`,
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.colors.accent}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Explore Sessions
              </Link>
            </div>
          </div>
        }
        isMobile={isMobile}
      />
    </div>
  );
};