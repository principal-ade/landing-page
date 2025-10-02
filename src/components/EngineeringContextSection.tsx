"use client";

import React, { useState } from "react";
import { useTheme } from "@a24z/industry-theme";
import { DynamicFileTree, DirectoryFilterInput, DirectoryFilter } from "@a24z/dynamic-file-tree";
import { FileTree, DirectoryInfo, FileInfo } from "@principal-ai/repository-abstraction";

interface EngineeringContextSectionProps {
  isMobile?: boolean;
  isTablet?: boolean;
}

// Sample file tree data for demonstration
const createFrontendTree = (): FileTree => {
  const repoName = "frontend-app";

  const homeFile: FileInfo = {
    path: `/repos/${repoName}/src/pages/Home.tsx`,
    name: "Home.tsx",
    extension: ".tsx",
    size: 2048,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "src/pages/Home.tsx",
  };

  const aboutFile: FileInfo = {
    path: `/repos/${repoName}/src/pages/About.tsx`,
    name: "About.tsx",
    extension: ".tsx",
    size: 1536,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "src/pages/About.tsx",
  };

  const buttonFile: FileInfo = {
    path: `/repos/${repoName}/src/components/Button.tsx`,
    name: "Button.tsx",
    extension: ".tsx",
    size: 1024,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "src/components/Button.tsx",
  };

  const navbarFile: FileInfo = {
    path: `/repos/${repoName}/src/components/Navbar.tsx`,
    name: "Navbar.tsx",
    extension: ".tsx",
    size: 2560,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "src/components/Navbar.tsx",
  };

  const stylesFile: FileInfo = {
    path: `/repos/${repoName}/src/styles/global.css`,
    name: "global.css",
    extension: ".css",
    size: 3072,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "src/styles/global.css",
  };

  const readmeFile: FileInfo = {
    path: `/repos/${repoName}/README.md`,
    name: "README.md",
    extension: ".md",
    size: 1536,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "README.md",
  };

  const pagesDir: DirectoryInfo = {
    path: `/repos/${repoName}/src/pages`,
    name: "pages",
    children: [homeFile, aboutFile],
    fileCount: 2,
    totalSize: 3584,
    depth: 2,
    relativePath: "src/pages",
  };

  const componentsDir: DirectoryInfo = {
    path: `/repos/${repoName}/src/components`,
    name: "components",
    children: [buttonFile, navbarFile],
    fileCount: 2,
    totalSize: 3584,
    depth: 2,
    relativePath: "src/components",
  };

  const stylesDir: DirectoryInfo = {
    path: `/repos/${repoName}/src/styles`,
    name: "styles",
    children: [stylesFile],
    fileCount: 1,
    totalSize: 3072,
    depth: 2,
    relativePath: "src/styles",
  };

  const srcDir: DirectoryInfo = {
    path: `/repos/${repoName}/src`,
    name: "src",
    children: [pagesDir, componentsDir, stylesDir],
    fileCount: 5,
    totalSize: 10240,
    depth: 1,
    relativePath: "src",
  };

  const rootDir: DirectoryInfo = {
    path: `/repos/${repoName}`,
    name: repoName,
    children: [srcDir, readmeFile],
    fileCount: 6,
    totalSize: 11776,
    depth: 0,
    relativePath: "",
  };

  return {
    sha: `sha-${repoName}`,
    root: rootDir,
    allFiles: [homeFile, aboutFile, buttonFile, navbarFile, stylesFile, readmeFile],
    allDirectories: [rootDir, srcDir, pagesDir, componentsDir, stylesDir],
    stats: {
      totalFiles: 6,
      totalDirectories: 5,
      totalSize: 11776,
      maxDepth: 2,
    },
    metadata: {
      id: `tree-${repoName}`,
      timestamp: new Date(),
      sourceType: "sample",
      sourceInfo: {},
    },
  };
};

