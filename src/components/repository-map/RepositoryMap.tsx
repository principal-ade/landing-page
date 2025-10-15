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

interface RepositoryMapProps {
  owner: string;
  repo: string;
  className?: string;
}

export const RepositoryMap: React.FC<RepositoryMapProps> = ({
  owner,
  repo,
  className = "w-full h-full",
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
  const highlightLayers = useMemo((): HighlightLayer[] => {
    return createFileColorHighlightLayers(
      DEFAULT_FILE_CONFIGS,
      fileSystemTree,
    );
  }, [fileSystemTree]);

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
          true, // noCache: true - always fetch fresh
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
      }}
      className={className}
    >
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
