'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useTheme } from '@principal-ade/industry-theme';

function formatStarCount(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toString();
}

interface BacklogBackgroundSectionProps {
  /** Called when user clicks "See it in action" to start the tour */
  onStartTour?: () => void;
}

export function BacklogBackgroundSection({ onStartTour }: BacklogBackgroundSectionProps) {
  const { theme } = useTheme();
  const [starCount, setStarCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/MrLesk/Backlog.md')
      .then(res => res.json())
      .then(data => {
        if (data.stargazers_count) {
          setStarCount(data.stargazers_count);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div
      id="backlog-section"
      style={{
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      height: 'calc(100vh - 70px)',
      borderBottom: `1px solid ${theme.colors.border}`,
      scrollSnapAlign: 'start',
      background: theme.colors.backgroundSecondary,
    }}>
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <p style={{
          fontSize: theme.fontSizes[2],
          fontWeight: theme.fontWeights.medium,
          fontFamily: theme.fonts.body,
          color: theme.colors.primary,
          margin: 0,
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Our Demo Partner
        </p>

        <img
          src="/backlog-logo.jpg"
          alt="Backlog.md"
          style={{
            width: 'clamp(80px, 15vw, 120px)',
            height: 'clamp(80px, 15vw, 120px)',
            borderRadius: '16px',
            marginBottom: '24px',
          }}
        />

        <h1 style={{
          fontSize: 'clamp(28px, 6vw, 48px)',
          fontWeight: theme.fontWeights.semibold,
          fontFamily: theme.fonts.body,
          color: theme.colors.text,
          margin: 0,
          marginBottom: '24px',
          textAlign: 'center',
          maxWidth: '800px',
          lineHeight: 1.2,
        }}>
          Markdown-Based<br />Task Manager
        </h1>

        <p style={{
          fontSize: 'clamp(14px, 3vw, 18px)',
          fontFamily: theme.fonts.body,
          color: theme.colors.textSecondary,
          margin: 0,
          marginBottom: 'clamp(32px, 6vw, 64px)',
          textAlign: 'center',
          maxWidth: '600px',
          lineHeight: 1.6,
          padding: '0 16px',
        }}>
          Backlog.md turns any Git repository into a self-contained project board
          powered by plain Markdown files.
        </p>

        <p style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontFamily: theme.fonts.body,
          color: theme.colors.textSecondary,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '6px',
        }}>
          {starCount !== null && (
            <>
              <Star size={16} fill={theme.colors.primary} color={theme.colors.primary} />
              <span style={{ color: theme.colors.primary, fontWeight: theme.fontWeights.medium }}>{formatStarCount(starCount)}</span>
              <span>stars on GitHub.</span>
            </>
          )}
          <span style={{ marginLeft: '4px' }}>Find out more at</span>
          <a
            href="https://github.com/MrLesk/Backlog.md"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: theme.colors.primary,
              textDecoration: 'none',
              fontWeight: theme.fontWeights.medium,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            Backlog.md
          </a>
        </p>

        <div style={{
          marginTop: 'clamp(40px, 8vw, 80px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <button
            onClick={() => {
              if (onStartTour) {
                onStartTour();
              } else {
                // Fallback: scroll to kanban section if no tour handler
                const el = document.getElementById('kanban-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }
            }}
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #0088CC 100%)`,
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              cursor: 'pointer',
              padding: '16px 48px',
              fontSize: 'clamp(16px, 3vw, 18px)',
              fontWeight: theme.fontWeights.semibold,
              fontFamily: theme.fonts.body,
              boxShadow: `0 4px 24px ${theme.colors.primary}66`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 6px 32px ${theme.colors.primary}88`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = `0 4px 24px ${theme.colors.primary}66`;
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21" />
            </svg>
            Start Demo
          </button>
        </div>
      </div>
    </div>
  );
}

export default BacklogBackgroundSection;
