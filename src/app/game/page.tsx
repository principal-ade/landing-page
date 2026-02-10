"use client";

import React from "react";
import ClientThemeProvider from "@/components/providers/ClientThemeProvider";
import { MazeDemo } from "@/components/MazeDemo";

export default function GamePage() {
  return (
    <ClientThemeProvider>
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
        }}
      >
        <div style={{ maxWidth: "800px", width: "100%" }}>
          <MazeDemo />
        </div>
      </div>
    </ClientThemeProvider>
  );
}
