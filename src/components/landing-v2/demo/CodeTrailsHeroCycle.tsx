"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@principal-ade/industry-theme';
import { TrailCityProgress } from '@principal-ai/logo-component';

interface CodeTrailsHeroCycleProps {
  isMobile?: boolean;
  /** The static lead-in that stays on screen. */
  prefix?: string;
  /** The rotating suffixes that get typed out one at a time. */
  suffixes?: string[];
}

const DEFAULT_SUFFIXES = [
  '…you’re stuck.',
  '…you need a second opinion.',
  '…expert feedback is needed.',
  '…the agent went sideways.',
  '…someone needs to weigh in.',
  '…you’re handing it off.',
  '…you actually need to understand it.',
  '…you’re building together.',
  '…alignment matters.',
  '…you’ll be responsible if it breaks.',
  '…you aren’t quite sure enough.',
  '…you need a mental model.',
  '…something just feels off.',
  '…you doubt the agent understands.',
  '…you don’t even know what to ask.',
  '…your files touch another team’s.',
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

type Phase = 'typing' | 'holding' | 'fading';

/**
 * Types out each phrase character-by-character, holds, then fades the whole
 * phrase out before typing the next one in. When the user prefers reduced
 * motion we skip the per-character typing and just cross-fade full phrases.
 */
function useTypewriter(
  phrases: string[],
  reducedMotion: boolean,
  { typeSpeed = 45, holdTime = 1700, fadeTime = 420, gapTime = 140 } = {}
) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<Phase>('typing');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const current = phrases[index % phrases.length];
    let id: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      setVisible(true);
      if (reducedMotion) {
        // No per-character typing: drop the full phrase in, then hold.
        if (text !== current) setText(current);
        else id = setTimeout(() => setPhase('holding'), holdTime);
      } else if (text.length < current.length) {
        id = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed);
      } else {
        id = setTimeout(() => setPhase('holding'), holdTime);
      }
    } else if (phase === 'holding') {
      id = setTimeout(() => setPhase('fading'), 0);
    } else {
      // Fading: drop opacity, then after the fade swap to the next phrase.
      setVisible(false);
      id = setTimeout(() => {
        setText('');
        setIndex((i) => i + 1);
        setPhase('typing');
      }, fadeTime + gapTime);
    }

    return () => clearTimeout(id);
  }, [text, phase, index, phrases, reducedMotion, typeSpeed, holdTime, fadeTime, gapTime]);

  return { text, visible, fadeTime, index };
}

export const CodeTrailsHeroCycle: React.FC<CodeTrailsHeroCycleProps> = ({
  isMobile = false,
  prefix = 'Make a trail when',
  suffixes = DEFAULT_SUFFIXES,
}) => {
  const { theme } = useTheme();
  const reducedMotion = usePrefersReducedMotion();
  const { text: typed, visible, fadeTime, index } = useTypewriter(suffixes, reducedMotion);

  // Populate the map only once a phrase has finished typing — so the squares
  // appear during the hold while the completed text sits on screen, not while
  // it's still typing in. The advance holds steady through the fade-out and the
  // next type-in (same value), then bumps again when that phrase completes.
  // After one full pass the city is fully built and stays put.
  const current = suffixes[index % suffixes.length] ?? '';
  const phraseComplete = current.length > 0 && typed.length >= current.length;
  const mapProgress = Math.min(
    1,
    (index + (phraseComplete ? 1 : 0)) / suffixes.length
  );

  // Reserve vertical space for the suffix so the layout never jumps as the
  // phrase length changes. The longest phrase drives the reserved height.
  const longest = useRef(
    suffixes.reduce((a, b) => (b.length > a.length ? b : a), '')
  ).current;

  const headingFontSize = isMobile
    ? 'clamp(16px, 4.5vw, 25px)'
    : 'clamp(24px, 4.6vw, 60px)';

  return (
    <section
      style={{
        minHeight: 'calc(100vh - 70px)',
        background: `radial-gradient(1100px 600px at 70% 8%, rgba(255,135,85,0.10), transparent 60%),
                     radial-gradient(900px 600px at 12% 90%, rgba(34,211,238,0.10), transparent 60%),
                     ${theme.colors.background}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.05fr 1fr',
          gap: isMobile ? '56px' : '80px',
          alignItems: 'center',
          padding: isMobile ? '40px 24px 64px' : '64px 40px 96px',
          maxWidth: '1480px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Left: Copy */}
        <div style={{ marginLeft: '100px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              style={{
                fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
                fontWeight: '700',
                lineHeight: 1.04,
                letterSpacing: '-0.04em',
                color: theme.colors.text,
                margin: 0,
                fontSize: headingFontSize,
              }}
            >
              <span>{prefix}</span>{' '}
              {/* Suffix line: a relatively-sized invisible spacer holds the row
                  height while the visible typed text is absolutely positioned. */}
              <span
                style={{
                  display: 'block',
                  position: 'relative',
                  marginTop: isMobile ? '4px' : '8px',
                }}
              >
                {/* Invisible longest phrase reserves the space. */}
                <span aria-hidden style={{ visibility: 'hidden' }}>
                  {longest}
                </span>
                {/* Visible typed text. */}
                <span
                  aria-live="polite"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    color: theme.colors.primary,
                    whiteSpace: 'pre-wrap',
                    opacity: visible ? 1 : 0,
                    transition: `opacity ${fadeTime}ms ease`,
                  }}
                >
                  {typed}
                  <motion.span
                    aria-hidden
                    animate={{ opacity: reducedMotion ? 1 : [1, 1, 0, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                      times: [0, 0.5, 0.5, 1],
                    }}
                    style={{
                      display: 'inline-block',
                      width: '0.06em',
                      height: '0.92em',
                      marginLeft: '0.04em',
                      transform: 'translateY(0.08em)',
                      background: theme.colors.primary,
                      borderRadius: '1px',
                    }}
                  />
                </span>
              </span>
            </h1>
          </motion.div>
        </div>

        {/* Right: Visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: isMobile ? '315px' : '465px',
            margin: '0 auto',
            minHeight: isMobile ? '315px' : '465px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TrailCityProgress theme={theme} progress={mapProgress} />
        </motion.div>
      </div>
    </section>
  );
};
