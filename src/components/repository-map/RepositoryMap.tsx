"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useTheme } from "@a24z/industry-theme";
import {
  ArchitectureMapHighlightLayers,
  HighlightLayer,
} from "@principal-ai/code-city-react";
import { FileTree } from "@principal-ai/repository-abstraction";
import { useGridCodeCityData } from "../../hooks/useGridCodeCityData";
import { GitHubService } from "../../services/githubService";
import {
  createFileColorHighlightLayers,
  DEFAULT_FILE_CONFIGS,
} from "../../utils/fileColorMapping";

interface NormalizedFile {
  originalPath: string;
  absolutePath: string;
  displayPath: string;
  repository?: {
    gitRoot: string;
    relativePath: string;
    remoteUrl?: string;
    owner?: string;
    repo?: string;
  };
}

interface CurrentEvent {
  normalized_files?: NormalizedFile[];
  operation?: string;
  tool_name?: string;
  [key: string]: unknown;
}

interface AccumulatedFiles {
  read: Set<string>;
  edited: Set<string>;
}

interface RepositoryMapProps {
  owner: string;
  repo: string;
  className?: string;
  currentEvent?: CurrentEvent | null;
  isPlaying?: boolean;
  accumulatedFiles?: AccumulatedFiles;
  onClearAccumulated?: () => void;
}

