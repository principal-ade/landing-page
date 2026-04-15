'use client';

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Color palette
const NAVY = '#1a2842';
const BLUE_DARK = '#2d4563';
const BLUE_MID = '#4a6fa5';
const BLUE_LIGHT = '#6b9bd1';
const ORANGE = '#ff6b35';
const GREEN = '#4ade80';

interface TraceStep {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  bgColor: string;
  borderColor: string;
  delay: number;
  isError?: boolean;
}

interface TracePath {
  id: string;
  d: string;
  color: string;
  delay: number;
  isDashed?: boolean;
}

interface ScenarioStep {
  text: string;
  variable: string;
  value: string;
}

export function AnimatedStoryMonitoringSection({ isMobile }: { isMobile: boolean }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [showValues, setShowValues] = React.useState(false);

  const viewBoxWidth = 600;
  const viewBoxHeight = 500;

  // Define trace steps for checkout error flow
  const steps: TraceStep[] = [
    {
      id: 'validated',
      label: 'payment.validated',
      x: 100,
      y: 50,
      width: 180,
      height: 60,
      bgColor: 'rgba(74, 222, 128, 0.15)',
      borderColor: GREEN,
      delay: 0,
    },
    {
      id: 'authorized',
      label: 'payment.authorized',
      x: 100,
      y: 140,
      width: 180,
      height: 60,
      bgColor: 'rgba(107, 155, 209, 0.15)',
      borderColor: BLUE_LIGHT,
      delay: 0.4,
    },
    {
      id: 'captured',
      label: 'payment.captured',
      x: 100,
      y: 230,
      width: 180,
      height: 60,
      bgColor: 'rgba(107, 155, 209, 0.15)',
      borderColor: BLUE_LIGHT,
      delay: 0.8,
    },
    {
      id: 'error',
      label: 'payment.failed',
      x: 350,
      y: 230,
      width: 180,
      height: 60,
      bgColor: 'rgba(255, 107, 53, 0.15)',
      borderColor: '#ff4444',
      delay: 1.2,
      isError: true,
    },
  ];

  // Define paths (arrows)
  const paths: TracePath[] = [
    { id: 'p1', d: `M 190 110 L 190 140`, color: BLUE_LIGHT, delay: 0.2 },
    { id: 'p2', d: `M 190 200 L 190 230`, color: BLUE_LIGHT, delay: 0.6 },
    { id: 'p3', d: `M 280 260 L 350 260`, color: '#ff4444', delay: 1.0, isDashed: true },
  ];

  // Scenario steps with variables for checkout error
  const scenarioSteps: ScenarioStep[] = [
    { text: 'Processing payment for', variable: '{{customer.email}}', value: 'user@example.com' },
    { text: 'Amount:', variable: '{{payment.amount}}', value: '$127.50' },
    { text: 'Payment method:', variable: '{{payment.method}}', value: 'Visa ****4242' },
    { text: 'Authorization:', variable: '{{auth.status}}', value: 'approved' },
    { text: 'Capture attempt:', variable: '{{capture.status}}', value: 'failed' },
    { text: 'Error:', variable: '{{error.message}}', value: 'Insufficient funds' },
  ];

  // Trigger variable fill after animation completes
  React.useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setShowValues(true);
      }, 2000); // 2s delay to let trace animation finish
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <section
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0a0e1a',
        padding: isMobile ? '80px 24px' : '100px 40px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? '48px' : '64px',
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? '32px' : '56px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '24px',
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              lineHeight: 1.2,
            }}
          >
            For the{' '}
            <Heart
              size={isMobile ? 32 : 48}
              fill={ORANGE}
              stroke={ORANGE}
              style={{ flexShrink: 0 }}
            />{' '}
            of being sure.
          </h2>
          <p
            style={{
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: '800',
              color: ORANGE,
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Story-Based Monitoring
          </p>
          <p
            style={{
              fontSize: isMobile ? '15px' : '17px',
              color: BLUE_LIGHT,
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              lineHeight: 1.5,
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Your agent said it's done. That's not the same as correct. We capture the intent in your code and show you whether the running code did what you meant.
          </p>
        </motion.div>

        {/* Combined Container with Trace Flow + Scenario Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, #0d1628 100%)`,
            borderRadius: '16px',
            padding: isMobile ? '32px 20px' : '40px',
            border: `3px solid ${BLUE_DARK}`,
            marginBottom: isMobile ? '40px' : '60px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '32px' : '40px',
            alignItems: isMobile ? 'stretch' : 'flex-start',
          }}
        >
          {/* Trace Flow Diagram */}
          <div style={{ flex: isMobile ? 'none' : '1' }}>
            <svg
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '400px',
              }}
            >
              {/* Paths (arrows) */}
              {paths.map((path) => {
                return (
                  <motion.path
                    key={path.id}
                    d={path.d}
                    stroke={path.color}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={path.isDashed ? '5,5' : undefined}
                    markerEnd="url(#arrowhead)"
                    initial={{
                      pathLength: 0,
                      opacity: 0,
                    }}
                    animate={
                      isInView
                        ? {
                            pathLength: 1,
                            opacity: 1,
                          }
                        : {}
                    }
                    transition={{
                      pathLength: {
                        duration: 0.6,
                        delay: path.delay,
                        ease: [0.4, 0, 0.2, 1],
                      },
                      opacity: {
                        duration: 0.3,
                        delay: path.delay,
                      },
                    }}
                  />
                );
              })}

              {/* Arrow marker */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="8"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill={BLUE_LIGHT} />
                </marker>
              </defs>

              {/* Step boxes */}
              {steps.map((step) => (
                <motion.g key={step.id}>
                  {/* Box */}
                  <motion.rect
                    x={step.x}
                    y={step.y}
                    width={step.width}
                    height={step.height}
                    rx="8"
                    fill={step.bgColor}
                    stroke={step.borderColor}
                    strokeWidth="2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: step.delay,
                      type: 'spring',
                      stiffness: 300,
                    }}
                  />

                  {/* Label */}
                  <motion.text
                    x={step.x + step.width / 2}
                    y={step.y + step.height / 2 + 5}
                    textAnchor="middle"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{
                      duration: 0.4,
                      delay: step.delay + 0.2,
                    }}
                    style={{
                      fill: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '600',
                      fontFamily: 'monospace',
                    }}
                  >
                    {step.label}
                  </motion.text>

                  {/* Start marker (S) */}
                  <motion.circle
                    cx={step.x + 15}
                    cy={step.y + 15}
                    r="8"
                    fill={GREEN}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{
                      duration: 0.3,
                      delay: step.delay + 0.3,
                      type: 'spring',
                    }}
                  />
                  <motion.text
                    x={step.x + 15}
                    y={step.y + 19}
                    textAnchor="middle"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{
                      duration: 0.2,
                      delay: step.delay + 0.4,
                    }}
                    style={{
                      fill: '#000',
                      fontSize: '10px',
                      fontWeight: '700',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    S
                  </motion.text>

                  {/* End marker (E) */}
                  <motion.circle
                    cx={step.x + step.width - 15}
                    cy={step.y + 15}
                    r="8"
                    fill={ORANGE}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{
                      duration: 0.3,
                      delay: step.delay + 0.3,
                      type: 'spring',
                    }}
                  />
                  <motion.text
                    x={step.x + step.width - 15}
                    y={step.y + 19}
                    textAnchor="middle"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{
                      duration: 0.2,
                      delay: step.delay + 0.4,
                    }}
                    style={{
                      fill: '#000',
                      fontSize: '10px',
                      fontWeight: '700',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    E
                  </motion.text>
                </motion.g>
              ))}
            </svg>
          </div>

          {/* Scenario Card */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
              padding: isMobile ? '20px' : '28px',
              border: `1px solid ${BLUE_DARK}`,
              flex: isMobile ? 'none' : '1',
            }}
          >
            {/* Header */}
            <h3
              style={{
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '20px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Checkout Error
            </h3>

            {/* Steps with variables */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {scenarioSteps.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '8px',
                    fontSize: isMobile ? '13px' : '14px',
                    fontFamily: 'monospace',
                    lineHeight: 1.6,
                  }}
                >
                  <span style={{ color: BLUE_LIGHT }}>{step.text}</span>
                  <motion.span
                    initial={{ opacity: 1 }}
                    animate={
                      showValues
                        ? { opacity: 1 }
                        : { opacity: 1 }
                    }
                    transition={{ duration: 0.4 }}
                    style={{
                      color: showValues
                        ? idx === scenarioSteps.length - 1
                          ? '#ff4444' // Red for error
                          : idx === scenarioSteps.length - 2
                          ? '#ff4444' // Red for failed status
                          : GREEN
                        : '#666',
                      fontWeight: '600',
                    }}
                  >
                    {showValues ? step.value : step.variable}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 2.4 }}
          style={{
            textAlign: 'center',
          }}
        >
          <Link
            href="https://principal-ade.com/story-based-monitoring"
            style={{
              color: BLUE_MID,
              fontSize: isMobile ? '15px' : '16px',
              fontWeight: '500',
              textDecoration: 'none',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              borderBottom: `1px solid ${BLUE_MID}`,
              transition: 'opacity 0.2s ease',
            }}
          >
            Learn more about Story-based Monitoring →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
