"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useTheme } from "@a24z/industry-theme";
import { DynamicFileTree, OrderedFileList } from "@a24z/dynamic-file-tree";
import { FileTree } from "@principal-ai/repository-abstraction";
import { ThemedMDXEditor, useThemedMDXEditor } from "@principal-ade/industry-themed-mdx-editor";
import "@mdxeditor/editor/style.css";
import "@principal-ade/industry-themed-mdx-editor/styles.css";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  frontmatterPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  BlockTypeSelect,
  CodeToggle,
  DiffSourceToggleWrapper,
  type MDXEditorMethods,
} from "@mdxeditor/editor";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
}

interface MarkdownEditorViewProps {
  repoOwner: string;
  repoName: string;
  branch?: string;
  githubToken?: string;
  onBack?: () => void;
}

// Editor component with properly configured plugins
const EditorWithPlugins: React.FC<{
  fileContent: string;
  selectedFile: string;
  handleSaveFile: (content: string) => Promise<void>;
  theme: any;
}> = ({ fileContent, selectedFile, handleSaveFile, theme }) => {
  const { getCodeMirrorExtensions } = useThemedMDXEditor();
  const editorRef = React.useRef<MDXEditorMethods>(null);

  const plugins = useMemo(
    () => {
      const extensions = getCodeMirrorExtensions();
      return [
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({
          imageUploadHandler: async () => 'https://via.placeholder.com/400x300',
        }),
        tablePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "javascript" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            javascript: "JavaScript",
            typescript: "TypeScript",
            tsx: "TypeScript (JSX)",
            jsx: "JavaScript (JSX)",
            python: "Python",
            java: "Java",
            go: "Go",
            rust: "Rust",
            cpp: "C++",
            c: "C",
            css: "CSS",
            html: "HTML",
            json: "JSON",
            yaml: "YAML",
            markdown: "Markdown",
            bash: "Bash",
            shell: "Shell",
            sql: "SQL",
          },
          codeMirrorExtensions: extensions || [],
        }),
        frontmatterPlugin(),
        diffSourcePlugin({ viewMode: "rich-text" }),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <DiffSourceToggleWrapper>
                <UndoRedo />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <CreateLink />
                <InsertImage />
                <InsertTable />
                <InsertThematicBreak />
                <ListsToggle />
              </DiffSourceToggleWrapper>
            </>
          ),
        }),
      ];
    },
    [getCodeMirrorExtensions]
  );

  return (
    <ThemedMDXEditor
      ref={editorRef}
      theme={theme}
      markdown={fileContent || ""}
      onSave={handleSaveFile}
      filePath={selectedFile || undefined}
      enableSaveShortcut={true}
      documentPadding={{ left: 32, right: 32, top: 0, bottom: 32 }}
      plugins={plugins}
    />
  );
};

