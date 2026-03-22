import React from 'react';
import { LivingDocHomepage } from './LivingDocHomepage';
import { TelemetryVisualization } from './TelemetryVisualization';
import { AgentShift } from './AgentShift';
import { SimpleCTA } from './SimpleCTA';
import { Footer } from './Footer';

export const CompleteLivingDocWebsite: React.FC = () => {
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
          boxSizing: 'border-box',
          height: 'calc(100vh - 70px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <LivingDocHomepage />
        </div>

        {/* The Experience - Show don't tell - Navy Blue */}
        <div style={{
          background: '#1b263b',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
          borderTop: '1px solid rgba(148, 163, 184, 0.1)',
        }}>
          <TelemetryVisualization isMobile={isMobile} />
        </div>

        {/* The Agent Shift - Problem Statement - Deep Blue-Gray */}
        <div style={{
          background: '#1a2332',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          boxSizing: 'border-box',
          borderTop: '1px solid rgba(148, 163, 184, 0.1)',
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
