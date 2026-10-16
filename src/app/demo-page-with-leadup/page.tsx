'use client';

import React, { useState, useEffect } from 'react';
import { ExplanationSection } from '@/components/demo/ExplanationSection';
import { BacklogBackgroundSection } from '@/components/demo/BacklogBackgroundSection';
import { DemoExplanationSectionMobile } from '@/components/demo/DemoExplanationSectionMobile';
import { DemoView } from '@/components/demo/DemoView';

export default function ObservabilityDemoPage() {
  const [providerReady, setProviderReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Track window width for responsive rendering
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Render the Kanban panel once mounted on the client.
  useEffect(() => {
    setProviderReady(true);
  }, []);

  // Open demo view
  const handleStartDemo = () => {
    setIsDemoOpen(true);
  };

  // Close demo view
  const handleCloseDemo = () => {
    setIsDemoOpen(false);
  };

  return (
    <>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#1a1c1e',
        overflowY: 'auto',
        height: 'calc(100vh - 70px)',
        scrollSnapType: 'y mandatory',
      }}>
        {/* Main Content */}
        <main style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
        }}>
          {/* Explanation Section */}
          <ExplanationSection />

          {/* Demo Explanation Section */}
          <DemoExplanationSectionMobile showExpandedText={!isMobile} />

          {/* Backlog Background Section - starts the demo on click */}
          <BacklogBackgroundSection onStartTour={handleStartDemo} />
        </main>
      </div>

      {/* Fullscreen Demo View */}
      <DemoView
        isOpen={isDemoOpen}
        onClose={handleCloseDemo}
        providerReady={providerReady}
      />
    </>
  );
}
