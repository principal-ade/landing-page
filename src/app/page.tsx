"use client";

import React from "react";
import { LandingPage } from "../components/LandingPage";
import { ThemeSelector } from "../components/ThemeSelector";

export default function HomePage() {
  return (
    <>
      <ThemeSelector position="fixed" />
      <LandingPage onExploreGithub={() => {}} />
    </>
  );
}