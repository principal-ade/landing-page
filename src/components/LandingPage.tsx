import React from "react";
import { useTheme } from "@a24z/industry-theme";
import {
  CheckCircle,
  GitBranch,
  Activity,
} from "lucide-react";
import { Logo } from "./Logo";
import { useThemeSwitcher } from "./providers/ClientThemeProvider";
import { ThemedSlidePresentationBook } from "./ThemedSlidePresentationBook";
import { parseMarkdownIntoPresentation } from "themed-markdown";

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
          <p
            style={{
              fontSize: isMobile ? "14px" : "16px",
              color: theme.colors.textSecondary,
              marginTop: "0",
              marginBottom: "20px",
              fontWeight: "500",
            }}
          >
            The Agentic Development Environment for Principal Engineers
          </p>
          <h1
            style={{
              fontSize: isMobile ? "32px" : isTablet ? "40px" : "48px",
              fontWeight: "700",
              marginTop: "0",
              marginBottom: "0",
              color: theme.colors.primary,
              width: "100%",
              paddingLeft: "10px",
            }}
          >
            Principal
          </h1>
          <h2
            style={{
              fontSize: isMobile ? "24px" : isTablet ? "28px" : "32px",
              fontWeight: "600",
              marginTop: "0",
              marginBottom: "0",
              color: theme.colors.textSecondary,
              width: "100%",
            }}
          >
            ADE
          </h2>

          {/* Logo */}
          <div
            style={{
              marginBottom: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: isMobile ? "20px" : "40px",
              position: "relative",
            }}
          >
            {/* Left side themes */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                justifyContent: "flex-end",
                maxWidth: isMobile ? "120px" : "200px",
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
                    fontSize: isMobile ? "12px" : "14px",
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

            <div
              onClick={handleLogoClick}
              style={{
                width: isMobile ? "150px" : "200px",
                height: isMobile ? "150px" : "200px",
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
                width={isMobile ? 150 : 200}
                height={isMobile ? 150 : 200}
                color={theme.colors.primary}
                particleColor={theme.colors.accent}
                opacity={0.9}
              />
            </div>

            {/* Right side themes */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                maxWidth: isMobile ? "120px" : "200px",
              }}
            >
              {availableThemes.slice(4, 8).map((themeName) => (
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
                    fontSize: isMobile ? "12px" : "14px",
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

          {/* Download Button */}
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
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
              Download
            </a>
          </div>

        </div>
      </div>

      {/* Book Section */}
      <div
        style={{
          height: "100vh",
          backgroundColor: theme.colors.background,
          backgroundImage: gridBackground,
          backgroundSize: "100px 100px",
          backgroundPosition: "-1px -1px",
          padding: isMobile ? "40px 20px" : "60px 40px",
          position: "relative",
          scrollSnapAlign: "start",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            width: "100%",
            height: "80vh",
            border: `2px solid ${theme.colors.border}`,
            borderRadius: "12px",
            overflow: "hidden",
            position: "relative",
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
                viewMode="book"
                showNavigation={true}
                showSlideCounter={true}
                showFullscreenButton={true}
                containerHeight="100%"
              />
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        style={{
          minHeight: "100vh",
          paddingTop: isMobile ? "60px" : "80px",
          paddingBottom: isMobile ? "60px" : "80px",
          backgroundColor: theme.colors.backgroundSecondary,
          width: "100%",
          scrollSnapAlign: "start",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            paddingLeft: isMobile ? "20px" : "40px",
            paddingRight: isMobile ? "20px" : "40px",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "28px" : "36px",
              fontWeight: "600",
              marginBottom: "24px",
              color: theme.colors.text,
              textAlign: "center",
            }}
          >
            Elevate Your Engineering Practice
          </h2>

          <p
            style={{
              fontSize: isMobile ? "16px" : "18px",
              color: theme.colors.textSecondary,
              lineHeight: "1.8",
              maxWidth: "800px",
              margin: "0 auto 40px",
              textAlign: "center",
            }}
          >
            Principal ADE combines the wisdom of senior engineering leadership with AI-powered analysis
            to help you build better software, faster.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "32px",
              marginBottom: "48px",
            }}
          >
            <div
              style={{
                backgroundColor: theme.colors.background,
                borderRadius: "16px",
                padding: "32px",
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "20px",
                }}
              >
                <GitBranch size={28} color={theme.colors.primary} />
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: theme.colors.text,
                    margin: 0,
                  }}
                >
                  Strategic Decision Making
                </h3>
              </div>
              <p
                style={{
                  fontSize: "16px",
                  color: theme.colors.textSecondary,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Make informed technical decisions with comprehensive analysis of trade-offs, 
                scalability implications, and long-term maintenance costs.
              </p>
            </div>

            <div
              style={{
                backgroundColor: theme.colors.background,
                borderRadius: "16px",
                padding: "32px",
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "20px",
                }}
              >
                <Activity size={28} color={theme.colors.success} />
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: theme.colors.text,
                    margin: 0,
                  }}
                >
                  Continuous Monitoring
                </h3>
              </div>
              <p
                style={{
                  fontSize: "16px",
                  color: theme.colors.textSecondary,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Stay ahead of technical debt and performance issues with continuous 
                codebase analysis and proactive improvement suggestions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div
        style={{
          paddingTop: isMobile ? "60px" : "80px",
          paddingBottom: isMobile ? "60px" : "80px",
          backgroundColor: theme.colors.background,
          width: "100%",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            paddingLeft: isMobile ? "20px" : "40px",
            paddingRight: isMobile ? "20px" : "40px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "28px" : "36px",
              fontWeight: "600",
              marginBottom: "24px",
              color: theme.colors.text,
            }}
          >
            Ready to Transform Your Engineering Practice?
          </h2>

          <p
            style={{
              fontSize: isMobile ? "16px" : "18px",
              color: theme.colors.textSecondary,
              lineHeight: "1.8",
              marginBottom: "40px",
            }}
          >
            Join the waitlist to be among the first to experience Principal ADE and
            revolutionize how you approach software architecture and team leadership.
          </p>

          <button
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
              gap: "12px",
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
            <CheckCircle size={20} />
            Join Waitlist
          </button>
        </div>
      </div>
    </div>
  );
};