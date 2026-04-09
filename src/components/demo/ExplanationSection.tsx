'use client';

import React from 'react';
import { useTheme } from '@principal-ade/industry-theme';
import Link from 'next/link';
import { Heart } from 'lucide-react';

interface ProductCard {
  title: string;
  description: string;
  href: string;
}

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
    },
    {
      title: 'Principal Activity Feed',
      description: 'seeing progress.',
      href: '/principal-feed',
    },
    {
      title: 'Story-based Monitoring',
      description: 'knowing it works.',
      href: '/story-based-monitoring',
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
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '12px',
              padding: isMobile ? '32px 24px' : '40px 28px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = theme.colors.primary;
              e.currentTarget.style.boxShadow = `0 12px 24px ${theme.colors.primary}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = theme.colors.border;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Description - hero */}
            <h3 style={{
              fontSize: isMobile ? '20px' : '22px',
              fontWeight: 600,
              fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
              color: theme.colors.text,
              margin: 0,
              marginBottom: '12px',
              lineHeight: 1.3,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              For the <Heart size={20} fill={theme.colors.primary} stroke={theme.colors.primary} style={{ flexShrink: 0 }} /> of {product.description}
            </h3>

            {/* Product name - subtle label */}
            <p style={{
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              color: theme.colors.textSecondary,
              margin: 0,
              letterSpacing: '0.02em',
            }}>
              {product.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ExplanationSection;
