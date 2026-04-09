'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StoryBasedMonitoringContent } from '@/components/StoryBasedMonitoringContent';

export default function StoryBasedMonitoringPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#EFF6FB' }}>
      <Header />
      <StoryBasedMonitoringContent />
      <Footer />
    </div>
  );
}
