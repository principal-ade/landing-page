"use client";

import React from "react";
import { Manifesto } from "../../components/Manifesto";
import { Footer } from "../../components/Footer";
import { COLORS } from "../../styles/colors";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: COLORS.background }}>
      <main style={{ flex: 1, paddingTop: "80px" }}>
        <Manifesto />
      </main>
      <Footer />
    </div>
  );
}
