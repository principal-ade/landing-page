"use client";

import React, { useState } from "react";
import { useTheme } from "@a24z/industry-theme";
import { FileTree, DirectoryInfo, FileInfo } from "@principal-ai/repository-abstraction";
import { DynamicFileTreeSection } from "./DynamicFileTreeSection";
import { MultiFileTreeSection } from "./MultiFileTreeSection";

interface EngineeringContextSectionProps {
  isMobile?: boolean;
  isTablet?: boolean;
  useMultiTree?: boolean;
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

// Create repositories once to avoid recreating on every render
const repositories = [
  { id: "frontend-app", name: "Frontend App", tree: createFrontendTree() },
  { id: "backend-api", name: "Backend API", tree: createBackendTree() },
  { id: "shared-components", name: "Shared Components", tree: createSharedTree() },
];

export const EngineeringContextSection: React.FC<EngineeringContextSectionProps> = ({
  isMobile = false,
  isTablet = false,
  useMultiTree = false,
}) => {
  const { theme } = useTheme();
  const [selectedRepo, setSelectedRepo] = useState<string>("frontend-app");

  const currentRepo = repositories.find(r => r.id === selectedRepo);

  // Use multi-tree view if specified
  if (useMultiTree) {
    return (
      <MultiFileTreeSection
        repositories={repositories}
        theme={theme}
        isMobile={isMobile}
        onFileSelect={(repoId, filePath) => {
          console.log(`Selected file in ${repoId}:`, filePath);
        }}
      />
    );
  }

  // Default single-tree view with repository selector
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
      {currentRepo && (
        <DynamicFileTreeSection
          fileTree={currentRepo.tree}
          theme={theme}
          title={currentRepo.name}
          isMobile={isMobile}
          onFileSelect={(filePath) => {
            console.log("Selected file:", filePath);
          }}
        />
      )}
    </div>
  );
};
