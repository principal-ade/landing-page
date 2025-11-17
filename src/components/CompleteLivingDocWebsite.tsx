import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useThemeSwitcher } from './providers/ClientThemeProvider';
import { LivingDocHomepage } from './LivingDocHomepage';
import { AboutV2 } from './AboutV2';
import { LivingDocumentationSection } from './LivingDocumentationSection';
import { PrincipalFolder } from './PrincipalFolder';
import { AgenticWorkspaceForV2 } from './AgenticWorkspaceForV2';
import { FeaturesAndBenefitsV2 } from './FeaturesAndBenefitsV2';
import { JoinTheAlpha } from './JoinTheAlpha';
import { Footer } from './Footer';

// Mock Logo component with Animation
const MockLogo: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  return (
    <motion.div
      style={{
        width,
        height,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #00C2FF30, #0098CC20, transparent)',
        border: '2px solid #00C2FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 0 20px #00C2FF40',
      }}
      animate={{
        boxShadow: [
          '0 0 20px #00C2FF40',
          '0 0 30px #00C2FF60',
          '0 0 20px #00C2FF40',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          width: '70%',
          height: '70%',
          border: '1.5px solid #00C2FF80',
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: '40%',
          height: '40%',
          border: '1.5px solid #00C2FF60',
          borderRadius: '50%',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: '12%',
          height: '12%',
          background: '#00C2FF',
          borderRadius: '50%',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
};

type Page = 'home' | 'about';

export const CompleteLivingDocWebsite: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentTheme, setCurrentTheme, availableThemes } = useThemeSwitcher();
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    const currentIndex = availableThemes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    setCurrentTheme(availableThemes[nextIndex]);
  };

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#000000' }}>
      {/* Navigation */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: scrolled
            ? 'rgba(0, 0, 0, 0.95)'
            : 'linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${scrolled ? 'rgba(0, 194, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
          transition: 'all 0.3s ease',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo and Brand */}
          <button
            onClick={() => handleNavClick('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleLogoClick();
              }}
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <MockLogo width={32} height={32} />
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: '600',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.02em',
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
            </div>
          </button>

          {/* Desktop Navigation */}
          <div
            style={{
              display: 'none',
              gap: '32px',
              alignItems: 'center',
            }}
            className="desktop-nav"
          >
            <button
              onClick={() => handleNavClick('home')}
              style={{
                background: 'transparent',
                border: 'none',
                color: currentPage === 'home' ? '#00C2FF' : '#ffffff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00C2FF';
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'home') {
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('about')}
              style={{
                background: 'transparent',
                border: 'none',
                color: currentPage === 'about' ? '#00C2FF' : '#ffffff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00C2FF';
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'about') {
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
            >
              About
            </button>
            <a
              href="/demo"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00C2FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#ffffff';
              }}
            >
              Book a Demo
            </a>
          </div>

          {/* CTA Buttons - Desktop */}
          <div
            style={{
              display: 'none',
              gap: '12px',
              alignItems: 'center',
            }}
            className="desktop-cta"
          >
            <a
              href="/demo"
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#00C2FF',
                background: 'transparent',
                border: '1px solid rgba(0, 194, 255, 0.3)',
                borderRadius: '6px',
                textDecoration: 'none',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 194, 255, 0.1)';
                e.currentTarget.style.borderColor = '#00C2FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(0, 194, 255, 0.3)';
              }}
            >
              Watch Demo
            </a>
            <a
              href="/download"
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#000000',
                background: '#00C2FF',
                border: 'none',
                borderRadius: '6px',
                textDecoration: 'none',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                transition: 'all 0.2s ease',
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
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '8px',
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'rgba(0, 0, 0, 0.98)',
                borderTop: '1px solid rgba(0, 194, 255, 0.2)',
                padding: '24px',
              }}
              className="mobile-menu"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <button
                  onClick={() => handleNavClick('home')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    display: 'block',
                    textAlign: 'left',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    display: 'block',
                    textAlign: 'left',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  About
                </button>
                <a
                  href="/demo"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    display: 'block',
                    textAlign: 'left',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Book a Demo
                </a>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                  <a
                    href="/demo"
                    style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#00C2FF',
                      background: 'transparent',
                      border: '1px solid rgba(0, 194, 255, 0.3)',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      textAlign: 'center',
                      fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Watch Demo
                  </a>
                  <a
                    href="/download"
                    style={{
                      padding: '12px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#000000',
                      background: '#00C2FF',
                      border: 'none',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      textAlign: 'center',
                      fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Download Alpha
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`
          @media (min-width: 1024px) {
            .desktop-nav {
              display: flex !important;
            }
            .desktop-cta {
              display: flex !important;
            }
            .mobile-menu-btn {
              display: none !important;
            }
          }
          @media (max-width: 1023px) {
            .mobile-menu-btn {
              display: block !important;
            }
          }
        `}</style>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: '64px' }}>
        <AnimatePresence mode="wait">
          {currentPage === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LivingDocHomepage />
            </motion.div>
          ) : (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AboutV2 />
              <LivingDocumentationSection />
              <PrincipalFolder />
              <AgenticWorkspaceForV2 />
              <FeaturesAndBenefitsV2 />
              <JoinTheAlpha />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
