import React from 'react';
import { useTheme } from '@a24z/industry-theme';
import { motion } from 'framer-motion';
import { useThemeSwitcher } from './providers/ClientThemeProvider';
import { CheckCircle2, ArrowRight, Download, Play, AlertCircle, Zap, GitBranch, Code2 } from 'lucide-react';

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
        padding: isMobile ? '60px 20px' : '100px 20px',
      }}
    >
      {/* Circular gradient */}
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
          maxWidth: '1000px',
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
        {/* Conference Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(0, 194, 255, 0.1)',
            border: '1px solid rgba(0, 194, 255, 0.3)',
            borderRadius: '24px',
            padding: '8px 20px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#00C2FF',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          AI Engineer Summit NYC · Nov 20-22, 2025
        </motion.div>

        {/* Brand Name with Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: isMobile ? '20px' : isConstrainedHeight ? '24px' : '28px',
            fontWeight: '600',
            margin: '0 0 40px 0',
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

        {/* Main Headline */}
        <h1
          style={{
            fontSize: isMobile ? '36px' : isConstrainedHeight ? '48px' : isTablet ? '56px' : '68px',
            fontWeight: '700',
            margin: '0 auto 24px auto',
            textAlign: 'center',
            width: '100%',
            maxWidth: '1000px',
            letterSpacing: '-0.03em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            lineHeight: '1.1',
            color: '#ffffff',
          }}
        >
          Your AI Agents Are Writing Code Faster Than You Can{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, #00D9FF 0%, #0099FF 50%, #0066FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Review It
          </span>
        </h1>

        {/* Problem Statement */}
        <p
          style={{
            fontSize: isMobile ? '18px' : '22px',
            fontWeight: '400',
            margin: '0 0 40px 0',
            color: '#d1d5db',
            lineHeight: '1.6',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            maxWidth: '800px',
          }}
        >
          At production scale, documentation decays the moment it's written. Your context is scattered. Your agents hallucinate. Your team can't keep up.
        </p>

        {/* Solution */}
        <p
          style={{
            fontSize: isMobile ? '20px' : '24px',
            fontWeight: '600',
            margin: '0',
            color: '#00C2FF',
            lineHeight: '1.5',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            maxWidth: '700px',
          }}
        >
          Living Documentation solves this.
        </p>
      </div>
    </div>
  );
};

