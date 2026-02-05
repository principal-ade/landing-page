"use client";

import React from "react";
import { About } from "../../components/About";
import { LivingDocumentationSection } from "../../components/LivingDocumentationSection";
import { WhyTeamsUse } from "../../components/WhyTeamsUse";
import { AgenticWorkspaceForV2 } from "../../components/AgenticWorkspaceForV2";
import { JoinTheAlpha } from "../../components/JoinTheAlpha";
import { FAQSection } from "../../components/FAQSection";
import { Footer } from "../../components/Footer";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#000000" }}>
      <main style={{ flex: 1, paddingTop: "80px" }}>
        <About />
        <LivingDocumentationSection />
        <WhyTeamsUse />
        <AgenticWorkspaceForV2 />
        <JoinTheAlpha />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
