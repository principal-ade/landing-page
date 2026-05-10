"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';
import { CodeTrailsHeroFinal } from './codetrails/CodeTrailsHeroFinal';
import { CodeTrailsHowItWorksStory } from './codetrails/CodeTrailsHowItWorksStory';
import { CodeTrailsLiveDemo } from './codetrails/CodeTrailsLiveDemo';
import { CodeTrailsTransformationFinal } from './codetrails/CodeTrailsTransformationFinal';
import { CodeTrailsGetStartedFinal } from './codetrails/CodeTrailsGetStartedFinal';

interface CodeTrailsLandingFinalProps {
  isMobile?: boolean;
}

export const CodeTrailsLandingFinal: React.FC<CodeTrailsLandingFinalProps> = ({ isMobile = false }) => {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
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
          background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : 'none',
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
              color: theme.colors.text,
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              letterSpacing: '-0.02em',
            }}
          >
            <span style={{ color: theme.colors.primary }}>Code Trails</span>
            <span style={{ fontWeight: '400', marginLeft: '8px', color: theme.colors.textTertiary }}>
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
                  color: theme.colors.text,
                  textDecoration: 'none',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = theme.colors.text)}
              >
                See a trail
              </a>
              <a
                href="#get-started"
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#fff',
                  background: theme.colors.primary,
                  padding: '10px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = `0 8px 20px ${theme.colors.primary}30`;
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
                background: theme.colors.primary,
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
      <CodeTrailsHeroFinal isMobile={isMobile} />
      <CodeTrailsHowItWorksStory isMobile={isMobile} />
      <CodeTrailsLiveDemo isMobile={isMobile} />
      <CodeTrailsTransformationFinal isMobile={isMobile} />
      <CodeTrailsGetStartedFinal isMobile={isMobile} />

      {/* Footer */}
      <footer
        style={{
          background: '#0c1741',
          padding: isMobile ? '64px 24px 40px' : '80px 40px 48px',
          color: '#fff',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Footer Content */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: isMobile ? '40px' : '60px',
              marginBottom: isMobile ? '48px' : '64px',
            }}
          >
            {/* Brand Column */}
            <div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  marginBottom: '12px',
                  fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                }}
              >
                <span style={{ color: theme.colors.primary }}>Code Trails</span>
              </div>
              <p
                style={{
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.6)',
                  margin: '0 0 20px',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                Frame.io for code. The new collaboration primitive for software development.
              </p>
              <div
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                }}
              >
                By{' '}
                <a
                  href="https://principal-ade.com"
                  style={{
                    color: theme.colors.primary,
                    textDecoration: 'none',
                    fontWeight: '500',
                  }}
                >
                  Principal AI
                </a>
              </div>
            </div>

            {/* Resources Column */}
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '20px',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                Resources
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Documentation', href: 'https://docs.principal-ade.com/code-trails' },
                  { label: 'GitHub', href: 'https://github.com/principalstudio/code-trails' },
                  { label: 'Examples', href: 'https://app.principal-ade.com/trails/examples' },
                  { label: 'API Reference', href: 'https://docs.principal-ade.com/api' },
                ].map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    style={{
                      fontSize: '15px',
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Community Column */}
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '20px',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                Community
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Discord', href: 'https://discord.gg/principal-ai' },
                  { label: 'Twitter/X', href: 'https://twitter.com/principal_ai' },
                  { label: 'Blog', href: 'https://principal-ade.com/blog' },
                  { label: 'Support', href: 'mailto:support@principal-ade.com' },
                ].map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    style={{
                      fontSize: '15px',
                      color: 'rgba(255,255,255,0.7)',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-inter, Inter, sans-serif)',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = theme.colors.primary)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div
            style={{
              paddingTop: isMobile ? '32px' : '40px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? '16px' : '0',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
              }}
            >
              © {new Date().getFullYear()} Principal Studio. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              {[
                { label: 'Privacy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
                { label: 'Security', href: '/security' },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.4)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-inter, Inter, sans-serif)',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
