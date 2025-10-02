"use client";

import React, { useState, useMemo } from "react";
import { Theme } from "@a24z/industry-theme";
import { DynamicFileTree, DirectoryFilterInput, DirectoryFilter } from "@a24z/dynamic-file-tree";
import { FileTree, DirectoryInfo, FileInfo } from "@principal-ai/repository-abstraction";

interface Repository {
  id: string;
  name: string;
  tree: FileTree;
}

interface MultiFileTreeSectionProps {
  repositories: Repository[];
  theme: Theme;
  isMobile?: boolean;
  onFileSelect?: (repoId: string, filePath: string) => void;
}

// Helper function to combine multiple repository trees into a single unified tree
const combineRepositoryTrees = (repositories: Repository[]): FileTree => {
  // Return an empty tree if no repositories
  if (repositories.length === 0) {
    return {
      sha: "empty",
      root: {
        path: "",
        name: "Repositories",
        children: [],
        fileCount: 0,
        totalSize: 0,
        depth: 0,
        relativePath: "",
      },
      allFiles: [],
      allDirectories: [],
      stats: {
        totalFiles: 0,
        totalDirectories: 0,
        totalSize: 0,
        maxDepth: 0,
      },
      metadata: {
        id: "combined-tree",
        timestamp: new Date(),
        sourceType: "combined",
        sourceInfo: {},
      },
    };
  }

  // Create a root directory that contains all repositories
  const rootChildren: (DirectoryInfo | FileInfo)[] = [];
  const allFiles: FileInfo[] = [];
  const allDirectories: DirectoryInfo[] = [];

  let totalFileCount = 0;
  let totalDirectoryCount = 0;
  let totalSizeBytes = 0;
  let maxDepth = 0;

  // Add the root directory itself
  const rootDir: DirectoryInfo = {
    path: "",
    name: "Repositories",
    children: [],
    fileCount: 0,
    totalSize: 0,
    depth: 0,
    relativePath: "",
  };

  // Process each repository and add it as a top-level directory
  repositories.forEach((repo) => {
    const repoTree = repo.tree;

    // Skip if tree is invalid
    if (!repoTree || !repoTree.root) {
      return;
    }

    // Ensure repo name has a fallback value
    const repoName = repo.name || 'unknown-repo';

    // Create a new directory for this repository
    const repoDir: DirectoryInfo = {
      path: repoName,
      name: repoName,
      children: repoTree.root.children ? repoTree.root.children.map((child) => {
        // Update paths to include the repository name as prefix
        return updatePaths(child, repoName);
      }) : [],
      fileCount: repoTree.root.fileCount || 0,
      totalSize: repoTree.root.totalSize || 0,
      depth: 1,
      relativePath: repoName,
    };

    rootChildren.push(repoDir);
    allDirectories.push(repoDir);

    // Add all files and directories with updated paths
    if (repoTree.allFiles) {
      repoTree.allFiles.forEach(file => {
        const updatedFile = {
          ...file,
          path: `${repoName}/${file.path || ''}`,
          name: file.name || extractNameFromPath(file.path) || 'unknown',
        };
        allFiles.push(updatedFile);
      });
    }

    if (repoTree.allDirectories) {
      repoTree.allDirectories.forEach(dir => {
        const updatedDir = {
          ...dir,
          path: `${repoName}/${dir.path || ''}`,
          name: dir.name || extractNameFromPath(dir.path) || 'unknown',
        };
        allDirectories.push(updatedDir);
      });
    }

    if (repoTree.stats) {
      totalFileCount += repoTree.stats.totalFiles || 0;
      totalDirectoryCount += repoTree.stats.totalDirectories || 0;
      totalSizeBytes += repoTree.stats.totalSize || 0;
      maxDepth = Math.max(maxDepth, (repoTree.stats.maxDepth || 0) + 1);
    }
  });

  rootDir.children = rootChildren;
  rootDir.fileCount = totalFileCount;
  rootDir.totalSize = totalSizeBytes;

  // Include the root directory in allDirectories
  allDirectories.unshift(rootDir);

  return {
    sha: "combined",
    root: rootDir,
    allFiles,
    allDirectories,
    stats: {
      totalFiles: totalFileCount,
      totalDirectories: totalDirectoryCount + repositories.length + 1, // Add repo directories + root
      totalSize: totalSizeBytes,
      maxDepth: maxDepth + 1,
    },
    metadata: {
      id: "combined-tree",
      timestamp: new Date(),
      sourceType: "combined",
      sourceInfo: { repositoryCount: repositories.length },
    },
  };
};

