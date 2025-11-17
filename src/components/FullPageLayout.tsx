import React from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { MultiAudienceHomepage } from './MultiAudienceHomepage';

interface FullPageLayoutProps {
  children?: React.ReactNode;
  includeNavigation?: boolean;
  includeFooter?: boolean;
}

export const FullPageLayout: React.FC<FullPageLayoutProps> = ({
  children,
  includeNavigation = true,
  includeFooter = true,
}) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {includeNavigation && <Navigation />}

      <main style={{ flex: 1, paddingTop: includeNavigation ? '64px' : '0' }}>
        {children}
      </main>

      {includeFooter && <Footer />}
    </div>
  );
};

// Complete homepage with navigation and footer
export const CompleteWebsite: React.FC = () => {
  return (
    <FullPageLayout>
      <MultiAudienceHomepage />
    </FullPageLayout>
  );
};
