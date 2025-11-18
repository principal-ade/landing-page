"use client";

import React from "react";
import { AboutV2 } from "../../components/AboutV2";
import { LivingDocumentationSection } from "../../components/LivingDocumentationSection";
import { PrincipalFolder } from "../../components/PrincipalFolder";
import { AgenticWorkspaceForV2 } from "../../components/AgenticWorkspaceForV2";
import { FeaturesAndBenefitsV2 } from "../../components/FeaturesAndBenefitsV2";
import { JoinTheAlpha } from "../../components/JoinTheAlpha";
import { Footer } from "../../components/Footer";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#000000" }}>
      <main style={{ flex: 1, paddingTop: "80px" }}>
        <AboutV2 />
        <LivingDocumentationSection />
        <PrincipalFolder />
        <AgenticWorkspaceForV2 />
        <FeaturesAndBenefitsV2 />
        <JoinTheAlpha />
      </main>
      <Footer />
    </div>
  );
}
