"use client";

import React from "react";
import { useTheme } from "@principal-ade/industry-theme";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { PlaybackSpeed, PlaybackState } from "../services/EventPlaybackService";
import { MAX_PLAYBACK_SPEED, MIN_PLAYBACK_SPEED } from "../services/EventPlaybackService";

export interface EventPlaybackControlsProps {
  playbackState: PlaybackState;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onGoToStart: () => void;
  onGoToEnd: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
}

export const EventPlaybackControls: React.FC<EventPlaybackControlsProps> = ({
  playbackState,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onGoToStart,
  onGoToEnd,
  onSpeedChange,
}) => {
  const { theme } = useTheme();

  const { isPlaying, currentIndex, totalEvents, speed } = playbackState;

  if (totalEvents === 0) {
    return null;
  }

  // Calculate display position (1-indexed for user display)
  const displayPosition = currentIndex >= 0 ? currentIndex + 1 : 0;

  const handleSpeedSliderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    if (!Number.isFinite(value)) {
      return;
    }
    onSpeedChange(Math.round(value));
  };

  const handleSpeedInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(event.target.value);
    if (!Number.isFinite(value)) {
      onSpeedChange(MIN_PLAYBACK_SPEED);
      return;
    }

    const roundedValue = Math.round(value);
    const clampedValue = Math.min(
      Math.max(roundedValue, MIN_PLAYBACK_SPEED),
      MAX_PLAYBACK_SPEED
    );

    onSpeedChange(clampedValue);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.space[2],
        padding: theme.space[3],
        backgroundColor: theme.colors.background,
        borderRadius: theme.radii[1],
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {/* Position and Status */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.space[2],
          }}
        >
          <span
            style={{
              fontSize: theme.fontSizes[1],
              fontWeight: theme.fontWeights.medium,
              color: theme.colors.text,
            }}
          >
            {displayPosition} / {totalEvents}
          </span>
          {isPlaying && (
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: theme.colors.success,
                animation: "pulse 2s infinite",
              }}
            />
          )}
        </div>

        {/* Speed Control */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.space[3],
            minWidth: 220,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.space[1],
              flex: 1,
            }}
          >
            <label
              htmlFor="playback-speed"
              style={{
                fontSize: theme.fontSizes[0],
                color: theme.colors.textSecondary,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: theme.space[2],
              }}
            >
              <span>Speed</span>
              <span
                style={{
                  fontWeight: theme.fontWeights.semibold,
                  color: theme.colors.text,
                }}
              >
                {Math.round(speed)}x
              </span>
            </label>
            <input
              id="playback-speed"
              type="range"
              min={MIN_PLAYBACK_SPEED}
              max={MAX_PLAYBACK_SPEED}
              step={1}
              value={Math.min(
                Math.max(Math.round(speed), MIN_PLAYBACK_SPEED),
                MAX_PLAYBACK_SPEED
              )}
              onChange={handleSpeedSliderChange}
              style={{
                width: "100%",
                accentColor: theme.colors.primary,
                cursor: "pointer",
              }}
            />
          </div>
          <input
            type="number"
            min={MIN_PLAYBACK_SPEED}
            max={MAX_PLAYBACK_SPEED}
            step={1}
            value={Number.isFinite(speed)
              ? Math.min(
                  Math.max(Math.round(speed), MIN_PLAYBACK_SPEED),
                  MAX_PLAYBACK_SPEED
                )
              : MIN_PLAYBACK_SPEED}
            onChange={handleSpeedInputChange}
            style={{
              width: "60px",
              padding: `${theme.space[1]} ${theme.space[2]}`,
              borderRadius: theme.radii[1],
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              fontSize: theme.fontSizes[1],
              textAlign: "center",
            }}
            aria-label="Playback speed multiplier"
          />
        </div>
      </div>

      {/* Playback Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: theme.space[2],
        }}
      >
        {/* Go to Start */}
        <button
          onClick={onGoToStart}
          disabled={currentIndex <= 0}
          style={{
            padding: theme.space[2],
            backgroundColor: "transparent",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii[1],
            cursor: currentIndex <= 0 ? "not-allowed" : "pointer",
            color:
              currentIndex <= 0 ? theme.colors.textSecondary : theme.colors.text,
            display: "flex",
            alignItems: "center",
            opacity: currentIndex <= 0 ? 0.5 : 1,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (currentIndex > 0) {
              e.currentTarget.style.backgroundColor =
                theme.colors.backgroundSecondary;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Go to start"
        >
          <ChevronsLeft size={18} />
        </button>

        {/* Previous */}
        <button
          onClick={onPrevious}
          disabled={currentIndex <= 0}
          style={{
            padding: theme.space[2],
            backgroundColor: "transparent",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii[1],
            cursor: currentIndex <= 0 ? "not-allowed" : "pointer",
            color:
              currentIndex <= 0 ? theme.colors.textSecondary : theme.colors.text,
            display: "flex",
            alignItems: "center",
            opacity: currentIndex <= 0 ? 0.5 : 1,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (currentIndex > 0) {
              e.currentTarget.style.backgroundColor =
                theme.colors.backgroundSecondary;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Previous event"
        >
          <SkipBack size={18} />
        </button>

        {/* Play/Pause */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={totalEvents === 0}
          style={{
            padding: `${theme.space[2]} ${theme.space[3]}`,
            backgroundColor: isPlaying
              ? theme.colors.warning
              : theme.colors.primary,
            border: "none",
            borderRadius: theme.radii[1],
            cursor: totalEvents === 0 ? "not-allowed" : "pointer",
            color: theme.colors.background,
            display: "flex",
            alignItems: "center",
            gap: theme.space[1],
            fontWeight: theme.fontWeights.medium,
            fontSize: theme.fontSizes[1],
            opacity: totalEvents === 0 ? 0.5 : 1,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (totalEvents > 0) {
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <>
              <Pause size={18} />
              Pause
            </>
          ) : (
            <>
              <Play size={18} />
              Play
            </>
          )}
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          disabled={currentIndex >= totalEvents - 1}
          style={{
            padding: theme.space[2],
            backgroundColor: "transparent",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii[1],
            cursor:
              currentIndex >= totalEvents - 1 ? "not-allowed" : "pointer",
            color:
              currentIndex >= totalEvents - 1
                ? theme.colors.textSecondary
                : theme.colors.text,
            display: "flex",
            alignItems: "center",
            opacity: currentIndex >= totalEvents - 1 ? 0.5 : 1,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (currentIndex < totalEvents - 1) {
              e.currentTarget.style.backgroundColor =
                theme.colors.backgroundSecondary;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Next event"
        >
          <SkipForward size={18} />
        </button>

        {/* Go to End */}
        <button
          onClick={onGoToEnd}
          disabled={currentIndex >= totalEvents - 1}
          style={{
            padding: theme.space[2],
            backgroundColor: "transparent",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii[1],
            cursor:
              currentIndex >= totalEvents - 1 ? "not-allowed" : "pointer",
            color:
              currentIndex >= totalEvents - 1
                ? theme.colors.textSecondary
                : theme.colors.text,
            display: "flex",
            alignItems: "center",
            opacity: currentIndex >= totalEvents - 1 ? 0.5 : 1,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (currentIndex < totalEvents - 1) {
              e.currentTarget.style.backgroundColor =
                theme.colors.backgroundSecondary;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Go to end"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
};
