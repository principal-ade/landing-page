"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@a24z/industry-theme";

export default function VerifyEmailPage() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();

  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const state = searchParams.get("state");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!state) {
      setError("Invalid verification session. Please start the login process again.");
    }
  }, [state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/workos/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state,
          verificationCode: verificationCode.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error_description || "Verification failed. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Store session data in cookie
      if (data.sessionData) {
        document.cookie = `workos_session=${JSON.stringify(data.sessionData)}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
      }

      // Redirect to return URL or home
      window.location.href = data.return_url || "/live-events";
    } catch (error) {
      console.error("Verification error:", error);
      setError("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.background,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: theme.colors.backgroundSecondary,
          borderRadius: theme.radii[3],
          padding: "32px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: theme.fontWeights.bold,
            color: theme.colors.text,
            marginBottom: "8px",
          }}
        >
          Verify Your Email
        </h1>

        <p
          style={{
            fontSize: theme.fontSizes[1],
            color: theme.colors.textSecondary,
            marginBottom: "24px",
          }}
        >
          We&apos;ve sent a verification code to{" "}
          <strong style={{ color: theme.colors.text }}>{email}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="code"
              style={{
                display: "block",
                fontSize: theme.fontSizes[1],
                fontWeight: theme.fontWeights.medium,
                color: theme.colors.text,
                marginBottom: "8px",
              }}
            >
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              disabled={isSubmitting}
              autoFocus
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                borderRadius: theme.radii[2],
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                textAlign: "center",
                letterSpacing: "4px",
                fontWeight: theme.fontWeights.semibold,
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: "12px",
                marginBottom: "16px",
                backgroundColor: "#fee",
                border: "1px solid #fcc",
                borderRadius: theme.radii[2],
                color: "#c33",
                fontSize: theme.fontSizes[1],
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !verificationCode.trim()}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: theme.fontSizes[2],
              fontWeight: theme.fontWeights.semibold,
              borderRadius: theme.radii[2],
              border: "none",
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting || !verificationCode.trim() ? 0.5 : 1,
            }}
          >
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <p
          style={{
            marginTop: "16px",
            fontSize: theme.fontSizes[0],
            color: theme.colors.textSecondary,
            textAlign: "center",
          }}
        >
          Didn&apos;t receive a code? Check your spam folder or{" "}
          <a
            href="/live-events"
            style={{
              color: theme.colors.primary,
              textDecoration: "none",
            }}
          >
            try again
          </a>
        </p>
      </div>
    </div>
  );
}
