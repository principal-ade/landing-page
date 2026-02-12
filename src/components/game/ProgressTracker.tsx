"use client";

import React from "react";
import { useTheme } from "@principal-ade/industry-theme";
import { GameFlowState } from "@/app/game/types";

interface ProgressStep {
  id: GameFlowState;
  label: string;
  description: string;
}

interface ProgressTrackerProps {
  currentState: GameFlowState;
  onNavigate: (state: GameFlowState) => void;
  isMobile?: boolean;
}

// Define the main progress steps (simplified from all flow states)
const PROGRESS_STEPS: ProgressStep[] = [
  { id: "start", label: "Start", description: "Introduction" },
  { id: "agent-question", label: "Setup", description: "Agent usage" },
  { id: "testing-intro", label: "Testing", description: "Run tests" },
  { id: "deploy-question", label: "Deploy", description: "Go live" },
  { id: "deployed-running", label: "Production", description: "Running" },
  { id: "incident-active", label: "Incident", description: "Debug" },
  { id: "incident-resolved", label: "Resolved", description: "Complete" },
];

// Map all flow states to their corresponding progress step
const STATE_TO_STEP_MAP: Record<GameFlowState, number> = {
  start: 0,
  "agent-question": 1,
  "testing-intro": 2,
  "testing-running": 2,
  "test-complete": 2,
  "deploy-question": 3,
  "cost-info": 4,
  "deployed-running": 4,
  "incident-active": 5,
  "incident-resolved": 6,
  "principal-comparison": 6,
};

export function ProgressTracker({
  currentState,
  onNavigate,
  isMobile = false,
}: ProgressTrackerProps) {
  const { theme } = useTheme();
  const currentStepIndex = STATE_TO_STEP_MAP[currentState];

  const handleStepClick = (step: ProgressStep, index: number) => {
    // Allow navigation to any step
    onNavigate(step.id);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.background,
        borderTop: `1px solid ${theme.colors.primary}30`,
        padding: isMobile ? "12px 8px" : "16px 24px",
        zIndex: 1000,
        boxShadow: `0 -4px 12px ${theme.colors.primary}10`,
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: isMobile ? "8px" : "12px",
        }}
      >
        {PROGRESS_STEPS.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isFuture = index > currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <button
                onClick={() => handleStepClick(step, index)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: isMobile ? "4px" : "8px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: isMobile ? "4px" : "8px",
                  flex: "1",
                  minWidth: 0,
                  transition: "all 0.2s ease",
                  opacity: isFuture ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Circle */}
                <div
                  style={{
                    width: isMobile ? "24px" : "32px",
                    height: isMobile ? "24px" : "32px",
                    borderRadius: "50%",
                    backgroundColor: isActive
                      ? theme.colors.primary
                      : isCompleted
                      ? theme.colors.success
                      : isFuture
                      ? theme.colors.primary + "20"
                      : theme.colors.primary + "30",
                    border: `2px solid ${
                      isActive
                        ? theme.colors.primary
                        : isCompleted
                        ? theme.colors.success
                        : theme.colors.primary + "40"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: theme.fonts.body,
                    fontSize: isMobile ? theme.fontSizes[0] : theme.fontSizes[1],
                    fontWeight: theme.fontWeights.bold,
                    color: theme.colors.text,
                    transition: "all 0.2s ease",
                  }}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>

                {/* Label - hide on mobile */}
                {!isMobile && (
                  <div
                    style={{
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        fontSize: theme.fontSizes[0],
                        fontWeight: isActive
                          ? theme.fontWeights.bold
                          : theme.fontWeights.body,
                        color: theme.colors.text,
                        fontFamily: theme.fonts.body,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {step.label}
                    </div>
                    <div
                      style={{
                        fontSize: theme.fontSizes[0],
                        color: theme.colors.text,
                        fontFamily: theme.fonts.body,
                        opacity: 0.6,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {step.description}
                    </div>
                  </div>
                )}
              </button>

              {/* Connector Line */}
              {index < PROGRESS_STEPS.length - 1 && (
                <div
                  style={{
                    flex: isMobile ? "0 0 8px" : "0 0 24px",
                    height: "2px",
                    backgroundColor:
                      index < currentStepIndex
                        ? theme.colors.success
                        : theme.colors.primary + "30",
                    transition: "background-color 0.3s ease",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
