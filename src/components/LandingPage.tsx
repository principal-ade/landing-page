import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "themed-markdown";
import {
  Download,
  CheckCircle,
  Zap,
  Users,
  Bot,
  Brain,
  GitBranch,
  Database,
  Activity,
} from "lucide-react";
import { SyncPropagationVisualizer } from "./collaborative-metrics/SyncPropagationVisualizer";
import { MetricsStatistics } from "./collaborative-metrics/MetricsStatistics";
import { LatestSyncEvent } from "./collaborative-metrics/LatestSyncEvent";
import {
  MetricsData,
  LiveEvent,
  SyncEvent,
  CollisionEvent,
} from "./collaborative-metrics/types";
import { ArchitectureMapHighlightLayers, HighlightLayer, useCodeCityData } from "@principal-ai/code-city-react";
import { GitHubService } from "../services/githubService";

interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  assets: {
    id: number;
    name: string;
    browser_download_url: string;
    size: number;
  }[];
}

interface LandingPageProps {
  onExploreGithub: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({}) => {
  const { theme } = useTheme();
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [hasAvailableDownload, setHasAvailableDownload] = useState(false);
  const [showWaitlistMessage, setShowWaitlistMessage] = useState(false);

  // Metrics state for collaborative features
  const [metrics, setMetrics] = useState<MetricsData>({
    avgSyncLatency: 0,
    timeBetweenSyncs: 0,
    collisionRate: 0,
    activeUsers: 0,
    recentSyncs: [],
    recentCollisions: [],
    syncVelocity: 0,
  });
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [enabledLayers, setEnabledLayers] = useState<Set<string>>(
    new Set(["frontend"]),
  );
  const [fileSystemTree, setFileSystemTree] = useState<any>(null);
  const [architectureLoading, setArchitectureLoading] = useState(true);
  const [lastCollisionTime, setLastCollisionTime] = useState<number | null>(
    null,
  );

  // Load architecture data for sst/open-next
  const { cityData } = useCodeCityData({
    fileSystemTree,
    autoUpdate: true,
  });

  // Debug cityData
  useEffect(() => {
    if (cityData) {
      console.log("CityData generated:", cityData);
      console.log("CityData structure:", {
        hasBuildings: !!cityData?.buildings,
        hasDistricts: !!cityData?.districts,
        buildingsLength: cityData?.buildings?.length,
        districtsLength: cityData?.districts?.length,
      });
    }
  }, [cityData]);

  // State for random file selections that change over time
  const [randomFileSets, setRandomFileSets] = useState<
    Record<string, string[]>
  >({});

  // Initialize and update random file selections periodically
  useEffect(() => {
    if (!fileSystemTree?.allFiles || fileSystemTree.allFiles.length === 0)
      return;

    const filesPerAgent = 5;
    const allFiles = fileSystemTree.allFiles;

    // Initialize with random files for each agent
    const initializeFiles = () => {
      const initialSets: Record<string, string[]> = {};
      const globalUsedIndices = new Set<number>();

      ["frontend", "backend", "database", "devops", "testing"].forEach(
        (agentId) => {
          const randomFiles: string[] = [];

          // Pick initial random files, avoiding duplicates across all agents
          while (
            randomFiles.length < filesPerAgent &&
            globalUsedIndices.size < allFiles.length
          ) {
            const randomIndex = Math.floor(Math.random() * allFiles.length);
            if (!globalUsedIndices.has(randomIndex)) {
              globalUsedIndices.add(randomIndex);
              randomFiles.push(allFiles[randomIndex].path);
            }
          }

          initialSets[agentId] = randomFiles;
        },
      );

      return initialSets;
    };

    // If not initialized, set initial files
    if (Object.keys(randomFileSets).length === 0) {
      setRandomFileSets(initializeFiles());
    }

    // Track which agent to update next
    let currentAgentIndex = 0;
    const agents = ["frontend", "backend", "database", "devops", "testing"];

    // Update one file for ONE agent at a time
    const updateOneFile = () => {
      setRandomFileSets((prevSets) => {
        const newSets = { ...prevSets };

        // Get all currently used files across all agents
        const allUsedFiles = new Set<string>();
        Object.values(newSets).forEach((files) => {
          files.forEach((file) => allUsedFiles.add(file));
        });

        // Pick the next agent to update
        const agentId = agents[currentAgentIndex];
        currentAgentIndex = (currentAgentIndex + 1) % agents.length;

        if (!newSets[agentId] || newSets[agentId].length === 0) {
          // Initialize if empty
          newSets[agentId] = [];
          for (let i = 0; i < filesPerAgent; i++) {
            const randomIndex = Math.floor(Math.random() * allFiles.length);
            newSets[agentId].push(allFiles[randomIndex].path);
          }
        } else {
          // Replace one random file in this agent's set
          const indexToReplace = Math.floor(
            Math.random() * newSets[agentId].length,
          );
          const oldFile = newSets[agentId][indexToReplace];

          // Find a new file that's not currently used by any agent
          let attempts = 0;
          let newFile = oldFile;
          while (attempts < 50) {
            // Limit attempts to avoid infinite loop
            const randomIndex = Math.floor(Math.random() * allFiles.length);
            const candidateFile = allFiles[randomIndex].path;
            if (!allUsedFiles.has(candidateFile)) {
              newFile = candidateFile;
              break;
            }
            attempts++;
          }

          // Update the file set
          newSets[agentId] = [...newSets[agentId]];
          newSets[agentId][indexToReplace] = newFile;
        }

        return newSets;
      });
    };

    // Update one file for one agent every 500ms (so each agent updates one file every 2.5 seconds)
    const interval = setInterval(updateOneFile, 500);

    return () => clearInterval(interval);
  }, [fileSystemTree]);

  // Define agent highlight layers with random changing files
  const agentLayers: HighlightLayer[] = useMemo(() => {
    if (!fileSystemTree?.allFiles) return [];

    return [
      {
        id: "frontend",
        name: "Frontend Agent",
        color: "#3B82F6",
        enabled: enabledLayers.has("frontend"),
        priority: 1,
        items: (randomFileSets["frontend"] || []).map((path) => ({
          path,
          type: "file" as const,
        })),
      },
      {
        id: "backend",
        name: "Backend Agent",
        color: "#10B981",
        enabled: enabledLayers.has("backend"),
        priority: 2,
        items: (randomFileSets["backend"] || []).map((path) => ({
          path,
          type: "file" as const,
        })),
      },
      {
        id: "database",
        name: "Database Agent",
        color: "#F59E0B",
        enabled: enabledLayers.has("database"),
        priority: 3,
        items: (randomFileSets["database"] || []).map((path) => ({
          path,
          type: "file" as const,
        })),
      },
      {
        id: "devops",
        name: "DevOps Agent",
        color: "#EF4444",
        enabled: enabledLayers.has("devops"),
        priority: 4,
        items: (randomFileSets["devops"] || []).map((path) => ({
          path,
          type: "file" as const,
        })),
      },
      {
        id: "testing",
        name: "Testing Agent",
        color: "#8B5CF6",
        enabled: enabledLayers.has("testing"),
        priority: 5,
        items: (randomFileSets["testing"] || []).map((path) => ({
          path,
          type: "file" as const,
        })),
      },
    ];
  }, [fileSystemTree, enabledLayers, randomFileSets]);

  const handleLayerToggle = (layerId: string, enabled: boolean) => {
    setEnabledLayers((prev) => {
      const newSet = new Set(prev);
      if (enabled) {
        newSet.add(layerId);
      } else {
        newSet.delete(layerId);
      }
      return newSet;
    });
  };

  // Detect platform immediately - this is synchronous
  const detectedPlatform = (() => {
    if (typeof window === "undefined") return null;
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("mac")) return "mac";
    if (userAgent.includes("win")) return "windows";
    if (userAgent.includes("linux")) return "linux";
    return null;
  })();

