"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useTheme } from "@a24z/industry-theme";
import { GitStatusFileTree, GitOrderedFileList, type GitFileStatus } from "@a24z/dynamic-file-tree";
import { FileTree } from "@principal-ai/repository-abstraction";
import { ThemedMDXEditor, useThemedMDXEditor } from "@principal-ade/industry-themed-mdx-editor";
import { GitManager } from "@/lib/git-manager";
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
}) => {
  const { theme } = useTheme();
  const [gitManager, setGitManager] = useState<GitManager | null>(null);
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [dirtyFiles, setDirtyFiles] = useState<GitFileStatus[]>([]);
  const [isLoadingTree, setIsLoadingTree] = useState<boolean>(true);
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"ordered" | "dynamic">("ordered");
  const [showCommitDialog, setShowCommitDialog] = useState<boolean>(false);

  // Initialize GitManager and load file tree
  const initializeGitManager = useCallback(async () => {
    setIsLoadingTree(true);
    setError(null);

    try {
      // Create GitManager instance
      const manager = new GitManager({
        owner: repoOwner,
        repo: repoName,
        branch: branch || "main",
        token: githubToken,
      });

      // Initialize (clone or fetch)
      await manager.initialize();
      setGitManager(manager);

      // List markdown files
      const files = await manager.listMarkdownFiles();

      // Convert flat list to FileNode tree structure
      const fileNodes = buildFileTree(files);
      setFileTree(fileNodes);

      // Load dirty state
      const dirty = await manager.getDirtyFiles();
      setDirtyFiles(dirty);
    } catch (err) {
      console.error("Failed to initialize git repository:", err);
      setError(err instanceof Error ? err.message : "Failed to initialize git repository");
      setFileTree([]);
    } finally {
      setIsLoadingTree(false);
    }
  }, [repoOwner, repoName, branch, githubToken]);

  // Helper to build file tree from flat list
  const buildFileTree = (files: string[]): FileNode[] => {
    const root: FileNode = {
      name: "",
      path: "",
      type: "directory",
      children: [],
    };

    for (const filePath of files) {
      const parts = filePath.split("/");
      let current = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isFile = i === parts.length - 1;
        const currentPath = parts.slice(0, i + 1).join("/");

        let child = current.children?.find((c) => c.name === part);

        if (!child) {
          child = {
            name: part,
            path: currentPath,
            type: isFile ? "file" : "directory",
            children: isFile ? undefined : [],
          };
          current.children = current.children || [];
          current.children.push(child);
        }

        current = child;
      }
    }

    return root.children || [];
  };

  const loadFileContent = useCallback(
    async (filePath: string) => {
      if (!gitManager) return;

      setIsLoadingFile(true);
      setError(null);

      try {
        const content = await gitManager.readFile(filePath);
        setFileContent(content);
        setSelectedFile(filePath);
      } catch (err) {
        console.error("Failed to load file content:", err);
        setError(err instanceof Error ? err.message : "Failed to load file content");
      } finally {
        setIsLoadingFile(false);
      }
    },
    [gitManager]
  );

  // Save file to local git filesystem (NOT GitHub yet)
  const handleSaveFile = useCallback(
    async (content: string) => {
      if (!selectedFile || !gitManager) return;

      try {
        // Write to local git filesystem
        await gitManager.writeFile(selectedFile, content);

        // Update dirty state
        const dirty = await gitManager.getDirtyFiles();
        setDirtyFiles(dirty);

        console.log("Saved to local git:", selectedFile);
      } catch (err) {
        console.error("Failed to save file:", err);
        setError(err instanceof Error ? err.message : "Failed to save file");
        throw err;
      }
    },
    [selectedFile, gitManager]
  );

  // Commit and push changes to GitHub
  const handleCommit = useCallback(
    async (commitMessage: string) => {
      if (!gitManager) return;

      if (!githubToken) {
        setError("GitHub token is required to push changes. Please provide a token with repo write access.");
        throw new Error("GitHub token required");
      }

      try {
        // Author info will be fetched automatically from GitHub
        await gitManager.commitAndPush({
          message: commitMessage,
        });

        // Clear dirty state after successful push
        setDirtyFiles([]);
        setShowCommitDialog(false);

        console.log("Successfully committed and pushed to GitHub");
      } catch (err) {
        console.error("Failed to commit and push:", err);
        setError(err instanceof Error ? err.message : "Failed to commit and push");
        throw err;
      }
    },
    [gitManager, githubToken]
  );

  // Initialize GitManager on mount
  React.useEffect(() => {
    initializeGitManager();
  }, [initializeGitManager]);

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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: theme.fontSizes[2],
                fontWeight: theme.fontWeights.semibold,
                fontFamily: theme.fonts?.monospace || "monospace",
              }}
            >
              <span>{repoName}</span>
              <span
                style={{
                  fontSize: theme.fontSizes[0],
                  color: theme.colors.textSecondary,
                }}
              >
                {branch || "main"}
              </span>
            </div>
            <div
              style={{
                fontSize: theme.fontSizes[1],
                color: theme.colors.textSecondary,
                marginBottom: theme.space[2],
              }}
            >
              {repoOwner}
            </div>

            {/* Dirty files count and commit button */}
            {dirtyFiles.length > 0 && (
              <div style={{ marginBottom: theme.space[2] }}>
                <div
                  style={{
                    fontSize: theme.fontSizes[1],
                    color: theme.colors.textSecondary,
                    marginBottom: theme.space[1],
                  }}
                >
                  {dirtyFiles.length} file{dirtyFiles.length !== 1 ? "s" : ""} modified
                </div>
                <button
                  type="button"
                  onClick={() => setShowCommitDialog(true)}
                  style={{
                    width: "100%",
                    padding: `${theme.space[2]} ${theme.space[3]}`,
                    backgroundColor: theme.colors.primary || theme.colors.text,
                    color: theme.colors.background,
                    border: "none",
                    borderRadius: theme.radii[2],
                    cursor: "pointer",
                    fontSize: theme.fontSizes[1],
                    fontWeight: theme.fontWeights.semibold,
                  }}
                >
                  Commit {dirtyFiles.length} file{dirtyFiles.length !== 1 ? "s" : ""}
                </button>
              </div>
            )}
            <div
              style={{
                marginTop: theme.space[2],
                display: "flex",
                gap: theme.space[1],
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode("ordered")}
                style={{
                  flex: 1,
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
                List
              </button>
              <button
                type="button"
                onClick={() => setViewMode("dynamic")}
                style={{
                  flex: 1,
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
                Folder
              </button>
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
            <div style={{ flex: 1, minHeight: 0, width: "100%" }}>
              {viewMode === "ordered" ? (
                <GitOrderedFileList
                  fileTree={fileTreeData}
                  theme={theme as any}
                  gitStatusData={dirtyFiles}
                  onFileSelect={(filePath) => loadFileContent(filePath)}
                  selectedFile={selectedFile || undefined}
                  padding="12px"
                />
              ) : (
                <GitStatusFileTree
                  fileTree={fileTreeData}
                  theme={theme}
                  gitStatusData={dirtyFiles}
                  onFileSelect={(filePath) => loadFileContent(filePath)}
                  showUnchangedFiles={true}
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

      {/* Commit Dialog */}
      {showCommitDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowCommitDialog(false)}
        >
          <div
            style={{
              backgroundColor: theme.colors.background,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii[3],
              padding: theme.space[4],
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: theme.space[3],
                fontSize: theme.fontSizes[4],
                fontWeight: theme.fontWeights.bold,
              }}
            >
              Commit Changes
            </h2>

            {/* Changed files list */}
            <div style={{ marginBottom: theme.space[3] }}>
              <div
                style={{
                  fontSize: theme.fontSizes[1],
                  color: theme.colors.textSecondary,
                  marginBottom: theme.space[2],
                }}
              >
                Files to commit:
              </div>
              <div
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radii[2],
                  padding: theme.space[2],
                  maxHeight: "200px",
                  overflow: "auto",
                }}
              >
                {dirtyFiles.map((file) => (
                  <div
                    key={file.filePath}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: theme.space[2],
                      padding: `${theme.space[1]} 0`,
                      fontSize: theme.fontSizes[1],
                      fontFamily: theme.fonts?.monospace || "monospace",
                    }}
                  >
                    <span
                      style={{
                        color:
                          file.status === "M"
                            ? "#f59e0b"
                            : file.status === "A"
                            ? "#10b981"
                            : "#ef4444",
                        fontWeight: theme.fontWeights.bold,
                      }}
                    >
                      {file.status}
                    </span>
                    <span>{file.filePath}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Commit form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const message = formData.get("message") as string;

                if (!message) {
                  alert("Please enter a commit message");
                  return;
                }

                try {
                  await handleCommit(message);
                } catch {
                  // Error is already handled in handleCommit
                }
              }}
            >
              <div style={{ marginBottom: theme.space[4] }}>
                <label
                  htmlFor="commit-message"
                  style={{
                    display: "block",
                    marginBottom: theme.space[1],
                    fontSize: theme.fontSizes[1],
                    fontWeight: theme.fontWeights.semibold,
                  }}
                >
                  Commit Message
                </label>
                <textarea
                  id="commit-message"
                  name="message"
                  required
                  placeholder="Update documentation"
                  autoFocus
                  style={{
                    width: "100%",
                    padding: theme.space[2],
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radii[2],
                    backgroundColor: theme.colors.backgroundSecondary,
                    color: theme.colors.text,
                    fontSize: theme.fontSizes[2],
                    fontFamily: "inherit",
                    resize: "vertical",
                    minHeight: "100px",
                  }}
                />
                <div
                  style={{
                    marginTop: theme.space[1],
                    fontSize: theme.fontSizes[0],
                    color: theme.colors.textSecondary,
                  }}
                >
                  Author info will be automatically fetched from your GitHub account
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: theme.space[2],
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowCommitDialog(false)}
                  style={{
                    padding: `${theme.space[2]} ${theme.space[3]}`,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radii[2],
                    backgroundColor: theme.colors.background,
                    color: theme.colors.text,
                    cursor: "pointer",
                    fontSize: theme.fontSizes[2],
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: `${theme.space[2]} ${theme.space[3]}`,
                    border: "none",
                    borderRadius: theme.radii[2],
                    backgroundColor: theme.colors.primary || theme.colors.text,
                    color: theme.colors.background,
                    cursor: "pointer",
                    fontSize: theme.fontSizes[2],
                    fontWeight: theme.fontWeights.semibold,
                  }}
                >
                  Commit & Push to GitHub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