export const MarkdownEditorView: React.FC<MarkdownEditorViewProps> = ({
  repoOwner,
  repoName,
  branch = "main",
  githubToken,
  onBack,
}) => {
  const { theme } = useTheme();
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [fileSha, setFileSha] = useState<string>("");
  const [isLoadingTree, setIsLoadingTree] = useState<boolean>(true);
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"ordered" | "dynamic">("ordered");

  const loadFileTree = useCallback(async () => {
    setIsLoadingTree(true);
    setError(null);

    try {
      const response = await fetch("/api/markdown/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: repoOwner,
          repo: repoName,
          branch: branch || "main",
          token: githubToken || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load file tree");
      }

      setFileTree(data.files || []);
    } catch (err) {
      console.error("Failed to load file tree:", err);
      setError(err instanceof Error ? err.message : "Failed to load file tree");
      setFileTree([]);
    } finally {
      setIsLoadingTree(false);
    }
  }, [repoOwner, repoName, branch, githubToken]);

  const loadFileContent = useCallback(
    async (filePath: string) => {
      setIsLoadingFile(true);
      setError(null);

      try {
        const response = await fetch("/api/markdown/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner: repoOwner,
            repo: repoName,
            filePath,
            branch: branch || "main",
            token: githubToken || undefined,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load file content");
        }

        setFileContent(data.content || "");
        setFileSha(data.sha || "");
        setSelectedFile(filePath);
      } catch (err) {
        console.error("Failed to load file content:", err);
        setError(err instanceof Error ? err.message : "Failed to load file content");
      } finally {
        setIsLoadingFile(false);
      }
    },
    [repoOwner, repoName, branch, githubToken]
  );

  const handleSaveFile = useCallback(
    async (content: string) => {
      if (!selectedFile || !fileSha) return;

      if (!githubToken) {
        setError("GitHub token is required to save files. Please provide a token with repo write access.");
        throw new Error("GitHub token required");
      }

      try {
        const response = await fetch("/api/markdown/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner: repoOwner,
            repo: repoName,
            filePath: selectedFile,
            content,
            branch: branch || "main",
            sha: fileSha,
            token: githubToken,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to save file");
        }

        // Update SHA after successful save
        if (data.sha) {
          setFileSha(data.sha);
        }
      } catch (err) {
        console.error("Failed to save file:", err);
        setError(err instanceof Error ? err.message : "Failed to save file");
        throw err;
      }
    },
    [selectedFile, fileSha, githubToken, repoOwner, repoName, branch]
  );

  // Load file tree on mount
  React.useEffect(() => {
    loadFileTree();
  }, [loadFileTree]);

  // Convert FileNode[] to FileTree format required by DynamicFileTree
  const fileTreeData = useMemo((): FileTree | null => {
    if (fileTree.length === 0) return null;

    const now = new Date();
    const allPaths: string[] = [];

    // Collect all file paths recursively
    const collectPaths = (nodes: FileNode[]) => {
      nodes.forEach((node) => {
        if (node.type === "file") {
          allPaths.push(node.path);
        }
        if (node.children) {
          collectPaths(node.children);
        }
      });
    };
    collectPaths(fileTree);

    // Build tree structure
    interface TempNode {
      name: string;
      path: string;
      children: TempNode[];
      isFile: boolean;
    }

    const rootNode: TempNode = {
      name: repoName || "root",
      path: "",
      children: [],
      isFile: false,
    };

    const directories = new Map<string, TempNode>();
    directories.set("", rootNode);

    // Build directory structure
    const buildNode = (nodes: FileNode[], parentNode: TempNode) => {
      nodes.forEach((node) => {
        if (node.type === "directory") {
          const dirNode: TempNode = {
            name: node.name,
            path: node.path,
            children: [],
            isFile: false,
          };
          parentNode.children.push(dirNode);
          directories.set(node.path, dirNode);

          if (node.children) {
            buildNode(node.children, dirNode);
          }
        } else {
          parentNode.children.push({
            name: node.name,
            path: node.path,
            children: [],
            isFile: true,
          });
        }
      });
    };

    buildNode(fileTree, rootNode);

    // Convert to proper FileTree format
    const buildDirectoryInfo = (node: TempNode, depth: number): any => {
      const childrenNodes = node.children.map((child) =>
        child.isFile
          ? {
              path: child.path,
              name: child.name,
              extension: child.name.includes(".")
                ? child.name.split(".").pop() || ""
                : "",
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
        isDirectory: true,
      };
    };

    const root = buildDirectoryInfo(rootNode, 0);

    // Build allFiles and allDirectories arrays
    const allFileInfos = allPaths.map((p) => ({
      path: p,
      name: p.split("/").pop() || p,
      extension: p.includes(".") ? p.split(".").pop() || "" : "",
      size: 0,
      lastModified: now,
      isDirectory: false,
      relativePath: p,
    }));

    const allDirInfos = Array.from(directories.values()).map((d) => ({
      path: d.path,
      name: d.name,
      children: [],
      fileCount: 0,
      totalSize: 0,
      depth: d.path.split("/").filter((p) => p).length,
      relativePath: d.path,
      isDirectory: true,
    }));

    return {
      sha: "local-" + Date.now(),
      root,
      allFiles: allFileInfos,
      allDirectories: allDirInfos,
      stats: {
        totalFiles: allPaths.length,
        totalDirectories: directories.size,
        totalSize: 0,
        maxDepth: Math.max(...allDirInfos.map((d) => d.depth), 0),
      },
      metadata: {
        id: `${repoOwner}/${repoName}`,
        timestamp: now,
        sourceType: "github-repository",
        sourceInfo: {
          owner: repoOwner,
          repo: repoName,
          branch: branch || "main",
        },
      },
    };
  }, [fileTree, repoOwner, repoName, branch]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: theme.space[3],
        minHeight: 0,
      }}
    >
      {error && (
        <div
          style={{
            padding: theme.space[3],
            backgroundColor: `${theme.colors.error}15`,
            border: `1px solid ${theme.colors.error}`,
            borderRadius: theme.radii[2],
            color: theme.colors.error,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gridTemplateRows: "minmax(0, 1fr)",
          gap: theme.space[3],
          minHeight: 0,
          maxHeight: "100%",
        }}
      >
        {/* File Tree */}
        <div
          style={{
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii[2],
            backgroundColor: theme.colors.backgroundSecondary,
            padding: theme.space[3],
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            maxHeight: "100%",
          }}
        >
          {/* Repository info header */}
          <div style={{ marginBottom: theme.space[3] }}>
            {onBack && (
              <button
                onClick={onBack}
                style={{
                  padding: `${theme.space[1]} ${theme.space[2]}`,
                  backgroundColor: theme.colors.background,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radii[2],
                  color: theme.colors.text,
                  cursor: "pointer",
                  fontSize: theme.fontSizes[1],
                  marginBottom: theme.space[2],
                  display: "block",
                }}
              >
                ← Back
              </button>
            )}
            <div
              style={{
                fontSize: theme.fontSizes[2],
                fontWeight: theme.fontWeights.semibold,
                fontFamily: theme.fonts?.monospace || "monospace",
                marginBottom: theme.space[1],
              }}
            >
              {repoOwner}/{repoName}
            </div>
            <div
              style={{
                fontSize: theme.fontSizes[0],
                color: theme.colors.textSecondary,
              }}
            >
              Branch: {branch || "main"}
            </div>
            <div
              style={{
                marginTop: theme.space[2],
                display: "flex",
                alignItems: "center",
                gap: theme.space[2],
              }}
            >
              <span
                style={{
                  fontSize: theme.fontSizes[1],
                  color: theme.colors.textSecondary,
                }}
              >
                View:
              </span>
              <div style={{ display: "flex", gap: theme.space[1] }}>
                <button
                  type="button"
                  onClick={() => setViewMode("ordered")}
                  style={{
                    padding: `${theme.space[1]} ${theme.space[2]}`,
                    border: `1px solid ${
                      viewMode === "ordered"
                        ? theme.colors.primary || theme.colors.text
                        : theme.colors.border
                    }`,
                    borderRadius: theme.radii[2],
                    backgroundColor:
                      viewMode === "ordered"
                        ? `${theme.colors.primary || theme.colors.text}15`
                        : theme.colors.background,
                    color: theme.colors.text,
                    cursor: "pointer",
                    fontSize: theme.fontSizes[1],
                  }}
                >
                  Ordered
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("dynamic")}
                  style={{
                    padding: `${theme.space[1]} ${theme.space[2]}`,
                    border: `1px solid ${
                      viewMode === "dynamic"
                        ? theme.colors.primary || theme.colors.text
                        : theme.colors.border
                    }`,
                    borderRadius: theme.radii[2],
                    backgroundColor:
                      viewMode === "dynamic"
                        ? `${theme.colors.primary || theme.colors.text}15`
                        : theme.colors.background,
                    color: theme.colors.text,
                    cursor: "pointer",
                    fontSize: theme.fontSizes[1],
                  }}
                >
                  Dynamic
                </button>
              </div>
            </div>
          </div>
          {isLoadingTree ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: theme.space[4],
                color: theme.colors.textSecondary,
              }}
            >
              Loading files...
            </div>
          ) : fileTreeData ? (
            <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
              {viewMode === "ordered" ? (
                <OrderedFileList
                  fileTree={fileTreeData}
                  theme={theme as any}
                  onFileSelect={(filePath) => loadFileContent(filePath)}
                  selectedFile={selectedFile || undefined}
                  padding="12px"
                />
              ) : (
                <DynamicFileTree
                  fileTree={fileTreeData}
                  theme={theme}
                  onFileSelect={(filePath) => loadFileContent(filePath)}
                  padding="12px"
                />
              )}
            </div>
          ) : (
            <div
              style={{
                color: theme.colors.textSecondary,
                fontSize: theme.fontSizes[1],
                textAlign: "center",
                padding: theme.space[4],
              }}
            >
              No markdown files found
            </div>
          )}
        </div>

        {/* Editor */}
        <div
          style={{
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii[2],
            backgroundColor: theme.colors.background,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            maxHeight: "100%",
          }}
        >
          {selectedFile ? (
            isLoadingFile ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  color: theme.colors.textSecondary,
                }}
              >
                Loading file...
              </div>
            ) : (
              <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
                <EditorWithPlugins
                  fileContent={fileContent}
                  selectedFile={selectedFile}
                  handleSaveFile={handleSaveFile}
                  theme={theme}
                />
              </div>
            )
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                color: theme.colors.textSecondary,
                fontSize: theme.fontSizes[2],
              }}
            >
              Select a markdown file to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
