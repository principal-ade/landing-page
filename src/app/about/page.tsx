"use client";

import React from "react";
import { Manifesto } from "../../components/Manifesto";
import { Footer } from "../../components/Footer";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#0d1b2a" }}>
      <main style={{ flex: 1, paddingTop: "80px" }}>
        <Manifesto />
      </main>
      <Footer />
    </div>
  );
}
