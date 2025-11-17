import React from 'react';
import { LivingDocHomepage } from './LivingDocHomepage';
import { Footer } from './Footer';

export const CompleteLivingDocWebsite: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000000' }}>
      <main style={{ flex: 1 }}>
        <LivingDocHomepage />
      </main>
      <Footer />
    </div>
  );
};
