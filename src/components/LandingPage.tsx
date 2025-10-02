import React from "react";
import Link from "next/link";
import { useTheme } from "@a24z/industry-theme";
import { Logo } from "@a24z/logo-component";
import { useThemeSwitcher } from "./providers/ClientThemeProvider";
import { ThemedSlidePresentationBook } from "./ThemedSlidePresentationBook";
import { parseMarkdownIntoPresentation } from "themed-markdown";
import { Section } from "./Section";
import { EngineeringContextSection } from "./EngineeringContextSection";

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

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
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
          height: "100vh",
          backgroundColor: theme.colors.background,
          backgroundImage: gridBackground,
          backgroundSize: "100px 100px",
          backgroundPosition: "-1px -1px",
          padding: isMobile ? "40px 20px 80px" : "60px 40px 120px",
          position: "relative",
          scrollSnapAlign: "start",
          scrollSnapStop: "always",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Action Buttons - Bottom Center */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "120px" : "140px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <a
            href="/download"
            style={{
              padding: isMobile ? "8px 16px" : "10px 20px",
              fontSize: isMobile ? "14px" : "15px",
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
              width: isMobile ? "100px" : "200px",
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
          <Link
            href="/blog"
            style={{
              padding: isMobile ? "8px 16px" : "10px 20px",
              fontSize: isMobile ? "14px" : "15px",
              fontWeight: "600",
              backgroundColor: "transparent",
              color: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              width: isMobile ? "100px" : "200px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = theme.colors.primary;
              e.currentTarget.style.color = theme.colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = theme.colors.border;
              e.currentTarget.style.color = theme.colors.text;
            }}
          >
            Blog
          </Link>
        </div>

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
          }}
        />

        <div
          style={{
            maxWidth: "1400px",
            width: "100%",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "24px" : isTablet ? "28px" : "32px",
              fontWeight: "600",
              marginTop: "0",
              marginBottom: "0",
              color: theme.colors.accent,
              width: "100%",
              paddingLeft: "4px",
            }}
          >
            Principal
          </h2>

          {/* Logo */}
          <div
            style={{
              marginBottom: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              onClick={handleLogoClick}
              style={{
                width: isMobile ? "200px" : "260px",
                height: isMobile ? "200px" : "260px",
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
                width={isMobile ? 200 : 260}
                height={isMobile ? 200 : 260}
                color={theme.colors.primary}
                particleColor={theme.colors.accent}
                opacity={0.9}
              />
            </div>
          </div>

          <h3
            style={{
              fontSize: isMobile ? "20px" : isTablet ? "24px" : "28px",
              fontWeight: "600",
              marginTop: "0",
              marginBottom: "20px",
              color: theme.colors.primary,
              width: "100%",
            }}
          >
            ADE
          </h3>

        </div>

        {/* Quick Links - Left Side */}
        <div
          style={{
            position: "absolute",
            left: isMobile ? "20px" : "350px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "80px",
            zIndex: 10,
          }}
        >
          <div
            onClick={() => {
              const section = document.getElementById("design-and-share");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
            }}
            style={{
              cursor: "pointer",
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "600",
              color: theme.colors.text,
              transition: "all 0.3s ease",
              textDecoration: "none",
              padding: "16px 24px",
              backgroundColor: `${theme.colors.background}80`,
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              border: `1px solid ${theme.colors.border}40`,
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
            Design And Share
          </div>
          <div
            onClick={() => {
              const section = document.getElementById("markdown-viewer");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
            }}
            style={{
              cursor: "pointer",
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "600",
              color: theme.colors.text,
              transition: "all 0.3s ease",
              textDecoration: "none",
              padding: "16px 24px",
              backgroundColor: `${theme.colors.background}80`,
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              border: `1px solid ${theme.colors.border}40`,
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
            Review Plans
          </div>
        </div>

        {/* Quick Links - Right Side */}
        <div
          style={{
            position: "absolute",
            right: isMobile ? "20px" : "350px",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: "80px",
            alignItems: "flex-end",
            zIndex: 10,
          }}
        >
          <div
            onClick={() => {
              const section = document.getElementById("agents-and-more");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
            }}
            style={{
              cursor: "pointer",
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "600",
              color: theme.colors.text,
              transition: "all 0.3s ease",
              textDecoration: "none",
              padding: "16px 24px",
              backgroundColor: `${theme.colors.background}80`,
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              border: `1px solid ${theme.colors.border}40`,
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
            Manage Agents
          </div>
          <div
            onClick={() => {
              const section = document.getElementById("repositories-video");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
            }}
            style={{
              cursor: "pointer",
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "600",
              color: theme.colors.text,
              transition: "all 0.3s ease",
              textDecoration: "none",
              padding: "16px 24px",
              backgroundColor: `${theme.colors.background}80`,
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              border: `1px solid ${theme.colors.border}40`,
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
            All Your Projects
          </div>
          <div
            onClick={() => {
              const section = document.getElementById("engineering-context");
              if (section) {
                section.scrollIntoView({ behavior: "smooth" });
              }
            }}
            style={{
              cursor: "pointer",
              fontSize: isMobile ? "16px" : "18px",
              fontWeight: "600",
              color: theme.colors.text,
              transition: "all 0.3s ease",
              textDecoration: "none",
              padding: "16px 24px",
              backgroundColor: `${theme.colors.background}80`,
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              border: `1px solid ${theme.colors.border}40`,
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
            Engineering Context
          </div>
        </div>
      </div>

      {/* Design And Share Section */}
      <Section
        id="design-and-share"
        textPosition="left"
        background="secondary"
        title="Design And Share"
        description={
          <p
            style={{
              fontSize: isMobile ? "16px" : "18px",
              color: theme.colors.textSecondary,
              lineHeight: "1.8",
              margin: 0,
            }}
          >
            We store all the information in your git repositories so that they are available with your team, no login or subscription necessary. Just sync and share. We use{" "}
            <a
              href="https://github.com/a24z-ai/core-library"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: theme.colors.primary,
                textDecoration: "none",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              a24z-memory
            </a>{" "}
            to do it.
          </p>
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
            <img
              src="/local_drawing.png"
              alt="Design and Share"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        }
        isMobile={isMobile}
        isTablet={isTablet}
      />

      {/* Book Section */}
      <Section
        id="markdown-viewer"
        textPosition="right"
        background="grid"
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
        isTablet={isTablet}
      />

      {/* Agents Section */}
      <Section
        id="agents-and-more"
        textPosition="left"
        background="secondary"
        title="Manage Any Local or Remote Agent from one place"
        description="Bring whatever agent you use and copy and paste tasks to them. All from one unified interface."
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
        isTablet={isTablet}
      />

      {/* Repositories Video Section */}
      <Section
        id="repositories-video"
        textPosition="right"
        background="grid"
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
        isTablet={isTablet}
      />

      {/* Engineering Context Section */}
      <Section
        id="engineering-context"
        textPosition="left"
        background="secondary"
        title="Engineering Context Across All Your Repositories"
        description="Browse and explore the structure of all your projects from one unified interface. Understand dependencies, architecture, and documentation across your entire engineering organization."
        media={<EngineeringContextSection isMobile={isMobile} isTablet={isTablet} useMultiTree={true} />}
        isMobile={isMobile}
        isTablet={isTablet}
      />

      {/* Download Section */}
      <Section
        id="download"
        textPosition="left"
        background="secondary"
        title="Ready to be a Principal Engineer?"
        description=""
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
            <a
              href="/download"
              style={{
                padding: "16px 32px",
                fontSize: "18px",
                fontWeight: "600",
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                textDecoration: "none",
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
          </div>
        }
        isMobile={isMobile}
        isTablet={isTablet}
      />
    </div>
  );
};