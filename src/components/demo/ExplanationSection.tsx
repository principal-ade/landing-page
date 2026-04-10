'use client';

import React from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import Link from 'next/link';
import { Heart } from 'lucide-react';

interface ProductCard {
  title: string;
  description: string;
  href: string;
  graphic: React.ReactNode;
}

// Color palette - Jonathan Adler inspired
const NAVY = '#1a2842';
const BLUE_DARK = '#2d4563';
const BLUE_MID = '#4a6fa5';
const BLUE_LIGHT = '#6b9bd1';
const ORANGE = '#ff6b35';

// File City Graphic - Treemap blocks
const FileCityGraphic = () => (
  <div style={{
    width: '100%',
    height: '200px',
    background: NAVY,
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Large blocks */}
    <div style={{ position: 'absolute', top: '10%', left: '5%', width: '30%', height: '35%', background: BLUE_DARK, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', top: '10%', left: '37%', width: '25%', height: '20%', background: ORANGE, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', top: '10%', left: '64%', width: '32%', height: '50%', background: BLUE_MID, border: '2px solid #000' }} />

    {/* Medium blocks */}
    <div style={{ position: 'absolute', top: '32%', left: '37%', width: '12%', height: '28%', background: BLUE_LIGHT, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', top: '32%', left: '51%', width: '11%', height: '28%', background: BLUE_DARK, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', top: '47%', left: '5%', width: '18%', height: '20%', background: BLUE_MID, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', top: '47%', left: '25%', width: '10%', height: '20%', background: ORANGE, border: '2px solid #000' }} />

    {/* Small blocks */}
    <div style={{ position: 'absolute', top: '62%', left: '37%', width: '8%', height: '15%', background: ORANGE, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', top: '62%', left: '47%', width: '15%', height: '28%', background: BLUE_LIGHT, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', top: '62%', left: '64%', width: '18%', height: '13%', background: ORANGE, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', top: '62%', left: '84%', width: '12%', height: '13%', background: BLUE_MID, border: '2px solid #000' }} />

    {/* Tiny accents */}
    <div style={{ position: 'absolute', top: '69%', left: '5%', width: '6%', height: '8%', background: ORANGE, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', top: '69%', left: '13%', width: '10%', height: '21%', background: BLUE_DARK, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', top: '77%', left: '37%', width: '8%', height: '13%', background: BLUE_MID, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', top: '77%', left: '64%', width: '10%', height: '13%', background: BLUE_DARK, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', top: '77%', left: '76%', width: '6%', height: '13%', background: ORANGE, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', top: '77%', left: '84%', width: '12%', height: '13%', background: BLUE_LIGHT, border: '2px solid #000' }} />
  </div>
);

// Principal Feed Graphic - Timeline bars
const PrincipalFeedGraphic = () => (
  <div style={{
    width: '100%',
    height: '200px',
    background: NAVY,
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    justifyContent: 'center',
  }}>
    {/* Timeline bars with dots */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ORANGE, flexShrink: 0 }} />
      <div style={{ height: '16px', background: BLUE_MID, flex: '0 0 65%', border: '2px solid #000' }} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: BLUE_LIGHT, flexShrink: 0 }} />
      <div style={{ height: '16px', background: BLUE_DARK, flex: '0 0 45%', border: '2px solid #000' }} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ORANGE, flexShrink: 0 }} />
      <div style={{ height: '16px', background: BLUE_LIGHT, flex: '0 0 80%', border: '2px solid #000' }} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: BLUE_MID, flexShrink: 0 }} />
      <div style={{ height: '16px', background: ORANGE, flex: '0 0 35%', border: '2px solid #000' }} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: BLUE_LIGHT, flexShrink: 0 }} />
      <div style={{ height: '16px', background: BLUE_MID, flex: '0 0 55%', border: '2px solid #000' }} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: ORANGE, flexShrink: 0 }} />
      <div style={{ height: '16px', background: BLUE_DARK, flex: '0 0 70%', border: '2px solid #000' }} />
    </div>
  </div>
);

