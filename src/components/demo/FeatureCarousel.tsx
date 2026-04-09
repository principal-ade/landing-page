'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '@principal-ade/industry-theme';

interface FeatureItem {
  id: string;
  icon: React.ReactNode | null;
  title: string;
  description: string;
}

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
  const { theme } = useTheme();

  const features: FeatureItem[] = [
    {
      id: 'file-city',
      icon: null,
      title: 'File City',
      description: 'Understand your codebase differently',
    },
    {
      id: 'principal-feed',
      icon: null,
      title: 'Principal Activity Feed',
      description: 'See work differently',
    },
    {
      id: 'story-monitoring',
      icon: null,
      title: 'Story-based Monitoring',
      description: "Monitor so differently you can't even call it observability",
    },
  ];

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
          minHeight: '140px',
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
                {/* Description first - the hero */}
                <h2
                  style={{
                    fontSize: 'clamp(24px, 5vw, 36px)',
                    fontWeight: 600,
                    fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
                    color: theme.colors.text,
                    margin: 0,
                    marginBottom: '16px',
                    lineHeight: 1.3,
                    maxWidth: '600px',
                    minHeight: '90px',
                  }}
                >
                  <RevealText
                    key={`desc-${featureIndex}-${revealKey}`}
                    text={feature.description}
                    isActive={shouldReveal}
                    delay={0}
                  />
                </h2>

                {/* Title after - subtle label */}
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: 500,
                    fontFamily: 'Inter, sans-serif',
                    color: theme.colors.textSecondary,
                    margin: 0,
                    letterSpacing: '0.02em',
                  }}
                >
                  {feature.title}
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
              background: index === displayIndex ? theme.colors.primary : 'rgba(255, 255, 255, 0.2)',
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