// Helper function to safely extract name from path
const extractNameFromPath = (path: string | undefined): string => {
  if (!path) return '';
  const parts = path.split('/');
  return parts[parts.length - 1] || '';
};

// Helper function to update paths recursively
const updatePaths = (node: DirectoryInfo | FileInfo, prefix: string): DirectoryInfo | FileInfo => {
  // Ensure node has a path
  const originalPath = node.path || '';
  const updatedPath = `${prefix}/${originalPath}`;
  const updatedRelativePath = `${prefix}/${node.relativePath || originalPath}`;

  if ('children' in node) {
    // This is a directory
    const dirNode = node as DirectoryInfo;
    const nodeName = dirNode.name || extractNameFromPath(originalPath);

    const updatedDir: DirectoryInfo = {
      ...dirNode,
      path: updatedPath,
      name: nodeName,
      relativePath: updatedRelativePath,
      depth: (dirNode.depth || 0) + 1,
      children: (dirNode.children || []).map(child => updatePaths(child, prefix)),
    };
    return updatedDir;
  } else {
    // This is a file
    const fileNode = node as FileInfo;
    const nodeName = fileNode.name || extractNameFromPath(originalPath);

    return {
      ...fileNode,
      path: updatedPath,
      name: nodeName,
      relativePath: updatedRelativePath,
    };
  }
};

// Helper function to filter FileTree based on selected directory paths
const filterFileTree = (tree: FileTree, selectedPaths: string[]): FileTree => {
  if (selectedPaths.length === 0) {
    return tree;
  }

  // Helper to check if a path should be included
  const shouldIncludePath = (path: string): boolean => {
    return selectedPaths.some(selectedPath =>
      path.startsWith(selectedPath) || selectedPath.startsWith(path)
    );
  };

  // Filter DirectoryInfo recursively
  const filterDirectory = (dir: DirectoryInfo): DirectoryInfo | null => {
    if (!shouldIncludePath(dir.path)) {
      return null;
    }

    const filteredChildren = dir.children
      .map((child) => {
        if ('children' in child) {
          return filterDirectory(child as DirectoryInfo);
        } else {
          return shouldIncludePath(child.path) ? child : null;
        }
      })
      .filter((child): child is (DirectoryInfo | FileInfo) => child !== null);

    if (filteredChildren.length === 0 && !selectedPaths.includes(dir.path)) {
      return null;
    }

    return {
      ...dir,
      children: filteredChildren,
      fileCount: filteredChildren.filter((c) => !('children' in c)).length,
    };
  };

  const filteredRoot = filterDirectory(tree.root as DirectoryInfo);
  if (!filteredRoot) {
    return tree;
  }

  const allFiles = tree.allFiles.filter(f => shouldIncludePath(f.path));
  const allDirectories = tree.allDirectories.filter(d => shouldIncludePath(d.path));

  return {
    ...tree,
    root: filteredRoot,
    allFiles,
    allDirectories,
    stats: {
      ...tree.stats,
      totalFiles: allFiles.length,
      totalDirectories: allDirectories.length,
    },
  };
};

