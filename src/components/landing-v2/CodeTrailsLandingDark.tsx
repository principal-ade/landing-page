"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CodeTrailsHeroDark } from './codetrails/CodeTrailsHeroDark';
import { CodeTrailsHowItWorksStory } from './codetrails/CodeTrailsHowItWorksStory';
import { CodeTrailsLiveDemo } from './codetrails/CodeTrailsLiveDemo';
import { CodeTrailsTransformationFinal } from './codetrails/CodeTrailsTransformationFinal';
import { Footer } from './Footer';

// Color palette
const NAVY = '#1a2842';
const ORANGE = '#ff6b35';

interface CodeTrailsLandingDarkProps {
  isMobile?: boolean;
}

export const CodeTrailsLandingDark: React.FC<CodeTrailsLandingDarkProps> = ({ isMobile: propIsMobile }) => {
  const [scrolled, setScrolled] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isMobile = propIsMobile !== undefined ? propIsMobile : windowWidth < 768;

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: NAVY }}>
      {/* Fixed Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? 'rgba(26, 40, 66, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
          padding: isMobile ? '16px 24px' : '20px 40px',
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: '700',
              color: '#fff',
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              letterSpacing: '-0.02em',
            }}
          >
            <span style={{ color: ORANGE }}>Code Trails</span>
            <span style={{ fontWeight: '400', marginLeft: '8px', color: 'rgba(255,255,255,0.5)' }}>
              by Principal AI
            </span>
          </div>

          {/* Nav Links */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <a
                href="#see-it"
                style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = ORANGE)}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
              >
                See a trail
              </a>
              <a
                href="#get-started"
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#fff',
                  background: ORANGE,
                  padding: '10px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = `0 8px 20px ${ORANGE}66`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Get started
              </a>
            </div>
          )}

          {/* Mobile CTA */}
          {isMobile && (
            <a
              href="#get-started"
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#fff',
                background: ORANGE,
                padding: '10px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            >
              Start
            </a>
          )}
        </div>
      </motion.nav>

      {/* Page Sections */}
      <CodeTrailsHeroDark isMobile={isMobile} />
      <CodeTrailsHowItWorksStory isMobile={isMobile} />
      <CodeTrailsLiveDemo isMobile={isMobile} />
      <CodeTrailsTransformationFinal isMobile={isMobile} />

      {/* Footer */}
      <Footer />
    </div>
  );
};
