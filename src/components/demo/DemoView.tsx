'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { RegisteredTrace, VersionSnapshot } from '@principal-ai/principal-view-core';
import type { PanelEventEmitter } from '@principal-ade/panel-framework-core';
import { Logo } from '@principal-ai/logo-component';
import {
  TourProvider,
  TourOverlay,
  TourSpotlight,
  useTour,
  observabilityTourSteps,
} from './tour';

// Dynamic imports for panel components
const KanbanPanelWrapper = dynamic(
  () => import('./KanbanPanelWrapper'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#666',
        fontFamily: 'Inter, sans-serif',
      }}>
        Loading Kanban Panel...
      </div>
    ),
  }
);

const TraceListPanelWrapper = dynamic(
  () => import('./TraceListPanelWrapper'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#00C2FF',
        fontFamily: 'Inter, sans-serif',
      }}>
        Loading Trace Panel...
      </div>
    ),
  }
);

const StoryboardListPanelWrapper = dynamic(
  () => import('./StoryboardListPanelWrapper'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#00C2FF',
        fontFamily: 'Inter, sans-serif',
      }}>
        Loading Storyboards...
      </div>
    ),
  }
);

const WaterfallTraceView = dynamic(
  () => import('./WaterfallTraceView'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#666',
        fontFamily: 'Inter, sans-serif',
      }}>
        Loading Trace View...
      </div>
    ),
  }
);

type DemoTab = 'storyboards' | 'kanban' | 'story-monitoring' | 'traditional-monitoring';

interface DemoViewProps {
  isOpen: boolean;
  onClose: () => void;
  schematics: VersionSnapshot[];
  providerReady: boolean;
  registeredTraces: RegisteredTrace[];
  onClearTraces: () => void;
}

export function DemoView({
  isOpen,
  onClose,
  schematics,
  providerReady,
  registeredTraces,
  onClearTraces,
}: DemoViewProps) {
  const [activeTab, setActiveTab] = useState<DemoTab>('storyboards');
  const storyboardEventsRef = useRef<PanelEventEmitter | null>(null);
  const kanbanEventsRef = useRef<PanelEventEmitter | null>(null);

  const handleStoryboardEventsReady = useCallback((events: PanelEventEmitter) => {
    storyboardEventsRef.current = events;
  }, []);

  const handleKanbanEventsReady = useCallback((events: PanelEventEmitter) => {
    kanbanEventsRef.current = events;
  }, []);

  const handleTourComplete = useCallback(() => {
    console.log('[Tour] Completed');
  }, []);

  // Reset to first tab when opening
  useEffect(() => {
    if (isOpen) {
      setActiveTab('storyboards');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const tabs: { id: DemoTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'storyboards',
      label: 'Storyboards',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: 'kanban',
      label: 'Backlog.md',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="5" height="18" rx="1" />
          <rect x="10" y="3" width="5" height="12" rx="1" />
          <rect x="17" y="3" width="5" height="8" rx="1" />
        </svg>
      ),
    },
    {
      id: 'traditional-monitoring',
      label: 'Traditional Otel',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      id: 'story-monitoring',
      label: 'Story-Based Otel',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
    },
  ];

  return (
    <TourProvider
      steps={observabilityTourSteps}
      autoStart={true}
      onComplete={handleTourComplete}
    >
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9000,
          background: '#0a0e17',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header with Tabs */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 24px',
            height: '70px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '1400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Logo - left side */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '18px',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <Logo width={40} height={40} color="#00C2FF" />
              <span style={{ color: '#ffffff' }}>Principal</span>
              <span
                style={{
                  fontWeight: 300,
                  background: 'linear-gradient(135deg, #00C2FF, #0098CC)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                AI
              </span>
            </div>

            {/* Tabs - centered */}
            <DemoTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tour navigation - right side */}
            <TourHeaderNav />
          </div>
        </header>

        {/* Tab Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* Intro Screen - shown during welcome and tab intro steps */}
          <IntroScreen />

          {/* Content wrapper with max-width */}
          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              maxWidth: '1400px',
              margin: '0 auto',
            }}
          >
            {/* Storyboards Tab */}
            {activeTab === 'storyboards' && (
              <div
                id="storyboard-section"
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  background: 'rgb(10, 10, 10)',
                }}
              >
                <StoryboardListPanelWrapper
                  schematics={schematics}
                  onEventsReady={handleStoryboardEventsReady}
                />
              </div>
            )}

            {/* Kanban Tab */}
            {activeTab === 'kanban' && (
              <div
                id="kanban-section"
                style={{
                  flex: 1,
                  overflow: 'hidden',
                }}
              >
                {providerReady && <KanbanPanelWrapper onEventsReady={handleKanbanEventsReady} />}
              </div>
            )}

            {/* Story-Based Monitoring Tab */}
            {activeTab === 'story-monitoring' && (
              <div
                data-tour-id="story-monitoring"
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  background: 'rgb(10, 10, 10)',
                }}
              >
                <TraceListPanelWrapper
                  traces={registeredTraces}
                  schematics={schematics}
                  onClear={onClearTraces}
                />
              </div>
            )}

            {/* Traditional Monitoring Tab */}
            {activeTab === 'traditional-monitoring' && (
              <div
                data-tour-id="traditional-monitoring"
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <WaterfallTraceView
                  traces={registeredTraces}
                  onClear={onClearTraces}
                />
              </div>
            )}
          </div>
        </div>

        {/* Tour UI */}
        <TourOverlay />
        <TourSpotlight />

        {/* Tour panel events integration */}
        <TourPanelEventsConnector
          storyboardEventsRef={storyboardEventsRef}
          kanbanEventsRef={kanbanEventsRef}
          onTabChange={(tab) => setActiveTab(tab as DemoTab)}
        />
      </div>
    </TourProvider>
  );
}

