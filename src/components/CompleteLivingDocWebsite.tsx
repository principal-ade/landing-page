"use client";

import React from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import { Header } from './Header';
import { LivingDocHomepage } from './LivingDocHomepage';
import { TelemetryVisualization } from './TelemetryVisualization';
import { AgentShift } from './AgentShift';
import { SimpleCTA } from './SimpleCTA';
import { Footer } from './Footer';

export const CompleteLivingDocWebsite: React.FC = () => {
  const { theme } = useTheme();
  const [windowWidth, setWindowWidth] = React.useState(1024);

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: theme.colors.background,
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      <Header />
      <main style={{ flex: 1, width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        {/* Hero - The Hook */}
        <div style={{
          background: theme.colors.backgroundPrimary || theme.colors.background,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          paddingBottom: '0px',
          width: '100%',
          boxSizing: 'border-box',
          height: 'calc(100vh - 70px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <LivingDocHomepage />
        </div>

        {/* The Experience - Show don't tell */}
        <div style={{
          background: theme.colors.backgroundSecondary,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
          borderTop: `1px solid ${theme.colors.border}`,
        }}>
          <TelemetryVisualization isMobile={isMobile} />
        </div>

        {/* The Agent Shift - Problem Statement */}
        <div style={{
          background: theme.colors.backgroundTertiary,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          boxSizing: 'border-box',
          borderTop: `1px solid ${theme.colors.border}`,
        }}>
          <AgentShift isMobile={isMobile} />
        </div>

        {/* Final CTA */}
        <SimpleCTA isMobile={isMobile} />
      </main>
      <Footer />
    </div>
  );
};