const createBackendTree = (): FileTree => {
  const repoName = "backend-api";

  const usersRoute: FileInfo = {
    path: `/repos/${repoName}/src/routes/users.ts`,
    name: "users.ts",
    extension: ".ts",
    size: 3072,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "src/routes/users.ts",
  };

  const authRoute: FileInfo = {
    path: `/repos/${repoName}/src/routes/auth.ts`,
    name: "auth.ts",
    extension: ".ts",
    size: 2560,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "src/routes/auth.ts",
  };

  const userModel: FileInfo = {
    path: `/repos/${repoName}/src/models/User.ts`,
    name: "User.ts",
    extension: ".ts",
    size: 2048,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "src/models/User.ts",
  };

  const dbFile: FileInfo = {
    path: `/repos/${repoName}/src/config/database.ts`,
    name: "database.ts",
    extension: ".ts",
    size: 1536,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "src/config/database.ts",
  };

  const envFile: FileInfo = {
    path: `/repos/${repoName}/src/config/env.ts`,
    name: "env.ts",
    extension: ".ts",
    size: 1024,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "src/config/env.ts",
  };

  const readmeFile: FileInfo = {
    path: `/repos/${repoName}/README.md`,
    name: "README.md",
    extension: ".md",
    size: 2048,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "README.md",
  };

  const routesDir: DirectoryInfo = {
    path: `/repos/${repoName}/src/routes`,
    name: "routes",
    children: [usersRoute, authRoute],
    fileCount: 2,
    totalSize: 5632,
    depth: 2,
    relativePath: "src/routes",
  };

  const modelsDir: DirectoryInfo = {
    path: `/repos/${repoName}/src/models`,
    name: "models",
    children: [userModel],
    fileCount: 1,
    totalSize: 2048,
    depth: 2,
    relativePath: "src/models",
  };

  const configDir: DirectoryInfo = {
    path: `/repos/${repoName}/src/config`,
    name: "config",
    children: [dbFile, envFile],
    fileCount: 2,
    totalSize: 2560,
    depth: 2,
    relativePath: "src/config",
  };

  const srcDir: DirectoryInfo = {
    path: `/repos/${repoName}/src`,
    name: "src",
    children: [routesDir, modelsDir, configDir],
    fileCount: 5,
    totalSize: 10240,
    depth: 1,
    relativePath: "src",
  };

  const rootDir: DirectoryInfo = {
    path: `/repos/${repoName}`,
    name: repoName,
    children: [srcDir, readmeFile],
    fileCount: 6,
    totalSize: 12288,
    depth: 0,
    relativePath: "",
  };

  return {
    sha: `sha-${repoName}`,
    root: rootDir,
    allFiles: [usersRoute, authRoute, userModel, dbFile, envFile, readmeFile],
    allDirectories: [rootDir, srcDir, routesDir, modelsDir, configDir],
    stats: {
      totalFiles: 6,
      totalDirectories: 5,
      totalSize: 12288,
      maxDepth: 2,
    },
    metadata: {
      id: `tree-${repoName}`,
      timestamp: new Date(),
      sourceType: "sample",
      sourceInfo: {},
    },
  };
};

const createSharedTree = (): FileTree => {
  const repoName = "shared-components";

  const buttonFile: FileInfo = {
    path: `/repos/${repoName}/src/ui/Button.tsx`,
    name: "Button.tsx",
    extension: ".tsx",
    size: 1536,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "src/ui/Button.tsx",
  };

  const inputFile: FileInfo = {
    path: `/repos/${repoName}/src/ui/Input.tsx`,
    name: "Input.tsx",
    extension: ".tsx",
    size: 1280,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "src/ui/Input.tsx",
  };

  const modalFile: FileInfo = {
    path: `/repos/${repoName}/src/ui/Modal.tsx`,
    name: "Modal.tsx",
    extension: ".tsx",
    size: 2048,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "src/ui/Modal.tsx",
  };

  const useFetchFile: FileInfo = {
    path: `/repos/${repoName}/src/hooks/useFetch.ts`,
    name: "useFetch.ts",
    extension: ".ts",
    size: 1024,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "src/hooks/useFetch.ts",
  };

  const formatFile: FileInfo = {
    path: `/repos/${repoName}/src/utils/format.ts`,
    name: "format.ts",
    extension: ".ts",
    size: 768,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "src/utils/format.ts",
  };

  const validateFile: FileInfo = {
    path: `/repos/${repoName}/src/utils/validate.ts`,
    name: "validate.ts",
    extension: ".ts",
    size: 512,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "src/utils/validate.ts",
  };

  const readmeFile: FileInfo = {
    path: `/repos/${repoName}/README.md`,
    name: "README.md",
    extension: ".md",
    size: 1024,
    lastModified: new Date(),
    isDirectory: false,
    relativePath: "README.md",
  };

  const uiDir: DirectoryInfo = {
    path: `/repos/${repoName}/src/ui`,
    name: "ui",
    children: [buttonFile, inputFile, modalFile],
    fileCount: 3,
    totalSize: 4864,
    depth: 2,
    relativePath: "src/ui",
  };

  const hooksDir: DirectoryInfo = {
    path: `/repos/${repoName}/src/hooks`,
    name: "hooks",
    children: [useFetchFile],
    fileCount: 1,
    totalSize: 1024,
    depth: 2,
    relativePath: "src/hooks",
  };

  const utilsDir: DirectoryInfo = {
    path: `/repos/${repoName}/src/utils`,
    name: "utils",
    children: [formatFile, validateFile],
    fileCount: 2,
    totalSize: 1280,
    depth: 2,
    relativePath: "src/utils",
  };

  const srcDir: DirectoryInfo = {
    path: `/repos/${repoName}/src`,
    name: "src",
    children: [uiDir, hooksDir, utilsDir],
    fileCount: 6,
    totalSize: 7168,
    depth: 1,
    relativePath: "src",
  };

  const rootDir: DirectoryInfo = {
    path: `/repos/${repoName}`,
    name: repoName,
    children: [srcDir, readmeFile],
    fileCount: 7,
    totalSize: 8192,
    depth: 0,
    relativePath: "",
  };

  return {
    sha: `sha-${repoName}`,
    root: rootDir,
    allFiles: [buttonFile, inputFile, modalFile, useFetchFile, formatFile, validateFile, readmeFile],
    allDirectories: [rootDir, srcDir, uiDir, hooksDir, utilsDir],
    stats: {
      totalFiles: 7,
      totalDirectories: 5,
      totalSize: 8192,
      maxDepth: 2,
    },
    metadata: {
      id: `tree-${repoName}`,
      timestamp: new Date(),
      sourceType: "sample",
      sourceInfo: {},
    },
  };
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
      .map(child => {
        if ('children' in child) {
          return filterDirectory(child);
        } else {
          return shouldIncludePath(child.path) ? child : null;
        }
      })
      .filter((child): child is FileInfo | DirectoryInfo => child !== null);

    if (filteredChildren.length === 0 && !selectedPaths.includes(dir.path)) {
      return null;
    }

    return {
      ...dir,
      children: filteredChildren,
      fileCount: filteredChildren.filter(c => !('children' in c)).length,
    };
  };

  const filteredRoot = filterDirectory(tree.root);
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

