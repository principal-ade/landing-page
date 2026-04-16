'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

// Ice Tangerine Color Palette
const COLORS = {
  bg: '#0c1225',
  surface: '#111a32',
  surface2: '#162040',
  border: 'rgba(107, 155, 209, 0.15)',
  borderStrong: 'rgba(107, 155, 209, 0.25)',
  text: '#e2e8f0',
  textMuted: '#8899b4',
  textFaint: '#4a5f80',
  primary: '#ff6b35',
  primaryGlow: 'rgba(255, 107, 53, 0.15)',
  secondary: '#0893d2',
  green: '#4ade80',
  red: '#ef4444',
  blueLight: '#6b9bd1',
  navy: '#1a2842',
};

// Fade-in scroll animation hook
function useFadeInOnScroll(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

export function StoryBasedMonitoringContent() {
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    // Set initial window width after mount
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh' }}>
      <HeroSection />
      <TwoWorldsSection windowWidth={windowWidth} />
      <MonitoringBackwardsSection />
      <ManifestSection windowWidth={windowWidth} />
      <WhySection windowWidth={windowWidth} />
      <CTASection />
    </div>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(6rem, 20vw, 9rem) 1.5rem 4rem',
        position: 'relative',
        overflow: 'hidden',
        background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${COLORS.primaryGlow} 0%, transparent 60%), ${COLORS.bg}`,
      }}
    >
      <div style={{ maxWidth: '720px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: '"Fira Code", monospace',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: COLORS.primary,
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ display: 'inline-block', width: '24px', height: '1px', background: COLORS.primary }} />
          <span>Story-Based Monitoring</span>
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            fontSize: 'clamp(2.5rem, 1rem + 4vw, 5rem)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: COLORS.text,
            marginBottom: '1.5rem',
          }}
        >
          You're Shipping Code
          <br />
          <span style={{ color: COLORS.primary, fontStyle: 'italic' }}>You Didn't Write.</span>
        </h1>
        <p
          style={{
            fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
            lineHeight: 1.7,
            color: COLORS.textMuted,
            maxWidth: '580px',
            margin: '0 auto 3rem',
          }}
        >
          Your AI agent generated a pull request. Tests pass. CI is green. You merge it. The code runs perfectly - it just skips the fraud check before processing payments. Traditional monitoring sees success. You see a compliance violation six hours later.
        </p>
      </div>
    </section>
  );
}

// Silent Failure Section
function TwoWorldsSection({ windowWidth }: { windowWidth: number }) {
  const { ref, isVisible } = useFadeInOnScroll(0.3);

  return (
    <section ref={ref} style={{ padding: 'clamp(4rem, 8vw, 6rem) 1.5rem', background: COLORS.bg }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: COLORS.textFaint,
            marginBottom: '1.5rem',
            textAlign: 'center',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          The Problem: Silent Failures
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            fontSize: 'clamp(2rem, 1.2rem + 2.5vw, 3.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: COLORS.text,
            textAlign: 'center',
            marginBottom: '1rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}
        >
          All Green. All Wrong.
        </h2>

        <p
          style={{
            fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
            lineHeight: 1.7,
            color: COLORS.textMuted,
            textAlign: 'center',
            maxWidth: '660px',
            margin: '0 auto 3rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          Same trace. Two completely different interpretations.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: windowWidth > 768 ? '1fr 1fr' : '1fr',
            gap: '1.5rem',
            marginBottom: '2rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        >
          <TracePanel type="traditional" windowWidth={windowWidth} />
          <TracePanel type="story-based" windowWidth={windowWidth} />
        </div>

        <p
          style={{
            textAlign: 'center',
            fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
            lineHeight: 1.7,
            color: COLORS.textMuted,
            maxWidth: '660px',
            margin: '0 auto',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
          }}
        >
          Every span returned <code style={{ fontFamily: '"Fira Code", monospace', fontSize: '0.88em', background: 'rgba(255, 107, 53, 0.12)', color: COLORS.primary, padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>200 OK</code>. Traditional monitoring sees success. Story-based monitoring catches the sequence violation: <strong style={{ color: COLORS.primary }}>fraud check skipped before payment processing</strong>. This is a silent failure - successful execution of the wrong behavior.
        </p>
      </div>
    </section>
  );
}

// Monitoring Backwards Section
function MonitoringBackwardsSection() {
  const { ref, isVisible } = useFadeInOnScroll(0.3);

  return (
    <section ref={ref} style={{ padding: 'clamp(4rem, 8vw, 6rem) 1.5rem', background: `linear-gradient(180deg, ${COLORS.bg} 0%, #0e1530 50%, ${COLORS.bg} 100%)` }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <div
          style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: COLORS.textFaint,
            marginBottom: '1.5rem',
            textAlign: 'center',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          The Root Cause
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            fontSize: 'clamp(2rem, 1.2rem + 2.5vw, 3.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: COLORS.text,
            textAlign: 'center',
            marginBottom: '1rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}
        >
          Monitoring Starts From
          <br />
          <span style={{ color: COLORS.primary, fontStyle: 'italic' }}>the Wrong End.</span>
        </h2>
        <p
          style={{
            fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
            lineHeight: 1.7,
            color: COLORS.textMuted,
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto 3rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          We built observability backward. We instrument code. Capture telemetry. Then try to figure out what it means. But we never wrote down what was supposed to happen in the first place.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontFamily: '"Fira Code", monospace', fontSize: '12px', fontWeight: 600, color: COLORS.red, marginBottom: '1rem', letterSpacing: '0.05em' }}>TRADITIONAL APPROACH</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ padding: '0.75rem 1.5rem', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontFamily: '"Fira Code", monospace', fontSize: '13px', color: COLORS.textMuted }}>Ship Code</div>
                <div style={{ color: COLORS.textFaint }}>→</div>
                <div style={{ padding: '0.75rem 1.5rem', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontFamily: '"Fira Code", monospace', fontSize: '13px', color: COLORS.textMuted }}>Capture Telemetry</div>
                <div style={{ color: COLORS.textFaint }}>→</div>
                <div style={{ padding: '0.75rem 1.5rem', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontFamily: '"Fira Code", monospace', fontSize: '13px', color: COLORS.textMuted }}>Guess Intent</div>
              </div>
              <p style={{ marginTop: '1rem', fontSize: '14px', color: COLORS.textFaint, fontStyle: 'italic' }}>You're reverse-engineering what the code should have done.</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontFamily: '"Fira Code", monospace', fontSize: '12px', fontWeight: 600, color: COLORS.primary, marginBottom: '1rem', letterSpacing: '0.05em' }}>STORY-BASED APPROACH</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ padding: '0.75rem 1.5rem', background: 'rgba(255, 107, 53, 0.1)', border: `1px solid ${COLORS.primary}`, borderRadius: '8px', fontFamily: '"Fira Code", monospace', fontSize: '13px', color: COLORS.text }}>Declare Intent</div>
                <div style={{ color: COLORS.primary }}>→</div>
                <div style={{ padding: '0.75rem 1.5rem', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontFamily: '"Fira Code", monospace', fontSize: '13px', color: COLORS.textMuted }}>Ship Code</div>
                <div style={{ color: COLORS.primary }}>→</div>
                <div style={{ padding: '0.75rem 1.5rem', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontFamily: '"Fira Code", monospace', fontSize: '13px', color: COLORS.textMuted }}>Verify Behavior</div>
              </div>
              <p style={{ marginTop: '1rem', fontSize: '14px', color: COLORS.primary, fontStyle: 'italic' }}>Intent is the starting point, not an afterthought.</p>
            </div>
          </div>
        </div>

        <p
          style={{
            fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
            lineHeight: 1.7,
            color: COLORS.textMuted,
            textAlign: 'center',
            maxWidth: '720px',
            margin: '3rem auto 0',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
          }}
        >
          Story-based monitoring flips the model. You write down what should happen <em style={{ color: COLORS.text, fontStyle: 'normal', fontWeight: 500 }}>before</em> the agent runs. Then telemetry proves whether it did.
        </p>
      </div>
    </section>
  );
}

