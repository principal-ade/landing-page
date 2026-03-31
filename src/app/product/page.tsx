"use client";

import React from "react";
import Image from "next/image";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { COLORS } from "../../styles/colors";

export default function FeaturesPage() {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // File City form state
  const [repoUrl, setRepoUrl] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitResult, setSubmitResult] = React.useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleFileCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch("/api/filecity-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, repoUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitResult({
          success: true,
          message: "We'll send your File City map to your inbox soon!",
        });
        setRepoUrl("");
        setEmail("");
      } else {
        setSubmitResult({
          success: false,
          message: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setSubmitResult({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.background,
        color: COLORS.text,
      }}
    >
      <Header />

      {/* Hero Section - fills viewport */}
      <section
        style={{
          minHeight: "calc(100vh - 70px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: isMobile ? "2rem" : "2rem",
        }}
      >
        {/* Page Header */}
        <div
          style={{
            maxWidth: "800px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? "2rem" : "3.25rem",
              fontWeight: "700",
              lineHeight: "1.15",
              letterSpacing: "-0.03em",
              marginBottom: "1rem",
              fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
            }}
          >
            Story-based software.
            <br />
            <em style={{ fontStyle: "normal", color: COLORS.primary }}>
              From dev to production.
            </em>
          </h1>
          <p
            style={{
              color: COLORS.textSecondary,
              fontSize: isMobile ? "16px" : "1.1rem",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.7",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            Understand what agents build. Verify it does what you intended.
            Monitor it in production.
          </p>
          <a
            href="/download"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "1.5rem",
              background: COLORS.primary,
              color: COLORS.white,
              padding: "0.75rem 2rem",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "1rem",
              textDecoration: "none",
              transition: "all 0.2s",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = COLORS.primaryHover;
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = COLORS.primary;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Download App
          </a>
        </div>

        {/* Product Navigation */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            paddingTop: "3rem",
            maxWidth: "700px",
            flexWrap: "wrap",
          }}
        >
        <a
          href="#filecity"
          style={{
            padding: isMobile ? "0.5rem 1rem" : "0.6rem 1.5rem",
            borderRadius: "100px",
            fontSize: isMobile ? "0.8rem" : "0.85rem",
            fontWeight: "600",
            textDecoration: "none",
            transition: "all 0.2s",
            border: `1px solid ${COLORS.secondary}`,
            color: COLORS.secondary,
            background: "rgba(8, 147, 210, 0.1)",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          File City Tours
        </a>
        <a
          href="#radar"
          style={{
            padding: isMobile ? "0.5rem 1rem" : "0.6rem 1.5rem",
            borderRadius: "100px",
            fontSize: isMobile ? "0.8rem" : "0.85rem",
            fontWeight: "600",
            textDecoration: "none",
            transition: "all 0.2s",
            border: `1px solid ${COLORS.accent}`,
            color: COLORS.accent,
            background: "rgba(255, 135, 85, 0.1)",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          Quality Radar
        </a>
        <a
          href="#stories"
          style={{
            padding: isMobile ? "0.5rem 1rem" : "0.6rem 1.5rem",
            borderRadius: "100px",
            fontSize: isMobile ? "0.8rem" : "0.85rem",
            fontWeight: "600",
            textDecoration: "none",
            transition: "all 0.2s",
            border: `1px solid ${COLORS.accent2}`,
            color: COLORS.accent2,
            background: "rgba(34, 211, 238, 0.1)",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          System Stories
        </a>
        </div>
      </section>

      {/* File City Tours Section */}
      <section
        id="filecity"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile ? "80px 24px" : "120px 40px",
          maxWidth: "1200px",
          margin: "0 auto",
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        <div
          style={{
            display: isMobile ? "flex" : "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "40px" : "60px",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          {/* Left Column - Content and Form */}
          <div>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: COLORS.secondary,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              Visual Understanding
            </p>
            <h1
              style={{
                fontSize: isMobile ? "28px" : "40px",
                fontWeight: "600",
                color: COLORS.text,
                margin: "0 0 20px 0",
                lineHeight: "1.15",
                letterSpacing: "-0.025em",
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              Your codebase is a city. Take the tour.
            </h1>
            <p
              style={{
                fontSize: isMobile ? "15px" : "16px",
                fontWeight: "400",
                color: COLORS.textSecondary,
                margin: "0 0 40px 0",
                lineHeight: "1.6",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              3,762 files. 645 folders. Understood in seconds. File City turns
              any repository into an interactive map — structure, composition,
              complexity, what's changing — all visible at once. Agents explore
              alongside you. Hover to inspect. Click to open. No more guessing
              what got built.
            </p>

            {/* Form Card */}
            <div
              style={{
                background: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "16px",
                padding: isMobile ? "32px 24px" : "40px",
                boxShadow: "0 4px 12px rgba(8, 145, 178, 0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: isMobile ? "18px" : "20px",
                  fontWeight: "600",
                  color: COLORS.text,
                  margin: "0 0 8px 0",
                  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                }}
              >
                Get your repo mapped free →
              </h2>
              <p
                style={{
                  fontSize: isMobile ? "14px" : "15px",
                  fontWeight: "400",
                  color: COLORS.textSecondary,
                  margin: "0 0 24px 0",
                  lineHeight: "1.5",
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                }}
              >
                Drop your GitHub URL. We'll generate yours and send it to you.
              </p>

              <form onSubmit={handleFileCitySubmit}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="github.com/your/repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      background: COLORS.background,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: "8px",
                      padding: "12px 16px",
                      fontSize: "15px",
                      color: COLORS.text,
                      fontFamily: "var(--font-inter), system-ui, sans-serif",
                      outline: "none",
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = COLORS.secondary;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = COLORS.border;
                    }}
                  />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    style={{
                      background: COLORS.background,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: "8px",
                      padding: "12px 16px",
                      fontSize: "15px",
                      color: COLORS.text,
                      fontFamily: "var(--font-inter), system-ui, sans-serif",
                      outline: "none",
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = COLORS.secondary;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = COLORS.border;
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background: isSubmitting ? COLORS.gray400 : COLORS.primary,
                      color: COLORS.white,
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px 24px",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      fontFamily: "var(--font-inter), system-ui, sans-serif",
                      transition: "background-color 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.backgroundColor = COLORS.primaryHover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.backgroundColor = COLORS.primary;
                      }
                    }}
                  >
                    {isSubmitting ? "Submitting..." : "Map It"}
                  </button>
                </div>
                {submitResult && (
                  <p
                    style={{
                      fontSize: "14px",
                      color: submitResult.success ? COLORS.success : COLORS.error,
                      margin: "0 0 8px 0",
                      fontFamily: "var(--font-inter), system-ui, sans-serif",
                    }}
                  >
                    {submitResult.message}
                  </p>
                )}
                {!submitResult && (
                  <p
                    style={{
                      fontSize: "13px",
                      color: COLORS.gray500,
                      margin: "0",
                      fontFamily: "var(--font-inter), system-ui, sans-serif",
                    }}
                  >
                    We'll send your File City map to your inbox when ready.
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Right Column - File City Visualization */}
          <div
            style={{
              background: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(8, 145, 178, 0.08)",
              position: "relative",
            }}
          >
            <Image
              src="/tldraw-example.png"
              alt="File City visualization"
              width={800}
              height={600}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: "8px",
              }}
            />
          </div>
        </div>
      </section>

      {/* Quality Radar Section */}
      <section
        id="radar"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile ? "80px 24px" : "120px 40px",
          maxWidth: "1000px",
          margin: "0 auto",
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "2rem" : "4rem",
            alignItems: "center",
          }}
        >
          <div style={{ order: isMobile ? 1 : 2 }}>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: "1rem",
                color: COLORS.accent,
              }}
            >
              Code Health
            </div>
            <h2
              style={{
                fontSize: isMobile ? "1.5rem" : "2.25rem",
                fontWeight: "700",
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
                lineHeight: "1.2",
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              Quality Radar
            </h2>
            <p
              style={{
                fontSize: isMobile ? "16px" : "1.1rem",
                color: COLORS.textSecondary,
                lineHeight: "1.7",
                marginBottom: "1.5rem",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              Now that you can see what was built, the question is: how much of
              it is actually understood? Quality Radar tracks comprehension debt
              across your codebase before it compounds.
            </p>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                {
                  title: "Comprehension debt tracking.",
                  desc: "See where understanding is eroding. Catch it before it becomes a production incident.",
                },
                {
                  title: "Agent impact visibility.",
                  desc: "Track how agent-written commits affect system understanding over time. Know which changes need human review.",
                },
                {
                  title: "Story coverage.",
                  desc: "Know which features have stories and which are running blind. Prioritize what to instrument next.",
                },
                {
                  title: "Team-level insights.",
                  desc: "Understand which parts of the system can run on autopilot vs. which need human eyes.",
                },
              ].map((feature, idx) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start",
                    fontSize: isMobile ? "14px" : "0.95rem",
                    color: COLORS.textSecondary,
                    lineHeight: "1.6",
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                  }}
                >
                  <div
                    style={{
                      width: isMobile ? "20px" : "24px",
                      height: isMobile ? "20px" : "24px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "0.7rem",
                      marginTop: "2px",
                      background: "rgba(255, 135, 85, 0.1)",
                      color: COLORS.accent,
                    }}
                  >
                    →
                  </div>
                  <div>
                    <strong style={{ color: COLORS.text, fontWeight: "600" }}>
                      {feature.title}
                    </strong>{" "}
                    {feature.desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              background: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "16px",
              overflow: "hidden",
              order: isMobile ? 2 : 1,
              boxShadow: "0 2px 8px rgba(8, 145, 178, 0.08)",
            }}
          >
            <Image
              src="/quality-radar.png"
              alt="Quality Radar dashboard"
              width={1200}
              height={800}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                opacity: 0.9,
              }}
            />
          </div>
        </div>
      </section>

      {/* System Stories Section */}
      <section
        id="stories"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile ? "80px 24px" : "120px 40px",
          maxWidth: "1000px",
          margin: "0 auto",
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "2rem" : "4rem",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: "1rem",
                color: COLORS.accent2,
              }}
            >
              Production Monitoring
            </div>
            <h2
              style={{
                fontSize: isMobile ? "1.5rem" : "2.25rem",
                fontWeight: "700",
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
                lineHeight: "1.2",
                fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
              }}
            >
              System Stories
            </h2>
            <p
              style={{
                fontSize: isMobile ? "16px" : "1.1rem",
                color: COLORS.textSecondary,
                lineHeight: "1.7",
                marginBottom: "1.5rem",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              This is the payoff. Your production system tells its own story. Not
              logs. Not dashboards. A human-readable narrative of what happened,
              compared to what should have happened.
            </p>

            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              {[
                {
                  title: "Expected vs. actual.",
                  desc: "See where behavior diverged from intent. Every deviation surfaced visually, instantly.",
                },
                {
                  title: "Root cause in minutes.",
                  desc: "No more grepping logs. No more reconstructing timelines. The story shows you where it broke and why.",
                },
                {
                  title: "Silent failure detection.",
                  desc: "Catch the bugs that pass tests but violate business logic. The ones your monitoring tools can't see.",
                },
                {
                  title: "Git-native.",
                  desc: "Stories live in your repo alongside the code. No cloud lock-in. No dashboard to learn. Version controlled.",
                },
              ].map((feature, idx) => (
                <li
                  key={idx}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start",
                    fontSize: isMobile ? "14px" : "0.95rem",
                    color: COLORS.textSecondary,
                    lineHeight: "1.6",
                    fontFamily: "var(--font-inter), system-ui, sans-serif",
                  }}
                >
                  <div
                    style={{
                      width: isMobile ? "20px" : "24px",
                      height: isMobile ? "20px" : "24px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "0.7rem",
                      marginTop: "2px",
                      background: "rgba(34, 211, 238, 0.1)",
                      color: COLORS.accent2,
                    }}
                  >
                    →
                  </div>
                  <div>
                    <strong style={{ color: COLORS.text, fontWeight: "600" }}>
                      {feature.title}
                    </strong>{" "}
                    {feature.desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              background: COLORS.white,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(8, 145, 178, 0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.75rem 1rem",
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#eab308" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" }} />
              <span
                style={{
                  marginLeft: "0.75rem",
                  fontFamily: "monospace",
                  fontSize: "0.7rem",
                  color: COLORS.gray500,
                }}
              >
                system-stories — production
              </span>
            </div>
            <div
              style={{
                padding: isMobile ? "1rem" : "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: COLORS.background,
              }}
            >
              <Image
                src="/system-story-flow.png"
                alt="System story flow diagram showing expected behavior in blue and error divergence in red"
                width={900}
                height={733}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How They Connect */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: isMobile ? "80px 24px" : "120px 40px",
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "center",
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: "1rem",
            color: COLORS.accent2,
          }}
        >
          One Platform
        </div>
        <h2
          style={{
            fontSize: isMobile ? "1.5rem" : "2rem",
            fontWeight: "700",
            letterSpacing: "-0.02em",
            marginBottom: "1rem",
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          Three features. One story.
        </h2>
        <p
          style={{
            color: COLORS.textSecondary,
            fontSize: isMobile ? "15px" : "1.05rem",
            lineHeight: "1.8",
            maxWidth: "650px",
            margin: "0 auto 2.5rem",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          File City Tours shows you what was built. Quality Radar tells you what's
          understood. System Stories prove it does what you intended. Together,
          they close the comprehension gap from dev to production.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "0.75rem",
            flexWrap: "wrap",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <div
            style={{
              padding: "1rem 1.5rem",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "0.9rem",
              border: `1px solid ${COLORS.secondary}`,
              background: "rgba(8, 147, 210, 0.1)",
              color: COLORS.secondary,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            File City Tours
          </div>
          <div
            style={{
              color: COLORS.gray500,
              fontSize: "1.5rem",
              fontWeight: "300",
              transform: isMobile ? "rotate(90deg)" : "none",
            }}
          >
            →
          </div>
          <div
            style={{
              padding: "1rem 1.5rem",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "0.9rem",
              border: `1px solid ${COLORS.accent}`,
              background: "rgba(255, 135, 85, 0.1)",
              color: COLORS.accent,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            Quality Radar
          </div>
          <div
            style={{
              color: COLORS.gray500,
              fontSize: "1.5rem",
              fontWeight: "300",
              transform: isMobile ? "rotate(90deg)" : "none",
            }}
          >
            →
          </div>
          <div
            style={{
              padding: "1rem 1.5rem",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "0.9rem",
              border: `1px solid ${COLORS.accent2}`,
              background: "rgba(34, 211, 238, 0.1)",
              color: COLORS.accent2,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            System Stories
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: isMobile ? "0.5rem" : "4rem",
            flexWrap: "wrap",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: COLORS.gray500,
            }}
          >
            Understand
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: COLORS.gray500,
            }}
          >
            Assess
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "0.65rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: COLORS.gray500,
            }}
          >
            Verify
          </span>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: isMobile ? "80px 24px" : "120px 40px",
          textAlign: "center",
          maxWidth: "600px",
          margin: "0 auto",
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "1.5rem" : "1.75rem",
            fontWeight: "700",
            letterSpacing: "-0.02em",
            marginBottom: "0.75rem",
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          Ready to see the story?
        </h2>
        <p
          style={{
            color: COLORS.textSecondary,
            fontSize: isMobile ? "15px" : "1rem",
            marginBottom: "2rem",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          Our alpha is live. We're onboarding individual devs and teams now.
        </p>
        <a
          href="/early-access"
          style={{
            background: COLORS.primary,
            color: COLORS.white,
            padding: "0.75rem 2rem",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "1rem",
            textDecoration: "none",
            transition: "all 0.2s",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = COLORS.primaryHover;
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = COLORS.primary;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Get Early Access →
        </a>
      </section>

      <Footer />
    </div>
  );
}
