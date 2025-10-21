"use client";

import React, { useMemo } from "react";
import { DynamicFileTree } from "@a24z/dynamic-file-tree";
import { FileTree } from "@principal-ai/repository-abstraction";
import { Theme } from "@a24z/industry-theme";

interface Event {
  timestamp: string;
  timestampMs: number;
  eventType?: string;
  [key: string]: unknown;
}

interface SessionFileTreeProps {
  events: Event[];
  sessionId: string;
  repoOwner?: string;
  repoName?: string;
  theme: Theme;
  onFileSelect?: (filePath: string) => void;
}

export const SessionFileTree: React.FC<SessionFileTreeProps> = ({
  events,
  sessionId,
  repoOwner,
  repoName,
  theme,
  onFileSelect,
}) => {
  // Build file tree from normalized files in events
  const fileTree = useMemo((): FileTree => {
    const allPaths = new Set<string>();

    events.forEach(event => {
      const files = (event as any).normalized_files;
      if (Array.isArray(files)) {
        files.forEach((file: any) => {
          const path = file.repository?.relativePath || file.displayPath;
          if (path) {
            allPaths.add(path);
          }
        });
      }
    });

    // Convert Set to sorted array
    const sortedPaths = Array.from(allPaths).sort();

    // Build tree structure with proper types
    interface TempNode {
      name: string;
      path: string;
      children: TempNode[];
      isFile: boolean;
    }

    const rootNode: TempNode = {
      name: repoName || 'root',
      path: '',
      children: [],
      isFile: false,
    };

    const directories = new Map<string, TempNode>();
    directories.set('', rootNode);

    sortedPaths.forEach(filePath => {
      const parts = filePath.split('/');
      let currentPath = '';

      // Create directories
      for (let i = 0; i < parts.length - 1; i++) {
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];

        if (!directories.has(currentPath)) {
          const dirNode: TempNode = {
            name: parts[i],
            path: currentPath,
            children: [],
            isFile: false,
          };

          const parent = directories.get(parentPath);
          if (parent) {
            parent.children.push(dirNode);
          }

          directories.set(currentPath, dirNode);
        }
      }

      // Add file
      const fileName = parts[parts.length - 1];
      const parentPath = parts.slice(0, -1).join('/');
      const parent = directories.get(parentPath);

      if (parent) {
        parent.children.push({
          name: fileName,
          path: filePath,
          children: [],
          isFile: true,
        });
      }
    });

    // Convert to proper FileTree format
    const now = new Date();

    // Build proper DirectoryInfo for root
    const buildDirectoryInfo = (node: TempNode, depth: number): any => {
      const childrenNodes = node.children.map(child =>
        child.isFile
          ? {
              path: child.path,
              name: child.name,
              extension: child.name.includes('.') ? child.name.split('.').pop() || '' : '',
              size: 0,
              lastModified: now,
              isDirectory: false,
              relativePath: child.path,
            }
          : buildDirectoryInfo(child, depth + 1)
      );

      const fileCount = childrenNodes.filter((n: any) => !n.isDirectory).length;

      return {
        path: node.path,
        name: node.name,
        children: childrenNodes,
        fileCount,
        totalSize: 0,
        depth,
        relativePath: node.path,
      };
    };

    const root = buildDirectoryInfo(rootNode, 0);

    // Build allFiles and allDirectories arrays
    const allFileInfos = sortedPaths.map(p => ({
      path: p,
      name: p.split('/').pop() || p,
      extension: p.includes('.') ? p.split('.').pop() || '' : '',
      size: 0,
      lastModified: now,
      isDirectory: false,
      relativePath: p,
    }));

    const allDirInfos = Array.from(directories.values()).map(d => ({
      path: d.path,
      name: d.name,
      children: [],
      fileCount: 0,
      totalSize: 0,
      depth: d.path.split('/').filter(p => p).length,
      relativePath: d.path,
    }));

    return {
      sha: 'session-' + sessionId.slice(0, 8),
      root,
      allFiles: allFileInfos,
      allDirectories: allDirInfos,
      stats: {
        totalFiles: sortedPaths.length,
        totalDirectories: directories.size,
        totalSize: 0,
        maxDepth: Math.max(...allDirInfos.map(d => d.depth), 0),
      },
      metadata: {
        id: sessionId,
        timestamp: now,
        sourceType: 'session-events',
        sourceInfo: {
          eventCount: events.length,
          repoOwner,
          repoName,
        },
      },
    };
  }, [events, repoName, sessionId, repoOwner]);

  return (
    <>
      <h3
        style={{
          fontSize: theme.fontSizes[1],
          fontWeight: theme.fontWeights.bold,
          color: theme.colors.text,
          margin: 0,
          marginBottom: theme.space[3],
        }}
      >
        Files Accessed
      </h3>
      <DynamicFileTree
        fileTree={fileTree}
        theme={theme}
        onFileSelect={(filePath) => onFileSelect?.(filePath)}
        padding="12px"
      />
    </>
  );
};
