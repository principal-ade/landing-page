import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  sha?: string;
  children?: FileNode[];
}

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url?: string;
}

async function buildFileTreeFromGitHub(
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string = "main"
): Promise<FileNode[]> {
  try {
    // Get the latest commit SHA for the branch
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    const commitSha = refData.object.sha;

    // Get the tree for this commit (recursive to get all files)
    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: commitSha,
      recursive: "true",
    });

    // Filter only markdown files
    const mdFiles = treeData.tree.filter(
      (item: GitHubTreeItem) =>
        item.type === "blob" && item.path.endsWith(".md")
    );

    // Build a tree structure
    const root: Map<string, FileNode> = new Map();
    const allNodes: Map<string, FileNode> = new Map();

    // Create directory nodes for all paths
    mdFiles.forEach((item: GitHubTreeItem) => {
      const parts = item.path.split("/");
      let currentPath = "";

      // Create all parent directories
      for (let i = 0; i < parts.length - 1; i++) {
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];

        if (!allNodes.has(currentPath)) {
          const dirNode: FileNode = {
            name: parts[i],
            path: currentPath,
            type: "directory",
            children: [],
          };
          allNodes.set(currentPath, dirNode);

          if (parentPath === "") {
            root.set(currentPath, dirNode);
          } else {
            const parent = allNodes.get(parentPath);
            if (parent && parent.children) {
              parent.children.push(dirNode);
            }
          }
        }
      }

      // Add the file
      const fileName = parts[parts.length - 1];
      const fileNode: FileNode = {
        name: fileName,
        path: item.path,
        type: "file",
        sha: item.sha,
      };

      const parentPath = parts.slice(0, -1).join("/");
      if (parentPath === "") {
        root.set(item.path, fileNode);
      } else {
        const parent = allNodes.get(parentPath);
        if (parent && parent.children) {
          parent.children.push(fileNode);
        }
      }
    });

    // Sort children in each directory
    const sortNodes = (nodes: FileNode[]) => {
      nodes.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "directory" ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

      nodes.forEach((node) => {
        if (node.children) {
          sortNodes(node.children);
        }
      });
    };

    const rootArray = Array.from(root.values());
    sortNodes(rootArray);

    return rootArray;
  } catch (error) {
    console.error("Error fetching from GitHub:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { owner, repo, branch = "main", token } = body;

    if (!owner || typeof owner !== "string") {
      return NextResponse.json(
        { error: "Repository owner is required" },
        { status: 400 }
      );
    }

    if (!repo || typeof repo !== "string") {
      return NextResponse.json(
        { error: "Repository name is required" },
        { status: 400 }
      );
    }

    // Create Octokit instance with token if provided
    const octokit = new Octokit({
      auth: token || process.env.GITHUB_TOKEN,
    });

    // Build the file tree from GitHub
    const files = await buildFileTreeFromGitHub(octokit, owner, repo, branch);

    return NextResponse.json({ files, owner, repo, branch });
  } catch (error: any) {
    console.error("Error loading file tree from GitHub:", error);

    if (error.status === 404) {
      return NextResponse.json(
        { error: "Repository not found or branch does not exist" },
        { status: 404 }
      );
    }

    if (error.status === 403 || error.status === 401) {
      return NextResponse.json(
        { error: "Access denied. Check your GitHub token or repository permissions" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to load file tree from GitHub" },
      { status: 500 }
    );
  }
}
