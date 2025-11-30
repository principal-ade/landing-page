"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Sparkles, FolderGit2, Zap, Check, X } from "lucide-react";
import { Logo } from "@principal-ai/logo-component";
import { useTheme } from "@principal-ade/industry-theme";
import { useThemeSwitcher } from "./providers/ClientThemeProvider";
import { trackDownload, trackButtonClick } from "@/lib/analytics";

interface InvestorReadyLandingPageProps {
  onExploreGithub: () => void;
}

export const InvestorReadyLandingPage: React.FC<InvestorReadyLandingPageProps> = ({}) => {
  const { theme } = useTheme();
  const { currentTheme, setCurrentTheme, availableThemes } = useThemeSwitcher();

  const handleLogoClick = () => {
    const currentIndex = availableThemes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    setCurrentTheme(availableThemes[nextIndex]);
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        background: theme.colors.background,
        color: theme.colors.text
      }}
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
        {/* Ambient Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: theme.colors.primary }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ background: theme.colors.accent }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-12">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-8"
          >
            <div
              onClick={handleLogoClick}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <Logo
                width={200}
                height={200}
                color={theme.colors.primary}
                particleColor={theme.colors.accent}
                opacity={0.9}
              />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight">
              <span style={{ color: theme.colors.accent }}>Principal ADE</span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl font-normal mt-4 block">
                The Agentic Development Environment
                <br />
                <span style={{ color: theme.colors.primary }}>for intelligent teams</span>
              </span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.div
            className="text-xl md:text-2xl max-w-3xl mx-auto space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{ color: theme.colors.textSecondary }}
          >
            <p>Give your codebase a memory.</p>
            <p className="text-lg md:text-xl">
              AI agents can write your code — Principal-ADE helps them understand{" "}
              <span style={{ color: theme.colors.primary }}>why</span>.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link
              href="/download"
              onClick={() => trackDownload('alpha')}
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl"
              style={{
                background: theme.colors.primary,
                color: theme.colors.background,
                boxShadow: `0 8px 32px ${theme.colors.primary}40`,
              }}
            >
              <Download className="w-5 h-5" />
              Download Alpha
            </Link>
            <Link
              href="/blog/pitch-deck"
              onClick={() => trackButtonClick('Investor Deck', '/blog/pitch-deck')}
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                background: 'transparent',
                color: theme.colors.primary,
                border: `2px solid ${theme.colors.primary}`,
              }}
            >
              <Sparkles className="w-5 h-5" />
              Investor Deck
            </Link>
            <Link
              href="/blog"
              onClick={() => trackButtonClick('Blog', '/blog')}
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200"
              style={{
                color: theme.colors.textSecondary,
              }}
            >
              Learn More →
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-16"
            {...fadeIn}
          >
            <div className="space-y-2">
              <div className="text-4xl font-bold" style={{ color: theme.colors.primary }}>∞</div>
              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Context Preserved</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold" style={{ color: theme.colors.primary }}>0</div>
              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Manual Documentation</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold" style={{ color: theme.colors.primary }}>100%</div>
              <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Agent-Safe</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section
        className="py-32 px-6"
        style={{ background: `linear-gradient(to bottom, ${theme.colors.background}, ${theme.colors.backgroundSecondary})` }}
      >
        <motion.div className="max-w-6xl mx-auto" {...fadeIn}>
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-16">
            AI can write your code.
            <br />
            <span style={{ color: theme.colors.textSecondary }}>But it can't remember why.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {/* Without ADE */}
            <div
              className="rounded-2xl p-8 space-y-4 border-2"
              style={{
                background: `${theme.colors.backgroundSecondary}80`,
                borderColor: `${theme.colors.error || '#ef4444'}40`,
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <X className="w-6 h-6" style={{ color: theme.colors.error || '#ef4444' }} />
                <span className="text-xl font-semibold" style={{ color: theme.colors.error || '#ef4444' }}>
                  Without ADE
                </span>
              </div>
              <ul className="space-y-3 text-lg" style={{ color: theme.colors.textSecondary }}>
                <li>• Agents move fast, but context disappears</li>
                <li>• Developers lose intent. Docs rot.</li>
                <li>• Spec debt grows silently</li>
                <li>• No one remembers why systems behave as they do</li>
              </ul>
            </div>

            {/* With ADE */}
            <div
              className="rounded-2xl p-8 space-y-4 border-2"
              style={{
                background: `${theme.colors.primary}10`,
                borderColor: `${theme.colors.primary}40`,
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Check className="w-6 h-6" style={{ color: theme.colors.primary }} />
                <span className="text-xl font-semibold" style={{ color: theme.colors.primary }}>
                  With ADE
                </span>
              </div>
              <ul className="space-y-3 text-lg" style={{ color: theme.colors.text }}>
                <li>• Context preserved automatically</li>
                <li>• Intent documented in real-time</li>
                <li>• Spec debt becomes visible</li>
                <li>• Every change has a traceable reason</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6">
        <motion.div className="max-w-6xl mx-auto space-y-16" {...fadeIn}>
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold">
              Your Repo's Living Memory
            </h2>
            <p className="text-xl" style={{ color: theme.colors.textSecondary }}>
              Store context, reasoning, and decisions right in your repository
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FolderGit2,
                title: "Spec-Delta PRs",
                description: "Explain what changed at the product level, not just the code level.",
              },
              {
                icon: Zap,
                title: "Reasoning Replay",
                description: "Review agent + human collaboration steps with full context.",
              },
              {
                icon: Sparkles,
                title: "Daily Summaries",
                description: "See what got built and why, every single day.",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  className="rounded-2xl p-8 space-y-4 border transition-all duration-300 hover:scale-105"
                  style={{
                    background: theme.colors.backgroundSecondary,
                    borderColor: `${theme.colors.primary}30`,
                  }}
                  whileHover={{ borderColor: `${theme.colors.primary}60` }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: `${theme.colors.primary}20` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: theme.colors.primary }} />
                  </div>
                  <h3 className="text-2xl font-semibold">{feature.title}</h3>
                  <p style={{ color: theme.colors.textSecondary }}>{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Integrations Section */}
      <section
        className="py-32 px-6"
        style={{ background: `linear-gradient(to bottom, ${theme.colors.background}, ${theme.colors.backgroundSecondary})` }}
      >
        <motion.div className="max-w-6xl mx-auto text-center space-y-12" {...fadeIn}>
          <h2 className="text-4xl md:text-6xl font-bold">Integrations</h2>

          <div className="flex flex-wrap justify-center items-center gap-8">
            {["Cursor", "Claude", "Cline", "GitHub", "Replit", "VS Code"].map((tool, i) => (
              <motion.div
                key={tool}
                className="px-8 py-4 rounded-lg border-2 text-xl font-semibold transition-all duration-300 hover:scale-110"
                style={{
                  borderColor: theme.colors.border,
                  color: theme.colors.textSecondary,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileHover={{
                  borderColor: theme.colors.primary,
                  color: theme.colors.primary,
                }}
              >
                {tool}
              </motion.div>
            ))}
          </div>

          <div className="text-2xl space-y-2 pt-8">
            <p style={{ color: theme.colors.primary }}>Agent neutral. Repo native.</p>
            <p style={{ color: theme.colors.textSecondary }}>Your intelligence layer.</p>
          </div>
        </motion.div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 blur-3xl"
            style={{ background: `radial-gradient(circle, ${theme.colors.primary} 0%, transparent 70%)` }}
          />
        </div>

        <motion.div className="relative z-10 max-w-4xl mx-auto text-center space-y-12" {...fadeIn}>
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            Build faster.
            <br />
            <span style={{ color: theme.colors.primary }}>Remember longer.</span>
          </h2>

          <div className="flex flex-wrap gap-6 justify-center pt-8">
            <Link
              href="/download"
              onClick={() => trackDownload('alpha')}
              className="inline-flex items-center gap-2 px-10 py-5 text-xl font-semibold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl"
              style={{
                background: theme.colors.primary,
                color: theme.colors.background,
                boxShadow: `0 8px 32px ${theme.colors.primary}40`,
              }}
            >
              <Download className="w-6 h-6" />
              Download Alpha
            </Link>
            <Link
              href="/blog"
              onClick={() => trackButtonClick('Read Blog', '/blog')}
              className="inline-flex items-center gap-2 px-10 py-5 text-xl font-semibold rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                background: 'transparent',
                color: theme.colors.primary,
                border: `2px solid ${theme.colors.primary}`,
              }}
            >
              Read Blog
            </Link>
          </div>

          <div className="pt-20 text-sm space-y-2" style={{ color: theme.colors.textSecondary }}>
            <p>Principal-ADE © 2025</p>
            <p>
              Built by <span style={{ color: theme.colors.primary }}>Noetic Labs</span>
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