// Create repositories once to avoid recreating on every render
const repositories = [
  { id: "frontend-app", name: "Frontend App", tree: createFrontendTree() },
  { id: "backend-api", name: "Backend API", tree: createBackendTree() },
  { id: "shared-components", name: "Shared Components", tree: createSharedTree() },
];

export const EngineeringContextSection: React.FC<EngineeringContextSectionProps> = ({
  isMobile = false,
  isTablet = false,
}) => {
  const { theme } = useTheme();
  const [selectedRepo, setSelectedRepo] = useState<string>("frontend-app");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "selected">("all");

  // Track directory filters for each repository
  const [directoryFilters, setDirectoryFilters] = useState<Record<string, DirectoryFilter[]>>({
    "frontend-app": [],
    "backend-api": [],
    "shared-components": [],
  });

  const currentRepo = repositories.find(r => r.id === selectedRepo);
  const currentFilters = directoryFilters[selectedRepo] || [];

  // Extract paths from filters that are in 'include' mode for display
  const currentSelectedDirs = currentFilters
    .filter(f => f.mode === 'include')
    .map(f => f.path);

  // Get the tree to display - filtered if in 'selected' mode
  const displayTree = currentRepo
    ? viewMode === "selected"
      ? filterFileTree(currentRepo.tree, currentSelectedDirs)
      : currentRepo.tree
    : null;

  const handleFiltersChange = (filters: DirectoryFilter[]) => {
    setDirectoryFilters(prev => ({
      ...prev,
      [selectedRepo]: filters,
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: "24px",
        width: "100%",
        height: "600px",
      }}
    >
      {/* Repository Selector */}
      <div
        style={{
          width: isMobile ? "100%" : "250px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: theme.colors.text,
            marginTop: 0,
            marginBottom: "12px",
          }}
        >
          Repositories
        </h3>
        {repositories.map((repo) => (
          <button
            key={repo.id}
            onClick={() => setSelectedRepo(repo.id)}
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "500",
              backgroundColor:
                selectedRepo === repo.id
                  ? theme.colors.primary
                  : theme.colors.backgroundSecondary,
              color:
                selectedRepo === repo.id
                  ? theme.colors.background
                  : theme.colors.text,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              if (selectedRepo !== repo.id) {
                e.currentTarget.style.backgroundColor = theme.colors.backgroundHover;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedRepo !== repo.id) {
                e.currentTarget.style.backgroundColor = theme.colors.backgroundSecondary;
              }
            }}
          >
            {repo.name}
          </button>
        ))}
      </div>

      {/* File Tree Viewer */}
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
            {currentRepo?.name}
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
              style={{
                padding: "6px 12px",
                fontSize: "13px",
                fontWeight: "500",
                backgroundColor: viewMode === "selected" ? theme.colors.primary : "transparent",
                color: viewMode === "selected" ? theme.colors.background : theme.colors.text,
                border: `1px solid ${viewMode === "selected" ? theme.colors.primary : theme.colors.border}`,
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
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
          {currentRepo && (
            <DirectoryFilterInput
              fileTree={currentRepo.tree}
              theme={theme}
              filters={currentFilters}
              onFiltersChange={handleFiltersChange}
            />
          )}
        </div>

        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "16px",
          }}
        >
          {displayTree && (
            <DynamicFileTree
              key={`${selectedRepo}-${viewMode}`}
              fileTree={displayTree}
              theme={theme}
              selectedDirectories={currentSelectedDirs}
              onFileSelect={(filePath) => {
                setSelectedFile(filePath);
                console.log("Selected file:", filePath);
              }}
            />
          )}
        </div>
        {selectedFile && (
          <div
            style={{
              padding: "12px 16px",
              borderTop: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.backgroundSecondary,
              fontSize: "12px",
              color: theme.colors.textSecondary,
            }}
          >
            Selected: {selectedFile}
          </div>
        )}
      </div>
    </div>
  );
};
