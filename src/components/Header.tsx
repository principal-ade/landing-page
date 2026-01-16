"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isBlogPage = pathname?.startsWith('/blog');
  const isAboutPage = pathname?.startsWith('/about');

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: '#000000',
        borderBottom: '1px solid rgba(0, 194, 255, 0.2)',
        padding: isTablet ? '18px 32px' : isMobile ? '14px 20px' : '16px 24px',
      }}
    >
      <div
        style={{
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
              fontSize: isTablet ? '22px' : isMobile ? '18px' : '20px',
              fontWeight: '600',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            <span style={{ color: '#ffffff' }}>Principal</span>
            <span
              style={{
                fontWeight: '300',
                background: 'linear-gradient(135deg, #00C2FF, #0098CC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AI
            </span>
          </Link>
          {isMobile && (isBlogPage || isAboutPage) && (
            <>
              <span style={{ color: 'rgba(255, 255, 255, 0.3)' }}>/</span>
              <Link
                href={isBlogPage ? '/blog' : '/about'}
                style={{
                  color: '#00C2FF',
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: '500',
                  fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                }}
              >
                {isBlogPage ? 'Blog' : 'About'}
              </Link>
            </>
          )}
        </div>

        {/* Desktop Nav Links */}
        <div
          style={{
            display: isMobile ? 'none' : 'flex',
            alignItems: 'center',
            gap: isTablet ? '20px' : '24px',
          }}
        >
          <Link
            href="/about"
            style={{
              color: isAboutPage ? '#00C2FF' : '#d1d5db',
              textDecoration: isAboutPage ? 'underline' : 'none',
              textUnderlineOffset: '4px',
              fontSize: isTablet ? '15px' : '14px',
              fontWeight: '500',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#00C2FF';
            }}
            onMouseLeave={(e) => {
              if (!isAboutPage) {
                e.currentTarget.style.color = '#d1d5db';
              }
            }}
          >
            About
          </Link>
          <Link
            href="/blog"
            style={{
              color: isBlogPage ? '#00C2FF' : '#d1d5db',
              textDecoration: isBlogPage ? 'underline' : 'none',
              textUnderlineOffset: '4px',
              fontSize: isTablet ? '15px' : '14px',
              fontWeight: '500',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#00C2FF';
            }}
            onMouseLeave={(e) => {
              if (!isBlogPage) {
                e.currentTarget.style.color = '#d1d5db';
              }
            }}
          >
            Blog
          </Link>
          <Link
            href="/demo"
            style={{
              padding: isTablet ? '10px 24px' : '8px 20px',
              background: 'transparent',
              color: '#00C2FF',
              border: '1px solid #00C2FF',
              textDecoration: 'none',
              fontSize: isTablet ? '15px' : '14px',
              fontWeight: '600',
              borderRadius: '8px',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 194, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Book a Demo
          </Link>
          <Link
            href="/download"
            style={{
              padding: isTablet ? '10px 24px' : '8px 20px',
              background: '#00C2FF',
              color: '#000000',
              textDecoration: 'none',
              fontSize: isTablet ? '15px' : '14px',
              fontWeight: '600',
              borderRadius: '8px',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 194, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Download Alpha
          </Link>
        </div>

        {/* Mobile Hamburger Menu Button */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
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
            background: 'rgba(0, 0, 0, 0.98)',
            borderBottom: '1px solid rgba(0, 194, 255, 0.2)',
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
              color: isAboutPage ? '#00C2FF' : '#d1d5db',
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
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: isBlogPage ? '#00C2FF' : '#d1d5db',
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
            href="/demo"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: '#00C2FF',
              border: '1px solid #00C2FF',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '6px',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              textAlign: 'center',
            }}
          >
            Book a Demo
          </Link>
          <Link
            href="/download"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '12px 24px',
              background: '#00C2FF',
              color: '#000000',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '6px',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              textAlign: 'center',
            }}
          >
            Download Alpha
          </Link>
        </div>
      )}
    </nav>
  );
};
