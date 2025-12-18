import React from 'react';
import { LivingDocHomepageV2 } from './LivingDocHomepageV2';
import { Footer } from './Footer';

export const CompleteLivingDocWebsiteV2: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000000' }}>
      <main style={{ flex: 1, paddingTop: '40px' }}>
        <LivingDocHomepageV2 />
      </main>
      <Footer />
    </div>
  );
};
