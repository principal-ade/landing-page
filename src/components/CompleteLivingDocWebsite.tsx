"use client";

import React from 'react';
import { useTheme } from '@principal-ade/industry-theme';
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
      <main style={{ flex: 1, width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        {/* Hero - The Hook */}
        <div style={{
          background: `radial-gradient(ellipse at top, ${theme.colors.primary}1A 0%, transparent 50%), ${theme.colors.background}`,
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
