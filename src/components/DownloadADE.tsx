import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnalytics } from '@/lib/analytics';
import { useTheme } from '@principal-ade/industry-theme';

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  assets: {
    id: number;
    name: string;
    browser_download_url: string;
    size: number;
  }[];
}

const Screenshot: React.FC<{ src: string; alt: string; borderColor: string }> = ({ src, alt, borderColor }) => (
  <img
    src={src}
    alt={alt}
    style={{
      width: '100%',
      borderRadius: '12px',
      border: `1px solid ${borderColor}`,
      display: 'block',
    }}
  />
);

export const DownloadADE: React.FC = () => {
  const { theme } = useTheme();
  const { trackDownload } = useAnalytics();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const response = await fetch("/api/github/releases");
        if (response.ok) {
          const data = await response.json();
          setReleases(data);
        }
      } catch {
        // Silently fail - buttons will show fallback
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
  }, []);

  const getAssetForPlatform = (release: GitHubRelease, platform: "mac" | "windows" | "linux") => {
    const patterns = {
      mac: [".dmg", "darwin", "macos"],
      windows: [".exe", ".msi", "win32", "windows"],
      linux: [".AppImage", ".deb", ".rpm", "linux"],
    };
    return release.assets.find((asset) =>
      patterns[platform].some((pattern) => asset.name.toLowerCase().includes(pattern))
    );
  };

  const macAsset = releases[0] ? getAssetForPlatform(releases[0], "mac") : null;
  const downloadUrl = macAsset
    ? `/api/github/download?assetId=${macAsset.id}&filename=${encodeURIComponent(macAsset.name)}`
    : "/download";

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
        fontFamily: theme.fonts.body,
      }}
    >
      {/* ── SECTION 1: HERO ── */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: isMobile ? '60px 24px 60px' : '80px 40px 80px',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              fontSize: isMobile ? '36px' : isTablet ? '48px' : '58px',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '40px',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            <span style={{ color: theme.colors.primary }}>Download</span>{' '}
            <span style={{ color: theme.colors.text }}>Principal</span>{' '}
            <span style={{ fontWeight: 300, color: theme.colors.primary }}>AI</span>
          </motion.h1>

          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            style={{
              margin: '0 auto 48px',
              maxWidth: '680px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: 400,
                fontStyle: 'italic',
                color: theme.colors.text,
                lineHeight: 1.5,
                letterSpacing: '-0.01em',
                margin: '0 0 12px 0',
              }}
            >
              For the polymath developer, this is kind of like catnip.
            </p>
            <footer
              style={{
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: 400,
                color: theme.colors.textMuted,
                fontStyle: 'normal',
                letterSpacing: '-0.01em',
              }}
            >
              &mdash; Garry Tan, President of Y Combinator
            </footer>
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <a
              href={downloadUrl}
              onClick={() => {
                if (macAsset) {
                  trackDownload({
                    filename: macAsset.name,
                    platform: 'mac',
                    assetId: macAsset.id,
                  });
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: isMobile ? '16px 36px' : '18px 44px',
                background: loading ? theme.colors.textMuted : theme.colors.primary,
                color: theme.colors.textOnPrimary,
                textDecoration: 'none',
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 600,
                borderRadius: '12px',
                fontFamily: theme.fonts.body,
                letterSpacing: '-0.01em',
                boxShadow: loading ? 'none' : `0 4px 20px ${theme.colors.primary}66`,
                transition: 'all 0.2s ease',
                pointerEvents: loading ? 'none' : 'auto',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.filter = 'brightness(1.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 30px ${theme.colors.primary}80`;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.filter = 'brightness(1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${theme.colors.primary}66`;
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {loading ? 'Loading...' : 'Download for macOS — Free'}
            </a>
            <span style={{ fontSize: '14px', color: theme.colors.textMuted, letterSpacing: '-0.01em' }}>
              Windows + Linux coming soon.{' '}
              <a
                href="https://discord.gg/G3qdcC2DXq"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#5865F2', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
              >
                Join the waitlist on Discord.
              </a>
            </span>
          </motion.div>

          {/* Hero Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            style={{ marginTop: '64px' }}
          >
            <p style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 500, color: theme.colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px', textAlign: 'center' }}>Activity Feed</p>
            <Screenshot src="/gary-tan-activity-feed.png" alt="Principal AI activity feed showing agent commits across repos" borderColor={theme.colors.border} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            style={{
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: 400,
              color: theme.colors.textSecondary,
              lineHeight: 1.7,
              maxWidth: '720px',
              margin: '32px auto 0',
              letterSpacing: '-0.01em',
            }}
          >
            Your codebase doesn&rsquo;t stand still, see what&rsquo;s going on across your team and your agents simultaneously.
            Open Principal AI and it&rsquo;s already there: what changed, where it changed, what it looks like now.
            No digging. No guessing. Just the shape of your work.
          </motion.p>
        </div>
      </section>

      {/* ── SECTION 2: THE TURN ── */}
      <section
        style={{
          padding: isMobile ? '40px 24px' : '60px 40px',
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: isMobile ? '22px' : '28px',
              fontWeight: 600,
              color: theme.colors.text,
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              textAlign: 'center',
              marginBottom: '12px',
            }}
          >
            That&rsquo;s the part that gets you in the door.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            style={{
              fontSize: isMobile ? '22px' : '28px',
              fontWeight: 600,
              color: theme.colors.primary,
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              textAlign: 'center',
              marginBottom: '48px',
            }}
          >
            This is the part that makes you stay.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ marginBottom: '48px' }}
          >
            <p style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 500, color: theme.colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px', textAlign: 'center' }}>Story-based Monitoring</p>
            <Screenshot src="/codex-runner-error-with-file-city.png" alt="Principal AI codex runner error with file city view" borderColor={theme.colors.border} />
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '48px' }}>
            {[
              "Your agents didn\u2019t just build something. They either followed your intent, or they didn\u2019t.",
              "Most tools tell you what happened after something breaks. Principal AI shows you whether it happened right \u2014 so you know before it becomes a problem.",
              "And when something does go wrong, you\u2019re not searching logs. You\u2019re reading the story. You can see exactly where reality diverged from intent.",
            ].map((text, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: 400,
                  color: theme.colors.textSecondary,
                  lineHeight: 1.7,
                  letterSpacing: '-0.01em',
                  margin: 0,
                }}
              >
                {text}
              </motion.p>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: isMobile ? '18px' : '22px',
              fontWeight: 600,
              color: theme.colors.text,
              lineHeight: 1.4,
              letterSpacing: '-0.02em',
              marginBottom: '48px',
              borderLeft: `3px solid ${theme.colors.primary}`,
              paddingLeft: '20px',
            }}
          >
            The log tells you what happened.
            <br />
            The storyboard tells you what <em style={{ color: theme.colors.primary, fontStyle: 'italic' }}>should</em> have.
          </motion.p>

        </div>
      </section>

      {/* ── SECTION 3: FEATURE CARDS ── */}
      <section
        style={{
          padding: isMobile ? '24px 24px' : '32px 40px',
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: 700,
              color: theme.colors.text,
              letterSpacing: '-0.03em',
              textAlign: 'center',
              marginBottom: '48px',
            }}
          >
            What&rsquo;s Inside
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(2, 1fr)',
              gap: '24px',
            }}
          >
            {[
              {
                title: 'Activity Feed',
                description: 'Every repo. Every commit. At a glance. Your agents\u2019 work, made visible.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                ),
              },
              {
                title: 'File City',
                description: 'See inside your codebase. Every change, every file. Agents and humans, one view.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                ),
              },
              {
                title: 'Principal Behavioral Manifest',
                description: 'What should happen, which code does it, and what telemetry proves it did. Connected.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ),
              },
              {
                title: 'Story-based Monitoring',
                description: 'Observability that starts with intent, not with incidents.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                ),
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  background: theme.colors.backgroundSecondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '16px',
                  padding: isMobile ? '28px' : '36px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    background: `${theme.colors.primary}14`,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: isMobile ? '18px' : '20px',
                    fontWeight: 600,
                    color: theme.colors.text,
                    marginBottom: '10px',
                    letterSpacing: '-0.02em',
                    fontFamily: theme.fonts.body,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: 400,
                    color: theme.colors.textMuted,
                    lineHeight: 1.6,
                    letterSpacing: '-0.01em',
                    margin: 0,
                    fontFamily: theme.fonts.body,
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: CLOSING CTA ── */}
      <section
        style={{
          padding: isMobile ? '80px 24px 100px' : '120px 40px 140px',
          borderTop: `1px solid ${theme.colors.border}`,
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: isMobile ? '28px' : '40px',
              fontWeight: 700,
              color: theme.colors.text,
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              marginBottom: '16px',
            }}
          >
            See the work. <span style={{ color: theme.colors.primary }}>Read the story.</span>
            <br />
            Know if it went right.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              marginTop: '40px',
            }}
          >
            <a
              href={downloadUrl}
              onClick={() => {
                if (macAsset) {
                  trackDownload({
                    filename: macAsset.name,
                    platform: 'mac',
                    assetId: macAsset.id,
                  });
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: isMobile ? '16px 36px' : '18px 44px',
                background: loading ? theme.colors.textMuted : theme.colors.primary,
                color: theme.colors.textOnPrimary,
                textDecoration: 'none',
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: 600,
                borderRadius: '12px',
                fontFamily: theme.fonts.body,
                letterSpacing: '-0.01em',
                boxShadow: loading ? 'none' : `0 4px 20px ${theme.colors.primary}66`,
                transition: 'all 0.2s ease',
                pointerEvents: loading ? 'none' : 'auto',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.filter = 'brightness(1.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 30px ${theme.colors.primary}80`;
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.filter = 'brightness(1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${theme.colors.primary}66`;
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {loading ? 'Loading...' : 'Download for macOS — Free'}
            </a>
            <span style={{ fontSize: '14px', color: theme.colors.textMuted, letterSpacing: '-0.01em' }}>
              Windows + Linux.{' '}
              <a
                href="https://discord.gg/G3qdcC2DXq"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#5865F2', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
              >
                Join the Discord waitlist.
              </a>
            </span>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
