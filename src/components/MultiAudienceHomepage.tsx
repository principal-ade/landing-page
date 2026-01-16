import React, { useState } from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeSwitcher } from './providers/ClientThemeProvider';
import { PrincipalFolder } from './PrincipalFolder';
import { LivingDocumentationSection } from './LivingDocumentationSection';
import { FeaturesAndBenefitsV2 } from './FeaturesAndBenefitsV2';
import { AgenticWorkspaceForV2 } from './AgenticWorkspaceForV2';
import { Code2, Users } from 'lucide-react';

type Audience = 'developers' | 'teams';

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
      <motion.div
        style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          border: '2px solid #00C2FF80',
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: '40%',
          height: '40%',
          border: '2px solid #00C2FF60',
          borderRadius: '50%',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
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
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
};

const HeroSection: React.FC<{ selectedAudience: Audience; onAudienceChange: (audience: Audience) => void }> = ({
  selectedAudience,
  onAudienceChange,
}) => {
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

  const audiences = [
    { id: 'developers' as Audience, label: 'Developers', icon: Code2 },
    { id: 'teams' as Audience, label: 'Teams', icon: Users },
  ];

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
      {/* Circular gradient emanating from logo center */}
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
          {/* Brand Name with Logo */}
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

          {/* Tagline */}
          <div
            style={{
              fontSize: isMobile ? '11px' : '13px',
              fontWeight: '600',
              letterSpacing: '0.15em',
              color: '#00C2FF',
              textTransform: 'uppercase',
              marginBottom: isMobile ? '20px' : '24px',
              textAlign: 'center',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            THE BEHAVIOR LAYER FOR SOFTWARE
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: isMobile ? '28px' : isConstrainedHeight ? '40px' : isTablet ? '44px' : '48px',
              fontWeight: '600',
              margin: '0 auto',
              textAlign: 'center',
              width: '100%',
              maxWidth: '1100px',
              letterSpacing: '-0.025em',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              lineHeight: '1.15',
              color: '#ffffff',
            }}
          >
            A picture is worth a thousand <span style={{ color: '#0099FF', fontWeight: '600' }}>lines of code</span>
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
            fontSize: isMobile ? '15px' : '17px',
            fontWeight: '400',
            margin: '0 0 24px 0',
            color: '#d1d5db',
            lineHeight: '1.7',
            letterSpacing: '-0.011em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Code is being written faster than anyone can review it.
        </p>
        <p
          style={{
            fontSize: isMobile ? '15px' : '17px',
            fontWeight: '500',
            margin: '0 0 32px 0',
            color: '#ffffff',
            lineHeight: '1.7',
            letterSpacing: '-0.011em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Just like Slack created the workspace for team communication, Principal AI creates the workspace for AI development.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <a
            href="https://principal.dev/gallery"
            style={{
              backgroundColor: '#0099FF',
              color: '#ffffff',
              padding: isMobile ? '12px 24px' : '14px 28px',
              borderRadius: '8px',
              fontSize: isMobile ? '15px' : '16px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              transition: 'background-color 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0088EE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0099FF';
            }}
          >
            Get Your Repo Mapped
            <span style={{ fontSize: '18px' }}>→</span>
          </a>
          <a
            href="https://principal.dev/gallery"
            style={{
              backgroundColor: '#1e3a5f',
              color: '#ffffff',
              padding: isMobile ? '12px 24px' : '14px 28px',
              borderRadius: '8px',
              fontSize: isMobile ? '15px' : '16px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              border: 'none',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              transition: 'background-color 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2a4d7a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1e3a5f';
            }}
          >
            Explore the Gallery
          </a>
        </div>
      </div>

      {/* Audience Selector */}
      <div
        style={{
          marginTop: isMobile ? '40px' : '60px',
          zIndex: 3,
          display: 'flex',
          gap: isMobile ? '12px' : '16px',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '700px',
          padding: '0 20px',
        }}
      >
        {audiences.map((audience) => {
          const Icon = audience.icon;
          const isSelected = selectedAudience === audience.id;
          return (
            <motion.button
              key={audience.id}
              onClick={() => onAudienceChange(audience.id)}
              style={{
                flex: 1,
                padding: isMobile ? '16px' : '20px',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '600',
                background: isSelected ? '#00C2FF' : 'rgba(0, 194, 255, 0.1)',
                color: isSelected ? '#000000' : '#00C2FF',
                border: `2px solid ${isSelected ? '#00C2FF' : 'rgba(0, 194, 255, 0.3)'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '-0.02em',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                width: isMobile ? '100%' : 'auto',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={isMobile ? 20 : 24} />
              {audience.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// Developer-focused content
const DeveloperContent: React.FC = () => {
  return (
    <div>
      {/* Hero Section for Developers */}
      <div style={{ backgroundColor: '#0a1628', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2
              style={{
                fontSize: '40px',
                fontWeight: '600',
                margin: '0 0 20px 0',
                color: '#ffffff',
                letterSpacing: '-0.025em',
                lineHeight: '1.15',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Git-Based Agentic Workspace
            </h2>
            <p
              style={{
                fontSize: '17px',
                color: '#d1d5db',
                maxWidth: '800px',
                margin: '0 auto 40px auto',
                lineHeight: '1.6',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              The next generation of AI-powered work. Orchestrate AI agents, maintain perfect context, and ship faster than ever before.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://app.principal-ade.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '14px 28px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: '#00C2FF',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'inline-block',
                  textDecoration: 'none',
                  fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 194, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Try Web ADE
              </a>
              <a
                href="/download"
                style={{
                  padding: '14px 28px',
                  fontSize: '16px',
                  fontWeight: '600',
                  background: 'transparent',
                  color: '#00C2FF',
                  border: '2px solid #00C2FF',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'inline-block',
                  textDecoration: 'none',
                  fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 194, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Download Alpha
              </a>
            </div>
          </div>

          {/* Core UI Components */}
          <div style={{ marginBottom: '80px' }}>
            <h3
              style={{
                fontSize: '28px',
                fontWeight: '600',
                margin: '0 0 40px 0',
                color: '#ffffff',
                textAlign: 'center',
                letterSpacing: '-0.025em',
                lineHeight: '1.15',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Everything You Need in One Interface
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
              }}
            >
              {[
                {
                  title: 'File Explorer',
                  description: 'Navigate your project structure with AI-enhanced search and context-aware suggestions',
                },
                {
                  title: 'AI Chat',
                  description: 'Real-time intelligent collaboration with AI assistants that understand your codebase',
                },
                {
                  title: 'Terminal',
                  description: 'Execute commands and view output seamlessly integrated with your workspace',
                },
              ].map((component, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    background: 'rgba(0, 194, 255, 0.05)',
                    border: '1px solid rgba(0, 194, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '32px',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      margin: '0 0 12px 0',
                      color: '#00C2FF',
                      fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {component.title}
                  </h4>
                  <p
                    style={{
                      fontSize: '15px',
                      color: '#d1d5db',
                      margin: 0,
                      lineHeight: '1.6',
                      fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {component.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Two Agentic Work Modes */}
          <div style={{ marginBottom: '80px' }}>
            <h3
              style={{
                fontSize: '28px',
                fontWeight: '600',
                margin: '0 0 40px 0',
                color: '#ffffff',
                textAlign: 'center',
                letterSpacing: '-0.025em',
                lineHeight: '1.15',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Two Modes of Agentic Work
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '32px',
              }}
            >
              {/* Outer Agentic Work */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 194, 255, 0.1), rgba(0, 152, 204, 0.05))',
                  border: '1px solid rgba(0, 194, 255, 0.3)',
                  borderRadius: '16px',
                  padding: '40px',
                }}
              >
                <h4
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    margin: '0 0 16px 0',
                    color: '#00C2FF',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  Outer Agentic Work
                </h4>
                <p
                  style={{
                    fontSize: '16px',
                    color: '#9ca3af',
                    marginBottom: '24px',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  Real-time AI collaboration
                </p>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {[
                    'Real-time intelligent suggestions',
                    'Rapid iterations and feedback',
                    'AI-powered insights for creative enhancement',
                    'Strategic project breakdown',
                  ].map((feature, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        color: '#d1d5db',
                        fontSize: '15px',
                        fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                      }}
                    >
                      <span style={{ color: '#00C2FF', fontSize: '20px', lineHeight: '1' }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Inner Agentic Work */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 194, 255, 0.1), rgba(0, 152, 204, 0.05))',
                  border: '1px solid rgba(0, 194, 255, 0.3)',
                  borderRadius: '16px',
                  padding: '40px',
                }}
              >
                <h4
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    margin: '0 0 16px 0',
                    color: '#00C2FF',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  Inner Agentic Work
                </h4>
                <p
                  style={{
                    fontSize: '16px',
                    color: '#9ca3af',
                    marginBottom: '24px',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  Autonomous operations
                </p>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {[
                    'Automated repetitive workflows',
                    'Independent agent task completion',
                    'Simultaneous parallel processing',
                    'Background execution and monitoring',
                  ].map((feature, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        color: '#d1d5db',
                        fontSize: '15px',
                        fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                      }}
                    >
                      <span style={{ color: '#00C2FF', fontSize: '20px', lineHeight: '1' }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Living Documentation */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(0, 194, 255, 0.2)',
              borderRadius: '16px',
              padding: '48px',
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                fontSize: '28px',
                fontWeight: '600',
                margin: '0 0 16px 0',
                color: '#ffffff',
                letterSpacing: '-0.025em',
                lineHeight: '1.15',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Living Documentation with CodebaseViews
            </h3>
            <p
              style={{
                fontSize: '17px',
                color: '#d1d5db',
                maxWidth: '800px',
                margin: '0 auto 32px auto',
                lineHeight: '1.6',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Say goodbye to outdated documentation. CodebaseViews create validated connections between your docs and actual code files.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginTop: '32px',
              }}
            >
              {[
                'Validated code-documentation links',
                'AI agents know which files to examine',
                'Impact analysis on changes',
                'Automated validation alerts',
                'Seamless doc-to-code navigation',
              ].map((feature, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(0, 194, 255, 0.05)',
                    border: '1px solid rgba(0, 194, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '20px',
                    fontSize: '14px',
                    color: '#d1d5db',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Existing sections */}
      <div style={{ backgroundColor: '#111827' }}>
        <PrincipalFolder />
      </div>
      <div style={{ backgroundColor: '#0f1b2e' }}>
        <LivingDocumentationSection />
      </div>
      <div style={{ backgroundColor: '#0d1117' }}>
        <FeaturesAndBenefitsV2 />
      </div>
      <div style={{ backgroundColor: '#0a1628' }}>
        <AgenticWorkspaceForV2 />
      </div>
    </div>
  );
};

// Team-focused content
const TeamContent: React.FC = () => {
  return (
    <div>
      <div style={{ backgroundColor: '#0a1628', padding: '60px 20px', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: '600',
            margin: '0 0 20px 0',
            color: '#ffffff',
            letterSpacing: '-0.025em',
            lineHeight: '1.15',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Transparency & Collaboration Built In
        </h2>
        <p
          style={{
            fontSize: '17px',
            color: '#d1d5db',
            maxWidth: '800px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Principal AI makes AI work visible, reviewable, and collaborative. Perfect context for your entire team.
        </p>
        <a
          href="/demo"
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            background: '#00C2FF',
            color: '#000000',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'inline-block',
            textDecoration: 'none',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Watch Demo
        </a>
      </div>
      <div style={{ backgroundColor: '#0f1b2e' }}>
        <LivingDocumentationSection />
      </div>
      <div style={{ backgroundColor: '#0a1628' }}>
        <AgenticWorkspaceForV2 />
      </div>
      <div style={{ backgroundColor: '#111827' }}>
        <PrincipalFolder />
      </div>
    </div>
  );
};

export const MultiAudienceHomepage: React.FC = () => {
  const [selectedAudience, setSelectedAudience] = useState<Audience>('developers');

  return (
    <div>
      {/* Hero Section */}
      <div style={{ backgroundColor: '#000000' }}>
        <HeroSection selectedAudience={selectedAudience} onAudienceChange={setSelectedAudience} />
      </div>

      {/* Dynamic Content Based on Audience */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedAudience}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {selectedAudience === 'developers' && <DeveloperContent />}
          {selectedAudience === 'teams' && <TeamContent />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
