"use client";

import React, { useMemo } from "react";
import { Theme } from "@a24z/industry-theme";
import { MultiFileTree, parseUnifiedPath } from "@a24z/dynamic-file-tree";
import { FileTree, LoadedFileTreeSource, FileTreeSource } from "@principal-ai/repository-abstraction";

interface Repository {
  id: string;
  name: string;
  tree: FileTree;
}

interface MultiFileTreeSectionProps {
  repositories: Repository[];
  theme: Theme;
  onFileSelect?: (repoId: string, filePath: string) => void;
}

export const MultiFileTreeSection: React.FC<MultiFileTreeSectionProps> = ({
  repositories,
  theme,
  onFileSelect,
}) => {
  // Convert repositories to LoadedFileTreeSource format
  const sources: LoadedFileTreeSource[] = useMemo(() => {
    return repositories.map(repo => ({
      id: repo.id,
      type: 'local' as const,
      owner: '',
      name: repo.name,
      remoteUrl: '',
      location: '',
      locationType: 'working' as const,
      label: repo.name,
      tree: repo.tree,
      treeStats: {
        fileCount: repo.tree.stats?.totalFiles || 0,
        directoryCount: repo.tree.stats?.totalDirectories || 0,
        loadedAt: Date.now(),
      },
    }));
  }, [repositories]);

  const handleFileSelect = (source: FileTreeSource, filePath: string) => {
    // Extract the original path from the unified path
    const { originalPath } = parseUnifiedPath(filePath);

    if (onFileSelect) {
      onFileSelect(source.id, originalPath);
    }
    console.log(`Selected file in ${source.id}:`, originalPath);
  };

  return (
    <MultiFileTree
      sources={sources}
      theme={theme}
      title="Repository Explorer"
      onFileSelect={handleFileSelect}
    />
  );
};