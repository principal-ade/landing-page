"use client";

import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PrincipalFeed } from "@/components/PrincipalFeed";

export default function PrincipalFeedPage() {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <PrincipalFeed isMobile={isMobile} />
      <Footer />
    </div>
  );
}
