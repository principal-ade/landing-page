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
      background: '#f7fcfd',
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      <main style={{ flex: 1, width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        {/* Hero - The Hook - Ice Blue */}
        <div style={{
          background: 'radial-gradient(ellipse at top, rgba(255, 107, 53, 0.08) 0%, transparent 50%), #f7fcfd',
          paddingBottom: '0px',
          width: '100%',
          boxSizing: 'border-box',
          height: 'calc(100vh - 70px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <LivingDocHomepage />
        </div>

        {/* The Experience - Show don't tell - White */}
        <div style={{
          background: '#ffffff',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          width: '100%',
          boxSizing: 'border-box',
          borderTop: '1px solid #dffff5',
        }}>
          <TelemetryVisualization isMobile={isMobile} />
        </div>

        {/* The Agent Shift - Problem Statement - Ice Blue */}
        <div style={{
          background: '#f7fcfd',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          boxSizing: 'border-box',
          borderTop: '1px solid #dffff5',
          padding: isMobile ? '80px 0' : '120px 0',
        }}>
          <AgentShift isMobile={isMobile} />
        </div>

        {/* Final CTA - White */}
        <SimpleCTA isMobile={isMobile} />
      </main>
      <Footer />
    </div>
  );
};
