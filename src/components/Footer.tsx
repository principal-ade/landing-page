"use client";

import React from 'react';
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
              For the love of building.
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
