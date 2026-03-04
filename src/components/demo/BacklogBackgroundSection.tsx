'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Star } from 'lucide-react';

function formatStarCount(count: number): string {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return count.toString();
}

export function BacklogBackgroundSection() {
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
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      scrollSnapAlign: 'start',
      background: '#0d1b2a',
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
          fontSize: '14px',
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif',
          color: '#07c0ca',
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
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          color: '#ffffff',
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
          fontFamily: 'Inter, sans-serif',
          color: '#9ca3af',
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
          fontFamily: 'Inter, sans-serif',
          color: '#9ca3af',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '6px',
        }}>
          {starCount !== null && (
            <>
              <Star size={16} fill="#07c0ca" color="#07c0ca" />
              <span style={{ color: '#07c0ca', fontWeight: 500 }}>{formatStarCount(starCount)}</span>
              <span>stars on GitHub.</span>
            </>
          )}
          <span style={{ marginLeft: '4px' }}>Find out more at</span>
          <a
            href="https://github.com/MrLesk/Backlog.md"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#07c0ca',
              textDecoration: 'none',
              fontWeight: 500,
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
          color: '#07c0ca',
        }}>
          <p style={{
            fontSize: '18px',
            fontFamily: 'Inter, sans-serif',
            margin: 0,
            marginBottom: '8px',
          }}>
            See it in action
          </p>
          <div
            onClick={() => {
              const el = document.getElementById('kanban-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            style={{
              animation: 'bounce 2s ease-in-out infinite',
              cursor: 'pointer',
            }}
          >
            <ChevronDown size={48} />
          </div>
          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(6px); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

export default BacklogBackgroundSection;
