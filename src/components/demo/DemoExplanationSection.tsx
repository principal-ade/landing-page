'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function DemoExplanationSection() {
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
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        scrollSnapAlign: 'start',
        background: '#0d1b2a',
      }}
    >
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '48px',
        paddingTop: '100px',
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
          How This Demo Works
        </p>

        <h1 style={{
          fontSize: '42px',
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          color: '#ffffff',
          margin: 0,
          marginBottom: '24px',
          textAlign: 'center',
          maxWidth: '800px',
          lineHeight: 1.2,
        }}>
          From Traces to Stories
        </h1>

        <p style={{
          fontSize: '18px',
          fontFamily: 'Inter, sans-serif',
          color: '#9ca3af',
          margin: 0,
          marginBottom: '48px',
          textAlign: 'center',
          maxWidth: '700px',
          lineHeight: 1.6,
        }}>
          This demo uses Backlog.md to demonstrate how story-based monitoring
          transforms raw telemetry into meaningful, contextual insights.
        </p>

        {/* Architecture Diagram */}
        <svg
          viewBox="0 0 800 390"
          style={{
            width: '100%',
            maxWidth: '900px',
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

          {/* Definitions for arrows and gradients */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#07c0ca" />
            </marker>
            <marker
              id="arrowhead-telemetry"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
            </marker>
            <marker
              id="arrowhead-green"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
            </marker>
          </defs>

          {/* Kanban UI Box */}
          <g className={isVisible ? "svg-animate" : ""} style={{ opacity: isVisible ? undefined : 0, animationDelay: '0s' }} transform="translate(110, 20)">
            <rect x="0" y="0" width="140" height="80" rx="8" fill="rgba(7, 192, 202, 0.1)" stroke="#07c0ca" strokeWidth="2" />
            <text x="70" y="35" textAnchor="middle" fill="#ffffff" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="600">Kanban UI</text>
            <text x="70" y="55" textAnchor="middle" fill="#9ca3af" fontFamily="Inter, sans-serif" fontSize="13">React Components</text>
          </g>

          {/* Arrow: Kanban UI -> Backlog Core */}
          <g className={isVisible ? "svg-animate" : ""} style={{ opacity: isVisible ? undefined : 0, animationDelay: '1s' }}>
            <line x1="250" y1="60" x2="320" y2="60" stroke="#07c0ca" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <text x="285" y="50" textAnchor="middle" fill="#ffffff" fontFamily="Inter, sans-serif" fontSize="12">calls</text>
          </g>

          {/* Backlog Core Box */}
          <g className={isVisible ? "svg-animate" : ""} style={{ opacity: isVisible ? undefined : 0, animationDelay: '2s' }} transform="translate(330, 20)">
            <rect x="0" y="0" width="140" height="80" rx="8" fill="rgba(7, 192, 202, 0.1)" stroke="#07c0ca" strokeWidth="2" />
            <text x="70" y="35" textAnchor="middle" fill="#ffffff" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="600">Backlog Core</text>
            <text x="70" y="55" textAnchor="middle" fill="#9ca3af" fontFamily="Inter, sans-serif" fontSize="13">Task Engine</text>
          </g>

          {/* Arrow: Backlog Core -> In-Memory FS */}
          <g className={isVisible ? "svg-animate" : ""} style={{ opacity: isVisible ? undefined : 0, animationDelay: '3s' }}>
            <line x1="470" y1="60" x2="540" y2="60" stroke="#07c0ca" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <text x="505" y="50" textAnchor="middle" fill="#ffffff" fontFamily="Inter, sans-serif" fontSize="12">uses</text>
          </g>

          {/* In-Memory FS Box */}
          <g className={isVisible ? "svg-animate" : ""} style={{ opacity: isVisible ? undefined : 0, animationDelay: '4s' }} transform="translate(550, 20)">
            <rect x="0" y="0" width="140" height="80" rx="8" fill="rgba(7, 192, 202, 0.1)" stroke="#07c0ca" strokeWidth="2" />
            <text x="70" y="35" textAnchor="middle" fill="#ffffff" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="600">In-Memory FS</text>
            <text x="70" y="55" textAnchor="middle" fill="#9ca3af" fontFamily="Inter, sans-serif" fontSize="13">Virtual Storage</text>
          </g>

          {/* Principal AI Box - centered below Backlog Core */}
          <g className={isVisible ? "svg-animate" : ""} style={{ opacity: isVisible ? undefined : 0, animationDelay: '5s' }} transform="translate(320, 170)">
            <rect x="0" y="0" width="160" height="80" rx="8" fill="rgba(7, 192, 202, 0.2)" stroke="#07c0ca" strokeWidth="3" />
            <text x="80" y="35" textAnchor="middle" fill="#07c0ca" fontFamily="Inter, sans-serif" fontSize="18" fontWeight="700">Principal AI</text>
            <text x="80" y="55" textAnchor="middle" fill="#9ca3af" fontFamily="Inter, sans-serif" fontSize="13">Trace Processor</text>
          </g>

          {/* Telemetry arrows from Kanban UI */}
          <g className={isVisible ? "svg-animate" : ""} style={{ opacity: isVisible ? undefined : 0, animationDelay: '6s' }}>
            <path className={isVisible ? "telemetry-flow" : ""} d="M180 100 L180 140 L350 160" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" fill="none" markerEnd="url(#arrowhead-telemetry)" />
            <text x="120" y="125" fill="#f59e0b" fontFamily="Inter, sans-serif" fontSize="12">telemetry</text>
          </g>

          {/* Telemetry arrows from Backlog Core */}
          <g className={isVisible ? "svg-animate" : ""} style={{ opacity: isVisible ? undefined : 0, animationDelay: '7s' }}>
            <path className={isVisible ? "telemetry-flow" : ""} d="M400 100 L400 160" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" fill="none" markerEnd="url(#arrowhead-telemetry)" />
          </g>

          {/* Telemetry arrows from In-Memory FS */}
          <g className={isVisible ? "svg-animate" : ""} style={{ opacity: isVisible ? undefined : 0, animationDelay: '8s' }}>
            <path className={isVisible ? "telemetry-flow" : ""} d="M620 100 L620 140 L450 160" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" fill="none" markerEnd="url(#arrowhead-telemetry)" />
          </g>

          {/* Arrow: Principal AI -> Stories */}
          <g className={isVisible ? "svg-animate" : ""} style={{ opacity: isVisible ? undefined : 0, animationDelay: '9s' }}>
            <line className={isVisible ? "output-flow" : ""} x1="400" y1="250" x2="400" y2="295" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#arrowhead-green)" />
            <text x="350" y="275" fill="#22c55e" fontFamily="Inter, sans-serif" fontSize="12">outputs</text>
          </g>

          {/* Stories Output Box - centered below Principal AI */}
          <g className={isVisible ? "svg-animate" : ""} style={{ opacity: isVisible ? undefined : 0, animationDelay: '10s' }} transform="translate(320, 300)">
            <rect x="0" y="0" width="160" height="80" rx="8" fill="rgba(34, 197, 94, 0.1)" stroke="#22c55e" strokeWidth="2" />
            <text x="80" y="35" textAnchor="middle" fill="#ffffff" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="600">Stories</text>
            <text x="80" y="55" textAnchor="middle" fill="#9ca3af" fontFamily="Inter, sans-serif" fontSize="13">Business Context</text>
          </g>
        </svg>

        <div style={{
          marginTop: '60px',
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

export default DemoExplanationSection;