  // Responsive breakpoints with React hooks
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Fetch releases on mount
  useEffect(() => {
    fetchReleases();
  }, []);

  // Fetch file tree for architecture map
  useEffect(() => {
    const fetchFileTree = async () => {
      try {
        setArchitectureLoading(true);
        const githubService = new GitHubService();
        // First fetch repository info to get the default branch
        const repoInfo = await githubService.fetchRepositoryInfo(
          "sst",
          "open-next",
        );
        const tree = await githubService.fetchFileSystemTree(
          "sst",
          "open-next",
          repoInfo.defaultBranch,
        );
        console.log("Fetched FileSystemTree:", tree);
        console.log("Tree structure:", {
          hasRoot: !!tree?.root,
          hasAllFiles: !!tree?.allFiles,
          hasAllDirectories: !!tree?.allDirectories,
          hasStats: !!tree?.stats,
          allFilesLength: tree?.allFiles?.length,
          rootChildren: tree?.root?.children?.length,
        });
        setFileSystemTree(tree);
      } catch (error) {
        console.error("Failed to fetch file tree:", error);
        setFileSystemTree(null);
      } finally {
        setArchitectureLoading(false);
      }
    };

    fetchFileTree();
  }, []);

  // Check if download is available after releases are loaded
  useEffect(() => {
    if (releases.length > 0 && detectedPlatform) {
      const asset = getAssetForPlatform(releases[0], detectedPlatform);
      setHasAvailableDownload(!!asset);
    }
  }, [releases, detectedPlatform]);

