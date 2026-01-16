import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useThemeSwitcher } from './providers/ClientThemeProvider';
import { trackButtonClick, trackNavigation } from '@/lib/analytics';

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

interface NavLink {
  label: string;
  href: string;
  subLinks?: { label: string; href: string; description?: string }[];
}

const navLinks: NavLink[] = [
  {
    label: 'Platform',
    href: '#',
    subLinks: [
      { label: 'Features', href: '/features', description: 'Explore all capabilities' },
      { label: 'Workspace', href: '/workspace', description: 'Agentic development environment' },
      { label: 'Documentation', href: '/docs', description: 'Living documentation system' },
    ],
  },
  {
    label: 'Solutions',
    href: '#',
    subLinks: [
      { label: 'For Developers', href: '/?audience=developers', description: 'Build with AI agents' },
      { label: 'For Teams', href: '/?audience=teams', description: 'Collaborate seamlessly' },
      { label: 'For Enterprise', href: '/enterprise', description: 'Scale with confidence' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

export const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
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

  return (
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
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <div
            onClick={(e) => {
              e.preventDefault();
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
        </Link>

        {/* Desktop Navigation */}
        <div
          style={{
            display: 'none',
            gap: '32px',
            alignItems: 'center',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <div
              key={link.label}
              style={{ position: 'relative' }}
              onMouseEnter={() => link.subLinks && setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href={link.href}
                onClick={() => trackNavigation(link.label)}
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#00C2FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                {link.label}
                {link.subLinks && <ChevronDown size={16} />}
              </a>

              {/* Dropdown Menu */}
              {link.subLinks && activeDropdown === link.label && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '12px',
                    background: 'rgba(10, 22, 40, 0.98)',
                    border: '1px solid rgba(0, 194, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '8px',
                    minWidth: '240px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {link.subLinks.map((subLink) => (
                    <a
                      key={subLink.label}
                      href={subLink.href}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 194, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div
                        style={{
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '4px',
                          fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                        }}
                      >
                        {subLink.label}
                      </div>
                      {subLink.description && (
                        <div
                          style={{
                            color: '#9ca3af',
                            fontSize: '12px',
                            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                          }}
                        >
                          {subLink.description}
                        </div>
                      )}
                    </a>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
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
            onClick={() => trackButtonClick('Watch Demo', '/demo')}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#00C2FF',
              background: 'transparent',
              border: '1px solid rgba(0, 194, 255, 0.3)',
              borderRadius: '8px',
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
            onClick={() => trackButtonClick('Download Alpha - Nav', '/download')}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#000000',
              background: '#00C2FF',
              border: 'none',
              borderRadius: '8px',
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
              {navLinks.map((link) => (
                <div key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => trackNavigation(link.label)}
                    style={{
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                      display: 'block',
                      marginBottom: '12px',
                    }}
                  >
                    {link.label}
                  </a>
                  {link.subLinks && (
                    <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {link.subLinks.map((subLink) => (
                        <a
                          key={subLink.label}
                          href={subLink.href}
                          style={{
                            color: '#9ca3af',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                          }}
                        >
                          {subLink.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                <a
                  href="/demo"
                  onClick={() => trackButtonClick('Watch Demo', '/demo')}
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
                  onClick={() => trackButtonClick('Download Alpha - Nav', '/download')}
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
  );
};