// Map intro step IDs to tab IDs
const introStepToTab: Record<string, DemoTab> = {
  'tab-storyboards': 'storyboards',
  'tab-backlog': 'kanban',
  'tab-story-monitoring': 'story-monitoring',
  'tab-traditional-monitoring': 'traditional-monitoring',
};

// Tabs component that highlights the corresponding tab during intro screens
function DemoTabs({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: { id: DemoTab; label: string; icon: React.ReactNode }[];
  activeTab: DemoTab;
  onTabChange: (tab: DemoTab) => void;
}) {
  const { currentStep, isActive: isTourActive } = useTour();
  const isIntroScreen = isTourActive && isIntroStep(currentStep?.id);

  // Get the tab that should be highlighted based on current intro step
  const highlightedTab = currentStep?.id ? introStepToTab[currentStep.id] : undefined;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {tabs.map((tab) => {
        // During intro screens, highlight the tab being explained
        const isHighlighted = isIntroScreen && highlightedTab === tab.id;
        // Normal active state when not on intro screen
        const isActive = !isIntroScreen && activeTab === tab.id;
        // Dim tabs during intro screens unless they're the highlighted one
        const isDimmed = isIntroScreen && !isHighlighted;

        return (
          <button
            key={tab.id}
            data-tour-tab={tab.id}
            onClick={() => onTabChange(tab.id)}
            disabled={isIntroScreen}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 0',
              width: '180px',
              background: isActive || isHighlighted ? 'rgba(0, 194, 255, 0.15)' : 'transparent',
              border: 'none',
              borderBottom: isActive || isHighlighted ? '2px solid #00C2FF' : '2px solid transparent',
              color: isActive || isHighlighted ? '#00C2FF' : 'rgba(255, 255, 255, 0.6)',
              cursor: isIntroScreen ? 'default' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
              fontWeight: isActive || isHighlighted ? 600 : 400,
              transition: 'all 0.2s ease',
              marginBottom: '-1px',
              opacity: isDimmed ? 0.4 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isActive && !isIntroScreen) {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive && !isIntroScreen) {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// Intro screen content for each step
const introStepContent: Record<string, { title: string; description: string; icon?: React.ReactNode }> = {
  welcome: {
    title: 'Welcome to Principal AI',
    description: 'Principal AI enhances traditional monitoring signals into stories to improve system design clarity during operation.',
  },
  'tab-storyboards': {
    title: 'Storyboards',
    description: 'Browse architecture files that define how the Backlog.md Kanban Board is structured.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  'tab-backlog': {
    title: 'Backlog.md',
    description: 'An interactive Kanban board powered by Backlog.md. Every interaction is instrumented with OpenTelemetry, generating real traces you can explore.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="1.5">
        <rect x="3" y="3" width="5" height="18" rx="1" />
        <rect x="10" y="3" width="5" height="12" rx="1" />
        <rect x="17" y="3" width="5" height="8" rx="1" />
      </svg>
    ),
  },
  'tab-traditional-monitoring': {
    title: 'Traditional Monitoring',
    description: 'Standard trace views showing Otel data. Aims to provide the monitoring experience provided by systems today.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="1.5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  'tab-story-monitoring': {
    title: 'Story-Based Monitoring',
    description: 'See traces matched against business scenarios from your storyboards. Converting terse Otel data into actionable insights.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00C2FF" strokeWidth="1.5">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
};

// Check if a step is an intro step (should show full-screen view)
function isIntroStep(stepId: string | undefined): boolean {
  return stepId !== undefined && stepId in introStepContent;
}

// Intro screen shown during welcome and tab introduction steps
function IntroScreen() {
  const { currentStep, isActive, next, prev, currentStepIndex, steps } = useTour();

  // Only show on intro steps
  if (!isActive || !currentStep || !isIntroStep(currentStep.id)) {
    return null;
  }

  const content = introStepContent[currentStep.id];
  const isWelcome = currentStep.id === 'welcome';
  const isLastIntro = !isIntroStep(steps[currentStepIndex + 1]?.id);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0a0e17 0%, #0d1520 100%)',
        zIndex: 100,
        padding: '40px',
      }}
    >
      {isWelcome ? (
        <Logo width={80} height={80} color="#00C2FF" />
      ) : (
        content.icon
      )}

      <h1
        style={{
          fontSize: isWelcome ? '36px' : '32px',
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          color: '#ffffff',
          margin: '32px 0 16px 0',
          textAlign: 'center',
        }}
      >
        {isWelcome ? (
          <>
            Welcome to Principal{' '}
            <span
              style={{
                fontWeight: 300,
                background: 'linear-gradient(135deg, #00C2FF, #0098CC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AI
            </span>
          </>
        ) : (
          <span style={{ color: '#00C2FF' }}>{content.title}</span>
        )}
      </h1>

      <p
        style={{
          fontSize: '18px',
          fontFamily: 'Inter, sans-serif',
          color: 'rgba(255, 255, 255, 0.7)',
          margin: 0,
          maxWidth: '600px',
          textAlign: 'center',
          lineHeight: 1.6,
        }}
      >
        {content.description}
      </p>

      <div
        style={{
          marginTop: '48px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {/* Back button - show on all steps except welcome */}
        {!isWelcome && (
          <button
            onClick={prev}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 28px',
              minWidth: '120px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '16px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
        )}

        {/* Next button */}
        <button
          onClick={next}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px 28px',
            minWidth: '120px',
            background: 'linear-gradient(135deg, #00C2FF 0%, #0088CC 100%)',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0, 194, 255, 0.4)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 194, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 194, 255, 0.4)';
          }}
        >
          {isWelcome ? 'Start Tour' : isLastIntro ? 'Start Exploring' : 'Next'}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Progress dots for intro steps */}
      {!isWelcome && (
        <div
          style={{
            marginTop: '24px',
            display: 'flex',
            gap: '8px',
          }}
        >
          {Object.keys(introStepContent).filter(id => id !== 'welcome').map((id, index) => (
            <div
              key={id}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: currentStep.id === id ? '#00C2FF' : 'rgba(255, 255, 255, 0.3)',
                transition: 'background 0.2s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Tour navigation for header
function TourHeaderNav() {
  const { isActive, currentStep, prev, next, currentStepIndex, steps } = useTour();

  // Don't show during intro steps
  const introStepIds = ['welcome', 'tab-storyboards', 'tab-backlog', 'tab-story-monitoring', 'tab-traditional-monitoring'];
  if (!isActive || !currentStep || introStepIds.includes(currentStep.id)) {
    return null;
  }

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <button
        onClick={prev}
        disabled={isFirstStep}
        style={{
          background: 'transparent',
          border: 'none',
          color: isFirstStep ? 'rgba(255, 255, 255, 0.3)' : '#00C2FF',
          cursor: isFirstStep ? 'not-allowed' : 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Previous step"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <span
        style={{
          color: '#00C2FF',
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        Tour
      </span>

      <button
        onClick={next}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#00C2FF',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label={isLastStep ? 'Finish tour' : 'Next step'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

// Component to connect panel events to tour context
function TourPanelEventsConnector({
  storyboardEventsRef,
  kanbanEventsRef,
  onTabChange,
}: {
  storyboardEventsRef: React.RefObject<PanelEventEmitter | null>;
  kanbanEventsRef: React.RefObject<PanelEventEmitter | null>;
  onTabChange: (tab: string) => void;
}) {
  const { setPanelEvents, setKanbanEvents, setTabHandler } = useTour();

  useEffect(() => {
    setTabHandler(onTabChange);
    return () => setTabHandler(null);
  }, [onTabChange, setTabHandler]);

  useEffect(() => {
    const checkEvents = () => {
      if (storyboardEventsRef.current) {
        setPanelEvents(storyboardEventsRef.current);
      }
      if (kanbanEventsRef.current) {
        setKanbanEvents(kanbanEventsRef.current);
      }
    };

    checkEvents();
    const interval = setInterval(checkEvents, 500);
    return () => clearInterval(interval);
  }, [storyboardEventsRef, kanbanEventsRef, setPanelEvents, setKanbanEvents]);

  return null;
}

export default DemoView;
