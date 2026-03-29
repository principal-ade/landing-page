"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useTheme } from '@principal-ade/industry-theme';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isBlogPage = pathname?.startsWith('/blog');
  const isAboutPage = pathname?.startsWith('/about');
  const isFeaturesPage = pathname?.startsWith('/product');
  const isDemoPage = pathname?.startsWith('/observability-demo');

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
          {isMobile && (isBlogPage || isAboutPage || isFeaturesPage || isDemoPage) && (
            <>
              <span style={{ color: theme.colors.textMuted }}>/</span>
              <Link
                href={isBlogPage ? '/blog' : isAboutPage ? '/about' : isDemoPage ? '/observability-demo' : '/product'}
                style={{
                  color: theme.colors.primary,
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: '500',
                  fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                }}
              >
                {isBlogPage ? 'Blog' : isAboutPage ? 'About' : isDemoPage ? 'Demo' : 'Features'}
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
          <Link
            href="/product"
            style={{
              color: isFeaturesPage ? theme.colors.primary : theme.colors.textSecondary,
              textDecoration: isFeaturesPage ? 'underline' : 'none',
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
              if (!isFeaturesPage) {
                e.currentTarget.style.color = theme.colors.textSecondary;
              }
            }}
          >
            Features
          </Link>
          <Link
            href="/observability-demo"
            style={{
              color: isDemoPage ? theme.colors.primary : theme.colors.textSecondary,
              textDecoration: isDemoPage ? 'underline' : 'none',
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
              if (!isDemoPage) {
                e.currentTarget.style.color = theme.colors.textSecondary;
              }
            }}
          >
            Demo
          </Link>
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
          <Link
            href="/early-access"
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
            Get Early Access
          </Link>
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
          <Link
            href="/product"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: isFeaturesPage ? theme.colors.primary : theme.colors.textSecondary,
              textDecoration: isFeaturesPage ? 'underline' : 'none',
              textUnderlineOffset: '4px',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Features
          </Link>
          <Link
            href="/observability-demo"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: isDemoPage ? theme.colors.primary : theme.colors.textSecondary,
              textDecoration: isDemoPage ? 'underline' : 'none',
              textUnderlineOffset: '4px',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Demo
          </Link>
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
          <Link
            href="/early-access"
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
            Get Early Access
          </Link>
        </div>
      )}
    </nav>
  );
};
