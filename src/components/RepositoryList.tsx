"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@a24z/industry-theme";

interface Repository {
  repoName: string;
  repoOwner: string;
  lastActivity: string | null;
  sessionCount: number;
  isPublic: boolean;
}

interface RepositoryListProps {
  refreshInterval?: number; // in milliseconds
  showOnlyPublic?: boolean; // Filter to show only public repos
  onSelectRepo?: (repo: { owner: string; name: string }) => void; // Callback when repo is selected
  selectedRepo?: { owner: string; name: string } | null; // Currently selected repo
}

export function RepositoryList({ refreshInterval = 30000, showOnlyPublic = false, onSelectRepo, selectedRepo }: RepositoryListProps) {
  const { theme } = useTheme();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepositories = async () => {
    try {
      const response = await fetch('/api/agent-events/repositories');
      const data = await response.json();

      if (response.ok) {
        const repos = data.repositories || [];
        // Filter to show only public repos if requested
        const filteredRepos = showOnlyPublic ? repos.filter((r: Repository) => r.isPublic) : repos;
        setRepositories(filteredRepos);
        setError(null);

        // Auto-select first repo if none selected
        if (onSelectRepo && !selectedRepo && filteredRepos.length > 0) {
          onSelectRepo({ owner: filteredRepos[0].repoOwner, name: filteredRepos[0].repoName });
        }
      } else {
        setError(data.message || 'Failed to fetch repositories');
      }
    } catch (err) {
      setError('Network error fetching repositories');
      console.error('Error fetching repositories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchRepositories();

    // Set up interval for refreshing
    const interval = setInterval(fetchRepositories, refreshInterval);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshInterval, showOnlyPublic]);

  const formatTimeAgo = (timestamp: string | null): string => {
    if (!timestamp) return 'Unknown';

    const now = Date.now();
    const then = new Date(timestamp).getTime();
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: theme.colors.backgroundSecondary,
          borderRadius: theme.radii[2],
          padding: theme.space[4],
          border: `1px solid ${theme.colors.border}`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: theme.fontSizes[1],
            color: theme.colors.textSecondary,
          }}
        >
          Loading repositories...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          backgroundColor: theme.colors.backgroundSecondary,
          borderRadius: theme.radii[2],
          padding: theme.space[4],
          border: `1px solid ${theme.colors.error}`,
        }}
      >
        <div
          style={{
            fontSize: theme.fontSizes[1],
            color: theme.colors.error,
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  if (repositories.length === 0) {
    return (
      <div
        style={{
          backgroundColor: theme.colors.backgroundSecondary,
          borderRadius: theme.radii[2],
          padding: theme.space[4],
          border: `1px solid ${theme.colors.border}`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: theme.fontSizes[1],
            color: theme.colors.textSecondary,
          }}
        >
          No repositories found
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.radii[2],
        border: `1px solid ${theme.colors.border}`,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: theme.space[4],
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3
          style={{
            fontSize: theme.fontSizes[2],
            fontWeight: theme.fontWeights.heading,
            margin: 0,
            color: theme.colors.text,
          }}
        >
          {showOnlyPublic ? 'Public Repositories' : 'Active Repositories'}
        </h3>
        <div
          style={{
            fontSize: theme.fontSizes[0],
            color: theme.colors.textMuted,
          }}
        >
          {repositories.length} {repositories.length === 1 ? 'repo' : 'repos'}
        </div>
      </div>

      {/* Repository List */}
      <div
        style={{
          maxHeight: '500px',
          overflowY: 'auto',
        }}
      >
        {repositories.map((repo, index) => {
          const isSelected = selectedRepo?.owner === repo.repoOwner && selectedRepo?.name === repo.repoName;
          return (
          <div
            key={`${repo.repoOwner}/${repo.repoName}-${index}`}
            onClick={() => onSelectRepo?.({ owner: repo.repoOwner, name: repo.repoName })}
            style={{
              padding: theme.space[3],
              borderBottom: index < repositories.length - 1 ? `1px solid ${theme.colors.border}` : 'none',
              transition: 'background-color 0.2s ease, border-left 0.2s ease',
              cursor: 'pointer',
              backgroundColor: isSelected ? theme.colors.background : 'transparent',
              borderLeft: isSelected ? `3px solid ${theme.colors.primary}` : '3px solid transparent',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = theme.colors.background;
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: theme.space[2],
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: theme.fontSizes[1],
                    fontWeight: theme.fontWeights.semibold,
                    color: theme.colors.primary,
                    marginBottom: theme.space[1],
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {repo.repoOwner}/{repo.repoName}
                </div>
                <div
                  style={{
                    fontSize: theme.fontSizes[0],
                    color: theme.colors.textSecondary,
                    display: 'flex',
                    gap: theme.space[3],
                  }}
                >
                  <span>
                    {repo.sessionCount} {repo.sessionCount === 1 ? 'session' : 'sessions'}
                  </span>
                  <span>•</span>
                  <span>{formatTimeAgo(repo.lastActivity)}</span>
                </div>
              </div>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}
