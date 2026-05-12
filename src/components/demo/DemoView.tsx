'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { RegisteredTrace, VersionSnapshot } from '@principal-ai/principal-view-core';
import type { PanelEventEmitter } from '@principal-ade/panel-framework-core';
import { Logo } from '@principal-ai/logo-component';
import { useTheme } from '@principal-ade/industry-theme';
import {
  TourProvider,
  TourOverlay,
  TourSpotlight,
  TourDebugPanel,
  TourLightbox,
  useTour,
  observabilityTourSteps,
} from './tour';

// Color palette matching "For the Love of Building" animated page
const NAVY = '#1a2842';
const BLUE_DARK = '#2d4563';
const BLUE_MID = '#4a6fa5';
const BLUE_LIGHT = '#6b9bd1';
const ORANGE = '#ff6b35';

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
        color: BLUE_LIGHT,
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
        color: BLUE_LIGHT,
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
        color: BLUE_LIGHT,
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
        color: BLUE_LIGHT,
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

// Inner component to access tour context
function DemoViewInner({
  isOpen,
  onClose: _onClose,
  schematics,
  providerReady,
  registeredTraces,
  onClearTraces,
}: DemoViewProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<DemoTab>('storyboards');
  const storyboardEventsRef = useRef<PanelEventEmitter | null>(null);
  const kanbanEventsRef = useRef<PanelEventEmitter | null>(null);
  const traceListEventsRef = useRef<PanelEventEmitter | null>(null);
  const { currentStep, isActive: isTourActive, start: startTour } = useTour();

  const handleStoryboardEventsReady = useCallback((events: PanelEventEmitter) => {
    storyboardEventsRef.current = events;
  }, []);

  const handleKanbanEventsReady = useCallback((events: PanelEventEmitter) => {
    kanbanEventsRef.current = events;
  }, []);

  const handleTraceListEventsReady = useCallback((events: PanelEventEmitter) => {
    traceListEventsRef.current = events;
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

  // Check if we're on an intro step (don't show context bar during intro)
  const isOnIntroStep = isTourActive && currentStep && isIntroStep(currentStep.id);

  // Get context header based on active tab
  const getContextHeader = () => {
    switch (activeTab) {
      case 'storyboards':
        return {
          label: 'Principal AI',
          sublabel: 'Story-Based Monitoring',
          color: ORANGE,
          bgColor: NAVY,
        };
      case 'kanban':
        return {
          label: 'Live App',
          sublabel: 'Backlog.md',
          color: ORANGE,
          bgColor: NAVY,
        };
      case 'traditional-monitoring':
        return {
          label: 'Traditional Monitoring',
          sublabel: 'Traces',
          color: ORANGE,
          bgColor: NAVY,
        };
      case 'story-monitoring':
        return {
          label: 'Principal AI',
          sublabel: 'Story-Based Monitoring',
          color: ORANGE,
          bgColor: NAVY,
        };
      default:
        return null;
    }
  };

  const contextHeader = getContextHeader();

  // Check if we should show exploration controls (on try-it step)
  const showExplorationControls = isTourActive && currentStep?.id === 'try-it';

  return (
    <div
      style={{
        position: 'fixed',
        top: '70px', // Position below main site header
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        background: theme.colors.background,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Context Header Bar - hide during intro screens */}
      {contextHeader && !isOnIntroStep && (
        <div
          style={{
            height: '50px',
            background: contextHeader.bgColor,
            borderBottom: `1px solid ${contextHeader.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: showExplorationControls ? 'space-between' : 'center',
            padding: '0 24px',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            <span style={{ color: contextHeader.color }}>{contextHeader.label}</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>•</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{contextHeader.sublabel}</span>
          </div>

          {/* Segmented Controls - shown only on try-it step */}
          {showExplorationControls && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              {/* Segmented Control */}
              <div
                style={{
                  display: 'inline-flex',
                  padding: '4px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  gap: '2px',
                }}
              >
                {[
                  { id: 'storyboards' as DemoTab, label: 'Architecture' },
                  { id: 'kanban' as DemoTab, label: 'Kanban' },
                  { id: 'traditional-monitoring' as DemoTab, label: 'Traditional' },
                  { id: 'story-monitoring' as DemoTab, label: 'Story-Based' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '6px 16px',
                      background: activeTab === tab.id ? `${ORANGE}33` : 'transparent',
                      color: activeTab === tab.id ? ORANGE : BLUE_LIGHT,
                      border: 'none',
                      borderRadius: '6px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.background = `${ORANGE}1A`;
                        e.currentTarget.style.color = '#ffffff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== tab.id) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = BLUE_LIGHT;
                      }
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Restart Tour Button */}
              <button
                onClick={() => {
                  if (startTour) {
                    startTour();
                  }
                }}
                style={{
                  padding: '6px 12px',
                  background: 'transparent',
                  color: BLUE_LIGHT,
                  border: `1px solid ${BLUE_DARK}`,
                  borderRadius: '6px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = ORANGE;
                  e.currentTarget.style.color = ORANGE;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = BLUE_DARK;
                  e.currentTarget.style.color = BLUE_LIGHT;
                }}
              >
                Restart Tour
              </button>
            </div>
          )}
        </div>
      )}

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
                  background: theme.colors.background,
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
                  background: theme.colors.background,
                }}
              >
                <TraceListPanelWrapper
                  traces={registeredTraces}
                  schematics={schematics}
                  onClear={onClearTraces}
                  onEventsReady={handleTraceListEventsReady}
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
        <TourSpotlight borderRadius={10} />
        <TourLightbox />
        <TourDebugPanel />

        {/* Tour panel events integration */}
        <TourPanelEventsConnector
          storyboardEventsRef={storyboardEventsRef}
          kanbanEventsRef={kanbanEventsRef}
          traceListEventsRef={traceListEventsRef}
          onTabChange={(tab) => setActiveTab(tab as DemoTab)}
        />
    </div>
  );
}

// Outer component to provide tour context
export function DemoView(props: DemoViewProps) {
  const handleTourComplete = useCallback(() => {
    console.log('[Tour] Completed');
  }, []);

  return (
    <TourProvider
      steps={observabilityTourSteps}
      autoStart={true}
      onComplete={handleTourComplete}
    >
      <DemoViewInner {...props} />
    </TourProvider>
  );
}

// Intro screen content for each step
const introStepContent: Record<string, { title: string; description: string; icon?: React.ReactNode }> = {
  welcome: {
    title: '',
    description: "Using Principal's skill, the agent reads the codebase,\nmaps the workflows, and sets up story-based monitoring.\n\nThe live app you'll interact with is Backlog.md,\nan open source task manager.",
  },
};

// Check if a step is an intro step (should show full-screen view)
function isIntroStep(stepId: string | undefined): boolean {
  return stepId !== undefined && stepId in introStepContent;
}

// Intro screen shown during welcome and tab introduction steps
function IntroScreen() {
  const { theme } = useTheme();
  const { currentStep, isActive, next, prev, currentStepIndex: _currentStepIndex, steps: _steps } = useTour();

  // Only show on intro steps
  if (!isActive || !currentStep || !isIntroStep(currentStep.id)) {
    return null;
  }

  const content = introStepContent[currentStep.id];
  const isWelcome = currentStep.id === 'welcome';

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
        background: `linear-gradient(180deg, ${theme.colors.background} 0%, ${theme.colors.backgroundSecondary} 100%)`,
        zIndex: 100,
        padding: '40px',
      }}
    >
      {isWelcome ? (
        <div style={{ marginBottom: '32px' }}>
          <Logo
            width={100}
            height={100}
            color={ORANGE}
            particleColor={ORANGE}
            letterColor={BLUE_LIGHT}
            opacity={0.9}
          />
        </div>
      ) : (
        content.icon
      )}

      {content.title && (
        <h1
          style={{
            fontSize: isWelcome ? '36px' : '32px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            color: theme.colors.text,
            margin: '32px 0 16px 0',
            textAlign: 'center',
          }}
        >
          <span style={{ color: theme.colors.primary }}>{content.title}</span>
        </h1>
      )}

      <div
        style={{
          fontSize: '24px',
          fontFamily: 'Inter, sans-serif',
          color: theme.colors.textTertiary,
          margin: content.title ? 0 : '32px 0 0 0',
          maxWidth: '800px',
          minHeight: '87px', // Fixed height for 3 lines to prevent icon/title shifting
          textAlign: 'center',
          lineHeight: 1.6,
          whiteSpace: 'pre-line',
        }}
      >
        {content.description.split('\n\n').map((paragraph, index) => (
          <p key={index} style={{ margin: index === 0 ? 0 : '16px 0 0 0' }}>
            {paragraph}
          </p>
        ))}
      </div>

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
              border: `1px solid ${BLUE_DARK}`,
              borderRadius: '10px',
              color: BLUE_LIGHT,
              fontSize: '16px',
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = NAVY;
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = BLUE_DARK;
              e.currentTarget.style.color = BLUE_LIGHT;
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
          data-tour-target="next-button"
          onClick={next}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px 28px',
            minWidth: '120px',
            background: ORANGE,
            border: 'none',
            borderRadius: '10px',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            boxShadow: `0 4px 20px ${ORANGE}66`,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = `0 6px 24px ${ORANGE}80`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = `0 4px 20px ${ORANGE}66`;
          }}
        >
          Start
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Component to connect panel events to tour context
function TourPanelEventsConnector({
  storyboardEventsRef,
  kanbanEventsRef,
  traceListEventsRef,
  onTabChange,
}: {
  storyboardEventsRef: React.RefObject<PanelEventEmitter | null>;
  kanbanEventsRef: React.RefObject<PanelEventEmitter | null>;
  traceListEventsRef: React.RefObject<PanelEventEmitter | null>;
  onTabChange: (tab: string) => void;
}) {
  const { setPanelEvents, setKanbanEvents, setTraceListEvents, setTabHandler } = useTour();

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
      if (traceListEventsRef.current) {
        setTraceListEvents(traceListEventsRef.current);
      }
    };

    checkEvents();
    const interval = setInterval(checkEvents, 500);
    return () => clearInterval(interval);
  }, [storyboardEventsRef, kanbanEventsRef, traceListEventsRef, setPanelEvents, setKanbanEvents, setTraceListEvents]);

  return null;
}

export default DemoView;
