"use client";

import React, { useState } from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Support', href: '/support' },
      { label: 'Book a Demo', href: '/demo' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

const socialLinks = [
  { icon: Github, href: 'https://github.com/principal-ai', label: 'GitHub' },
  { icon: Twitter, href: 'https://x.com/principal_ade', label: 'X' },
  { icon: Linkedin, href: 'https://linkedin.com/company/principalai', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:principalai@noetic-labs.ai', label: 'Email' },
];

export const Footer: React.FC = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus('error');
      setMessage('Please enter your email');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, source: 'footer' }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Successfully subscribed!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe');
      }
    } catch {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
    }
  };

  return (
    <footer
      style={{
        background: `linear-gradient(180deg, ${theme.colors.background} 0%, ${theme.colors.backgroundSecondary} 100%)`,
        borderTop: `1px solid ${theme.colors.border}`,
        padding: '80px 24px 40px 24px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Main Footer Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
            marginBottom: '60px',
          }}
        >
          {/* Brand Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div
              style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '16px',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              <span style={{ color: theme.colors.text }}>Principal</span>{' '}
              <span
                style={{
                  fontWeight: '300',
                  color: theme.colors.primary,
                }}
              >
                AI
              </span>
            </div>
            <p
              style={{
                color: theme.colors.textTertiary,
                fontSize: '14px',
                lineHeight: '1.6',
                marginBottom: '24px',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Story-based software<br />from dev to production.
            </p>

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: `${theme.colors.primary}1A`,
                      border: `1px solid ${theme.colors.primary}33`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: theme.colors.primary,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    whileHover={{
                      scale: 1.1,
                      background: `${theme.colors.primary}33`,
                      borderColor: theme.colors.primary,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Footer Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3
                style={{
                  color: theme.colors.text,
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                }}
              >
                {section.title}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{
                        color: theme.colors.textTertiary,
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = theme.colors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = theme.colors.textTertiary;
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div
          style={{
            background: `${theme.colors.primary}0D`,
            border: `1px solid ${theme.colors.primary}33`,
            borderRadius: '12px',
            padding: '32px',
            marginBottom: '60px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
              alignItems: 'center',
            }}
          >
            <div>
              <h3
                style={{
                  color: theme.colors.text,
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                }}
              >
                Stay Updated
              </h3>
              <p
                style={{
                  color: theme.colors.textTertiary,
                  fontSize: '14px',
                  margin: 0,
                  fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                }}
              >
                Get the latest updates on Principal AI features and releases.
              </p>
            </div>
            <form
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                width: '100%',
              }}
              onSubmit={handleSubmit}
            >
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  style={{
                    flex: '1 1 150px',
                    minWidth: '0',
                    padding: '8px 10px',
                    background: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '8px',
                    color: theme.colors.text,
                    fontSize: '13px',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    outline: 'none',
                    opacity: status === 'loading' ? 0.6 : 1,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.primary;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.border;
                  }}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    flex: '0 0 auto',
                    padding: '8px 16px',
                    background: status === 'loading' ? theme.colors.muted : theme.colors.primary,
                    color: theme.colors.textOnPrimary,
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (status !== 'loading') {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${theme.colors.primary}66`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
              {message && (
                <p
                  style={{
                    color: status === 'success' ? '#4ade80' : '#f87171',
                    fontSize: '12px',
                    margin: 0,
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '32px',
            borderTop: `1px solid ${theme.colors.border}`,
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <p
            style={{
              color: theme.colors.textTertiary,
              fontSize: '14px',
              margin: 0,
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            © {new Date().getFullYear()} Principal AI. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a
              href="/privacy"
              style={{
                color: theme.colors.textTertiary,
                textDecoration: 'none',
                fontSize: '14px',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.colors.textTertiary;
              }}
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              style={{
                color: theme.colors.textTertiary,
                textDecoration: 'none',
                fontSize: '14px',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.colors.textTertiary;
              }}
            >
              Terms of Service
            </a>
            <a
              href="/cookies"
              style={{
                color: theme.colors.textTertiary,
                textDecoration: 'none',
                fontSize: '14px',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme.colors.textTertiary;
              }}
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
