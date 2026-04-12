"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useTheme } from '@principal-ade/industry-theme';
import { AnimatedFileCityHero } from './demo/AnimatedFileCityHero';
import { InteractiveFileCitySection } from './demo/InteractiveFileCitySection';
import { AnimatedPrincipalFeedSection } from './demo/AnimatedPrincipalFeedSection';
import { AnimatedStoryMonitoringSection } from './demo/AnimatedStoryMonitoringSection';
import { Footer } from './Footer';

export const ForTheLoveOfBuildingAnimated: React.FC = () => {
  const { theme } = useTheme();
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <div
      style={{
        background: theme.colors.background,
        scrollBehavior: 'smooth',
      }}
    >
      {/* Animated Hero Section */}
      <AnimatedFileCityHero isMobile={isMobile} />

      {/* Interactive Product Sections */}
      <InteractiveFileCitySection isMobile={isMobile} />
      <AnimatedPrincipalFeedSection isMobile={isMobile} />
      <AnimatedStoryMonitoringSection isMobile={isMobile} />

      {/* Final CTA Section */}
      <section
        style={{
          minHeight: isMobile ? '60vh' : '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#dff1f5',
          padding: isMobile ? '80px 24px' : '100px 40px',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          style={{
            maxWidth: '800px',
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? '36px' : '56px',
              fontWeight: '700',
              color: '#1a2842',
              marginBottom: '24px',
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              lineHeight: 1.2,
            }}
          >
            Ready to see your code differently?
          </h2>

          <p
            style={{
              fontSize: isMobile ? '17px' : '22px',
              lineHeight: '1.6',
              color: '#2d4563',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              marginBottom: '48px',
              maxWidth: '600px',
              margin: '0 auto 48px',
            }}
          >
            See and build. Build and see. Verify intention. Repeat.
          </p>

          <motion.a
            href="https://principal-ade.com/download"
            whileHover={{
              scale: 1.05,
              boxShadow: `0 12px 32px ${theme.colors.primary}66`,
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: theme.colors.primary,
              color: theme.colors.textOnPrimary,
              padding: isMobile ? '16px 36px' : '20px 48px',
              borderRadius: '12px',
              fontSize: isMobile ? '17px' : '19px',
              fontWeight: '700',
              textDecoration: 'none',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              border: `2px solid ${theme.colors.primary}`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Download Principal AI
            <Download size={24} strokeWidth={2.5} />
          </motion.a>

          {/* Subtle tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              marginTop: '32px',
              fontSize: isMobile ? '14px' : '15px',
              color: '#4a6fa5',
              fontFamily: 'Inter, sans-serif',
              fontStyle: 'italic',
            }}
          >
            Built for agents. Optimized for humans. Because you're still the boss of AI.
          </motion.p>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