// Story-based Monitoring Graphic - Flow diagram
const StoryMonitoringGraphic = () => (
  <div style={{
    width: '100%',
    height: '200px',
    background: NAVY,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    {/* SVG flow paths */}
    <svg width="100%" height="100%" viewBox="0 0 300 200" style={{ position: 'absolute' }}>
      {/* Main flow path */}
      <path d="M 20 100 L 80 100" stroke={BLUE_MID} strokeWidth="3" fill="none" />
      <path d="M 80 100 L 120 60" stroke={BLUE_LIGHT} strokeWidth="3" fill="none" />
      <path d="M 80 100 L 120 100" stroke={BLUE_MID} strokeWidth="3" fill="none" />
      <path d="M 80 100 L 120 140" stroke={BLUE_DARK} strokeWidth="3" fill="none" />

      {/* Converging paths */}
      <path d="M 120 60 L 180 80" stroke={BLUE_LIGHT} strokeWidth="3" fill="none" />
      <path d="M 120 100 L 180 80" stroke={BLUE_MID} strokeWidth="3" fill="none" />
      <path d="M 120 140 L 180 120" stroke={BLUE_DARK} strokeWidth="3" fill="none" />
      <path d="M 180 80 L 220 100" stroke={BLUE_MID} strokeWidth="3" fill="none" />
      <path d="M 180 120 L 220 100" stroke={BLUE_DARK} strokeWidth="3" fill="none" />
      <path d="M 220 100 L 280 100" stroke={BLUE_MID} strokeWidth="3" fill="none" />
    </svg>

    {/* Nodes */}
    <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', borderRadius: '50%', background: ORANGE, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', left: '80px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', borderRadius: '50%', background: BLUE_LIGHT, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', left: '120px', top: '30%', transform: 'translateY(-50%)', width: '14px', height: '14px', borderRadius: '50%', background: BLUE_MID, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', left: '120px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', borderRadius: '50%', background: BLUE_MID, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', left: '120px', top: '70%', transform: 'translateY(-50%)', width: '14px', height: '14px', borderRadius: '50%', background: BLUE_MID, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', left: '180px', top: '40%', transform: 'translateY(-50%)', width: '14px', height: '14px', borderRadius: '50%', background: BLUE_LIGHT, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', left: '180px', top: '60%', transform: 'translateY(-50%)', width: '14px', height: '14px', borderRadius: '50%', background: BLUE_DARK, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', left: '220px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', borderRadius: '50%', background: BLUE_MID, border: '2px solid #000' }} />
    <div style={{ position: 'absolute', left: '280px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', borderRadius: '50%', background: ORANGE, border: '2px solid #000' }} />
  </div>
);

export function ExplanationSection() {
  const { theme } = useTheme();
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const products: ProductCard[] = [
    {
      title: 'File City',
      description: 'understanding.',
      href: '/file-city',
      graphic: <FileCityGraphic />,
    },
    {
      title: 'Principal Activity Feed',
      description: 'seeing progress.',
      href: '/principal-feed',
      graphic: <PrincipalFeedGraphic />,
    },
    {
      title: 'Story-based Monitoring',
      description: 'knowing it works.',
      href: '/story-based-monitoring',
      graphic: <StoryMonitoringGraphic />,
    },
  ];

  return (
    <div style={{
      padding: isMobile ? '40px 24px 60px' : '60px 40px 80px',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: isMobile ? '20px' : '24px',
        marginBottom: isMobile ? '48px' : '56px',
      }}>
        {products.map((product) => (
          <Link
            key={product.title}
            href={product.href}
            style={{
              textDecoration: 'none',
              background: theme.colors.background,
              border: `3px solid ${NAVY}`,
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = ORANGE;
              e.currentTarget.style.boxShadow = `0 16px 40px rgba(255, 107, 53, 0.25)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = NAVY;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Graphic - top 60% */}
            <div style={{ width: '100%' }}>
              {product.graphic}
            </div>

            {/* Content - bottom 40% */}
            <div style={{
              padding: isMobile ? '24px 20px' : '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              background: theme.colors.background,
            }}>
              {/* Description with heart */}
              <h3 style={{
                fontSize: isMobile ? '18px' : '20px',
                fontWeight: 600,
                fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
                color: theme.colors.text,
                margin: 0,
                marginBottom: '10px',
                lineHeight: 1.3,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}>
                For the <Heart size={18} fill={ORANGE} stroke={ORANGE} style={{ flexShrink: 0 }} /> of {product.description}
              </h3>

              {/* Product name */}
              <p style={{
                fontSize: '13px',
                fontWeight: 800,
                fontFamily: 'Inter, sans-serif',
                color: ORANGE,
                margin: 0,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                {product.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ExplanationSection;
