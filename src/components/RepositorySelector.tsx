"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "@a24z/industry-theme";
import { Octokit } from "@octokit/rest";
import Image from "next/image";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  default_branch: string;
  private: boolean;
}

interface RepositorySelectorProps {
  githubToken?: string;
  onSelectRepository: (owner: string, repo: string, branch: string) => void;
}

export const RepositorySelector: React.FC<RepositorySelectorProps> = ({
  githubToken,
  onSelectRepository,
}) => {
  const { theme } = useTheme();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  const loadRepositories = useCallback(async () => {
    if (!githubToken) {
      setError("GitHub token is required to view your repositories");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const octokit = new Octokit({ auth: githubToken });

      // Get user's repositories
      const { data } = await octokit.repos.listForAuthenticatedUser({
        per_page: 100,
        sort: "updated",
        direction: "desc",
      });

      setRepositories(data as Repository[]);
    } catch (err: any) {
      console.error("Failed to load repositories:", err);
      if (err.status === 401) {
        setError("Invalid GitHub token. Please check your token.");
      } else {
        setError(err.message || "Failed to load repositories");
      }
    } finally {
      setIsLoading(false);
    }
  }, [githubToken]);

  useEffect(() => {
    loadRepositories();
  }, [loadRepositories]);

  // Filter repositories
  const filteredRepositories = repositories.filter((repo) => {
    const matchesSearch =
      searchQuery === "" ||
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description &&
        repo.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLanguage =
      selectedLanguage === "all" || repo.language === selectedLanguage;

    return matchesSearch && matchesLanguage;
  });

  // Get unique languages
  const languages = Array.from(
    new Set(repositories.map((r) => r.language).filter((l): l is string => Boolean(l)))
  ).sort();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  if (!githubToken) {
    return (
      <div
        style={{
          padding: theme.space[4],
          textAlign: "center",
          color: theme.colors.textSecondary,
        }}
      >
        <p style={{ fontSize: theme.fontSizes[3], marginBottom: theme.space[3] }}>
          Sign in to view your repositories
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.space[4],
        height: "100%",
      }}
    >
      {/* Search and Filter Bar */}
      <div
        style={{
          display: "flex",
          gap: theme.space[3],
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            padding: `${theme.space[2]} ${theme.space[3]}`,
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii[2],
            color: theme.colors.text,
            fontSize: theme.fontSizes[2],
          }}
        />
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          style={{
            padding: `${theme.space[2]} ${theme.space[3]}`,
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii[2],
            color: theme.colors.text,
            fontSize: theme.fontSizes[2],
          }}
        >
          <option value="all">All Languages</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

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

      {/* Repository List */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
          gap: theme.space[3],
          alignContent: "start",
        }}
      >
        {isLoading ? (
          <div
            style={{
              gridColumn: "1 / -1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: theme.space[5],
              color: theme.colors.textSecondary,
            }}
          >
            Loading repositories...
          </div>
        ) : filteredRepositories.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: theme.space[5],
              color: theme.colors.textSecondary,
            }}
          >
            {searchQuery
              ? "No repositories found matching your search"
              : "No repositories found"}
          </div>
        ) : (
          filteredRepositories.map((repo) => (
            <button
              key={repo.id}
              onClick={() =>
                onSelectRepository(
                  repo.owner.login,
                  repo.name,
                  repo.default_branch
                )
              }
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.space[2],
                padding: theme.space[3],
                backgroundColor: theme.colors.backgroundSecondary,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii[2],
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.colors.primary;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.space[2],
                }}
              >
                <Image
                  src={repo.owner.avatar_url}
                  alt={repo.owner.login}
                  width={32}
                  height={32}
                  style={{
                    borderRadius: "50%",
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: theme.fontSizes[2],
                      fontWeight: theme.fontWeights.semibold,
                      color: theme.colors.text,
                      fontFamily: theme.fonts?.monospace || "monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {repo.name}
                  </div>
                  <div
                    style={{
                      fontSize: theme.fontSizes[0],
                      color: theme.colors.textSecondary,
                      display: "flex",
                      alignItems: "center",
                      gap: theme.space[2],
                    }}
                  >
                    {repo.private && (
                      <span
                        style={{
                          padding: "2px 6px",
                          backgroundColor: theme.colors.background,
                          borderRadius: theme.radii[1],
                          fontSize: theme.fontSizes[0],
                        }}
                      >
                        Private
                      </span>
                    )}
                    {repo.language && (
                      <span>
                        <span
                          style={{
                            display: "inline-block",
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: theme.colors.primary,
                            marginRight: "4px",
                          }}
                        />
                        {repo.language}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {repo.description && (
                <div
                  style={{
                    fontSize: theme.fontSizes[1],
                    color: theme.colors.textSecondary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {repo.description}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: theme.fontSizes[0],
                  color: theme.colors.textSecondary,
                }}
              >
                <span>Updated {formatDate(repo.updated_at)}</span>
                {repo.stargazers_count > 0 && (
                  <span>⭐ {repo.stargazers_count}</span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