// The Production Problem
const ProductionProblemSection: React.FC = () => {
  const problems = [
    {
      icon: AlertCircle,
      title: 'Documentation Drift',
      description: 'Your docs are out of date before the PR merges. Agents reference stale information. Engineers waste hours reconciling reality.',
    },
    {
      icon: GitBranch,
      title: 'Context Fragmentation',
      description: 'Context is scattered across Notion, Confluence, comments, and tribal knowledge. Every new agent starts from zero.',
    },
    {
      icon: Code2,
      title: 'Agent Hallucination',
      description: 'Without validated context, your AI makes confident mistakes. You spend more time reviewing than building.',
    },
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #0a1628 100%)',
        padding: '100px 20px',
        borderTop: '1px solid rgba(0, 194, 255, 0.2)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              fontWeight: '700',
              margin: '0 0 24px 0',
              color: '#ffffff',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            The Production AI Challenge
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: '#9ca3af',
              maxWidth: '800px',
              margin: '0 auto',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            You're shipping AI at scale. These problems compound daily.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
          }}
        >
          {problems.map((problem, i) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'rgba(220, 38, 38, 0.05)',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                  borderRadius: '12px',
                  padding: '32px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(220, 38, 38, 0.1)',
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Icon size={24} color="#dc2626" />
                </div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    margin: '0 0 12px 0',
                    color: '#ffffff',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {problem.title}
                </h3>
                <p
                  style={{
                    fontSize: '15px',
                    color: '#9ca3af',
                    margin: 0,
                    lineHeight: '1.7',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {problem.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Living Documentation Solution
const LivingDocSolutionSection: React.FC = () => {
  const features = [
    {
      icon: CheckCircle2,
      title: 'Validated Code-Doc Links',
      description: 'Explicit, validated connections between documentation and implementation. Agents know exactly which files are authoritative.',
    },
    {
      icon: Zap,
      title: 'Real-Time Impact Analysis',
      description: 'See which docs are affected by code changes instantly. No more silent drift. No more stale references.',
    },
    {
      icon: AlertCircle,
      title: 'Automated Staleness Detection',
      description: 'Broken references alert immediately. Your team knows what needs updating before agents use outdated context.',
    },
    {
      icon: GitBranch,
      title: 'Git-Native Integration',
      description: 'Lives in your repository. Version-controlled. No external tool to break. Works with your existing workflow.',
    },
  ];

  return (
    <div
      style={{
        background: '#0a1628',
        padding: '120px 20px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <h2
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: '700',
              margin: '0 0 32px 0',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              lineHeight: '1.2',
            }}
          >
            Living{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #00D9FF 0%, #0099FF 50%, #0066FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Documentation
            </span>
          </h2>
          <p
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
              color: '#d1d5db',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.7',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Context that stays synchronized with reality. Built for production AI teams.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            marginBottom: '80px',
          }}
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: 'rgba(0, 194, 255, 0.05)',
                  border: '1px solid rgba(0, 194, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '32px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(0, 194, 255, 0.1)',
                    border: '1px solid rgba(0, 194, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Icon size={24} color="#00C2FF" />
                </div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    margin: '0 0 12px 0',
                    color: '#ffffff',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: '15px',
                    color: '#9ca3af',
                    margin: 0,
                    lineHeight: '1.7',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Demo CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, rgba(0, 194, 255, 0.1), rgba(0, 152, 204, 0.05))',
            border: '1px solid rgba(0, 194, 255, 0.3)',
            borderRadius: '16px',
            padding: '60px 40px',
            textAlign: 'center',
          }}
        >
          <h3
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: '600',
              margin: '0 0 16px 0',
              color: '#ffffff',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            See How Production Teams Use It
          </h3>
          <p
            style={{
              fontSize: '18px',
              color: '#d1d5db',
              maxWidth: '700px',
              margin: '0 auto 32px auto',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Watch how teams at scale maintain perfect context across thousands of files and dozens of AI agents.
          </p>
          <a
            href="/demo"
            style={{
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '600',
              background: '#00C2FF',
              color: '#000000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
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
            <Play size={20} />
            Watch Demo
          </a>
        </motion.div>
      </div>
    </div>
  );
};

// Ship Now Section
const ShipNowSection: React.FC = () => {
  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #0a1628 0%, #000000 100%)',
        padding: '100px 20px',
        borderTop: '1px solid rgba(0, 194, 255, 0.2)',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '700',
              margin: '0 0 32px 0',
              color: '#ffffff',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Built for Engineers Who{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #00D9FF 0%, #0099FF 50%, #0066FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Ship
            </span>
          </h2>
          <p
            style={{
              fontSize: '20px',
              color: '#d1d5db',
              lineHeight: '1.8',
              marginBottom: '48px',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Add Living Documentation to your production codebase today. No migration. No vendor lock-in. Start seeing the benefits in your next sprint.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://app.principal-ade.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '18px 36px',
                fontSize: '18px',
                fontWeight: '600',
                background: '#00C2FF',
                color: '#000000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
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
              <ArrowRight size={20} />
            </a>
            <a
              href="/download"
              style={{
                padding: '18px 36px',
                fontSize: '18px',
                fontWeight: '600',
                background: 'transparent',
                color: '#00C2FF',
                border: '2px solid #00C2FF',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
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
              <Download size={20} />
              Download Alpha
            </a>
          </div>

          {/* Alpha Badge */}
          <p
            style={{
              fontSize: '14px',
              color: '#6b7280',
              marginTop: '32px',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Alpha Release · 2025 Q1 · Working with select production teams
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export const AIEngineerSummitHomepage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <ProductionProblemSection />
      <LivingDocSolutionSection />
      <ShipNowSection />
    </div>
  );
};
