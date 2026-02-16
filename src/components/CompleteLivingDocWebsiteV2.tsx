import React from 'react';
import { LivingDocHomepageV2 } from './LivingDocHomepageV2';
import { TelemetryVisualization } from './TelemetryVisualization';
import { AgentShift } from './AgentShift';
import { SimpleCTA } from './SimpleCTA';
import { Footer } from './Footer';

export const CompleteLivingDocWebsiteV2: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(1024);

  React.useEffect(() => {
    setMounted(true);
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
      background: '#0d1117',
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      <main style={{ flex: 1, width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        {/* Hero - The Hook - Dark Navy */}
        <div style={{
          background: 'radial-gradient(ellipse at top, rgba(0, 194, 255, 0.1) 0%, transparent 50%), #0d1b2a',
          paddingBottom: '0px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <LivingDocHomepageV2 />
        </div>

        {/* The Experience - Show don't tell - Navy Blue */}
        <div style={{
          background: '#1b263b',
          paddingTop: isMobile ? '80px' : '120px',
          paddingBottom: isMobile ? '80px' : '120px',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <TelemetryVisualization isMobile={isMobile} />
        </div>

        {/* The Agent Shift - Problem Statement - Deep Blue-Gray */}
        <div style={{
          background: '#1a2332',
          paddingTop: isMobile ? '60px' : '100px',
          paddingBottom: isMobile ? '60px' : '100px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <AgentShift isMobile={isMobile} />
        </div>

        {/* Final CTA - Deep Navy */}
        <SimpleCTA isMobile={isMobile} />
      </main>
      <Footer />
    </div>
  );
};
