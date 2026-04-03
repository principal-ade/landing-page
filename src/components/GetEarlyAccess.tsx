import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@principal-ade/industry-theme";

interface GetEarlyAccessProps {
  isMobile?: boolean;
}

export const GetEarlyAccess: React.FC<GetEarlyAccessProps> = ({
  isMobile = false,
}) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role, teamSize }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(180deg, ${theme.colors.backgroundSecondary} 0%, ${theme.colors.background} 100%)`,
          padding: isMobile ? "40px 24px" : "80px 40px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: "500px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: `${theme.colors.primary}1A`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 32px",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2
            style={{
              fontSize: isMobile ? "28px" : "36px",
              fontWeight: "600",
              color: theme.colors.text,
              marginBottom: "16px",
              fontFamily: theme.fonts.heading,
            }}
          >
            You're in.
          </h2>
          <p
            style={{
              fontSize: isMobile ? "16px" : "18px",
              color: "#9ca3af",
              lineHeight: "1.6",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            We'll reach out with access.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(180deg, ${theme.colors.backgroundSecondary} 0%, ${theme.colors.background} 100%)`,
        padding: isMobile ? "40px 24px" : "80px 40px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "100%",
          maxWidth: "500px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "48px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: isMobile ? "32px" : "44px",
              fontWeight: "600",
              color: theme.colors.text,
              marginBottom: "16px",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
              fontFamily: theme.fonts.heading,
            }}
          >
            Get Early Access
          </h1>
          <p
            style={{
              fontSize: isMobile ? "15px" : "17px",
              color: "#9ca3af",
              lineHeight: "1.6",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            Our alpha is live.<br />We're onboarding individual devs and teams now.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              padding: isMobile ? "32px 24px" : "40px",
            }}
          >
            {/* Email Field */}
            <div style={{ marginBottom: "24px" }}>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#ffffff",
                  marginBottom: "8px",
                  fontFamily: theme.fonts.body,
                }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontFamily: theme.fonts.body,
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}
              />
            </div>

            {/* Role Field */}
            <div style={{ marginBottom: "24px" }}>
              <label
                htmlFor="role"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#ffffff",
                  marginBottom: "8px",
                  fontFamily: theme.fonts.body,
                }}
              >
                What's your role?
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: role ? "#ffffff" : "#6b7280",
                  fontSize: "15px",
                  fontFamily: theme.fonts.body,
                  outline: "none",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="developer">Developer</option>
                <option value="engineering-manager">Engineering Manager</option>
                <option value="cto-vp">CTO / VP Engineering</option>
                <option value="founder">Founder</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Team Size Field */}
            <div style={{ marginBottom: "32px" }}>
              <label
                htmlFor="teamSize"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#ffffff",
                  marginBottom: "8px",
                  fontFamily: theme.fonts.body,
                }}
              >
                Team size
              </label>
              <select
                id="teamSize"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: teamSize ? "#ffffff" : "#6b7280",
                  fontSize: "15px",
                  fontFamily: theme.fonts.body,
                  outline: "none",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                }}
              >
                <option value="" disabled>
                  Select team size
                </option>
                <option value="just-me">Just me</option>
                <option value="2-5">2-5</option>
                <option value="6-20">6-20</option>
                <option value="21-50">21-50</option>
                <option value="50+">50+</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "12px 16px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "8px",
                  color: "#f87171",
                  fontSize: "14px",
                  fontFamily: theme.fonts.body,
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "14px 24px",
                background: isLoading ? "#6b7280" : theme.colors.primary,
                color: theme.colors.textOnPrimary,
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                opacity: isLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.filter = "brightness(1.1)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}66`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.filter = "brightness(1)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {isLoading ? "Submitting..." : "Join the list"}
            </button>
          </div>
        </form>

        {/* Footer Text */}
        <p
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "13px",
            color: "#6b7280",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          Investor or partner?{" "}
          <a
            href="/demo"
            style={{
              color: theme.colors.primary,
              textDecoration: "none",
              transition: "filter 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(1.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)";
            }}
          >
            Schedule a demo
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
};
