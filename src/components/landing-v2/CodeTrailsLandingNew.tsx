"use client";

import React from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { CodeTrailsHeroNew } from './demo/CodeTrailsHeroNew';
import { CodeTrailsHowItWorks } from './demo/CodeTrailsHowItWorks';
import { CodeTrailsLiveDemo } from './demo/CodeTrailsLiveDemo';
import { CodeTrailsTransformation } from './demo/CodeTrailsTransformation';
import { CodeTrailsFinalCTA } from './demo/CodeTrailsFinalCTA';

export const CodeTrailsLandingNew: React.FC = () => {
  const { theme } = useTheme();
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
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
    <div
      style={{
        background: theme.colors.background,
        scrollBehavior: 'smooth',
        position: 'relative',
      }}
    >
      {/* Minimal top nav */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(247,252,253,0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${theme.colors.border}20`,
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: isMobile ? '16px 24px' : '20px 40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: theme.colors.text,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="6" fill={theme.colors.primary}/>
              <path d="M14 8L20 14L14 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span
              style={{
                fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                fontSize: '18px',
                fontWeight: '600',
              }}
            >
              Principal <span style={{ color: theme.colors.primary, fontWeight: '400' }}>AI</span>
            </span>
          </a>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '16px' : '32px',
            }}
          >
            {!isMobile && (
              <>
                <a
                  href="#how-it-works"
                  style={{
                    fontSize: '15px',
                    color: theme.colors.text,
                    textDecoration: 'none',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    fontWeight: '500',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.text)}
                >
                  How it works
                </a>
                <a
                  href="#see-it"
                  style={{
                    fontSize: '15px',
                    color: theme.colors.text,
                    textDecoration: 'none',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    fontWeight: '500',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.text)}
                >
                  Live demo
                </a>
              </>
            )}
            <a
              href="#get-started"
              style={{
                fontSize: '15px',
                color: '#fff',
                background: theme.colors.primary,
                padding: isMobile ? '8px 20px' : '10px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                fontWeight: '600',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Get started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <CodeTrailsHeroNew isMobile={isMobile} />

      {/* How It Works Section */}
      <CodeTrailsHowItWorks isMobile={isMobile} />

      {/* Live Demo Section */}
      <CodeTrailsLiveDemo isMobile={isMobile} />

      {/* Transformation Section */}
      <CodeTrailsTransformation isMobile={isMobile} />

      {/* Final CTA Section */}
      <CodeTrailsFinalCTA isMobile={isMobile} />

      {/* Minimal Footer */}
      <footer
        style={{
          background: '#1a2842',
          padding: isMobile ? '48px 24px 32px' : '64px 40px 40px',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? '40px' : '48px',
          }}
        >
          {/* Brand column */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '16px',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="6" fill={theme.colors.primary}/>
                <path d="M14 8L20 14L14 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span
                style={{
                  fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#fff',
                }}
              >
                Principal AI
              </span>
            </div>
            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.6,
                margin: 0,
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            >
              Making code collaboration
              <br />
              human again.
            </p>
          </div>

          {/* Product column */}
          <div>
            <h3
              style={{
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#fff',
                marginBottom: '16px',
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              Product
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <a
                  href="/file-city"
                  style={{
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  File City
                </a>
              </li>
              <li>
                <a
                  href="/principal-feed"
                  style={{
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  Principal Feed
                </a>
              </li>
              <li>
                <a
                  href="/code-trails"
                  style={{
                    fontSize: '15px',
                    color: theme.colors.primary,
                    textDecoration: 'none',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    fontWeight: '600',
                  }}
                >
                  Code Trails
                </a>
              </li>
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <h3
              style={{
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#fff',
                marginBottom: '16px',
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              Resources
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <a
                  href="https://docs.principal-ade.com"
                  style={{
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/principal-ai"
                  style={{
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/principal-ai"
                  style={{
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3
              style={{
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#fff',
                marginBottom: '16px',
                fontFamily: 'var(--font-mono, monospace)',
              }}
            >
              Company
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <a
                  href="/about"
                  style={{
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  style={{
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  style={{
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            marginTop: isMobile ? '40px' : '56px',
            paddingTop: isMobile ? '24px' : '32px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: '16px',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              margin: 0,
              fontFamily: 'var(--font-mono, monospace)',
              letterSpacing: '0.05em',
            }}
          >
            © 2026 Principal AI. All rights reserved.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '24px',
              fontSize: '13px',
            }}
          >
            <a
              href="/privacy"
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            >
              Privacy
            </a>
            <a
              href="/terms"
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
