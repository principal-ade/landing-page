# GitHub Package Service Usage Guide

## Overview

The GitHub Package Service provides a comprehensive solution for discovering and analyzing npm packages (and other package managers) in GitHub repositories. It uses the `@principal-ai/codebase-composition` library with a custom GitHub API adapter.

## Architecture

```
GitHubService (GitHub API client)
    ↓
GitHubFileSystemAdapter (implements FileSystemAdapter interface)
    ↓
PackageLayerModule (from @principal-ai/codebase-composition)
    ↓
GitHubPackageService (high-level package discovery)
```

## Components

### 1. GitHubFileSystemAdapter

**Location**: `src/adapters/GitHubFileSystemAdapter.ts`

Implements the `FileSystemAdapter` interface required by `PackageLayerModule`. It translates GitHub API calls into filesystem-like operations.

**Key Methods**:
- `readFile(path)` - Reads file content from GitHub
- `fileExists(path)` - Checks if a file exists
- `isDirectory(path)` - Checks if a path is a directory
- `buildFilteredFileTree()` - Returns all files in the repository

### 2. GitHubPackageService

**Location**: `src/services/githubPackageService.ts`

High-level service for package discovery and analysis.

**Key Methods**:

#### `discoverPackages(owner, repo, ref?)`
Discovers all packages in a repository.

**Returns**:
```typescript
{
  owner: string;
  repo: string;
  ref: string;
  packages: PackageInfo[];
  isMonorepo: boolean;
  totalPackages: number;
  packageManager?: "npm" | "yarn" | "pnpm" | "bun";
}
```

#### `getPackageSummary(owner, repo, ref?)`
Gets a quick summary of packages.

**Returns**:
```typescript
{
  hasPackages: boolean;
  packageCount: number;
  isMonorepo: boolean;
  packageManager?: string;
  rootPackage?: PackageInfo;
}
```

#### `getAllDependencies(owner, repo, ref?)`
Gets all dependencies across all packages.

**Returns**:
```typescript
{
  dependencies: Map<string, Set<string>>;
  devDependencies: Map<string, Set<string>>;
  peerDependencies: Map<string, Set<string>>;
  totalUniqueDependencies: number;
}
```

#### `findVersionConflicts(owner, repo, ref?)`
Finds version conflicts in monorepos.

**Returns**:
```typescript
Array<{
  packageName: string;
  versions: string[];
  usedBy: string[];
}>
```

## API Endpoints

### GET /api/packages

**Query Parameters**:
- `owner` (required) - Repository owner
- `repo` (required) - Repository name
- `ref` (optional) - Git reference (branch, tag, or commit SHA). Defaults to "HEAD"
- `action` (optional) - Action to perform: `discover`, `summary`, `dependencies`, `conflicts`

**Examples**:

```bash
# Discover all packages
curl "http://localhost:3000/api/packages?owner=facebook&repo=react&action=discover"

# Get package summary
curl "http://localhost:3000/api/packages?owner=facebook&repo=react&action=summary"

# Get all dependencies
curl "http://localhost:3000/api/packages?owner=facebook&repo=react&action=dependencies"

# Find version conflicts
curl "http://localhost:3000/api/packages?owner=vercel&repo=next.js&action=conflicts"
```

## Usage Examples

### React Component

```tsx
"use client";

import { useState } from "react";

interface PackageInfo {
  name: string;
  version: string;
  path: string;
  dependencies?: Record<string, string>;
}

export function DependencyPortfolio({ owner, repo }: { owner: string; repo: string }) {
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/packages?owner=${owner}&repo=${repo}&action=discover`
      );
      const data = await response.json();
      setPackages(data.packages);
    } catch (error) {
      console.error("Failed to load packages:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={loadPackages} disabled={loading}>
        {loading ? "Loading..." : "Load Packages"}
      </button>

      {packages.length > 0 && (
        <div>
          <h2>Found {packages.length} package(s)</h2>
          <ul>
            {packages.map((pkg) => (
              <li key={pkg.path}>
                <strong>{pkg.name}</strong> v{pkg.version}
                <br />
                <small>{pkg.path}</small>
                {pkg.dependencies && (
                  <div>
                    Dependencies: {Object.keys(pkg.dependencies).length}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Server-Side Usage

```typescript
import { GitHubService } from "@/services/githubService";
import { GitHubPackageService } from "@/services/githubPackageService";

export async function getServerSideProps() {
  const githubService = new GitHubService(process.env.GITHUB_TOKEN);
  const packageService = new GitHubPackageService(githubService);

  const packages = await packageService.discoverPackages(
    "facebook",
    "react",
    "main"
  );

  return {
    props: {
      packages: packages.packages,
      isMonorepo: packages.isMonorepo,
    },
  };
}
```

### Direct Service Usage

```typescript
import { GitHubService } from "./services/githubService";
import { GitHubPackageService } from "./services/githubPackageService";

async function analyzeRepository(owner: string, repo: string) {
  const githubService = new GitHubService(process.env.GITHUB_TOKEN);
  const packageService = new GitHubPackageService(githubService);

  // Get package summary
  const summary = await packageService.getPackageSummary(owner, repo);
  console.log(`Packages found: ${summary.packageCount}`);
  console.log(`Monorepo: ${summary.isMonorepo}`);
  console.log(`Package manager: ${summary.packageManager}`);

  // Find version conflicts
  if (summary.isMonorepo) {
    const conflicts = await packageService.findVersionConflicts(owner, repo);
    if (conflicts.length > 0) {
      console.log("Version conflicts found:");
      conflicts.forEach((conflict) => {
        console.log(`  ${conflict.packageName}: ${conflict.versions.join(", ")}`);
      });
    }
  }

  // Get all dependencies
  const deps = await packageService.getAllDependencies(owner, repo);
  console.log(`Total unique dependencies: ${deps.totalUniqueDependencies}`);
}

analyzeRepository("vercel", "next.js");
```

## Supported Package Managers

The `@principal-ai/codebase-composition` library supports multiple package managers:

- **npm** - `package.json`
- **Python** - `pyproject.toml`, `requirements.txt`, `setup.py`
- **Rust** - `Cargo.toml`
- **Go** - `go.mod`
- **Ruby** - `Gemfile`
- **Java/Kotlin** - `pom.xml`, `build.gradle`, `build.gradle.kts`

## Performance Considerations

1. **Caching**: The `GitHubFileSystemAdapter` caches the repository tree to avoid multiple API calls
2. **Rate Limits**: GitHub API has rate limits (5000/hour for authenticated requests)
3. **Large Repos**: For large repositories, the initial tree fetch may take some time

## Error Handling

```typescript
try {
  const packages = await packageService.discoverPackages(owner, repo);
} catch (error) {
  if (error.message.includes("404")) {
    console.error("Repository not found");
  } else if (error.message.includes("403")) {
    console.error("Rate limit exceeded or access denied");
  } else {
    console.error("Unknown error:", error);
  }
}
```

## Environment Variables

```bash
# .env.local
GITHUB_TOKEN=your_github_personal_access_token
```

The token is optional but recommended for higher rate limits (5000/hour vs 60/hour).

## Future Enhancements

- [ ] Support for package vulnerability scanning
- [ ] NPM registry integration for latest version checking
- [ ] Dependency graph visualization
- [ ] Package update recommendations
- [ ] License compatibility analysis
- [ ] Bundle size estimation