function TracePanel({ type, windowWidth }: { type: 'traditional' | 'story-based'; windowWidth: number }) {
  const [isAnimated, setIsAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsAnimated(true), type === 'story-based' ? 200 : 0);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [type]);

  const isStoryBased = type === 'story-based';

  return (
    <div
      ref={ref}
      style={{
        background: COLORS.surface,
        border: `1px solid ${isStoryBased ? 'rgba(255, 107, 53, 0.25)' : COLORS.border}`,
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: isStoryBased ? '0 4px 24px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 40px rgba(255, 107, 53, 0.08)' : '0 4px 24px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <span
          style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            background: isStoryBased ? 'rgba(255, 107, 53, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            color: isStoryBased ? COLORS.primary : COLORS.textMuted,
            border: `1px solid ${isStoryBased ? 'rgba(255, 107, 53, 0.25)' : 'rgba(239, 68, 68, 0.2)'}`,
          }}
        >
          {isStoryBased ? 'Story-Based Monitoring' : 'Traditional Monitoring'}
        </span>
        <span
          style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: isStoryBased ? COLORS.primary : COLORS.green,
          }}
        >
          {isStoryBased ? 'VIOLATION' : 'ALL CLEAR'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { name: 'validate_cart', width: '45%', time: '12ms' },
          { name: isStoryBased ? 'check_fraud' : 'process_payment', width: '75%', time: isStoryBased ? '0ms' : '234ms' },
          { name: isStoryBased ? 'process_payment' : 'confirm_order', width: isStoryBased ? '85%' : '28%', time: isStoryBased ? '234ms' : '8ms' },
        ].map((span, i) => (
          <TraceSpan
            key={i}
            name={span.name}
            width={span.width}
            time={span.time}
            delay={i * 200}
            isAnimated={isAnimated}
            showCheck={isStoryBased && span.name !== 'check_fraud'}
            isSkipped={isStoryBased && span.name === 'check_fraud'}
            windowWidth={windowWidth}
          />
        ))}
        {isStoryBased && (
          <TraceSpan
            name="confirm_order"
            width="28%"
            time="8ms"
            delay={600}
            isAnimated={isAnimated}
            showCheck={true}
            windowWidth={windowWidth}
          />
        )}
        {!isStoryBased && (
          <TraceSpan
            name="api.response"
            width="20%"
            time="4ms"
            delay={600}
            isAnimated={isAnimated}
            showCheck={false}
            windowWidth={windowWidth}
          />
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          paddingTop: '1rem',
          borderTop: `1px solid ${COLORS.border}`,
          fontFamily: '"Fira Code", monospace',
          fontSize: '11px',
          lineHeight: 1.5,
          color: isStoryBased ? COLORS.primary : COLORS.green,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke={isStoryBased ? COLORS.primary : COLORS.green} strokeWidth="1.5" />
          {isStoryBased ? (
            <path d="M6 6l4 4M10 6l-4 4" stroke={COLORS.primary} strokeWidth="1.5" strokeLinecap="round" />
          ) : (
            <path d="M5 8l2 2 4-4" stroke={COLORS.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
        <span>{isStoryBased ? 'Sequence violation: fraud check required before payment processing' : '4 spans, 0 errors, 258ms total'}</span>
      </div>
    </div>
  );
}

function TraceSpan({ name, width, time, delay, isAnimated, showCheck, isSkipped, windowWidth }: { name: string; width: string; time?: string; delay: number; isAnimated: boolean; showCheck: boolean; isSkipped?: boolean; windowWidth: number }) {
  if (isSkipped) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: windowWidth > 560 ? '140px 1fr auto' : '100px 1fr auto',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.5rem 0',
          opacity: isAnimated ? 1 : 0,
          transform: isAnimated ? 'translateX(0)' : 'translateX(-8px)',
          transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay + 200}ms, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay + 200}ms`,
        }}
      >
        <span style={{ fontFamily: '"Fira Code", monospace', fontSize: '12px', color: COLORS.primary, fontWeight: 500 }}>{name}</span>
        <div style={{ height: '6px', borderRadius: '3px', background: 'repeating-linear-gradient(90deg, rgba(255, 107, 53, 0.3) 0px, rgba(255, 107, 53, 0.3) 4px, transparent 4px, transparent 8px)' }}>
          <style>{`@keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }`}</style>
          <div style={{ animation: 'pulse 2s ease-in-out infinite' }} />
        </div>
        <span style={{ fontFamily: '"Fira Code", monospace', fontSize: '10px', fontWeight: 600, color: COLORS.primary, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>SKIPPED</span>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: windowWidth > 560 ? '140px 1fr auto' : '100px 1fr auto',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.5rem 0',
        opacity: isAnimated ? 1 : 0,
        transform: isAnimated ? 'translateX(0)' : 'translateX(-8px)',
        transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay + 200}ms, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${delay + 200}ms`,
      }}
    >
      <span style={{ fontFamily: '"Fira Code", monospace', fontSize: '12px', color: COLORS.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
      <div style={{ height: '6px', borderRadius: '3px', position: 'relative', overflow: 'hidden', background: 'rgba(74, 222, 128, 0.4)', width }}>
        <style>{`@keyframes barFill { to { width: 100%; } }`}</style>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 0, background: COLORS.green, borderRadius: '3px', animation: 'barFill 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }} />
      </div>
      {showCheck ? (
        <span style={{ fontSize: '12px', color: COLORS.green, fontWeight: 700 }}>✓</span>
      ) : time ? (
        <span style={{ fontFamily: '"Fira Code", monospace', fontSize: '11px', color: COLORS.textFaint, fontVariantNumeric: 'tabular-nums' }}>{time}</span>
      ) : null}
    </div>
  );
}

