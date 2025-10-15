"use client";

/**
 * Dependency Portfolio Component
 * Displays package information and dependencies for a GitHub repository
 */

import { useState } from "react";

interface PackageInfo {
  name: string;
  version: string;
  path: string;
  description?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

interface RepositoryPackages {
  owner: string;
  repo: string;
  ref: string;
  packages: PackageInfo[];
  isMonorepo: boolean;
  totalPackages: number;
  packageManager?: "npm" | "yarn" | "pnpm" | "bun";
}

interface DependencyPortfolioProps {
  owner: string;
  repo: string;
  ref?: string;
}

export function DependencyPortfolio({
  owner,
  repo,
  ref = "HEAD",
}: DependencyPortfolioProps) {
  const [data, setData] = useState<RepositoryPackages | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(
    null,
  );

  const loadPackages = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/packages?owner=${owner}&repo=${repo}&ref=${ref}&action=discover`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch packages");
      }

      const packageData = await response.json();
      setData(packageData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("Failed to load packages:", err);
    } finally {
      setLoading(false);
    }
  };

  const countTotalDependencies = (pkg: PackageInfo) => {
    const deps = Object.keys(pkg.dependencies || {}).length;
    const devDeps = Object.keys(pkg.devDependencies || {}).length;
    const peerDeps = Object.keys(pkg.peerDependencies || {}).length;
    return deps + devDeps + peerDeps;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dependency Portfolio</h1>
        <p className="text-gray-600">
          {owner}/{repo} {ref !== "HEAD" && `@ ${ref}`}
        </p>
      </div>

      {/* Load Button */}
      {!data && (
        <button
          onClick={loadPackages}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Loading..." : "Discover Packages"}
        </button>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Total Packages</div>
                <div className="text-2xl font-bold">{data.totalPackages}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Type</div>
                <div className="text-2xl font-bold">
                  {data.isMonorepo ? "Monorepo" : "Single"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Package Manager</div>
                <div className="text-2xl font-bold">
                  {data.packageManager || "Unknown"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Reference</div>
                <div className="text-2xl font-bold">{data.ref}</div>
              </div>
            </div>
          </div>

          {/* Package List */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Packages</h2>
            <div className="space-y-3">
              {data.packages.map((pkg) => (
                <div
                  key={pkg.path}
                  className="border rounded p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{pkg.name}</h3>
                      <p className="text-sm text-gray-500">v{pkg.version}</p>
                      {pkg.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {pkg.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{pkg.path}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-600">
                        {countTotalDependencies(pkg)} dependencies
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Package Details */}
          {selectedPackage && (
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">
                  {selectedPackage.name}
                </h2>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Dependencies */}
              {selectedPackage.dependencies &&
                Object.keys(selectedPackage.dependencies).length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Dependencies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(selectedPackage.dependencies).map(
                        ([name, version]) => (
                          <div
                            key={name}
                            className="text-sm bg-gray-50 p-2 rounded"
                          >
                            <span className="font-mono">{name}</span>
                            <span className="text-gray-500 ml-2">
                              {version}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Dev Dependencies */}
              {selectedPackage.devDependencies &&
                Object.keys(selectedPackage.devDependencies).length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Dev Dependencies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(selectedPackage.devDependencies).map(
                        ([name, version]) => (
                          <div
                            key={name}
                            className="text-sm bg-gray-50 p-2 rounded"
                          >
                            <span className="font-mono">{name}</span>
                            <span className="text-gray-500 ml-2">
                              {version}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Peer Dependencies */}
              {selectedPackage.peerDependencies &&
                Object.keys(selectedPackage.peerDependencies).length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Peer Dependencies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Object.entries(selectedPackage.peerDependencies).map(
                        ([name, version]) => (
                          <div
                            key={name}
                            className="text-sm bg-gray-50 p-2 rounded"
                          >
                            <span className="font-mono">{name}</span>
                            <span className="text-gray-500 ml-2">
                              {version}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Reload Button */}
          <button
            onClick={loadPackages}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Reloading..." : "Reload Packages"}
          </button>
        </div>
      )}
    </div>
  );
}
