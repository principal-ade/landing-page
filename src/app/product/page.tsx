"use client";

import React from "react";
import { MultipleViews } from "../../components/MultipleViews";
import { Footer } from "../../components/Footer";

export default function ProductPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0d1117",
      }}
    >
      {/* Navigation Header */}
      <header
        style={{
          background: "rgba(13, 17, 23, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "20px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <a
            href="/"
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#ffffff",
              textDecoration: "none",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            ← Principal AI
          </a>
          <a
            href="/demo"
            style={{
              padding: "10px 20px",
              background: "#00C2FF",
              color: "#0d1117",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            }}
          >
            Book Demo
          </a>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <div
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(0, 194, 255, 0.1) 0%, transparent 50%), #0d1b2a",
            paddingTop: "100px",
            paddingBottom: "80px",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 40px",
            }}
          >
            <p
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#00C2FF",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "24px",
              }}
            >
              Product
            </p>
            <h1
              style={{
                fontSize: "56px",
                fontWeight: "600",
                color: "#ffffff",
                lineHeight: "1.1",
                letterSpacing: "-0.03em",
                marginBottom: "24px",
                maxWidth: "800px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              Visual Understanding of Software
            </h1>
            <p
              style={{
                fontSize: "20px",
                color: "#9ca3af",
                lineHeight: "1.6",
                maxWidth: "700px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              Three complementary views to understand any codebase instantly.
              From quality to structure to composition.
            </p>
          </div>
        </div>

        {/* Multiple Views Section */}
        <div
          style={{
            background: "#0a0c10",
            paddingTop: "140px",
            paddingBottom: "140px",
          }}
        >
          <MultipleViews />
        </div>

        {/* CTA Section */}
        <div
          style={{
            background: "#141e30",
            paddingTop: "100px",
            paddingBottom: "100px",
          }}
        >
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              padding: "0 40px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "40px",
                fontWeight: "600",
                color: "#ffffff",
                marginBottom: "24px",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              See It In Action
            </h2>
            <p
              style={{
                fontSize: "18px",
                color: "#9ca3af",
                marginBottom: "40px",
                lineHeight: "1.6",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              }}
            >
              Book a demo to see how these views work on your codebase.
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="/demo"
                style={{
                  display: "inline-block",
                  padding: "16px 32px",
                  background: "#00C2FF",
                  color: "#0d1117",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}
              >
                Book Demo →
              </a>
              <a
                href="/download"
                style={{
                  display: "inline-block",
                  padding: "16px 32px",
                  background: "transparent",
                  color: "#00C2FF",
                  border: "1px solid #00C2FF",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
                }}
              >
                Download Alpha
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
