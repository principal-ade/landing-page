import React from 'react';
import { useTheme } from '@a24z/industry-theme';
import { motion } from 'framer-motion';
import { useThemeSwitcher } from './providers/ClientThemeProvider';
import { ContextEngineering } from './ContextEngineering';
import { PrincipalFolder } from './PrincipalFolder';
import { LivingDocumentationSection } from './LivingDocumentationSection';
import { FeaturesAndBenefitsV2 } from './FeaturesAndBenefitsV2';
import { AgenticWorkspaceForV2 } from './AgenticWorkspaceForV2';

// Mock Logo component with Animation
const MockLogo: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  return (
    <motion.div
      style={{
        width,
        height,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #00C2FF30, #0098CC20, transparent)',
        border: '3px solid #00C2FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 0 30px #00C2FF40',
      }}
      animate={{
        boxShadow: [
          '0 0 30px #00C2FF40',
          '0 0 40px #00C2FF60',
          '0 0 30px #00C2FF40',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Outer ring - rotates */}
      <motion.div
        style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          border: '2px solid #00C2FF80',
          borderRadius: '50%',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {/* Inner ring - rotates opposite direction */}
      <motion.div
        style={{
          position: 'absolute',
          width: '40%',
          height: '40%',
          border: '2px solid #00C2FF60',
          borderRadius: '50%',
        }}
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {/* Center dot - pulses */}
      <motion.div
        style={{
          position: 'absolute',
          width: '12%',
          height: '12%',
          background: '#00C2FF',
          borderRadius: '50%',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

const HeroSection: React.FC = () => {
  const { theme } = useTheme();
  const { currentTheme, setCurrentTheme, availableThemes } = useThemeSwitcher();

  const handleLogoClick = () => {
    const currentIndex = availableThemes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    setCurrentTheme(availableThemes[nextIndex]);
  };

  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  );
  const [windowHeight, setWindowHeight] = React.useState(
    typeof window !== 'undefined' ? window.innerHeight : 768,
  );

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isConstrainedHeight = windowHeight < 900;

  const gridBackground = `
    linear-gradient(${theme.colors.border}40 1px, transparent 1px),
    linear-gradient(90deg, ${theme.colors.border}40 1px, transparent 1px)
  `;

  return (
    <div
      style={{
        minHeight: 'auto',
        backgroundColor: '#000000',
        backgroundImage: gridBackground,
        backgroundSize: '100px 100px',
        backgroundPosition: '-1px -1px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        padding: isMobile ? '20px 0' : '40px 0',
      }}
    >
      {/* Circular gradient emanating from logo center - Neural Blue */}
      <div
        style={{
          position: 'absolute',
          top: isConstrainedHeight ? 'calc(50% - 50px)' : 'calc(50% - 120px)',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle at center, transparent 0%, #00C2FF20 25%, #0098CC30 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Gradient overlay for better contrast */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, transparent 0%, #000000 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '0 20px' : '0 40px',
        }}
      >
        {/* Center: Logo and Titles */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: isMobile ? '8px' : isConstrainedHeight ? '12px' : '16px',
            width: '100%',
          }}
        >
          {/* Brand Name with Logo - Smaller */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: isMobile ? '20px' : isConstrainedHeight ? '24px' : '28px',
              fontWeight: '600',
              margin: '0 0 24px 0',
              textAlign: 'center',
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            {/* Animated Logo */}
            <div
              onClick={handleLogoClick}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <MockLogo
                width={isMobile ? 40 : isConstrainedHeight ? 48 : 56}
                height={isMobile ? 40 : isConstrainedHeight ? 48 : 56}
              />
            </div>

            <span style={{ fontWeight: '600', color: '#ffffff' }}>Principal</span>
            <span
              style={{
                fontWeight: '300',
                background: 'linear-gradient(135deg, #00C2FF, #0098CC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AI
            </span>
          </div>

          {/* Main Headline - MUCH LARGER */}
          <h1
            style={{
              fontSize: isMobile ? '40px' : isConstrainedHeight ? '56px' : isTablet ? '64px' : '80px',
              fontWeight: '700',
              margin: '0 auto',
              textAlign: 'center',
              width: '100%',
              maxWidth: '1100px',
              letterSpacing: '-0.03em',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              lineHeight: '1.1',
              background: 'linear-gradient(90deg, #00D9FF 0%, #0099FF 50%, #0066FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            The Universal Workspace for Agentic Work
          </h1>
        </div>
      </div>

      {/* Body Copy */}
      <div
        style={{
          marginTop: isMobile ? '40px' : isConstrainedHeight ? '50px' : '60px',
          zIndex: 3,
          maxWidth: '800px',
          textAlign: 'center',
          padding: '0 20px',
        }}
      >
        <p
          style={{
            fontSize: isMobile ? '16px' : isConstrainedHeight ? '17px' : '18px',
            fontWeight: '400',
            margin: '0 0 24px 0',
            color: '#d1d5db',
            lineHeight: '1.7',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Code is being written faster than anyone can review it.
        </p>
        <p
          style={{
            fontSize: isMobile ? '16px' : isConstrainedHeight ? '17px' : '18px',
            fontWeight: '400',
            margin: '0 0 24px 0',
            color: '#d1d5db',
            lineHeight: '1.7',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Just like Slack created the workspace for team communication, Principal AI creates the workspace for AI development. It's where agents work transparently and context persists.
        </p>
        <p
          style={{
            fontSize: isMobile ? '16px' : isConstrainedHeight ? '17px' : '18px',
            fontWeight: '500',
            margin: '0',
            color: '#ffffff',
            lineHeight: '1.7',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          The workspace that makes AI development make sense. For developers, for everyone.
        </p>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          marginTop: isMobile ? '30px' : isConstrainedHeight ? '40px' : '50px',
          zIndex: 3,
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <a
          href="/download"
          style={{
            padding: isMobile ? '6px 12px' : isConstrainedHeight ? '8px 14px' : '10px 16px',
            fontSize: isMobile ? '12px' : isConstrainedHeight ? '13px' : '14px',
            fontWeight: '600',
            background: '#00C2FF',
            color: '#000000',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            whiteSpace: 'nowrap',
            minWidth: isMobile ? '110px' : '120px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 194, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Download Alpha
        </a>
        <a
          href="/demo"
          style={{
            padding: isMobile ? '6px 12px' : isConstrainedHeight ? '8px 14px' : '10px 16px',
            fontSize: isMobile ? '12px' : isConstrainedHeight ? '13px' : '14px',
            fontWeight: '600',
            background: '#ffffff',
            color: '#00C2FF',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            whiteSpace: 'nowrap',
            minWidth: isMobile ? '110px' : '120px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Watch Demo
        </a>
        <a
          href="/blog/pitch-deck"
          style={{
            padding: isMobile ? '6px 12px' : isConstrainedHeight ? '8px 14px' : '10px 16px',
            fontSize: isMobile ? '12px' : isConstrainedHeight ? '13px' : '14px',
            fontWeight: '600',
            background: '#1e3a5f',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            whiteSpace: 'nowrap',
            minWidth: isMobile ? '110px' : '120px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 58, 95, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Pitch Deck
        </a>
      </div>
    </div>
  );
};

export const CompleteLandingPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section - Pure Black */}
      <div style={{ backgroundColor: '#000000' }}>
        <HeroSection />
      </div>

      {/* Context Engineering - Dark Navy */}
      <div style={{ backgroundColor: '#0a1628' }}>
        <ContextEngineering />
      </div>

      {/* Principal Folder - Deep Gray */}
      <div style={{ backgroundColor: '#111827' }}>
        <PrincipalFolder />
      </div>

      {/* Living Documentation - Navy Variant */}
      <div style={{ backgroundColor: '#0f1b2e' }}>
        <LivingDocumentationSection />
      </div>

      {/* Features & Benefits - Darker Gray */}
      <div style={{ backgroundColor: '#0d1117' }}>
        <FeaturesAndBenefitsV2 />
      </div>

      {/* Agentic Workspace For - Dark Navy */}
      <div style={{ backgroundColor: '#0a1628' }}>
        <AgenticWorkspaceForV2 />
      </div>
    </div>
  );
};