// Manifest Section
function ManifestSection({ windowWidth }: { windowWidth: number }) {
  const { ref, isVisible } = useFadeInOnScroll(0.3);

  return (
    <section ref={ref} style={{ padding: 'clamp(4rem, 8vw, 6rem) 1.5rem', background: COLORS.bg }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <div
          style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: COLORS.textFaint,
            marginBottom: '1.5rem',
            textAlign: 'center',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          The Solution
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            fontSize: 'clamp(2rem, 1.2rem + 2.5vw, 3.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: COLORS.text,
            textAlign: 'center',
            marginBottom: '1rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}
        >
          The Missing Artifact:
          <br />
          <span style={{ color: COLORS.primary }}>OTEL Behavioral Manifest</span>
        </h2>
        <p
          style={{
            fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
            lineHeight: 1.7,
            color: COLORS.textMuted,
            textAlign: 'center',
            maxWidth: '680px',
            margin: '0 auto 3rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          A single file that connects intent, implementation, and verification. It's what you write <em style={{ color: COLORS.text, fontStyle: 'normal', fontWeight: 500 }}>before</em> your agent ships code. It's what telemetry gets compared against <em style={{ color: COLORS.text, fontStyle: 'normal', fontWeight: 500 }}>after</em>.
        </p>

        <div
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.borderStrong}`,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)',
            marginBottom: '3rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'rgba(0, 0, 0, 0.2)', borderBottom: `1px solid ${COLORS.border}` }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: COLORS.textFaint, flexShrink: 0 }}>
              <path d="M4 1h6l4 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10 1v4h4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span style={{ fontFamily: '"Fira Code", monospace', fontSize: '12px', color: COLORS.textMuted, fontWeight: 500 }}>checkout.manifest.yaml</span>
            <span style={{ marginLeft: 'auto', fontFamily: '"Fira Code", monospace', fontSize: '10px', letterSpacing: '0.06em', color: COLORS.primary, background: 'rgba(255, 107, 53, 0.1)', padding: '2px 8px', borderRadius: '999px' }}>OTEL Behavioral Manifest</span>
          </div>
          <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <pre style={{ margin: 0, fontFamily: '"Fira Code", monospace', fontSize: '13px', lineHeight: 1.75, color: COLORS.textMuted }}>
              <code>
                <span style={{ color: COLORS.blueLight, fontWeight: 500 }}>story</span>: <span style={{ color: COLORS.green }}>"Process checkout with fraud check"</span>
                {'\n\n'}
                <span style={{ color: COLORS.blueLight, fontWeight: 500 }}>intent</span>:{'\n'}
                {'  '}<span style={{ color: COLORS.blueLight, fontWeight: 500 }}>actor</span>: <span style={{ color: COLORS.green }}>"checkout-service"</span>{'\n'}
                {'  '}<span style={{ color: COLORS.blueLight, fontWeight: 500 }}>goal</span>: <span style={{ color: COLORS.green }}>"Validate cart, check fraud, process payment, confirm order"</span>
                {'\n\n'}
                <span style={{ color: COLORS.blueLight, fontWeight: 500 }}>steps</span>:{'\n'}
                {'  '}- <span style={{ color: COLORS.blueLight, fontWeight: 500 }}>name</span>: <span style={{ color: COLORS.green }}>"validate cart"</span>{'\n'}
                {'    '}<span style={{ color: COLORS.blueLight, fontWeight: 500 }}>expects</span>: <span style={{ color: COLORS.green }}>"validate_cart span with items"</span>{'\n'}
                {'  '}- <span style={{ color: COLORS.blueLight, fontWeight: 500 }}>name</span>: <span style={{ color: COLORS.green }}>"check fraud"</span>{'\n'}
                {'    '}<span style={{ color: COLORS.blueLight, fontWeight: 500 }}>expects</span>: <span style={{ color: COLORS.green }}>"check_fraud span before process_payment"</span>{'\n'}
                {'    '}<span style={{ color: COLORS.textFaint, fontStyle: 'italic' }}># ^ This is the step traditional monitoring misses</span>{'\n'}
                {'  '}- <span style={{ color: COLORS.blueLight, fontWeight: 500 }}>name</span>: <span style={{ color: COLORS.green }}>"process payment"</span>{'\n'}
                {'    '}<span style={{ color: COLORS.blueLight, fontWeight: 500 }}>expects</span>: <span style={{ color: COLORS.green }}>"process_payment span with amount"</span>{'\n'}
                {'  '}- <span style={{ color: COLORS.blueLight, fontWeight: 500 }}>name</span>: <span style={{ color: COLORS.green }}>"confirm order"</span>{'\n'}
                {'    '}<span style={{ color: COLORS.blueLight, fontWeight: 500 }}>expects</span>: <span style={{ color: COLORS.green }}>"confirm_order span with order_id"</span>
                {'\n\n'}
                <span style={{ color: COLORS.blueLight, fontWeight: 500 }}>verification</span>:{'\n'}
                {'  '}<span style={{ color: COLORS.blueLight, fontWeight: 500 }}>mode</span>: <span style={{ color: COLORS.green }}>"strict"</span>{'\n'}
                {'  '}<span style={{ color: COLORS.blueLight, fontWeight: 500 }}>on_sequence_violation</span>: <span style={{ color: COLORS.green }}>"alert"</span>
              </code>
            </pre>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: windowWidth > 640 ? 'repeat(3, 1fr)' : '1fr',
            gap: '1.5rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
          }}
        >
          {[
            { num: '01', title: 'Intent', text: 'You declare what the agent should do before it runs. This becomes ground truth - the source of "should" in your system.' },
            { num: '02', title: 'Implementation', text: 'Standard OpenTelemetry spans capture what actually happened: which operations ran, in what sequence, with what results.' },
            { num: '03', title: 'Verification', text: 'Runtime telemetry is validated against the manifest. A visual storyboard shows what matched the intent - and what didn\'t.' },
          ].map((pillar, i) => (
            <div key={i} style={{ padding: '1.5rem', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '12px' }}>
              <div style={{ fontFamily: '"Fira Code", monospace', fontSize: '11px', color: COLORS.primary, marginBottom: '0.75rem', fontWeight: 600 }}>{pillar.num}</div>
              <h3 style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)', fontSize: 'clamp(1.125rem, 1rem + 0.75vw, 1.5rem)', fontWeight: 600, color: COLORS.text, marginBottom: '0.5rem' }}>{pillar.title}</h3>
              <p style={{ fontSize: 'clamp(0.875rem, 0.8rem + 0.35vw, 1rem)', lineHeight: 1.65, color: COLORS.textMuted, margin: 0 }}>{pillar.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Why Now Section
function WhySection({ windowWidth }: { windowWidth: number }) {
  const { ref, isVisible } = useFadeInOnScroll(0.3);

  return (
    <section ref={ref} style={{ padding: 'clamp(4rem, 8vw, 6rem) 1.5rem', background: `linear-gradient(180deg, ${COLORS.bg} 0%, #0e1530 50%, ${COLORS.bg} 100%)` }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
        <div
          style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: COLORS.textFaint,
            marginBottom: '1.5rem',
            textAlign: 'center',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          Why This Matters Now
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            fontSize: 'clamp(2rem, 1.2rem + 2.5vw, 3.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: COLORS.text,
            textAlign: 'center',
            marginBottom: '1rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}
        >
          AI Agents Need
          <br />
          <span style={{ color: COLORS.primary }}>Behavioral Guardrails</span>
        </h2>

        <p
          style={{
            fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
            lineHeight: 1.7,
            color: COLORS.textMuted,
            textAlign: 'center',
            maxWidth: '680px',
            margin: '0 auto 3rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          Agents don't just write code - they ship it. They make autonomous decisions. And they can succeed at every step while completely missing the point. Traditional monitoring wasn't built for this.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: windowWidth > 640 ? 'repeat(2, 1fr)' : '1fr',
            gap: '1.5rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        >
          {[
            {
              title: 'Silent failures are the new norm',
              text: 'An agent can complete every operation successfully and still violate the requirement. Status codes won\'t catch it.',
              icon: <><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>,
            },
            {
              title: 'You need ground truth',
              text: 'The manifest becomes the source of "should" in your system. Not documentation. Not tribal knowledge. A versioned, durable artifact.',
              icon: <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M16 13H8M16 17H8M10 9H8" />,
            },
            {
              title: 'Verification happens at runtime',
              text: 'The storyboard doesn\'t just show what happened - it shows whether it matched the declared intent. Instantly.',
              icon: <><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></>,
            },
            {
              title: 'It\'s still OpenTelemetry',
              text: 'No proprietary formats. No vendor lock-in. Standard OTEL spans, enriched with behavioral verification. Use your existing instrumentation.',
              icon: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></>,
            },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                padding: '1.5rem',
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '12px',
                transition: 'border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.borderStrong)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.border)}
            >
              <div style={{ marginBottom: '1rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={COLORS.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {card.icon}
                </svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)', fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.25rem)', fontWeight: 600, color: COLORS.text, marginBottom: '0.5rem' }}>{card.title}</h3>
              <p style={{ fontSize: 'clamp(0.875rem, 0.8rem + 0.35vw, 1rem)', lineHeight: 1.65, color: COLORS.textMuted, margin: 0 }}>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  const { ref, isVisible } = useFadeInOnScroll(0.3);

  return (
    <section ref={ref} style={{ padding: 'clamp(4rem, 10vw, 6rem) 1.5rem', background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${COLORS.primaryGlow} 0%, transparent 60%), ${COLORS.bg}` }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: COLORS.textFaint,
            marginBottom: '1.5rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          See It In Action
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
            fontSize: 'clamp(2rem, 1.2rem + 2.5vw, 3.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: COLORS.text,
            marginBottom: '1rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
          }}
        >
          Try the Interactive Demo
        </h2>
        <p
          style={{
            fontSize: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
            lineHeight: 1.7,
            color: COLORS.textMuted,
            maxWidth: '640px',
            margin: '0 auto 3rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          Explore a real working example using <strong style={{ color: COLORS.text }}>Backlog.md</strong> - an open-source task manager. See how manifests validate behavior, catch silent failures, and generate storyboards in real-time.
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        >
          <Link
            href="/observability-demo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem 2.5rem',
              borderRadius: '999px',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              fontSize: 'clamp(0.875rem, 0.8rem + 0.35vw, 1rem)',
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '0.01em',
              minHeight: '52px',
              background: COLORS.primary,
              color: '#fff',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Launch Interactive Demo →
          </Link>
        </div>
        <p
          style={{
            fontSize: '14px',
            color: COLORS.textFaint,
            fontStyle: 'italic',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
          }}
        >
          No signup required. Fully interactive in your browser.
        </p>
      </div>
    </section>
  );
}
