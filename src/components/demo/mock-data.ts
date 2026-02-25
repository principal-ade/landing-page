import { PathsFileTreeBuilder, FileTree } from '@principal-ai/repository-abstraction';

const builder = new PathsFileTreeBuilder();

/**
 * Mock FileTree representing a backlog.md project structure
 */
export const mockFileTree: FileTree = builder.build({
  files: [
    'backlog/config.yml',
    'backlog/tasks/task-1.md',
    'backlog/tasks/task-2.md',
    'backlog/tasks/task-3.md',
    'backlog/tasks/task-4.md',
    'backlog/tasks/task-5.md',
    'backlog/tasks/task-6.md',
    'backlog/tasks/task-7.md',
    'backlog/tasks/task-8.md',
    'backlog/milestones/v1.0.md',
    'backlog/milestones/v1.1.md',
  ],
  rootPath: '/demo-project'
});

/**
 * Mock file contents for @backlog-md/core to parse
 * Uses backlog.md frontmatter format
 */
export const mockFileContents: Record<string, string> = {
  'backlog/config.yml': `# Backlog.md Configuration
projectName: Demo Project
statuses:
  - To Do
  - In Progress
  - Done
labels:
  - feature
  - bug
  - docs
  - security
  - performance
  - ui
  - testing
  - backend
  - mobile
priorities:
  - low
  - medium
  - high
  - critical
`,

  'backlog/tasks/task-1.md': `---
id: task-1
title: Implement user authentication
status: To Do
priority: high
labels:
  - feature
  - security
created: 2024-01-15
---

## Description

Add OAuth2 login flow with Google and GitHub providers.

### Acceptance Criteria
- [ ] Google OAuth integration
- [ ] GitHub OAuth integration
- [ ] Session management
- [ ] Logout functionality
`,

  'backlog/tasks/task-2.md': `---
id: task-2
title: Fix login redirect bug
status: In Progress
priority: critical
labels:
  - bug
assignee: alice
created: 2024-01-18
---

## Description

Users are being redirected to the wrong page after successful login.

### Steps to Reproduce
1. Log in with valid credentials
2. Observe redirect to /dashboard instead of /home

### Expected Behavior
User should be redirected to the page they were trying to access.
`,

  'backlog/tasks/task-3.md': `---
id: task-3
title: Update API documentation
status: Done
priority: low
labels:
  - docs
assignee: bob
created: 2024-01-10
completed: 2024-01-20
---

## Description

Document the new authentication endpoints in the API reference.

### Endpoints Documented
- POST /auth/login
- POST /auth/logout
- GET /auth/me
- POST /auth/refresh
`,

  'backlog/tasks/task-4.md': `---
id: task-4
title: Add dark mode support
status: To Do
priority: medium
labels:
  - feature
  - ui
created: 2024-01-22
---

## Description

Implement dark mode theme toggle for the application.

### Requirements
- System preference detection
- Manual toggle in settings
- Persist user preference
- Smooth transition animation
`,

  'backlog/tasks/task-5.md': `---
id: task-5
title: Optimize database queries
status: In Progress
priority: high
labels:
  - performance
  - backend
assignee: charlie
created: 2024-01-20
---

## Description

Several database queries are running slowly in production.

### Queries to Optimize
- User list query (currently 2.3s)
- Dashboard stats aggregation (currently 4.1s)
- Search functionality (currently 1.8s)

### Approach
- Add appropriate indexes
- Implement query caching
- Consider denormalization where appropriate
`,

  'backlog/tasks/task-6.md': `---
id: task-6
title: Write unit tests for auth module
status: To Do
priority: medium
labels:
  - testing
  - security
created: 2024-01-23
---

## Description

Increase test coverage for the authentication module.

### Test Cases Needed
- Login success/failure scenarios
- Token refresh flow
- Session expiration handling
- Password validation rules
`,

  'backlog/tasks/task-7.md': `---
id: task-7
title: Implement rate limiting
status: Done
priority: high
labels:
  - security
  - backend
assignee: alice
created: 2024-01-12
completed: 2024-01-19
---

## Description

Add rate limiting to prevent API abuse.

### Implementation Details
- 100 requests per minute per IP
- 1000 requests per hour per user
- Custom limits for specific endpoints
- Redis-backed storage
`,

  'backlog/tasks/task-8.md': `---
id: task-8
title: Mobile responsive design
status: In Progress
priority: medium
labels:
  - ui
  - mobile
assignee: diana
created: 2024-01-21
---

## Description

Ensure all pages work well on mobile devices.

### Pages to Update
- [ ] Homepage
- [ ] Dashboard
- [ ] Settings
- [x] Login/Signup
- [ ] Profile
`,

  'backlog/milestones/v1.0.md': `---
id: v1.0
title: Version 1.0 - MVP Release
status: active
dueDate: 2024-02-15
---

## Goals

Launch the minimum viable product with core features:
- User authentication
- Basic dashboard
- API rate limiting

### Included Tasks
- task-1
- task-2
- task-3
- task-7
`,

  'backlog/milestones/v1.1.md': `---
id: v1.1
title: Version 1.1 - Polish & Performance
status: planned
dueDate: 2024-03-01
---

## Goals

Improve user experience and application performance.

### Included Tasks
- task-4
- task-5
- task-6
- task-8
`,
};

/**
 * Get a file's content by path
 */
export function getFileContent(path: string): string {
  // Normalize path (remove leading slash if present)
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return mockFileContents[normalizedPath] || mockFileContents[path] || '';
}

/**
 * Check if a file exists in mock data
 */
export function fileExists(path: string): boolean {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return normalizedPath in mockFileContents || path in mockFileContents;
}

/**
 * List all file paths
 */
export function listFiles(): string[] {
  return Object.keys(mockFileContents);
}
