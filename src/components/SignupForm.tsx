import React, { useState } from "react";

interface SignupFormProps {
  isMobile?: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({ isMobile = false }) => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    company: "",
    repoUrl: "",
    useCase: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isSubmitted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "40px 24px" : "60px 40px",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #00C2FF, #0099FF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 32px auto",
            }}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
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
            You're on the list!
          </h2>
          <p
            style={{
              fontSize: isMobile ? "16px" : "18px",
              color: "#9ca3af",
              lineHeight: "1.6",
              marginBottom: "32px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            We'll reach out within 3-5 days to get you onboarded.
            <br />
            Check your inbox for a confirmation email.
          </p>
          <a
            href="https://principal.dev/gallery"
            style={{
              color: "#00C2FF",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "500",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            Explore the Gallery while you wait →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "40px 24px" : "60px 40px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: isMobile ? "40px" : "56px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: isMobile ? "48px" : "64px",
              fontWeight: "600",
              color: "#00C2FF",
              lineHeight: "1.1",
              letterSpacing: "-0.02em",
              marginBottom: "24px",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            Request Early Access
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#a0aec0",
              lineHeight: "1.6",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              letterSpacing: "-0.01em",
            }}
          >
            Setup help available • Free during alpha
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Email */}
            <div>
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
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: "16px",
                  color: "#ffffff",
                  backgroundColor: "rgba(17, 24, 39, 0.6)",
                  border: "1px solid rgba(55, 65, 81, 0.6)",
                  borderRadius: "8px",
                  outline: "none",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#00C2FF";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(55, 65, 81, 0.6)";
                }}
              />
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
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
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: "16px",
                  color: "#ffffff",
                  backgroundColor: "rgba(17, 24, 39, 0.6)",
                  border: "1px solid rgba(55, 65, 81, 0.6)",
                  borderRadius: "8px",
                  outline: "none",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#00C2FF";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(55, 65, 81, 0.6)";
                }}
              />
            </div>

            {/* Company */}
            <div>
              <label
                htmlFor="company"
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
                Company / Role
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name or Independent Developer"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: "16px",
                  color: "#ffffff",
                  backgroundColor: "rgba(17, 24, 39, 0.6)",
                  border: "1px solid rgba(55, 65, 81, 0.6)",
                  borderRadius: "8px",
                  outline: "none",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#00C2FF";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(55, 65, 81, 0.6)";
                }}
              />
            </div>

            {/* GitHub Repo URL */}
            <div>
              <label
                htmlFor="repoUrl"
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
                GitHub Repo URL{" "}
                <span style={{ color: "#6b7280", fontWeight: "400" }}>
                  (optional)
                </span>
              </label>
              <input
                type="url"
                id="repoUrl"
                name="repoUrl"
                value={formData.repoUrl}
                onChange={handleChange}
                placeholder="github.com/your/repo"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: "16px",
                  color: "#ffffff",
                  backgroundColor: "rgba(17, 24, 39, 0.6)",
                  border: "1px solid rgba(55, 65, 81, 0.6)",
                  borderRadius: "8px",
                  outline: "none",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  transition: "border-color 0.2s ease",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#00C2FF";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(55, 65, 81, 0.6)";
                }}
              />
              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginTop: "6px",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}
              >
                Helps us prepare for your onboarding
              </p>
            </div>

            {/* Use Case */}
            <div>
              <label
                htmlFor="useCase"
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
                What do you want to use Principal for?
              </label>
              <textarea
                id="useCase"
                name="useCase"
                value={formData.useCase}
                onChange={handleChange}
                placeholder="Tell us about your use case..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: "16px",
                  color: "#ffffff",
                  backgroundColor: "rgba(17, 24, 39, 0.6)",
                  border: "1px solid rgba(55, 65, 81, 0.6)",
                  borderRadius: "8px",
                  outline: "none",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                  transition: "border-color 0.2s ease",
                  resize: "vertical",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#00C2FF";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(55, 65, 81, 0.6)";
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "16px 32px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#ffffff",
                backgroundColor: "#0099FF",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                transition: "all 0.2s ease",
                boxShadow: "0 4px 16px rgba(0, 153, 255, 0.3)",
                marginTop: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0088EE";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 20px rgba(0, 153, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#0099FF";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(0, 153, 255, 0.3)";
              }}
            >
              Join Early Access
            </button>

            {/* Helper text */}
            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                textAlign: "center",
                lineHeight: "1.5",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              Setup help available • Free during alpha
              <br />
              We'll reach out within 3-5 days
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
