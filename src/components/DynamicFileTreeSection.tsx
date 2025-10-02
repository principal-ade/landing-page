"use client";

import React, { useState } from "react";
import { Theme } from "@a24z/industry-theme";
import { DynamicFileTree, DirectoryFilterInput, DirectoryFilter, filterFileTreeByPaths } from "@a24z/dynamic-file-tree";
import { FileTree } from "@principal-ai/repository-abstraction";

interface DynamicFileTreeSectionProps {
  fileTree: FileTree;
  theme: Theme;
  title?: string;
  isMobile?: boolean;
  onFileSelect?: (filePath: string) => void;
}

export const DynamicFileTreeSection: React.FC<DynamicFileTreeSectionProps> = ({
  fileTree,
  theme,
  title,
  isMobile = false,
  onFileSelect,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "selected">("all");
  // Start with some default selections to demonstrate the feature
  const [directoryFilters, setDirectoryFilters] = useState<DirectoryFilter[]>(() => {
    // Pre-select the src directory if it exists
    const srcDir = fileTree.allDirectories.find(d => d.name === 'src');
    if (srcDir) {
      return [{ id: `filter-${Date.now()}`, path: srcDir.path, mode: 'include' }];
    }
    return [];
  });

  // Extract paths from filters that are in 'include' mode for display
  const currentSelectedDirs = directoryFilters
    .filter(f => f.mode === 'include')
    .map(f => f.path);

  // Get the tree to display - filtered if in 'selected' mode using library utility
  const displayTree = viewMode === "selected"
    ? filterFileTreeByPaths(fileTree, currentSelectedDirs)
    : fileTree;

  const handleFiltersChange = (filters: DirectoryFilter[]) => {
    setDirectoryFilters(filters);
  };

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
    if (onFileSelect) {
      onFileSelect(filePath);
    }
    console.log("Selected file:", filePath);
  };

  return (
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
          {title}
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
          fileTree={fileTree}
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
            ℹ️ Type to search and select directories. Selected directories will be highlighted when you click "Show Selected".
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
            🔍 Showing only selected directories: {currentSelectedDirs.map(dir => dir.split('/').pop()).join(', ')}
          </div>
        )}
        <DynamicFileTree
          key={`${viewMode}-${currentSelectedDirs.join(',')}`}
          fileTree={displayTree}
          theme={theme}
          selectedDirectories={currentSelectedDirs}
          onFileSelect={handleFileSelect}
        />
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
  );
};