"use client";

import React, { useState } from "react";
import { Footer } from "../../components/Footer";
import { COLORS } from "../../styles/colors";

export default function DemoPage() {
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
        background: COLORS.background,
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
            color: COLORS.text,
            marginBottom: "16px",
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
        >
          Schedule a Demo
        </h1>

        <p
          style={{
            fontSize: isMobile ? "16px" : "18px",
            color: COLORS.textSecondary,
            marginBottom: "40px",
            lineHeight: "1.6",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          Schedule a 30-minute walkthrough with our team. We'll show you Living Documentation, tour Principal ADE, and answer questions about your specific use case.
        </p>

        {/* Success Message */}
        {status === "success" && (
          <div
            style={{
              background: "rgba(255, 107, 53, 0.1)",
              border: `1px solid ${COLORS.primary}`,
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px",
              color: COLORS.primary,
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            Thank you! We've received your demo request and will be in touch shortly.
          </div>
        )}

        {/* Error Message */}
        {status === "error" && (
          <div
            style={{
              background: "rgba(220, 38, 38, 0.1)",
              border: "1px solid #dc2626",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px",
              color: "#dc2626",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            Something went wrong. Please try again or email us directly at{" "}
            <a
              href="mailto:info@noetic-labs.ai"
              style={{ color: "#dc2626", textDecoration: "underline" }}
            >
              info@noetic-labs.ai
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
                color: COLORS.text,
                marginBottom: "8px",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
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
                background: COLORS.background,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "8px",
                color: COLORS.text,
                fontSize: "16px",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = COLORS.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = COLORS.border;
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
                color: COLORS.text,
                marginBottom: "8px",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
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
                background: COLORS.background,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "8px",
                color: COLORS.text,
                fontSize: "16px",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = COLORS.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = COLORS.border;
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
                color: COLORS.text,
                marginBottom: "8px",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
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
                background: COLORS.background,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "8px",
                color: COLORS.text,
                fontSize: "16px",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = COLORS.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = COLORS.border;
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
                color: COLORS.text,
                marginBottom: "8px",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
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
                background: COLORS.background,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "8px",
                color: COLORS.text,
                fontSize: "16px",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = COLORS.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = COLORS.border;
              }}
            >
              <option value="" style={{ background: COLORS.white }}>
                Select team size
              </option>
              <option value="1-5" style={{ background: COLORS.white }}>
                1-5 people
              </option>
              <option value="6-20" style={{ background: COLORS.white }}>
                6-20 people
              </option>
              <option value="21-50" style={{ background: COLORS.white }}>
                21-50 people
              </option>
              <option value="51-200" style={{ background: COLORS.white }}>
                51-200 people
              </option>
              <option value="200+" style={{ background: COLORS.white }}>
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
                color: COLORS.text,
                marginBottom: "8px",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
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
                background: COLORS.background,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "8px",
                color: COLORS.text,
                fontSize: "16px",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = COLORS.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = COLORS.border;
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
                color: COLORS.text,
                marginBottom: "8px",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
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
                background: COLORS.background,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "8px",
                color: COLORS.text,
                fontSize: "16px",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
                outline: "none",
                transition: "border-color 0.2s ease",
                resize: "vertical",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = COLORS.primary;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = COLORS.border;
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
                  ? COLORS.textSecondary
                  : COLORS.primary,
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
              cursor: status === "submitting" ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (status !== "submitting") {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.background = COLORS.accent;
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(255, 107, 53, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (status !== "submitting") {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = COLORS.primary;
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {status === "submitting" ? "Submitting..." : "Request Demo"}
          </button>
        </form>

        <p
          style={{
            marginTop: "24px",
            fontSize: "14px",
            color: COLORS.textSecondary,
            textAlign: "center",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          Or email us directly at{" "}
          <a
            href="mailto:info@noetic-labs.ai"
            style={{ color: COLORS.primary, textDecoration: "underline" }}
          >
            info@noetic-labs.ai
          </a>
        </p>
      </div>

      <Footer />
    </div>
  );
}