  const fetchReleases = async () => {
    try {
      const response = await fetch("/api/github/releases");

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to fetch releases");
      }

      const data = await response.json();
      setReleases(data);
    } catch (err) {
      console.error("Failed to load releases:", err);
    } finally {
    }
  };

  // Simulate collaborative metrics data
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate sync events
      const newSync: SyncEvent = {
        id: Math.random().toString(36),
        timestamp: Date.now(),
        initiatorHash: Math.random().toString(36).substring(2, 6),
        propagationTimes: [50, 120, 85, 200].map((t) => t + Math.random() * 50),
        avgLatency: 100 + Math.random() * 50,
      };

      // Occasionally add collision
      const shouldAddCollision = Math.random() > 0.8;
      const newCollision: CollisionEvent | null = shouldAddCollision
        ? {
            id: Math.random().toString(36),
            timestamp: Date.now(),
            userHashes: ["user1", "user2"],
            resourceType: [".tsx", ".ts", ".jsx", ".js"][
              Math.floor(Math.random() * 4)
            ],
            resolved: Math.random() > 0.3,
            resolutionTime: 500 + Math.random() * 2000,
          }
        : null;

      if (newCollision) {
        setLastCollisionTime(Date.now());
      }

      setMetrics((prev) => ({
        ...prev,
        avgSyncLatency: 95 + Math.random() * 30,
        timeBetweenSyncs: 2.5 + Math.random() * 2,
        collisionRate: 0.3 + Math.random() * 0.5,
        activeUsers: 3 + Math.floor(Math.random() * 5),
        recentSyncs: [newSync, ...prev.recentSyncs].slice(0, 10),
        recentCollisions: newCollision
          ? [newCollision, ...prev.recentCollisions].slice(0, 5)
          : prev.recentCollisions,
        syncVelocity: 15 + Math.random() * 10,
      }));

      // Add to live events
      const eventType =
        shouldAddCollision && newCollision ? "collision" : "sync";
      const liveEvent: LiveEvent = {
        id: eventType === "collision" ? newCollision!.id : newSync.id,
        type: eventType,
        timestamp: Date.now(),
        latency: eventType === "sync" ? newSync.avgLatency : undefined,
        userCount:
          eventType === "sync" ? 3 + Math.floor(Math.random() * 5) : undefined,
        fileType:
          eventType === "collision" ? newCollision!.resourceType : undefined,
        resolved:
          eventType === "collision" ? newCollision!.resolved : undefined,
      };

      setLiveEvents((prev) => [liveEvent, ...prev].slice(0, 20));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getAssetForPlatform = (
    release: GitHubRelease,
    platform: "mac" | "windows" | "linux",
  ) => {
    const patterns = {
      mac: [".dmg", "darwin", "macos"],
      windows: [".exe", ".msi", "win32", "windows"],
      linux: [".AppImage", ".deb", ".rpm", "linux"],
    };

    return release.assets.find((asset) =>
      patterns[platform].some((pattern) =>
        asset.name.toLowerCase().includes(pattern),
      ),
    );
  };

  const handleDownloadClick = async () => {
    // Check if downloads are available
    if (!hasAvailableDownload) {
      // Show waitlist message
      setShowWaitlistMessage(true);
      // Open Discord after a short delay so user sees the message
      setTimeout(() => {
        window.open("https://discord.gg/jh242TEd", "_blank");
        setShowWaitlistMessage(false);
      }, 2000);
      return;
    }

    if (detectedPlatform && releases[0]) {
      const asset = getAssetForPlatform(releases[0], detectedPlatform);
      if (asset) {
        // In development with mock data, show a message
        if (releases[0].tag_name === "v1.0.0-dev") {
          console.log("Development mode: Download button clicked");
          console.log("Asset:", asset);
          alert(
            "Development Mode: Downloads work in production with GITHUB_RELEASES_READONLY_TOKEN configured",
          );
          return;
        }

        // Start download
        window.location.href = `/api/github/download?assetId=${asset.id}&filename=${encodeURIComponent(asset.name)}`;
        setDownloadStarted(true);
      }
    }
  };

  // Create a subtle grid pattern
  const gridBackground = `
    linear-gradient(${theme.colors.border}40 1px, transparent 1px),
    linear-gradient(90deg, ${theme.colors.border}40 1px, transparent 1px)
  `;

  // Show completed screen if download started
  if (downloadStarted) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.background,
          backgroundImage: gridBackground,
          backgroundSize: "100px 100px",
          backgroundPosition: "-1px -1px",
          padding: isMobile ? "20px" : "40px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at center, transparent 0%, ${theme.colors.background}99 100%)`,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "600px",
            width: "100%",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: isMobile ? "80px" : "100px",
              height: isMobile ? "80px" : "100px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 32px",
            }}
          >
            <CheckCircle size={isMobile ? 40 : 50} color="white" />
          </div>

          <h1
            style={{
              fontSize: isMobile ? "28px" : "36px",
              fontWeight: "700",
              marginBottom: "16px",
              color: theme.colors.text,
            }}
          >
            Download Started!
          </h1>

          <p
            style={{
              fontSize: isMobile ? "16px" : "18px",
              color: theme.colors.textSecondary,
              marginBottom: "32px",
              lineHeight: "1.6",
            }}
          >
            Your download should begin automatically. If it doesn&apos;t start,
            check your browser&apos;s download folder.
          </p>

          <button
            onClick={() => (window.location.href = "/")}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              backgroundColor: theme.colors.backgroundSecondary,
              border: `2px solid ${theme.colors.border}`,
              borderRadius: "8px",
              color: theme.colors.text,
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.colors.border;
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", overflow: "auto" }}>
      {/* Hero Section */}
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: theme.colors.background,
          backgroundImage: gridBackground,
          backgroundSize: "100px 100px",
          backgroundPosition: "-1px -1px",
          padding: isMobile ? "60px 20px 80px" : "100px 40px 120px",
          position: "relative",
        }}
      >
        {/* Gradient overlay for better contrast */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at center, transparent 0%, ${theme.colors.background}99 100%)`,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1400px",
            width: "100%",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <h1
            style={{
              fontSize: isMobile ? "32px" : isTablet ? "40px" : "48px",
              fontWeight: "700",
              marginBottom: isMobile ? "16px" : "20px",
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary || theme.colors.primary} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: theme.colors.primary, // Fallback for browsers that don't support text gradients
              display: "inline-block", // Fix for gradient text rendering
              width: "100%",
            }}
          >
            Specktor
          </h1>

          <p
            style={{
              fontSize: isMobile ? "16px" : isTablet ? "18px" : "20px",
              color: theme.colors.textSecondary,
              lineHeight: "1.6",
              padding: isMobile ? "0 10px" : "0",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
              marginTop: "0",
              marginBottom: isMobile ? "30px" : "40px",
            }}
          >
            Vibe code with your friends
          </p>

          {/* Main content area with sync network, action boxes, and architecture map */}
          <div
            style={{
              marginTop: "40px",
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr auto 1fr",
              gap: theme.space[4],
              alignItems: "center",
              maxWidth: "1200px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            {/* Left: Sync Propagation Visualizer */}
            {!isMobile && (
              <div style={{ justifySelf: "end" }}>
                <SyncPropagationVisualizer metrics={metrics} />
              </div>
            )}

            {/* Center: Two action boxes */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.space[3],
                alignItems: "center",
              }}
            >
              {/* Download Beta Option */}
              <div
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderRadius: "16px",
                  padding: isMobile ? "20px" : "24px",
                  border: `2px solid ${theme.colors.border}`,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  width: "220px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary;
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 10px 30px ${theme.colors.primary}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: isMobile ? "50px" : "60px",
                    height: isMobile ? "50px" : "60px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary || theme.colors.primary} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                  onClick={handleDownloadClick}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  title="Click to download"
                >
                  <Download size={isMobile ? 30 : 40} color="white" />
                </div>

                <h2
                  style={{
                    fontSize: isMobile ? "18px" : "20px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: theme.colors.text,
                    textAlign: "center",
                  }}
                >
                  Download Beta
                </h2>

                {showWaitlistMessage && (
                  <p
                    style={{
                      fontSize: isMobile ? "14px" : "16px",
                      color: theme.colors.warning || "#FF9800",
                      marginTop: "16px",
                      padding: "12px",
                      backgroundColor: theme.colors.backgroundSecondary,
                      borderRadius: "8px",
                      border: `1px solid ${theme.colors.warning || "#FF9800"}`,
                    }}
                  >
                    {detectedPlatform
                      ? `${detectedPlatform.charAt(0).toUpperCase() + detectedPlatform.slice(1)} version coming soon! Redirecting to Discord waitlist...`
                      : "This platform is not yet supported. Redirecting to Discord waitlist..."}
                  </p>
                )}
              </div>

              {/* Or divider */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.space[2],
                  color: theme.colors.textMuted,
                  fontSize: theme.fontSizes[1],
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    backgroundColor: theme.colors.border,
                  }}
                />
                <span>or</span>
                <div
                  style={{
                    width: "40px",
                    height: "1px",
                    backgroundColor: theme.colors.border,
                  }}
                />
              </div>

              {/* Checkout Live Activity Option */}
              <div
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderRadius: "16px",
                  padding: isMobile ? "20px" : "24px",
                  border: `2px solid ${theme.colors.border}`,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  width: "220px",
                }}
                onClick={() => {
                  // Navigate to live activity view
                  window.location.href = "/live-activity";
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.success;
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 10px 30px ${theme.colors.success}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border;
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: isMobile ? "50px" : "60px",
                    height: isMobile ? "50px" : "60px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.info} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  title="View live activity"
                >
                  <Activity size={isMobile ? 30 : 40} color="white" />
                </div>

                <h2
                  style={{
                    fontSize: isMobile ? "18px" : "20px",
                    fontWeight: "600",
                    marginBottom: "8px",
                    color: theme.colors.text,
                    textAlign: "center",
                  }}
                >
                  Live Activity
                </h2>

                <p
                  style={{
                    fontSize: isMobile ? "12px" : "14px",
                    color: theme.colors.textSecondary,
                    textAlign: "center",
                    lineHeight: "1.4",
                  }}
                >
                  View real-time collaboration for open source projects
                </p>
              </div>
            </div>

            {/* Right: Architecture Map */}
            {!isMobile && (
              <div style={{ justifySelf: "start" }}>
                <div
                  style={{
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderRadius: theme.radii[2],
                    padding: theme.space[3],
                    width: "350px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: theme.fontSizes[2],
                      fontWeight: theme.fontWeights.heading,
                      color: theme.colors.text,
                      marginBottom: theme.space[2],
                    }}
                  >
                    Architecture Map
                  </h3>

                  {/* Map visualization */}
                  <div
                    style={{
                      height: "280px",
                      backgroundColor: theme.colors.backgroundTertiary,
                      borderRadius: theme.radii[1],
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {architectureLoading ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          color: theme.colors.textMuted,
                          fontSize: theme.fontSizes[1],
                        }}
                      >
                        Loading sst/open-next...
                      </div>
                    ) : cityData ? (
                      <ArchitectureMapHighlightLayers
                        cityData={cityData}
                        highlightLayers={agentLayers}
                        onLayerToggle={handleLayerToggle}
                        canvasBackgroundColor={theme.colors.backgroundTertiary}
                        fullSize={false}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          color: theme.colors.error,
                          fontSize: theme.fontSizes[1],
                        }}
                      >
                        Failed to load
                      </div>
                    )}
                  </div>

                  {/* Agent selector pills below map */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 1fr)",
                      gap: theme.space[1],
                      marginTop: theme.space[2],
                    }}
                  >
                    {[
                      "frontend",
                      "backend",
                      "database",
                      "devops",
                      "testing",
                    ].map((agentId) => {
                      const agent = agentLayers.find((a) => a.id === agentId);
                      if (!agent) return null;

                      return (
                        <button
                          key={agentId}
                          onClick={() =>
                            handleLayerToggle(
                              agentId,
                              !enabledLayers.has(agentId),
                            )
                          }
                          style={{
                            padding: `4px 2px`,
                            fontSize: "10px",
                            borderRadius: theme.radii[1],
                            border: `1px solid ${enabledLayers.has(agentId) ? agent.color : theme.colors.border}`,
                            backgroundColor: enabledLayers.has(agentId)
                              ? `${agent.color}20`
                              : theme.colors.backgroundTertiary,
                            color: enabledLayers.has(agentId)
                              ? agent.color
                              : theme.colors.textSecondary,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {agent.name.replace(" Agent", "")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Metrics Section */}
      <div
        style={{
          paddingTop: isMobile ? "60px" : "80px",
          paddingBottom: isMobile ? "60px" : "80px",
          backgroundColor: theme.colors.backgroundSecondary,
          width: "100%",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            paddingLeft: isMobile ? "20px" : "40px",
            paddingRight: isMobile ? "20px" : "40px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 2fr",
              gap: theme.space[5],
              alignItems: "center",
            }}
          >
            {/* Left: Text content */}
            <div>
              <h2
                style={{
                  fontSize: isMobile ? "24px" : "32px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: theme.colors.text,
                }}
              >
                Live Agent Synchronization
              </h2>

              <p
                style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.colors.textSecondary,
                  lineHeight: "1.6",
                  marginBottom: "24px",
                }}
              >
                When properly configured, development agents can sync changes
                live through git. The codebase is a big place, and collisions
                are rare—but when they happen, our system ensures smooth
                resolution.
              </p>

              {/* Latest Sync Event inline */}
              <LatestSyncEvent events={liveEvents} />
            </div>

            {/* Right: Metrics */}
            <div>
              <MetricsStatistics
                metrics={metrics}
                lastCollisionTime={lastCollisionTime}
              />
            </div>
          </div>
        </div>
      </div>

      {/* A24Z Memory Section */}
      <div
        style={{
          paddingTop: isMobile ? "60px" : "80px",
          paddingBottom: isMobile ? "60px" : "80px",
          backgroundColor: theme.colors.background,
          width: "100%",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            paddingLeft: isMobile ? "20px" : "40px",
            paddingRight: isMobile ? "20px" : "40px",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "28px" : "36px",
              fontWeight: "600",
              marginBottom: "24px",
              color: theme.colors.text,
              textAlign: "center",
            }}
          >
            A24Z Memory: Context Without the Overhead
          </h2>

          <p
            style={{
              fontSize: isMobile ? "16px" : "18px",
              color: theme.colors.textSecondary,
              lineHeight: "1.8",
              maxWidth: "800px",
              margin: "0 auto 40px",
              textAlign: "center",
            }}
          >
            Keep your AI agents up-to-date with repository knowledge using
            git-native storage. No RAG pipelines. No vector databases. Just
            markdown notes that travel with your code.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fit, minmax(300px, 1fr))",
              gap: theme.space[4],
              marginBottom: theme.space[5],
            }}
          >
            <div
              style={{
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: theme.radii[2],
                padding: theme.space[4],
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.space[2],
                  marginBottom: theme.space[3],
                }}
              >
                <Brain size={24} color={theme.colors.primary} />
                <h3
                  style={{
                    fontSize: theme.fontSizes[3],
                    fontWeight: theme.fontWeights.semibold,
                    color: theme.colors.text,
                  }}
                >
                  Tribal Knowledge
                </h3>
              </div>
              <p
                style={{
                  fontSize: theme.fontSizes[2],
                  color: theme.colors.textSecondary,
                  lineHeight: 1.6,
                }}
              >
                Document architectural decisions, gotchas, and patterns as you
                code. Your AI agents read these notes to understand context and
                avoid repeating mistakes.
              </p>
            </div>

            <div
              style={{
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: theme.radii[2],
                padding: theme.space[4],
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.space[2],
                  marginBottom: theme.space[3],
                }}
              >
                <GitBranch size={24} color={theme.colors.success} />
                <h3
                  style={{
                    fontSize: theme.fontSizes[3],
                    fontWeight: theme.fontWeights.semibold,
                    color: theme.colors.text,
                  }}
                >
                  Git-Native Storage
                </h3>
              </div>
              <p
                style={{
                  fontSize: theme.fontSizes[2],
                  color: theme.colors.textSecondary,
                  lineHeight: 1.6,
                }}
              >
                Notes live in your repository&apos;s .a24z folder. They branch,
                merge, and travel with your code. No external services, no sync
                delays, no stale embeddings.
              </p>
            </div>

            <div
              style={{
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: theme.radii[2],
                padding: theme.space[4],
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.space[2],
                  marginBottom: theme.space[3],
                }}
              >
                <Database
                  size={24}
                  color={theme.colors.warning}
                  style={{ textDecoration: "line-through" }}
                />
                <h3
                  style={{
                    fontSize: theme.fontSizes[3],
                    fontWeight: theme.fontWeights.semibold,
                    color: theme.colors.text,
                  }}
                >
                  No Vector DB Required
                </h3>
              </div>
              <p
                style={{
                  fontSize: theme.fontSizes[2],
                  color: theme.colors.textSecondary,
                  lineHeight: 1.6,
                }}
              >
                Skip the complexity of RAG and embeddings. A24Z Memory uses
                simple file anchoring and semantic search to surface relevant
                context exactly when agents need it.
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: theme.colors.backgroundTertiary,
              borderRadius: theme.radii[2],
              padding: theme.space[4],
              textAlign: "center",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <p
              style={{
                fontSize: theme.fontSizes[2],
                color: theme.colors.text,
                fontStyle: "italic",
              }}
            >
              &quot;A24Z Memory turned our codebase into a living knowledge graph.
              Our AI agents now understand not just what the code does, but why
              it was written that way.&quot;
            </p>
            <p
              style={{
                fontSize: theme.fontSizes[1],
                color: theme.colors.textSecondary,
                marginTop: theme.space[2],
              }}
            >
              - Early Beta User
            </p>
            <a
              href="https://github.com/a24z-ai/a24z-Memory"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: theme.space[3],
                padding: `${theme.space[2]} ${theme.space[3]}`,
                fontSize: theme.fontSizes[1],
                color: theme.colors.primary,
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.primary}`,
                borderRadius: theme.radii[1],
                textDecoration: "none",
                transition: "all 0.2s ease",
                fontWeight: theme.fontWeights.medium,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary;
                e.currentTarget.style.color = theme.colors.background;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.background;
                e.currentTarget.style.color = theme.colors.primary;
              }}
            >
              View on GitHub →
            </a>
          </div>
        </div>
      </div>

      {/* Download CTA Section */}
      <div
        style={{
          paddingTop: isMobile ? "60px" : "80px",
          paddingBottom: isMobile ? "60px" : "80px",
          backgroundColor: theme.colors.backgroundSecondary,
          width: "100%",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            paddingLeft: isMobile ? "20px" : "40px",
            paddingRight: isMobile ? "20px" : "40px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "28px" : "36px",
              fontWeight: "600",
              marginBottom: "24px",
              color: theme.colors.text,
            }}
          >
            Download Our App to Try It Yourself
          </h2>

          <p
            style={{
              fontSize: isMobile ? "16px" : "18px",
              color: theme.colors.textSecondary,
              lineHeight: "1.8",
              maxWidth: "800px",
              margin: "0 auto 40px",
            }}
          >
            We&apos;re in beta and onboarding people every day to try coding live
            with their peers. On your local machine, get the same experience as
            Lovable with hot reloading—but use the agents you already pay for.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: theme.space[5],
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            {/* Feature highlights */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: theme.space[4],
                flex: 1,
              }}
            >
              <div
                style={{
                  padding: theme.space[3],
                  borderRadius: theme.radii[2],
                  backgroundColor: theme.colors.backgroundSecondary,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <div
                  style={{
                    marginBottom: theme.space[2],
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Zap size={24} color={theme.colors.primary} />
                </div>
                <div
                  style={{
                    fontSize: theme.fontSizes[1],
                    fontWeight: theme.fontWeights.semibold,
                    color: theme.colors.text,
                    marginBottom: theme.space[1],
                  }}
                >
                  Hot Reloading
                </div>
                <div
                  style={{
                    fontSize: theme.fontSizes[0],
                    color: theme.colors.textSecondary,
                  }}
                >
                  See changes instantly as you code
                </div>
              </div>

              <div
                style={{
                  padding: theme.space[3],
                  borderRadius: theme.radii[2],
                  backgroundColor: theme.colors.backgroundSecondary,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <div
                  style={{
                    marginBottom: theme.space[2],
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Users size={24} color={theme.colors.primary} />
                </div>
                <div
                  style={{
                    fontSize: theme.fontSizes[1],
                    fontWeight: theme.fontWeights.semibold,
                    color: theme.colors.text,
                    marginBottom: theme.space[1],
                  }}
                >
                  Live Collaboration
                </div>
                <div
                  style={{
                    fontSize: theme.fontSizes[0],
                    color: theme.colors.textSecondary,
                  }}
                >
                  Code with peers in real-time
                </div>
              </div>

              <div
                style={{
                  padding: theme.space[3],
                  borderRadius: theme.radii[2],
                  backgroundColor: theme.colors.backgroundSecondary,
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <div
                  style={{
                    marginBottom: theme.space[2],
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Bot size={24} color={theme.colors.primary} />
                </div>
                <div
                  style={{
                    fontSize: theme.fontSizes[1],
                    fontWeight: theme.fontWeights.semibold,
                    color: theme.colors.text,
                    marginBottom: theme.space[1],
                  }}
                >
                  Your AI Agents
                </div>
                <div
                  style={{
                    fontSize: theme.fontSizes[0],
                    color: theme.colors.textSecondary,
                  }}
                >
                  Use the agents you already pay for
                </div>
              </div>
            </div>
          </div>

          {/* Download button */}
          <div
            style={{
              marginTop: "48px",
            }}
          >
            <button
              onClick={handleDownloadClick}
              style={{
                padding: "16px 32px",
                fontSize: "18px",
                fontWeight: "600",
                backgroundColor: theme.colors.primary,
                color: theme.colors.background,
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${theme.colors.primary}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Download size={20} />
              Join the Beta
            </button>

            <div
              style={{
                marginTop: "16px",
                fontSize: theme.fontSizes[1],
                color: theme.colors.textMuted,
              }}
            >
              Available for macOS • Windows and Linux coming soon
            </div>
          </div>
        </div>
      </div>

      {/* Additional sections can go here */}
    </div>
  );
};
