"use client";

import React from "react";
import { useTheme } from "@principal-ade/industry-theme";
import { Manifesto } from "../../components/Manifesto";
import { Footer } from "../../components/Footer";

export default function AboutPage() {
  const { theme } = useTheme();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: theme.colors.background }}>
      <main style={{ flex: 1 }}>
        <Manifesto />
      </main>
      <Footer />
    </div>
  );
}