export const RepositoryMap: React.FC<RepositoryMapProps> = ({
  owner,
  repo,
  className = "w-full h-full",
  currentEvent,
  isPlaying = false,
  accumulatedFiles,
  onClearAccumulated,
}) => {
  const { theme } = useTheme();
  const [fileSystemTree, setFileSystemTree] = useState<FileTree | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get city data from file tree
  const { cityData } = useGridCodeCityData({
    fileSystemTree,
    gridConfig: null,
    rootPath: "",
  });

  // Create highlight layers based on file types
  const fileTypeHighlightLayers = useMemo((): HighlightLayer[] => {
    return createFileColorHighlightLayers(
      DEFAULT_FILE_CONFIGS,
      fileSystemTree,
    );
  }, [fileSystemTree]);

  // Create accumulated highlight layers for files read and edited
  const accumulatedHighlightLayers = useMemo((): HighlightLayer[] => {
    if (!accumulatedFiles || (!accumulatedFiles.read.size && !accumulatedFiles.edited.size)) {
      return [];
    }

    const layers: HighlightLayer[] = [];

    // Files read layer
    if (accumulatedFiles.read.size > 0) {
      layers.push({
        id: 'accumulated-read',
        name: `Files Read (${accumulatedFiles.read.size})`,
        color: theme.colors.accent, // Blue for reads
        enabled: true,
        opacity: 0.4, // Lower opacity for accumulated layers
        priority: 500, // Medium priority
        items: Array.from(accumulatedFiles.read).map(path => ({
          path,
          type: 'file' as const,
          renderStrategy: 'fill' as const,
        })),
      });
    }

    // Files edited layer
    if (accumulatedFiles.edited.size > 0) {
      layers.push({
        id: 'accumulated-edited',
        name: `Files Edited (${accumulatedFiles.edited.size})`,
        color: theme.colors.warning, // Orange for edits
        enabled: true,
        opacity: 0.4, // Lower opacity for accumulated layers
        priority: 510, // Slightly higher priority than read
        items: Array.from(accumulatedFiles.edited).map(path => ({
          path,
          type: 'file' as const,
          renderStrategy: 'fill' as const,
        })),
      });
    }

    return layers;
  }, [accumulatedFiles, theme.colors]);

  // Create current event highlight layer (the active event being played)
  const currentEventHighlightLayer = useMemo((): HighlightLayer[] => {
    if (!currentEvent?.normalized_files || currentEvent.normalized_files.length === 0) {
      return [];
    }

    // Determine color based on operation type
    const getOperationColor = (operation?: string): string => {
      switch (operation) {
        case 'read':
          return theme.colors.accent; // Blue for reads
        case 'write':
        case 'edit':
          return theme.colors.warning; // Orange for edits/writes
        default:
          return theme.colors.primary; // Default color
      }
    };

    const color = getOperationColor(currentEvent.operation);

    // Extract file paths from normalized_files
    const filePaths = currentEvent.normalized_files
      .map(file => file.repository?.relativePath || file.displayPath)
      .filter((path): path is string => !!path);

    if (filePaths.length === 0) {
      return [];
    }

    return [{
      id: `current-event-${Date.now()}`,
      name: `Current: ${currentEvent.tool_name || 'Unknown'} (${currentEvent.operation || 'N/A'})`,
      color,
      enabled: true,
      opacity: 0.9, // Higher opacity for current event
      priority: 1000, // Highest priority to show above accumulated layers
      items: filePaths.map(path => ({
        path,
        type: 'file' as const,
        renderStrategy: 'glow' as const, // Use glow effect for current event
      })),
    }];
  }, [currentEvent, theme.colors]);

  // Determine if we have any accumulated files
  const hasAccumulatedFiles = accumulatedFiles &&
    (accumulatedFiles.read.size > 0 || accumulatedFiles.edited.size > 0);

  // Combine file type layers with event layers (event layers on top)
  // Hide file type highlighting when playback is active OR when there are accumulated files
  const highlightLayers = useMemo((): HighlightLayer[] => {
    if (isPlaying || hasAccumulatedFiles) {
      // During playback or when showing accumulated results: only show accumulated layers + current event
      return [...accumulatedHighlightLayers, ...currentEventHighlightLayer];
    }
    // When not playing and no accumulated files: show file type layers + current event
    return [...fileTypeHighlightLayers, ...currentEventHighlightLayer];
  }, [fileTypeHighlightLayers, accumulatedHighlightLayers, currentEventHighlightLayer, isPlaying, hasAccumulatedFiles]);

  // Load repository data
  useEffect(() => {
    const loadRepository = async () => {
      if (!owner || !repo) return;

      setLoading(true);
      setError(null);

      try {
        const githubService = new GitHubService();

        // First fetch repository info to get the default branch
        const repoInfo = await githubService.fetchRepositoryInfo(owner, repo);

        // Load file tree
        const tree = await githubService.fetchFileSystemTree(
          owner,
          repo,
          repoInfo.defaultBranch,
          false, // Use cache to avoid rate limits
        );

        setFileSystemTree(tree);
      } catch (err) {
        console.error("Failed to load repository:", err);
        setError(
          `Failed to load repository ${owner}/${repo}. Please check that the repository exists and is public.`,
        );
      } finally {
        setLoading(false);
      }
    };

    loadRepository();
  }, [owner, repo]);

  if (loading) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.backgroundSecondary,
          borderRadius: theme.radii[2],
          border: `1px solid ${theme.colors.border}`,
        }}
        className={className}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: `3px solid ${theme.colors.border}`,
              borderTopColor: theme.colors.primary,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: theme.colors.textSecondary }}>
            Loading repository...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.backgroundSecondary,
          borderRadius: theme.radii[2],
          border: `1px solid ${theme.colors.error}`,
          padding: "2rem",
        }}
        className={className}
      >
        <div style={{ textAlign: "center", color: theme.colors.error }}>
          <h3 style={{ fontSize: theme.fontSizes[2], marginBottom: "0.5rem" }}>
            Failed to Load Repository
          </h3>
          <p style={{ fontSize: theme.fontSizes[1] }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: theme.colors.background,
        border: `2px solid ${theme.colors.border}`,
        borderRadius: theme.radii[2],
        overflow: "hidden",
        position: "relative",
        width: "500px",
        height: "500px",
        display: "flex",
        flexDirection: "column",
      }}
      className={className}
    >
      {/* Clear button - only show when there are accumulated files and not playing */}
      {hasAccumulatedFiles && !isPlaying && onClearAccumulated && (
        <div
          style={{
            position: "absolute",
            top: theme.space[2],
            right: theme.space[2],
            zIndex: 1000,
          }}
        >
          <button
            onClick={onClearAccumulated}
            style={{
              backgroundColor: theme.colors.backgroundSecondary,
              color: theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii[1],
              padding: `${theme.space[1]} ${theme.space[3]}`,
              fontSize: theme.fontSizes[0],
              fontWeight: theme.fontWeights.medium,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: theme.space[1],
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.background;
              e.currentTarget.style.borderColor = theme.colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
              e.currentTarget.style.borderColor = theme.colors.border;
            }}
          >
            Clear Highlights
          </button>
        </div>
      )}

      {cityData ? (
        <ArchitectureMapHighlightLayers
          cityData={cityData}
          highlightLayers={highlightLayers}
          canvasBackgroundColor={theme.colors.background}
          className="w-full h-full"
        />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: theme.colors.textSecondary,
            textAlign: "center",
            backgroundColor: theme.colors.background,
          }}
        >
          <div>
            <p style={{ fontSize: theme.fontSizes[1] }}>
              No repository data available
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
