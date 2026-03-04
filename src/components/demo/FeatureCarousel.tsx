'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Logo } from '@principal-ai/logo-component';

interface FeatureItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    id: 'story-based',
    icon: <Logo width={90} height={90} color="#07c0ca" />,
    title: 'Story-based Dev',
    description: 'Design your systems expected behaviors first',
  },
  {
    id: 'ai-native',
    icon: (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '12px' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#13120a', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, position: 'relative' }}>
          <img src="/cursor-logo.svg" alt="Cursor" width={38} height={38} />
        </div>
        <div style={{ width: 58, height: 58, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-28px', transform: 'translateY(-3px)', zIndex: 3, position: 'relative' }}>
          <img src="/claude-logo.svg" alt="Claude" width={36} height={36} />
        </div>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-28px', zIndex: 1, position: 'relative' }}>
          <img src="/openai-logo.svg" alt="OpenAI Codex" width={38} height={38} />
        </div>
      </div>
    ),
    title: 'AI Native Validation',
    description: 'Confirm agent code changes in development',
  },
  {
    id: 'otel',
    icon: <img src="/otel-logo.png" alt="OpenTelemetry" width={54} height={54} />,
    title: 'Built on OTel',
    description: 'Works with your existing OpenTelemetry setup',
  },
];

const ROTATION_INTERVAL = 4000; // 4 seconds per slide
const TRANSITION_DURATION = 500; // 0.5s transition
const REVEAL_SPEED = 25; // ms per character

// Reveal text component - letters appear in place
// Note: reactStrictMode is disabled in next.config.mjs to prevent double-mount animation restarts in dev
function RevealText({
  text,
  isActive,
  delay = 0,
}: {
  text: string;
  isActive: boolean;
  delay?: number;
}) {
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setRevealedCount(0);
      return;
    }

    let currentIndex = 0;
    const startTimeout = setTimeout(() => {
      const revealInterval = setInterval(() => {
        if (currentIndex < text.length) {
          currentIndex++;
          setRevealedCount(currentIndex);
        } else {
          clearInterval(revealInterval);
        }
      }, REVEAL_SPEED);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [isActive, text, delay]);

  return (
    <span>
      {text.split('').map((char, idx) => (
        <span
          key={idx}
          style={{
            opacity: idx < revealedCount ? 1 : 0,
            transition: 'opacity 0.15s ease-in',
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

export function FeatureCarousel() {
  // We use an extended array: [...features, features[0]] for seamless looping
  const [position, setPosition] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [revealActive, setRevealActive] = useState(0); // Which slide should reveal text
  const [revealKey, setRevealKey] = useState(0); // Force re-render of reveal
  const slideCount = features.length;
  const containerRef = useRef<HTMLDivElement>(null);

  // The actual displayed index (for dots)
  const displayIndex = position % slideCount;

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setRevealActive(-1); // Disable reveal during transition
    setPosition((prev) => prev + 1);
  }, []);

  // Track if we're doing a loop reset (to skip reveal trigger)
  const isLoopReset = useRef(false);

  // Handle the seamless loop reset
  useEffect(() => {
    if (position === slideCount) {
      // We've reached the cloned first slide, wait for transition then reset
      const timeout = setTimeout(() => {
        isLoopReset.current = true;
        setIsTransitioning(false);
        setPosition(0);
      }, TRANSITION_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [position, slideCount]);

  // Trigger reveal effect after slide transition completes
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      // On first render, revealActive is already 0, just skip
      isFirstRender.current = false;
      return;
    }

    if (isLoopReset.current) {
      // Skip reveal trigger when resetting from cloned slide
      isLoopReset.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      setRevealActive(position % slideCount);
      setRevealKey((prev) => prev + 1);
    }, TRANSITION_DURATION);
    return () => clearTimeout(timeout);
  }, [position, slideCount]);

  // Auto-rotate
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(nextSlide, ROTATION_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Handle dot click - go to specific slide
  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setPosition(index);
  };

  // Extended slides array with first slide cloned at the end
  const extendedFeatures = [...features, features[0]];

  return (
    <div
      style={{
        marginTop: '24px',
        width: '100%',
        maxWidth: '800px',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '180px',
        }}
      >
        {/* Slides */}
        <div
          ref={containerRef}
          style={{
            display: 'flex',
            transition: isTransitioning ? `transform ${TRANSITION_DURATION}ms ease-in-out` : 'none',
            transform: `translateX(-${position * 100}%)`,
          }}
        >
          {extendedFeatures.map((feature, idx) => {
            const featureIndex = idx % slideCount;
            const shouldReveal = featureIndex === revealActive;

            return (
              <div
                key={`${feature.id}-${idx}`}
                style={{
                  flex: '0 0 100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '0 24px',
                }}
              >
                <div
                  style={{
                    height: '80px',
                    marginBottom: '16px',
                    color: '#07c0ca',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    color: '#ffffff',
                    margin: 0,
                    marginBottom: '8px',
                    minHeight: '28px',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif',
                    color: '#6b7280',
                    margin: 0,
                    lineHeight: 1.5,
                    maxWidth: '280px',
                    minHeight: '48px',
                  }}
                >
                  <RevealText
                    key={`desc-${featureIndex}-${revealKey}`}
                    text={feature.description}
                    isActive={shouldReveal}
                    delay={0}
                  />
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots Indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '24px',
        }}
      >
        {features.map((feature, index) => (
          <button
            key={feature.id}
            onClick={() => goToSlide(index)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              border: 'none',
              background: index === displayIndex ? '#07c0ca' : 'rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              padding: 0,
              transition: 'background 0.3s ease, transform 0.2s ease',
              transform: index === displayIndex ? 'scale(1.2)' : 'scale(1)',
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
}

export default FeatureCarousel;
