"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import for LandingPage
const LandingPage = dynamic(
  () =>
    import("../../components/LandingPage").then((mod) => ({
      default: mod.LandingPage,
    })),
  { ssr: false },
);

export default function WorkspacePageClient() {
  const [showLandingPage] = useState(true);

  const handleExploreGithub = () => {
    // For now, just a placeholder - no actual GitHub functionality
    console.log("Explore GitHub clicked");
  };

  if (showLandingPage) {
    return <LandingPage onExploreGithub={handleExploreGithub} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Specktor</h1>
        <p className="text-gray-400">
          Elegant Context Management for Agentic Coding
        </p>
      </div>
    </div>
  );
}
