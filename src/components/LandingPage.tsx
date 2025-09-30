import React from "react";
import { useTheme } from "themed-markdown";
import {
  Download,
  CheckCircle,
  Zap,
  Users,
  Bot,
  Brain,
  GitBranch,
  Database,
  Activity,
} from "lucide-react";
import { Logo } from "./Logo";

interface LandingPageProps {
  onExploreGithub: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({}) => {
  const { theme } = useTheme();

  // Responsive breakpoints with React hooks
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  // Platform detection for download button
  const [platform, setPlatform] = React.useState<
    "mac" | "windows" | "linux" | null
  >(null);
  const [architecture, setArchitecture] = React.useState<"arm64" | "x64">(
    "x64",
  );

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("mac")) {
      setPlatform("mac");
      // Detect Apple Silicon vs Intel
      const isAppleSilicon =
        userAgent.includes("arm") || navigator.platform === "MacIntel";
      setArchitecture(isAppleSilicon ? "arm64" : "x64");
    } else if (userAgent.includes("win")) {
      setPlatform("windows");
    } else if (userAgent.includes("linux")) {
      setPlatform("linux");
    }
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Create a subtle grid pattern
  const gridBackground = `
    linear-gradient(${theme.colors.border}40 1px, transparent 1px),
    linear-gradient(90deg, ${theme.colors.border}40 1px, transparent 1px)
  `;

  return (
    <div style={{ width: "100%", overflow: "auto" }}>
      {/* Hero Section */}
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: theme.colors.background,
          backgroundImage: gridBackground,
          backgroundSize: "100px 100px",
          backgroundPosition: "-1px -1px",
          padding: isMobile ? "60px 20px 80px" : "100px 40px 120px",
          position: "relative",
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
          <h1
            style={{
              fontSize: isMobile ? "32px" : isTablet ? "40px" : "48px",
              fontWeight: "700",
              marginTop: "0",
              marginBottom: "0",
              color: theme.colors.primary,
              width: "100%",
            }}
          >
            Principal ADE
          </h1>

          {/* Logo */}
          <div
            style={{
              marginBottom: isMobile ? "15px" : "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: isMobile ? "150px" : "200px",
                height: isMobile ? "150px" : "200px",
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
          </div>

          {/* Download Button */}
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* Download Button - Only show for Mac users */}
            {platform === "mac" && (
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
                  gap: "12px",
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
                <Download size={20} />
                Download for Mac ({architecture === "arm64" ? "Apple Silicon" : "Intel"})
              </a>
            )}
          </div>

          <p
            style={{
              fontSize: isMobile ? "16px" : isTablet ? "18px" : "20px",
              color: theme.colors.textSecondary,
              lineHeight: "1.6",
              padding: isMobile ? "0 10px" : "0",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: isMobile ? "30px" : "40px",
              marginBottom: isMobile ? "20px" : "30px",
            }}
          >
            The Agentic Development Environment for Principal Engineers
          </p>

          {/* Feature Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : isTablet
                ? "repeat(2, 1fr)"
                : "repeat(3, 1fr)",
              gap: "24px",
              maxWidth: "1000px",
              margin: "0 auto 60px",
            }}
          >
            <div
              style={{
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: "16px",
                padding: "24px",
                border: `2px solid ${theme.colors.border}`,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <Brain size={24} color={theme.colors.primary} />
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: theme.colors.text,
                    margin: 0,
                  }}
                >
                  Architectural Guidance
                </h3>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: theme.colors.textSecondary,
                  lineHeight: "1.5",
                  margin: 0,
                }}
              >
                Get expert-level architectural recommendations and design pattern suggestions 
                tailored to your codebase and team needs.
              </p>
            </div>

            <div
              style={{
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: "16px",
                padding: "24px",
                border: `2px solid ${theme.colors.border}`,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <Zap size={24} color={theme.colors.primary} />
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: theme.colors.text,
                    margin: 0,
                  }}
                >
                  Code Quality Insights
                </h3>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: theme.colors.textSecondary,
                  lineHeight: "1.5",
                  margin: 0,
                }}
              >
                Continuous analysis of code quality, technical debt, and performance bottlenecks 
                with actionable improvement recommendations.
              </p>
            </div>

            <div
              style={{
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: "16px",
                padding: "24px",
                border: `2px solid ${theme.colors.border}`,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <Users size={24} color={theme.colors.primary} />
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: theme.colors.text,
                    margin: 0,
                  }}
                >
                  Team Leadership
                </h3>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: theme.colors.textSecondary,
                  lineHeight: "1.5",
                  margin: 0,
                }}
              >
                Provide technical leadership and mentorship to your development team 
                with AI-powered guidance and best practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        style={{
          paddingTop: isMobile ? "60px" : "80px",
          paddingBottom: isMobile ? "60px" : "80px",
          backgroundColor: theme.colors.backgroundSecondary,
          width: "100%",
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