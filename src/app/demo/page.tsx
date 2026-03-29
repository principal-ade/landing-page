"use client";

import React, { useState } from "react";
import { useTheme } from "@principal-ade/industry-theme";
import { Footer } from "../../components/Footer";

export default function DemoPage() {
  const { theme } = useTheme();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    teamSize: "",
    preferredDateTime: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          company: "",
          teamSize: "",
          preferredDateTime: "",
          message: "",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: theme.colors.background,
      }}
    >
      <div
        style={{
          flex: 1,
          maxWidth: "600px",
          margin: "0 auto",
          padding: isMobile ? "100px 20px 40px 20px" : "120px 40px 60px 40px",
          width: "100%",
        }}
      >
        {/* Page Title */}
        <h1
          style={{
            fontSize: isMobile ? "32px" : "48px",
            fontWeight: "700",
            color: "#ffffff",
            marginBottom: "16px",
            fontFamily:
              'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Schedule a Demo
        </h1>

        <p
          style={{
            fontSize: isMobile ? "16px" : "18px",
            color: "#d1d5db",
            marginBottom: "40px",
            lineHeight: "1.6",
            fontFamily:
              'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Schedule a 30-minute walkthrough with our team. We'll show you Living Documentation, tour Principal ADE, and answer questions about your specific use case.
        </p>

        {/* Success Message */}
        {status === "success" && (
          <div
            style={{
              background: `${theme.colors.primary}1A`,
              border: `1px solid ${theme.colors.primary}`,
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px",
              color: theme.colors.primary,
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Thank you! We've received your demo request and will be in touch shortly.
          </div>
        )}

        {/* Error Message */}
        {status === "error" && (
          <div
            style={{
              background: "rgba(255, 77, 77, 0.1)",
              border: "1px solid #ff4d4d",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px",
              color: "#ff4d4d",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Something went wrong. Please try again or email us directly at{" "}
            <a
              href="mailto:principalai@noetic-labs.ai"
              style={{ color: "#ff4d4d", textDecoration: "underline" }}
            >
              principalai@noetic-labs.ai
            </a>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="name"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: "8px",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
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
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${theme.colors.primary}33`,
                borderRadius: "8px",
                color: "#ffffff",
                fontSize: "16px",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = `${theme.colors.primary}33`;
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: "8px",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
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
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${theme.colors.primary}33`,
                borderRadius: "8px",
                color: "#ffffff",
                fontSize: "16px",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = `${theme.colors.primary}33`;
              }}
            />
          </div>

          {/* Company */}
          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="company"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: "8px",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${theme.colors.primary}33`,
                borderRadius: "8px",
                color: "#ffffff",
                fontSize: "16px",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = `${theme.colors.primary}33`;
              }}
            />
          </div>

          {/* Team Size */}
          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="teamSize"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: "8px",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Team Size
            </label>
            <select
              id="teamSize"
              name="teamSize"
              value={formData.teamSize}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${theme.colors.primary}33`,
                borderRadius: "8px",
                color: "#ffffff",
                fontSize: "16px",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = `${theme.colors.primary}33`;
              }}
            >
              <option value="" style={{ background: "#1a1a1a" }}>
                Select team size
              </option>
              <option value="1-5" style={{ background: "#1a1a1a" }}>
                1-5 people
              </option>
              <option value="6-20" style={{ background: "#1a1a1a" }}>
                6-20 people
              </option>
              <option value="21-50" style={{ background: "#1a1a1a" }}>
                21-50 people
              </option>
              <option value="51-200" style={{ background: "#1a1a1a" }}>
                51-200 people
              </option>
              <option value="200+" style={{ background: "#1a1a1a" }}>
                200+ people
              </option>
            </select>
          </div>

          {/* Preferred Date/Time */}
          <div style={{ marginBottom: "24px" }}>
            <label
              htmlFor="preferredDateTime"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: "8px",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Preferred Date/Time
            </label>
            <input
              type="text"
              id="preferredDateTime"
              name="preferredDateTime"
              placeholder="e.g., Next Tuesday afternoon, or any day next week"
              value={formData.preferredDateTime}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${theme.colors.primary}33`,
                borderRadius: "8px",
                color: "#ffffff",
                fontSize: "16px",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = `${theme.colors.primary}33`;
              }}
            />
          </div>

          {/* Message */}
          <div style={{ marginBottom: "32px" }}>
            <label
              htmlFor="message"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: "8px",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Questions or Specific Use Cases
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Tell us about your team and what you'd like to learn during the demo..."
              value={formData.message}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255, 255, 255, 0.05)",
                border: `1px solid ${theme.colors.primary}33`,
                borderRadius: "8px",
                color: "#ffffff",
                fontSize: "16px",
                fontFamily:
                  'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                outline: "none",
                transition: "border-color 0.2s ease",
                resize: "vertical",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = `${theme.colors.primary}33`;
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "submitting"}
            style={{
              width: "100%",
              padding: "16px 32px",
              background:
                status === "submitting"
                  ? "#666666"
                  : theme.colors.primary,
              color: theme.colors.textOnPrimary,
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              fontFamily:
                'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              cursor: status === "submitting" ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (status !== "submitting") {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.filter = "brightness(1.1)";
                e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}66`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.filter = "brightness(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {status === "submitting" ? "Submitting..." : "Request Demo"}
          </button>
        </form>

        <p
          style={{
            marginTop: "24px",
            fontSize: "14px",
            color: theme.colors.textMuted,
            textAlign: "center",
            fontFamily:
              'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Or email us directly at{" "}
          <a
            href="mailto:principalai@noetic-labs.ai"
            style={{ color: theme.colors.primary, textDecoration: "underline" }}
          >
            principalai@noetic-labs.ai
          </a>
        </p>
      </div>

      <Footer />
    </div>
  );
}
