"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from '@principal-ade/industry-theme';

export const StoryBasedMonitoringContent: React.FC = () => {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 560);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    page: {
      maxWidth: '760px',
      margin: '0 auto',
      padding: '5rem 2rem 6rem',
      background: '#EFF6FB',
      minHeight: '100vh',
    },
    eyebrow: {
      fontFamily: theme.fonts.mono,
      fontSize: '11px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase' as const,
      color: theme.colors.primary,
      marginBottom: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    eyebrowLine: {
      display: 'inline-block',
      width: '20px',
      height: '1px',
      background: theme.colors.primary,
    },
    h1: {
      fontFamily: theme.fonts.serif,
      fontSize: 'clamp(36px, 6vw, 56px)',
      fontWeight: 400,
      lineHeight: 1.1,
      color: theme.colors.text,
      marginBottom: '1.5rem',
      letterSpacing: '-0.01em',
    },
    h1Em: {
      fontStyle: 'italic',
      color: theme.colors.primary,
    },
    lede: {
      fontSize: '18px',
      lineHeight: 1.65,
      color: theme.colors.textSecondary,
      maxWidth: '560px',
      marginBottom: '3.5rem',
      fontWeight: 300,
    },
    divider: {
      border: 'none',
      borderTop: `1px solid ${theme.colors.border}`,
      margin: '3rem 0',
    },
    sectionLabel: {
      fontFamily: theme.fonts.mono,
      fontSize: '10px',
      letterSpacing: '0.14em',
      textTransform: 'uppercase' as const,
      color: theme.colors.textMuted,
      marginBottom: '1.5rem',
    },
    contrastPair: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: '1px',
      background: theme.colors.border,
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '1.75rem',
      border: `1px solid ${theme.colors.border}`,
    },
    contrastCard: {
      background: theme.colors.surface,
      padding: '1.5rem',
    },
    contrastCardRight: {
      background: theme.colors.accent,
      padding: '1.5rem',
    },
    cardLabel: {
      fontFamily: theme.fonts.mono,
      fontSize: '10px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      color: theme.colors.textMuted,
      marginBottom: '0.75rem',
    },
    cardLabelRight: {
      fontFamily: theme.fonts.mono,
      fontSize: '10px',
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      color: '#FFFFFF',
      marginBottom: '0.75rem',
    },
    cardText: {
      fontSize: '14px',
      lineHeight: 1.65,
      color: theme.colors.textSecondary,
    },
    cardTextRight: {
      fontSize: '14px',
      lineHeight: 1.65,
      color: '#FFFFFF',
    },
    prose: {
      fontSize: '15px',
      lineHeight: 1.7,
      color: theme.colors.textSecondary,
      marginBottom: '2rem',
    },
    steps: {
      display: 'flex',
      flexDirection: 'column' as const,
      marginBottom: '2rem',
    },
    step: {
      display: 'flex',
      gap: '20px',
      padding: '1.5rem 0',
      borderBottom: `1px solid ${theme.colors.border}`,
      position: 'relative' as const,
    },
    stepLast: {
      borderBottom: 'none',
    },
    stepNum: {
      fontFamily: theme.fonts.mono,
      fontSize: '11px',
      fontWeight: 500,
      color: theme.colors.primary,
      width: '24px',
      paddingTop: '3px',
      flexShrink: 0,
    },
    stepH3: {
      fontSize: '15px',
      fontWeight: 500,
      color: theme.colors.text,
      marginBottom: '5px',
      fontFamily: theme.fonts.body,
    },
    stepP: {
      fontSize: '14px',
      lineHeight: 1.65,
      color: theme.colors.textSecondary,
    },
    callout: {
      background: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderLeft: `3px solid ${theme.colors.primary}`,
      borderRadius: '0 10px 10px 0',
      padding: '1.25rem 1.5rem',
      marginBottom: '2rem',
    },
    calloutP: {
      fontSize: '15px',
      lineHeight: 1.65,
      color: theme.colors.text,
    },
    calloutStrong: {
      fontWeight: 500,
      color: theme.colors.primary,
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: '10px',
      marginBottom: '2rem',
    },
    miniCard: {
      background: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: '10px',
      padding: '1.25rem',
      transition: 'border-color 0.15s ease',
    },
    miniCardH4: {
      fontSize: '14px',
      fontWeight: 500,
      color: theme.colors.text,
      marginBottom: '6px',
      fontFamily: theme.fonts.body,
    },
    miniCardP: {
      fontSize: '13px',
      lineHeight: 1.55,
      color: theme.colors.textSecondary,
    },
    footerLine: {
      fontFamily: theme.fonts.serif,
      fontStyle: 'italic',
      fontSize: '18px',
      color: theme.colors.textSecondary,
      textAlign: 'center' as const,
      paddingTop: '2rem',
    },
  };

  return (
    <div style={styles.page}>
      <p style={styles.eyebrow}>
        <span style={styles.eyebrowLine}></span>
        Principal AI
      </p>
      <h1 style={styles.h1}>
        Story-based<br />
        <em style={styles.h1Em}>monitoring</em>
      </h1>
      <p style={styles.lede}>
        Traditional observability tells you what happened. Story-based monitoring tells you what should have — and whether it did.
      </p>

      <hr style={styles.divider} />

      <p style={styles.sectionLabel}>The problem with logs</p>
      <div style={styles.contrastPair}>
        <div style={styles.contrastCard}>
          <p style={styles.cardLabel}>What logs give you</p>
          <p style={styles.cardText}>
            A record of what the agent did. Function calls, token counts, timestamps. Accurate, but silent on intent.
          </p>
        </div>
        <div style={styles.contrastCardRight}>
          <p style={styles.cardLabelRight}>What you actually need</p>
          <p style={styles.cardTextRight}>
            A way to verify whether the agent's behavior matched what it was supposed to do. That's a different question entirely.
          </p>
        </div>
      </div>

      <p style={styles.prose}>
        Logs were designed for debugging, not for intent verification. As agents take on more consequential work, the gap between "what happened" and "did it go right" becomes a real risk.
      </p>

      <hr style={styles.divider} />

      <p style={styles.sectionLabel}>How it works</p>
      <div style={styles.steps}>
        <div style={styles.step}>
          <span style={styles.stepNum}>01</span>
          <div>
            <h3 style={styles.stepH3}>Intent is declared before the agent runs</h3>
            <p style={styles.stepP}>
              The developer describes what the agent should accomplish — in plain language, structured as a manifest. This becomes the ground truth for the session.
            </p>
          </div>
        </div>
        <div style={styles.step}>
          <span style={styles.stepNum}>02</span>
          <div>
            <h3 style={styles.stepH3}>The agent runs with OpenTelemetry instrumentation</h3>
            <p style={styles.stepP}>
              Standard OTEL spans capture what actually happened: which tools were called, in what order, with what results.
            </p>
          </div>
        </div>
        <div style={styles.step}>
          <span style={styles.stepNum}>03</span>
          <div>
            <h3 style={styles.stepH3}>Behavior is mapped against declared intent</h3>
            <p style={styles.stepP}>
              The telemetry is compared to the manifest. Principal generates a storyboard — a human-readable account of what the agent did and whether it matched expectations.
            </p>
          </div>
        </div>
        <div style={{ ...styles.step, ...styles.stepLast }}>
          <span style={styles.stepNum}>04</span>
          <div>
            <h3 style={styles.stepH3}>You see the result at a glance</h3>
            <p style={styles.stepP}>
              Not a wall of logs. A story. Agents and humans, one view.
            </p>
          </div>
        </div>
      </div>

      <hr style={styles.divider} />

      <p style={styles.sectionLabel}>The key artifact</p>
      <div style={styles.callout}>
        <p style={styles.calloutP}>
          The <strong style={styles.calloutStrong}>Principal Behavioral Manifest</strong> is the output of story-based telemetry. It connects intent, implementation, and verification in a single durable artifact — generated by the agent, confirmed by the developer.
        </p>
      </div>

      <hr style={styles.divider} />

      <p style={styles.sectionLabel}>Why it matters now</p>
      <div style={styles.cardGrid}>
        <div style={styles.miniCard}>
          <h4 style={styles.miniCardH4}>Agents act autonomously</h4>
          <p style={styles.miniCardP}>
            They don't just answer questions. They write code, run tools, make decisions. You need more than a trace.
          </p>
        </div>
        <div style={styles.miniCard}>
          <h4 style={styles.miniCardH4}>Errors are non-obvious</h4>
          <p style={styles.miniCardP}>
            An agent can complete every step and still fail the task. Logs won't tell you that. Intent verification will.
          </p>
        </div>
        <div style={styles.miniCard}>
          <h4 style={styles.miniCardH4}>Teams need shared context</h4>
          <p style={styles.miniCardP}>
            A storyboard is readable by anyone on the team, not just the engineer who knows what the spans mean.
          </p>
        </div>
        <div style={styles.miniCard}>
          <h4 style={styles.miniCardH4}>The gap is structural</h4>
          <p style={styles.miniCardP}>
            No existing observability tool was built to answer "did it go right." That's the missing primitive.
          </p>
        </div>
      </div>

      <hr style={styles.divider} />

      <p style={styles.footerLine}>
        The log tells you what happened. The storyboard tells you what should have.
      </p>
    </div>
  );
};
