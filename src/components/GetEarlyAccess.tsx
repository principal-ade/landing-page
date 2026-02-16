import React, { useState } from "react";
import { motion } from "framer-motion";

interface GetEarlyAccessProps {
  isMobile?: boolean;
}

export const GetEarlyAccess: React.FC<GetEarlyAccessProps> = ({
  isMobile = false,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the data to your backend
    console.log({ email, role, teamSize });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0d1b2a 0%, #0a0d12 100%)",
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
              background: "rgba(0, 194, 255, 0.1)",
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
              stroke="#00C2FF"
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
              color: "#ffffff",
              marginBottom: "16px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            You're in.
          </h2>
          <p
            style={{
              fontSize: isMobile ? "16px" : "18px",
              color: "#9ca3af",
              lineHeight: "1.6",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
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
        background: "linear-gradient(180deg, #0d1b2a 0%, #0a0d12 100%)",
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
              color: "#ffffff",
              marginBottom: "16px",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            Get Early Access
          </h1>
          <p
            style={{
              fontSize: isMobile ? "15px" : "17px",
              color: "#9ca3af",
              lineHeight: "1.6",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
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
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
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
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#00C2FF";
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
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
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
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: "none",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#00C2FF";
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
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
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
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  outline: "none",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#00C2FF";
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

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px 24px",
                background: "#00C2FF",
                color: "#000000",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#00d4ff";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(0, 194, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#00C2FF";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Join the list
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
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
          }}
        >
          Investor or partner?{" "}
          <a
            href="/demo"
            style={{
              color: "#00C2FF",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#00d4ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#00C2FF";
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
