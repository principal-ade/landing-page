import { NextRequest } from 'next/server';

jest.mock('@a24z/observability-sdk', () => ({
  TursoObservabilitySDK: {
    createCloud: jest.fn(),
  },
}));

jest.mock('@octokit/rest', () => {
  return {
    Octokit: jest.fn(),
  };
});

jest.mock('@/lib/repo-visibility-cache', () => ({
  repoVisibilityCache: {
    get: jest.fn(),
    set: jest.fn(),
    has: jest.fn(),
    clear: jest.fn(),
    cleanup: jest.fn(),
    stats: jest.fn(),
  },
}));

const { TursoObservabilitySDK } = require('@a24z/observability-sdk');
const { Octokit } = require('@octokit/rest');

describe('agent-events routes public access fallback', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.TURSO_DATABASE_URL = 'https://example-db';
    process.env.TURSO_AUTH_TOKEN = 'test-token';
    process.env.GITHUB_TOKEN = 'server-token';
  });

  it('returns repositories when fallback access succeeds after credential error', async () => {
    const execute = jest.fn().mockResolvedValue({
      rows: [
        {
          repoName: 'demo-repo',
          repoOwner: 'acme',
          lastActivity: 1700000000,
          sessionCount: 3,
        },
      ],
    });
    const close = jest.fn().mockResolvedValue(undefined);
    (TursoObservabilitySDK.createCloud as jest.Mock).mockReturnValueOnce({ execute, close });

    const primaryGet = jest.fn().mockRejectedValueOnce({ status: 401, message: 'Bad credentials' });
    const fallbackGet = jest.fn().mockResolvedValue({});
    (Octokit as jest.Mock)
      .mockImplementationOnce(() => ({ repos: { get: primaryGet } }))
      .mockImplementationOnce(() => ({ repos: { get: fallbackGet } }));

    const { GET } = await import('@/app/api/agent-events/repositories-by-activity/route');

    const request = new Request('http://localhost/api/agent-events/repositories-by-activity', {
      headers: {
        authorization: 'Bearer bad-token',
      },
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.repositories).toHaveLength(1);
    expect(body.repositories[0]).toMatchObject({ repoName: 'demo-repo', repoOwner: 'acme' });
    expect(primaryGet).toHaveBeenCalledWith({ owner: 'acme', repo: 'demo-repo' });
    expect(fallbackGet).toHaveBeenCalledWith({ owner: 'acme', repo: 'demo-repo' });
    expect(close).toHaveBeenCalled();
  });

  it('returns timeline events when fallback access succeeds after credential error', async () => {
    const execute = jest.fn().mockResolvedValue({
      rows: [
        {
          timestamp: 1700000000,
          event_type: 'agent',
          tool_name: 'test-tool',
          session_id: 'session-123',
          repo_name: 'demo-repo',
          repo_owner: 'acme',
        },
      ],
    });
    const close = jest.fn().mockResolvedValue(undefined);
    (TursoObservabilitySDK.createCloud as jest.Mock).mockReturnValueOnce({ execute, close });

    const primaryGet = jest.fn().mockRejectedValueOnce({ status: 403, message: 'Requires authentication' });
    const fallbackGet = jest.fn().mockResolvedValue({});
    (Octokit as jest.Mock)
      .mockImplementationOnce(() => ({ repos: { get: primaryGet } }))
      .mockImplementationOnce(() => ({ repos: { get: fallbackGet } }));

    const { GET } = await import('@/app/api/agent-events/timeline/route');

    const request = new NextRequest('http://localhost/api/agent-events/timeline?hours=24', {
      headers: new Headers({
        authorization: 'Bearer bad-token',
      }),
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.events).toHaveLength(1);
    expect(body.events[0]).toMatchObject({ repoName: 'demo-repo', repoOwner: 'acme' });
    expect(primaryGet).toHaveBeenCalledWith({ owner: 'acme', repo: 'demo-repo' });
    expect(fallbackGet).toHaveBeenCalledWith({ owner: 'acme', repo: 'demo-repo' });
    expect(close).toHaveBeenCalled();
  });
});