export const MultiFileTreeSection: React.FC<MultiFileTreeSectionProps> = ({
  repositories,
  theme,
  isMobile = false,
  onFileSelect,
}) => {
  const [selectedFile, setSelectedFile] = useState<{ repoId: string; path: string } | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "selected">("all");
  const [directoryFilters, setDirectoryFilters] = useState<DirectoryFilter[]>([]);

  // Create the unified tree combining all repositories
  const unifiedTree = useMemo(() => {
    return combineRepositoryTrees(repositories);
  }, [repositories]);

  // Extract paths from filters that are in 'include' mode for display
  const currentSelectedDirs = directoryFilters
    .filter(f => f.mode === 'include')
    .map(f => f.path);

  // Get the tree to display - filtered if in 'selected' mode
  const displayTree = useMemo(() => {
    if (viewMode === "selected" && currentSelectedDirs.length > 0) {
      return filterFileTree(unifiedTree, currentSelectedDirs);
    }
    return unifiedTree;
  }, [unifiedTree, viewMode, currentSelectedDirs]);

  const handleFileSelect = (filePath: string) => {
    // Extract the repository name from the path (it's the first segment)
    const pathSegments = filePath.split('/');
    const repoName = pathSegments[0];
    const repo = repositories.find(r => r.name === repoName);

    if (repo) {
      // Remove the repository name from the path to get the original file path
      const originalPath = pathSegments.slice(1).join('/');
      setSelectedFile({ repoId: repo.id, path: originalPath });

      if (onFileSelect) {
        onFileSelect(repo.id, originalPath);
      }
      console.log(`Selected file in ${repo.id}:`, originalPath);
    }
  };

  const handleFiltersChange = (filters: DirectoryFilter[]) => {
    setDirectoryFilters(filters);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Unified File Tree Viewer */}
      <div
        style={{
          flex: 1,
          border: `2px solid ${theme.colors.border}`,
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: theme.colors.background,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header with view mode toggle */}
        <div
          style={{
            padding: "16px",
            borderBottom: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.backgroundSecondary,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h4
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: theme.colors.text,
              margin: 0,
            }}
          >
            Repository Explorer
          </h4>

          {/* View Mode Toggle */}
          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              onClick={() => setViewMode("all")}
              style={{
                padding: "6px 12px",
                fontSize: "13px",
                fontWeight: "500",
                backgroundColor: viewMode === "all" ? theme.colors.primary : "transparent",
                color: viewMode === "all" ? theme.colors.background : theme.colors.text,
                border: `1px solid ${viewMode === "all" ? theme.colors.primary : theme.colors.border}`,
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Show All
            </button>
            <button
              onClick={() => setViewMode("selected")}
              disabled={currentSelectedDirs.length === 0}
              style={{
                padding: "6px 12px",
                fontSize: "13px",
                fontWeight: "500",
                backgroundColor: viewMode === "selected" ? theme.colors.primary : "transparent",
                color: viewMode === "selected" ? theme.colors.background : currentSelectedDirs.length === 0 ? theme.colors.textSecondary : theme.colors.text,
                border: `1px solid ${viewMode === "selected" ? theme.colors.primary : theme.colors.border}`,
                borderRadius: "6px",
                cursor: currentSelectedDirs.length === 0 ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                opacity: currentSelectedDirs.length === 0 ? 0.5 : 1,
              }}
              title={currentSelectedDirs.length === 0 ? "Select directories below first" : `Show only selected directories (${currentSelectedDirs.length})`}
            >
              Show Selected ({currentSelectedDirs.length})
            </button>
          </div>
        </div>

        {/* Directory Filter Input */}
        <div
          style={{
            padding: "16px",
            borderBottom: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.background,
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontWeight: "500",
              color: theme.colors.text,
              marginBottom: "8px",
            }}
          >
            Select Directories to Filter:
          </div>
          <DirectoryFilterInput
            fileTree={unifiedTree}
            theme={theme}
            filters={directoryFilters}
            onFiltersChange={handleFiltersChange}
          />
          {currentSelectedDirs.length === 0 && (
            <div
              style={{
                fontSize: "12px",
                color: theme.colors.textSecondary,
                marginTop: "8px",
                fontStyle: "italic",
              }}
            >
              Type to search and select directories from any repository. Selected directories will be highlighted when you click "Show Selected".
            </div>
          )}
          {currentSelectedDirs.length > 0 && viewMode === "all" && (
            <div
              style={{
                fontSize: "12px",
                color: theme.colors.primary,
                marginTop: "8px",
              }}
            >
              ✓ {currentSelectedDirs.length} director{currentSelectedDirs.length === 1 ? 'y' : 'ies'} selected. Click "Show Selected" to filter the view.
            </div>
          )}
        </div>

        {/* File Tree Display */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "16px",
          }}
        >
          {viewMode === "selected" && currentSelectedDirs.length > 0 && (
            <div
              style={{
                fontSize: "13px",
                color: theme.colors.textSecondary,
                marginBottom: "12px",
                padding: "8px 12px",
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: "6px",
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              Showing only selected directories: {currentSelectedDirs.map(dir => {
                const segments = dir.split('/');
                return segments.length > 1 ? `${segments[0]}/${segments[segments.length - 1]}` : dir;
              }).join(', ')}
            </div>
          )}
          <DynamicFileTree
            key={`unified-${viewMode}-${currentSelectedDirs.join(',')}`}
            fileTree={displayTree}
            theme={theme}
            selectedDirectories={currentSelectedDirs}
            onFileSelect={handleFileSelect}
          />
        </div>
      </div>

      {/* Selected file indicator */}
      {selectedFile && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: "8px",
            border: `1px solid ${theme.colors.border}`,
            fontSize: "12px",
            color: theme.colors.textSecondary,
          }}
        >
          Selected: {repositories.find(r => r.id === selectedFile.repoId)?.name} / {selectedFile.path}
        </div>
      )}
    </div>
  );
};