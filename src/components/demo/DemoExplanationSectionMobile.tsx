'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '@principal-ade/industry-theme';

interface DemoExplanationSectionMobileProps {
  showExpandedText?: boolean;
}

export function DemoExplanationSectionMobile({ showExpandedText = false }: DemoExplanationSectionMobileProps) {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add a pause before starting animations
          setTimeout(() => {
            setIsVisible(true);
          }, 1500);
          observer.disconnect(); // Only trigger once
        }
      },
      { threshold: 0.3 } // Trigger when 30% visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      id="demo-explanation-section"
      style={{
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        height: 'calc(100vh - 70px)',
        borderBottom: `1px solid ${theme.colors.border}`,
        scrollSnapAlign: 'start',
        background: theme.colors.backgroundSecondary,
      }}
    >
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
          How it Works
        </p>

        <h1 style={{
          fontSize: 'clamp(28px, 6vw, 42px)',
          fontWeight: theme.fontWeights.semibold,
          fontFamily: theme.fonts.body,
          color: theme.colors.text,
          margin: 0,
          marginBottom: '24px',
          textAlign: 'center',
          maxWidth: '800px',
          lineHeight: 1.2,
        }}>
          From Traces to Stories
        </h1>

        {showExpandedText && (
          <p style={{
            fontSize: theme.fontSizes[4],
            fontFamily: theme.fonts.body,
            color: theme.colors.textSecondary,
            margin: 0,
            marginBottom: '32px',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: 1.6,
          }}>
            Understanding behavior from OTel, we can provide clarity to how your systems work.
          </p>
        )}

        {/* Simplified Architecture Diagram */}
        <svg
          viewBox="0 0 300 320"
          style={{
            width: '100%',
            maxWidth: '300px',
            height: 'auto',
          }}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes flowTelemetry {
              from { stroke-dashoffset: 16; }
              to { stroke-dashoffset: 0; }
            }
            .svg-animate {
              opacity: 0;
              animation: fadeIn 0.5s ease-out forwards;
            }
            .telemetry-flow {
              animation: flowTelemetry 1.5s linear infinite;
            }
            .output-flow {
              animation: flowTelemetry 1.5s linear infinite;
            }
          `}</style>

          {/* Definitions for arrows */}
          <defs>
            <marker
              id="arrowhead-telemetry-mobile"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill={theme.colors.warning} />
            </marker>
            <marker
              id="arrowhead-green-mobile"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill={theme.colors.success} />
            </marker>
          </defs>

          {/* Your System Box */}
          <g className={isVisible ? "svg-animate" : ""} style={{ opacity: isVisible ? undefined : 0, animationDelay: '0s' }} transform="translate(70, 10)">
            <rect x="0" y="0" width="160" height="70" fill={`${theme.colors.primary}1A`} stroke={theme.colors.primary} strokeWidth="2" />
            <text x="80" y="42" textAnchor="middle" fill={theme.colors.text} fontFamily={theme.fonts.body} fontSize="16" fontWeight="600">Your System</text>
          </g>

          {/* Telemetry arrow: Your System -> Principal AI */}
          <g className={isVisible ? "svg-animate" : ""} style={{ opacity: isVisible ? undefined : 0, animationDelay: '1s' }}>
            <line className={isVisible ? "telemetry-flow" : ""} x1="150" y1="80" x2="150" y2="125" stroke={theme.colors.warning} strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#arrowhead-telemetry-mobile)" />
            <text x="175" y="107" fill={theme.colors.warning} fontFamily={theme.fonts.body} fontSize="14">telemetry</text>
          </g>

          {/* Principal AI Box */}
          <g className={isVisible ? "svg-animate" : ""} style={{ opacity: isVisible ? undefined : 0, animationDelay: '2s' }} transform="translate(70, 130)">
            <rect x="0" y="0" width="160" height="50" fill={theme.colors.background} stroke={theme.colors.primary} strokeWidth="3" />
            <text x="80" y="32" textAnchor="middle" fontFamily={theme.fonts.body} fontSize="16" fontWeight="700">
              <tspan fill={theme.colors.text}>Principal </tspan>
              <tspan fill={theme.colors.primary}>AI</tspan>
            </text>
          </g>

          {/* Output arrow: Principal AI -> Stories */}
          <g className={isVisible ? "svg-animate" : ""} style={{ opacity: isVisible ? undefined : 0, animationDelay: '3s' }}>
            <line className={isVisible ? "output-flow" : ""} x1="150" y1="180" x2="150" y2="225" stroke={theme.colors.success} strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#arrowhead-green-mobile)" />
            <text x="175" y="207" fill={theme.colors.success} fontFamily={theme.fonts.body} fontSize="14">stories</text>
          </g>

          {/* Stories Output Box */}
          <g className={isVisible ? "svg-animate" : ""} style={{ opacity: isVisible ? undefined : 0, animationDelay: '4s' }} transform="translate(70, 230)">
            <rect x="0" y="0" width="160" height="70" fill={`${theme.colors.success}1A`} stroke={theme.colors.success} strokeWidth="2" />
            <text x="80" y="42" textAnchor="middle" fill={theme.colors.text} fontFamily={theme.fonts.body} fontSize="16" fontWeight="600">Stories</text>
          </g>
        </svg>

        <div style={{
          marginTop: '60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: theme.colors.primary,
        }}>
          <p style={{
            fontSize: theme.fontSizes[4],
            fontFamily: theme.fonts.body,
            margin: 0,
            marginBottom: '8px',
          }}>
            Next
          </p>
          <div
            onClick={() => {
              const el = document.getElementById('backlog-section');
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

export default DemoExplanationSectionMobile;
