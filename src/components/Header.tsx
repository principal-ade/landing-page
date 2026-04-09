"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useTheme } from '@principal-ade/industry-theme';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);

  const isBlogPage = pathname?.startsWith('/blog');
  const isAboutPage = pathname?.startsWith('/about');
  const isProductPage = pathname?.startsWith('/product') ||
                        pathname?.startsWith('/file-city') ||
                        pathname?.startsWith('/principal-feed') ||
                        pathname?.startsWith('/story-based-monitoring');
  const isFileCityPage = pathname?.startsWith('/file-city');
  const isPrincipalFeedPage = pathname?.startsWith('/principal-feed');
  const isStoryMonitoringPage = pathname?.startsWith('/story-based-monitoring');

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: theme.colors.background,
        borderBottom: `1px solid ${theme.colors.border}`,
        height: '70px',
        padding: isMobile ? '0 20px' : '0 24px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Logo/Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: '600',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            <span style={{ color: theme.colors.text }}>Principal</span>
            <span
              style={{
                fontWeight: '300',
                color: theme.colors.primary,
              }}
            >
              AI
            </span>
          </Link>
          {isMobile && (isBlogPage || isAboutPage || isProductPage) && (
            <>
              <span style={{ color: theme.colors.textMuted }}>/</span>
              <Link
                href={isBlogPage ? '/blog' : isAboutPage ? '/about' : '/product'}
                style={{
                  color: theme.colors.primary,
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: '500',
                  fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                }}
              >
                {isBlogPage ? 'Blog' : isAboutPage ? 'About' : 'Product'}
              </Link>
            </>
          )}
        </div>

        {/* Desktop Nav Links */}
        <div
          style={{
            display: isMobile ? 'none' : 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <Link
            href="/about"
            style={{
              color: isAboutPage ? theme.colors.primary : theme.colors.textSecondary,
              textDecoration: isAboutPage ? 'underline' : 'none',
              textUnderlineOffset: '4px',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.colors.primary;
            }}
            onMouseLeave={(e) => {
              if (!isAboutPage) {
                e.currentTarget.style.color = theme.colors.textSecondary;
              }
            }}
          >
            About
          </Link>

          {/* Product Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setProductDropdownOpen(true)}
            onMouseLeave={() => setProductDropdownOpen(false)}
          >
            <button
              style={{
                background: 'transparent',
                border: 'none',
                color: isProductPage ? theme.colors.primary : theme.colors.textSecondary,
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 0',
                transition: 'color 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                if (!isProductPage) {
                  e.currentTarget.style.color = theme.colors.textSecondary;
                }
              }}
            >
              Product
              <ChevronDown
                size={14}
                style={{
                  transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: productDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  opacity: productDropdownOpen ? 1 : 0.7,
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {productDropdownOpen && (
              <>
                {/* Invisible bridge to prevent dropdown from closing */}
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '-12px',
                    right: '-12px',
                    height: '12px',
                    background: 'transparent',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    left: '-12px',
                    background: theme.colors.background,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '12px',
                    padding: '8px',
                    minWidth: '220px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
                    animation: 'dropdownFadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                <style>
                  {`
                    @keyframes dropdownFadeIn {
                      from {
                        opacity: 0;
                        transform: translateY(-8px);
                      }
                      to {
                        opacity: 1;
                        transform: translateY(0);
                      }
                    }
                  `}
                </style>
                <Link
                  href="/file-city"
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: isFileCityPage ? theme.colors.primary : theme.colors.text,
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    borderRadius: '8px',
                    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: isFileCityPage ? `${theme.colors.primary}15` : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isFileCityPage ? `${theme.colors.primary}25` : `${theme.colors.primary}10`;
                    e.currentTarget.style.color = theme.colors.primary;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isFileCityPage ? `${theme.colors.primary}15` : 'transparent';
                    e.currentTarget.style.color = isFileCityPage ? theme.colors.primary : theme.colors.text;
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  File City
                </Link>
                <Link
                  href="/principal-feed"
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: isPrincipalFeedPage ? theme.colors.primary : theme.colors.text,
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    borderRadius: '8px',
                    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: isPrincipalFeedPage ? `${theme.colors.primary}15` : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isPrincipalFeedPage ? `${theme.colors.primary}25` : `${theme.colors.primary}10`;
                    e.currentTarget.style.color = theme.colors.primary;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isPrincipalFeedPage ? `${theme.colors.primary}15` : 'transparent';
                    e.currentTarget.style.color = isPrincipalFeedPage ? theme.colors.primary : theme.colors.text;
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  Principal Feed
                </Link>
                <Link
                  href="/story-based-monitoring"
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: isStoryMonitoringPage ? theme.colors.primary : theme.colors.text,
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    borderRadius: '8px',
                    transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: isStoryMonitoringPage ? `${theme.colors.primary}15` : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = isStoryMonitoringPage ? `${theme.colors.primary}25` : `${theme.colors.primary}10`;
                    e.currentTarget.style.color = theme.colors.primary;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isStoryMonitoringPage ? `${theme.colors.primary}15` : 'transparent';
                    e.currentTarget.style.color = isStoryMonitoringPage ? theme.colors.primary : theme.colors.text;
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  Story-based Monitoring
                </Link>
              </div>
              </>
            )}
          </div>

          <Link
            href="/blog"
            style={{
              color: isBlogPage ? theme.colors.primary : theme.colors.textSecondary,
              textDecoration: isBlogPage ? 'underline' : 'none',
              textUnderlineOffset: '4px',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = theme.colors.primary;
            }}
            onMouseLeave={(e) => {
              if (!isBlogPage) {
                e.currentTarget.style.color = theme.colors.textSecondary;
              }
            }}
          >
            Blog
          </Link>
          <a
            href="https://principal-ade.com/download"
            style={{
              padding: '8px 20px',
              background: theme.colors.primary,
              color: theme.colors.textOnPrimary,
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              borderRadius: '8px',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}66`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Download
          </a>
        </div>

        {/* Mobile Hamburger Menu Button */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: theme.colors.text,
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: theme.colors.background,
            borderBottom: `1px solid ${theme.colors.border}`,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: isAboutPage ? theme.colors.primary : theme.colors.textSecondary,
              textDecoration: isAboutPage ? 'underline' : 'none',
              textUnderlineOffset: '4px',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            About
          </Link>

          {/* Mobile Product Section */}
          <div>
            <button
              onClick={() => setMobileProductOpen(!mobileProductOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isProductPage ? theme.colors.primary : theme.colors.textSecondary,
                textDecoration: isProductPage ? 'underline' : 'none',
                textUnderlineOffset: '4px',
                fontSize: '16px',
                fontWeight: '500',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                justifyContent: 'flex-start',
              }}
            >
              Product
              <ChevronDown
                size={16}
                style={{
                  transition: 'transform 0.2s ease',
                  transform: mobileProductOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              />
            </button>
            {mobileProductOpen && (
              <div style={{ paddingLeft: '16px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link
                  href="/file-city"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: isFileCityPage ? theme.colors.primary : theme.colors.textSecondary,
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: '500',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  File City
                </Link>
                <Link
                  href="/principal-feed"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: isPrincipalFeedPage ? theme.colors.primary : theme.colors.textSecondary,
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: '500',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  Principal Feed
                </Link>
                <Link
                  href="/story-based-monitoring"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: isStoryMonitoringPage ? theme.colors.primary : theme.colors.textSecondary,
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: '500',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  Story-based Monitoring
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: isBlogPage ? theme.colors.primary : theme.colors.textSecondary,
              textDecoration: isBlogPage ? 'underline' : 'none',
              textUnderlineOffset: '4px',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Blog
          </Link>
          <a
            href="https://principal-ade.com/download"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '12px 24px',
              background: theme.colors.primary,
              color: theme.colors.textOnPrimary,
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '6px',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              textAlign: 'center',
            }}
          >
            Download
          </a>
        </div>
      )}
    </nav>
  );
};
