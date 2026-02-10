import React from 'react';
import { LivingDocHomepageV2 } from './LivingDocHomepageV2';
import { TelemetryVisualization } from './TelemetryVisualization';
import { SeeTheShape } from './SeeTheShape';
import { MultipleViews } from './MultipleViews';
import { AgentShift } from './AgentShift';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';

export const CompleteLivingDocWebsiteV2: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#0d1117'
    }}>
      <main style={{ flex: 1 }}>
        {/* Hero - The Hook - Dark Navy */}
        <div style={{
          background: 'radial-gradient(ellipse at top, rgba(0, 194, 255, 0.1) 0%, transparent 50%), #0d1b2a',
          paddingBottom: '0px'
        }}>
          <LivingDocHomepageV2 />
        </div>

        {/* The Experience - Show don't tell - Navy Blue */}
        <div style={{
          background: '#1b263b',
          paddingTop: '120px',
          paddingBottom: '120px',
          position: 'relative'
        }}>
          <TelemetryVisualization />
        </div>

        {/* The Call to Action - Dark Gradient with Teal Glow */}
        <div style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 194, 255, 0.04) 0%, transparent 50%), linear-gradient(180deg, #060a0f 0%, #0a0d12 50%, #060a0f 100%)',
          paddingTop: '120px',
          paddingBottom: '120px',
          position: 'relative'
        }}>
          <SeeTheShape />
        </div>

        {/* The Capabilities - Almost Black */}
        <div style={{
          background: '#0a0c10',
          paddingTop: '140px',
          paddingBottom: '140px'
        }}>
          <MultipleViews />
        </div>

        {/* The Agent Shift - Problem Statement - Deep Blue-Gray */}
        <div style={{
          background: '#1a2332',
          paddingTop: '100px',
          paddingBottom: '100px'
        }}>
          <AgentShift />
        </div>

        {/* Final CTA - Deep Navy */}
        <div style={{
          background: '#141e30',
          paddingTop: '100px',
          paddingBottom: '100px'
        }}>
          <FinalCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
};
