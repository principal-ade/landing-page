# Alexandria API Integration Guide

## Base URL
```
https://git-gallery.com/api/alexandria
```

## Types

**Note**: This API now uses standardized types from the `a24z-memory` package for consistency across the Alexandria ecosystem.

### CodebaseViewSummary
```typescript
// From a24z-memory/dist/pure-core/types/summary
interface CodebaseViewSummary {
  id: string;                    // View identifier
  name: string;                  // Human-readable view name
  description: string;           // View description
  cellCount: number;             // Number of cells in the grid
  gridSize: [number, number];    // [rows, cols] dimensions
  overviewPath: string;          // Path to markdown documentation
  category: string;              // View category
  displayOrder: number;          // Display order
}
```

### GithubRepository
```typescript
// From a24z-memory/dist/pure-core/types/repository
interface GithubRepository {
  id: string;                    // Format: "owner/name"
  owner: string;                 // Repository owner
  name: string;                  // Repository name
  description?: string;          // Repository description
  stars: number;                 // GitHub stars count
  primaryLanguage?: string;      // Primary programming language
  topics?: string[];             // GitHub topics
  license?: string;              // License identifier
  lastCommit?: string;           // ISO timestamp of last commit
  defaultBranch?: string;        // Default branch name
  isPublic?: boolean;            // Whether repository is public
  lastUpdated: string;           // ISO timestamp when GitHub metadata was last updated
}
```

### AlexandriaRepository
```typescript
// From a24z-memory/dist/pure-core/types/repository
interface AlexandriaRepository {
  name: string;                  // Repository/project name
  remoteUrl?: string;            // Git remote URL
  registeredAt: string;          // ISO timestamp when registered
  github?: GithubRepository;     // GitHub metadata (when available)
  hasViews: boolean;             // Has .a24z/views/ directory
  viewCount: number;             // Number of CodebaseView files
  views: CodebaseViewSummary[];  // Summary information about each view
  lastChecked?: string;          // ISO timestamp when metadata was last verified
}
```

## Endpoints

### 1. List Registered Repositories
**GET** `/repos`

Returns all registered repositories with their view summaries.

#### Response
```typescript
// Uses AlexandriaRepositoryRegistry from a24z-memory
{
  repositories: AlexandriaRepository[];
  total: number;
  lastUpdated: string;
}
```

**Note**: The response now uses the standardized `AlexandriaRepository` format. Individual repositories include GitHub metadata in the `github` field when available.

#### Example
```bash
curl https://git-gallery.com/api/alexandria/repos
```

### 2. Get Repository Details
**GET** `/repos/{owner}/{name}`

Returns detailed information about a specific repository.

#### Response
```typescript
// Returns AlexandriaRepository with full GitHub metadata
{
  name: string;
  remoteUrl?: string;
  registeredAt: string;
  github?: {
    id: string;
    owner: string;
    name: string;
    description?: string;
    stars: number;
    primaryLanguage?: string;
    topics?: string[];
    license?: string;
    lastCommit?: string;
    defaultBranch?: string;
    isPublic?: boolean;
    lastUpdated: string;
  };
  hasViews: boolean;
  viewCount: number;
  views: CodebaseViewSummary[];
  lastChecked?: string;
}
```

#### Example
```bash
curl https://git-gallery.com/api/alexandria/repos/anthropics/claude-code
```

### 3. Register Repository
**POST** `/repos`

Register a new repository or update an existing one.

#### Request Body
```typescript
{
  owner: string;           // Required: Repository owner
  name: string;            // Required: Repository name  
  branch?: string;         // Optional: Branch to scan (defaults to default branch)
  isDefaultBranch?: boolean; // Optional: Whether this is the default branch
  updateContext?: string;    // Optional: Context of update ('pull_request' or 'push')
}
```

#### Response (Success - 201/200)
```typescript
{
  success: true;
  repository: {
    id: string;
    owner: string;
    name: string;
    status: "registered" | "updated";
    message: string;
    hasViews: boolean;
    viewCount: number;
    views: CodebaseViewSummary[];
  };
}
```

#### Example
```bash
curl -X POST https://git-gallery.com/api/alexandria/repos \
  -H "Content-Type: application/json" \
  -d '{"owner": "a24z-ai", "name": "a24z-memory"}'
```

## Error Responses

All endpoints return consistent error responses:

```typescript
{
  error: {
    code: string;
    message: string;
  };
}
```

### Error Codes
- `REPOSITORY_NOT_FOUND` (404) - Repository doesn't exist or is private
- `INVALID_REQUEST` (400) - Missing required parameters
- `RATE_LIMITED` (429) - GitHub API rate limit exceeded
- `S3_CONNECTION_ERROR` (503) - Cannot connect to storage
- `GITHUB_API_ERROR` (502) - GitHub API request failed
- `SERVER_ERROR` (500) - Internal server error

## CORS

The API supports CORS for the following origins:
- `https://a24z-ai.github.io`
- `http://localhost:4321`
- `http://localhost:3000`
- All origins (`*`) - currently enabled

## Notes

1. **Public Repositories Only**: The API only accepts public GitHub repositories.

2. **Standardized Types**: The API now uses types from the `a24z-memory` package for consistency across the Alexandria ecosystem:
   - `AlexandriaRepository` for repository metadata
   - `GithubRepository` for GitHub-specific data
   - `CodebaseViewSummary` for view information

3. **View Detection**: The API automatically scans the `.a24z/views/` directory in the repository to detect and summarize codebase views using the centralized extraction logic from `a24z-memory`.

4. **GitHub Metadata**: Repository GitHub metadata is stored in the `github` field within each `AlexandriaRepository` object.

5. **Single JSON Response**: All repository summaries are aggregated into a single JSON response to minimize API calls from the frontend.

6. **Migration**: Existing S3 data will be migrated to the new standardized format automatically.

## Example Integration

```typescript
import type { 
  AlexandriaRepository, 
  AlexandriaRepositoryRegistry 
} from 'a24z-memory/dist/pure-core/types/repository';

// Fetch all repositories
async function getRepositories(): Promise<AlexandriaRepository[]> {
  const response = await fetch('https://git-gallery.com/api/alexandria/repos');
  const data: AlexandriaRepositoryRegistry = await response.json();
  return data.repositories;
}

// Register a new repository
async function registerRepository(owner: string, name: string) {
  const response = await fetch('https://git-gallery.com/api/alexandria/repos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ owner, name }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
  
  return await response.json();
}

// Get repository details
async function getRepositoryDetails(owner: string, name: string): Promise<AlexandriaRepository> {
  const response = await fetch(
    `https://git-gallery.com/api/alexandria/repos/${owner}/${name}`
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }
  
  return await response.json();
}

// Access GitHub metadata from repository
function getGitHubInfo(repo: AlexandriaRepository) {
  if (repo.github) {
    return {
      stars: repo.github.stars,
      description: repo.github.description,
      topics: repo.github.topics || [],
      language: repo.github.primaryLanguage
    };
  }
  return null;
}
```