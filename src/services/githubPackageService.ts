/**
 * GitHub Package Discovery Service
 * Uses GitHubFileSystemAdapter and PackageLayerModule to discover packages
 * in GitHub repositories
 */

import { PackageLayerModule } from "@principal-ai/codebase-composition";
import { GitHubService } from "./githubService";
import { GitHubFileSystemAdapter } from "../adapters/GitHubFileSystemAdapter";

export interface PackageInfo {
  name: string;
  version: string;
  path: string;
  description?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export interface RepositoryPackages {
  owner: string;
  repo: string;
  ref: string;
  packages: PackageInfo[];
  isMonorepo: boolean;
  totalPackages: number;
  packageManager?: "npm" | "yarn" | "pnpm" | "bun";
}

/**
 * GitHubPackageService
 * Discovers and analyzes packages in GitHub repositories
 */
export class GitHubPackageService {
  private packageModule: PackageLayerModule;

  constructor(private githubService: GitHubService) {
    this.packageModule = new PackageLayerModule();
  }

  /**
   * Discover all packages in a GitHub repository
   */
  async discoverPackages(
    owner: string,
    repo: string,
    ref: string = "HEAD",
  ): Promise<RepositoryPackages> {
    try {
      // Create adapter for this repository
      const adapter = new GitHubFileSystemAdapter(
        this.githubService,
        owner,
        repo,
        ref,
      );

      // Fetch the file tree
      const fileTree = await this.githubService.fetchFileSystemTree(
        owner,
        repo,
        ref,
      );

      // Create a file reader function that uses the adapter
      const fileReader = async (path: string): Promise<string> => {
        const result = await adapter.readFile(path);
        if (!result) {
          throw new Error(`File not found: ${path}`);
        }
        return result.content;
      };

      // Discover packages using the PackageLayerModule
      const packageLayers = await this.packageModule.discoverPackages(
        fileTree,
        fileReader,
      );

      // Transform to our interface
      const packages: PackageInfo[] = packageLayers.map((layer: any) => ({
        name: layer.packageData.name,
        version: layer.packageData.version || "unknown",
        path: layer.packageData.path,
        description: undefined, // Not available in PackageLayer
        dependencies: layer.packageData.dependencies || {},
        devDependencies: layer.packageData.devDependencies || {},
        peerDependencies: layer.packageData.peerDependencies || {},
      }));

      // Detect if it's a monorepo
      const isMonorepo = packages.length > 1;

      // Detect package manager
      const packageManager = await this.detectPackageManager(
        adapter,
        packages,
      );

      return {
        owner,
        repo,
        ref,
        packages,
        isMonorepo,
        totalPackages: packages.length,
        packageManager,
      };
    } catch (error) {
      console.error(
        `Error discovering packages for ${owner}/${repo}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get package summary for a repository
   */
  async getPackageSummary(
    owner: string,
    repo: string,
    ref: string = "HEAD",
  ): Promise<{
    hasPackages: boolean;
    packageCount: number;
    isMonorepo: boolean;
    packageManager?: string;
    rootPackage?: PackageInfo;
  }> {
    try {
      const result = await this.discoverPackages(owner, repo, ref);

      return {
        hasPackages: result.packages.length > 0,
        packageCount: result.packages.length,
        isMonorepo: result.isMonorepo,
        packageManager: result.packageManager,
        rootPackage: result.packages.find((p) => p.path === "package.json"),
      };
    } catch (error) {
      console.error(
        `Error getting package summary for ${owner}/${repo}:`,
        error,
      );
      return {
        hasPackages: false,
        packageCount: 0,
        isMonorepo: false,
      };
    }
  }

  /**
   * Get all dependencies across all packages in a repository
   */
  async getAllDependencies(
    owner: string,
    repo: string,
    ref: string = "HEAD",
  ): Promise<{
    dependencies: Map<string, Set<string>>; // package name -> versions used
    devDependencies: Map<string, Set<string>>;
    peerDependencies: Map<string, Set<string>>;
    totalUniqueDependencies: number;
  }> {
    const result = await this.discoverPackages(owner, repo, ref);

    const dependencies = new Map<string, Set<string>>();
    const devDependencies = new Map<string, Set<string>>();
    const peerDependencies = new Map<string, Set<string>>();

    result.packages.forEach((pkg) => {
      // Collect dependencies
      if (pkg.dependencies) {
        Object.entries(pkg.dependencies).forEach(([name, version]) => {
          if (!dependencies.has(name)) {
            dependencies.set(name, new Set());
          }
          dependencies.get(name)!.add(version);
        });
      }

      // Collect devDependencies
      if (pkg.devDependencies) {
        Object.entries(pkg.devDependencies).forEach(([name, version]) => {
          if (!devDependencies.has(name)) {
            devDependencies.set(name, new Set());
          }
          devDependencies.get(name)!.add(version);
        });
      }

      // Collect peerDependencies
      if (pkg.peerDependencies) {
        Object.entries(pkg.peerDependencies).forEach(([name, version]) => {
          if (!peerDependencies.has(name)) {
            peerDependencies.set(name, new Set());
          }
          peerDependencies.get(name)!.add(version);
        });
      }
    });

    return {
      dependencies,
      devDependencies,
      peerDependencies,
      totalUniqueDependencies: dependencies.size,
    };
  }

  /**
   * Detect package manager from lockfiles
   */
  private async detectPackageManager(
    adapter: GitHubFileSystemAdapter,
    _packages: PackageInfo[],
  ): Promise<"npm" | "yarn" | "pnpm" | "bun" | undefined> {
    // Check for lockfiles
    const hasPackageLockJson = await adapter.fileExists("package-lock.json");
    const hasYarnLock = await adapter.fileExists("yarn.lock");
    const hasPnpmLock = await adapter.fileExists("pnpm-lock.yaml");
    const hasBunLock = await adapter.fileExists("bun.lockb");

    if (hasBunLock) return "bun";
    if (hasPnpmLock) return "pnpm";
    if (hasYarnLock) return "yarn";
    if (hasPackageLockJson) return "npm";

    return undefined;
  }

  /**
   * Find version conflicts across packages in a monorepo
   */
  async findVersionConflicts(
    owner: string,
    repo: string,
    ref: string = "HEAD",
  ): Promise<
    Array<{
      packageName: string;
      versions: string[];
      usedBy: string[];
    }>
  > {
    const result = await this.discoverPackages(owner, repo, ref);
    const conflicts: Array<{
      packageName: string;
      versions: string[];
      usedBy: string[];
    }> = [];

    // Track which package uses which version
    const dependencyUsage = new Map<
      string,
      Map<string, Set<string>>
    >(); // pkg name -> version -> Set of package paths using it

    result.packages.forEach((pkg) => {
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
        ...pkg.peerDependencies,
      };

      Object.entries(allDeps).forEach(([depName, version]) => {
        if (!dependencyUsage.has(depName)) {
          dependencyUsage.set(depName, new Map());
        }

        const versionMap = dependencyUsage.get(depName)!;
        if (!versionMap.has(version)) {
          versionMap.set(version, new Set());
        }

        versionMap.get(version)!.add(pkg.name);
      });
    });

    // Find conflicts (multiple versions of same package)
    dependencyUsage.forEach((versionMap, packageName) => {
      if (versionMap.size > 1) {
        const versions = Array.from(versionMap.keys());
        const usedBy: string[] = [];

        versionMap.forEach((users, version) => {
          users.forEach((user) => {
            usedBy.push(`${user} (${version})`);
          });
        });

        conflicts.push({
          packageName,
          versions,
          usedBy,
        });
      }
    });

    return conflicts;
  }
}
