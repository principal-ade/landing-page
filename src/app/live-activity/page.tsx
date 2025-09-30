"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Users,
  GitBranch,
  Activity,
  Zap,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { SyncPropagationVisualizer } from "../../components/collaborative-metrics/SyncPropagationVisualizer";
import {
  MetricsData,
  LiveEvent,
} from "../../components/collaborative-metrics/types";
import { ArchitectureMapHighlightLayers, HighlightLayer, useCodeCityData } from "@principal-ai/code-city-react";
import { GitHubService } from "../../services/githubService";
import { AGENTS } from "../../components/collaborative-metrics/agents";

// Dynamic import ThemeProvider to avoid SSR issues
const ThemeProvider = dynamic(
  () =>
    import("themed-markdown").then(
      (mod) => mod.ThemeProvider,
    ),
  { ssr: false },
);

// Import useTheme from workspace-components instead
import { useTheme } from "themed-markdown";

interface Room {
  id: string;
  name: string;
  isPrivate: boolean;
  activeUsers: number;
  lastActivity: number;
  repository?: string;
}

function LiveActivityContent() {
  const { theme } = useTheme();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [metrics, setMetrics] = useState<MetricsData>({
    avgSyncLatency: 0,
    timeBetweenSyncs: 0,
    collisionRate: 0,
    activeUsers: 0,
    recentSyncs: [],
    recentCollisions: [],
    syncVelocity: 0,
  });
  const [, setLiveEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastCollisionTime, setLastCollisionTime] = useState<number | null>(
    null,
  );
  const [fileSystemTree, setFileSystemTree] = useState<any>(null);
  const [, setArchitectureLoading] = useState(true);

  // Architecture map state - use fileSystemTree like landing page
  const { cityData } = useCodeCityData({
    fileSystemTree,
    autoUpdate: true,
  });

  const [agentFiles, setAgentFiles] = useState<Map<string, string[]>>(
    new Map(),
  );
  const [allFiles, setAllFiles] = useState<string[]>([]);

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

  // Simulate fetching available rooms
  useEffect(() => {
    const timer = setTimeout(() => {
      const a24zRoom = {
        id: "room-a24z",
        name: "A24Z Memory",
        isPrivate: false,
        activeUsers: 2,
        lastActivity: Date.now() - 180000,
        repository: "a24z-ai/a24z-Memory",
      };
      setRooms([a24zRoom]);
      setSelectedRoom(a24zRoom); // Set as selected by default
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Collect all files from file system tree
  useEffect(() => {
    if (fileSystemTree?.allFiles && fileSystemTree.allFiles.length > 0) {
      const files = fileSystemTree.allFiles.map((file: any) => file.path);
      setAllFiles(files);

      // Initialize agent files
      if (files.length > 0) {
        const newAgentFiles = new Map<string, string[]>();
        AGENTS.forEach((agent) => {
          const agentFileSet = new Set<string>();
          while (agentFileSet.size < Math.min(5, files.length)) {
            const randomFile = files[Math.floor(Math.random() * files.length)];
            agentFileSet.add(randomFile);
          }
          newAgentFiles.set(agent.id, Array.from(agentFileSet));
        });
        setAgentFiles(newAgentFiles);
      }
    }
  }, [fileSystemTree]);

  // Update one file per agent periodically
  useEffect(() => {
    if (allFiles.length === 0) return;

    const interval = setInterval(() => {
      setAgentFiles((prev) => {
        const newMap = new Map(prev);
        AGENTS.forEach((agent) => {
          const currentFiles = newMap.get(agent.id) || [];
          if (currentFiles.length > 0 && allFiles.length > 5) {
            const newFiles = [...currentFiles];
            const indexToReplace = Math.floor(Math.random() * newFiles.length);
            let newFile;
            do {
              newFile = allFiles[Math.floor(Math.random() * allFiles.length)];
            } while (newFiles.includes(newFile));
            newFiles[indexToReplace] = newFile;
            newMap.set(agent.id, newFiles);
          }
        });
        return newMap;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [allFiles]);

  // Create highlight layers for agents
  const highlightLayers = useMemo((): HighlightLayer[] => {
    return AGENTS.map((agent) => ({
      id: agent.id,
      name: agent.name,
      color: agent.color,
      enabled: true,
      priority: 1,
      items: (agentFiles.get(agent.id) || []).map((path) => ({
        path,
        type: "file" as const,
      })),
    }));
  }, [agentFiles]);

  // Simulate real-time metrics for selected room
  useEffect(() => {
    if (!selectedRoom) return;

    const interval = setInterval(() => {
      // Generate room-specific metrics
      const newSync = {
        id: Math.random().toString(36),
        timestamp: Date.now(),
        initiatorHash: Math.random().toString(36).substring(2, 6),
        propagationTimes: Array.from(
          { length: selectedRoom.activeUsers },
          () => 50 + Math.random() * 150,
        ),
        avgLatency: 80 + Math.random() * 40,
      };

      const shouldAddCollision = Math.random() > 0.92;
      const newCollision = shouldAddCollision
        ? {
            id: Math.random().toString(36),
            timestamp: Date.now(),
            userHashes: ["user1", "user2"],
            resourceType: [".tsx", ".ts", ".jsx", ".js"][
              Math.floor(Math.random() * 4)
            ],
            resolved: Math.random() > 0.2,
            resolutionTime: 300 + Math.random() * 1500,
          }
        : null;

      if (newCollision) {
        setLastCollisionTime(Date.now());
      }

      setMetrics((prev) => ({
        ...prev,
        avgSyncLatency: 75 + Math.random() * 25,
        timeBetweenSyncs: 1.5 + Math.random() * 1.5,
        collisionRate: 0.05 + Math.random() * 0.15,
        activeUsers: selectedRoom.activeUsers,
        recentSyncs: [newSync, ...prev.recentSyncs].slice(0, 10),
        recentCollisions: newCollision
          ? [newCollision, ...prev.recentCollisions].slice(0, 5)
          : prev.recentCollisions,
        syncVelocity: 20 + Math.random() * 15,
      }));

      // Add to live events
      const eventType =
        shouldAddCollision && newCollision ? "collision" : "sync";
      const liveEvent: LiveEvent = {
        id: eventType === "collision" ? newCollision!.id : newSync.id,
        type: eventType,
        timestamp: Date.now(),
        latency: eventType === "sync" ? newSync.avgLatency : undefined,
        userCount: eventType === "sync" ? selectedRoom.activeUsers : undefined,
        fileType:
          eventType === "collision" ? newCollision!.resourceType : undefined,
        resolved:
          eventType === "collision" ? newCollision!.resolved : undefined,
      };

      setLiveEvents((prev) => [liveEvent, ...prev].slice(0, 20));
    }, 1500);

    return () => clearInterval(interval);
  }, [selectedRoom]);

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getTimeSinceLastCollision = () => {
    if (!lastCollisionTime) return "No collisions";
    const seconds = Math.floor((Date.now() - lastCollisionTime) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.backgroundSecondary,
          padding: "20px 40px",
          position: "relative",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={() => (window.location.href = "/")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: theme.colors.textSecondary,
                fontSize: "14px",
                padding: "8px 12px",
                borderRadius: "8px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme.colors.backgroundTertiary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ArrowLeft size={16} />
              Back to Home
            </button>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 600,
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <Activity size={24} color={theme.colors.primary} />
              Live Activity Monitor
            </h1>

            {/* Demo Badge */}
            <div
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary}dd 0%, ${theme.colors.info || theme.colors.primary}dd 100%)`,
                color: "white",
                padding: "4px 12px",
                borderRadius: "6px",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.5px",
                opacity: 0.9,
              }}
            >
              DEMO
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "14px",
              color: theme.colors.textSecondary,
            }}
          >
            <Users size={16} />2 active users
          </div>
        </div>
      </header>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "40px",
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "30px",
        }}
      >
        {/* Room List Sidebar */}
        <div
          style={{
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: "12px",
            padding: "20px",
            height: "fit-content",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 600,
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <GitBranch size={18} />
            Active Rooms
          </h2>

          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: theme.colors.textSecondary,
              }}
            >
              Loading rooms...
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  style={{
                    background:
                      selectedRoom?.id === room.id
                        ? theme.colors.primary
                        : "transparent",
                    border: `1px solid ${selectedRoom?.id === room.id ? theme.colors.primary : theme.colors.border}`,
                    borderRadius: "8px",
                    padding: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedRoom?.id !== room.id) {
                      e.currentTarget.style.backgroundColor =
                        theme.colors.backgroundTertiary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedRoom?.id !== room.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 500,
                        fontSize: "14px",
                        color:
                          selectedRoom?.id === room.id
                            ? "#fff"
                            : theme.colors.text,
                      }}
                    >
                      {room.name}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color:
                        selectedRoom?.id === room.id
                          ? "#fff"
                          : theme.colors.textSecondary,
                    }}
                  >
                    {room.repository}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "8px",
                      fontSize: "11px",
                      color:
                        selectedRoom?.id === room.id
                          ? "#fff"
                          : theme.colors.textSecondary,
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Users size={10} />
                      {room.activeUsers} active
                    </span>
                    <span>{formatTimeAgo(room.lastActivity)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Open Source Notice */}
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              backgroundColor: theme.colors.backgroundTertiary,
              borderRadius: "8px",
              fontSize: "12px",
              color: theme.colors.textSecondary,
              lineHeight: 1.5,
            }}
          >
            <GitBranch
              size={12}
              style={{ float: "left", marginRight: "8px", marginTop: "2px" }}
            />
            Live collaboration metrics for open source projects. Data is
            simulated for demonstration purposes.
          </div>
        </div>

        {/* Main Content Area */}
        <div>
          {selectedRoom ? (
            <>
              {/* Room Header with Metrics */}
              <div
                style={{
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        marginBottom: "8px",
                      }}
                    >
                      {selectedRoom.name}
                    </h2>
                    <div
                      style={{
                        fontSize: "14px",
                        color: theme.colors.textSecondary,
                      }}
                    >
                      Repository: {selectedRoom.repository}
                    </div>
                  </div>

                  {/* Inline Metrics */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "20px",
                    }}
                  >
                    <div
                      style={{
                        textAlign: "center",
                        padding: "8px",
                        backgroundColor: theme.colors.backgroundTertiary,
                        borderRadius: "8px",
                        borderLeft: `3px solid ${theme.colors.info}`,
                      }}
                    >
                      <Zap
                        size={16}
                        color={theme.colors.info}
                        style={{ marginBottom: "4px" }}
                      />
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 600,
                          color: theme.colors.info,
                        }}
                      >
                        {metrics.avgSyncLatency.toFixed(0)}ms
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: theme.colors.textSecondary,
                        }}
                      >
                        Sync Latency
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        padding: "8px",
                        backgroundColor: theme.colors.backgroundTertiary,
                        borderRadius: "8px",
                        borderLeft: `3px solid ${theme.colors.success}`,
                      }}
                    >
                      <Clock
                        size={16}
                        color={theme.colors.success}
                        style={{ marginBottom: "4px" }}
                      />
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 600,
                          color: theme.colors.success,
                        }}
                      >
                        {metrics.timeBetweenSyncs.toFixed(1)}s
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: theme.colors.textSecondary,
                        }}
                      >
                        Between Syncs
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        padding: "8px",
                        backgroundColor: theme.colors.backgroundTertiary,
                        borderRadius: "8px",
                        borderLeft: `3px solid ${theme.colors.success}`,
                      }}
                    >
                      <AlertTriangle
                        size={16}
                        color={theme.colors.success}
                        style={{ marginBottom: "4px" }}
                      />
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 600,
                          color: theme.colors.success,
                        }}
                      >
                        {getTimeSinceLastCollision()}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: theme.colors.textSecondary,
                        }}
                      >
                        Last Collision
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        padding: "8px",
                        backgroundColor: theme.colors.backgroundTertiary,
                        borderRadius: "8px",
                        borderLeft: `3px solid ${theme.colors.primary}`,
                      }}
                    >
                      <Users
                        size={16}
                        color={theme.colors.primary}
                        style={{ marginBottom: "4px" }}
                      />
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: 600,
                          color: theme.colors.primary,
                        }}
                      >
                        {metrics.activeUsers}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: theme.colors.textSecondary,
                        }}
                      >
                        Active Users
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visualization Grid - Sync Network and Map */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "20px",
                  marginBottom: "20px",
                  height: "400px",
                }}
              >
                {/* Sync Network Visualization on the left */}
                <div style={{ height: "100%" }}>
                  <SyncPropagationVisualizer metrics={metrics} />
                </div>

                {/* Architecture Map on the right */}
                <div
                  style={{
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderRadius: "12px",
                    padding: "20px",
                    height: "100%",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      marginBottom: "12px",
                    }}
                  >
                    Active File Changes
                  </h3>
                  {cityData ? (
                    <div style={{ height: "calc(100% - 32px)" }}>
                      <ArchitectureMapHighlightLayers
                        cityData={cityData}
                        highlightLayers={highlightLayers}
                        onLayerToggle={() => {}}
                        onFileClick={() => {}}
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: "calc(100% - 32px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: theme.colors.textSecondary,
                      }}
                    >
                      Loading map...
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div
              style={{
                backgroundColor: theme.colors.backgroundSecondary,
                borderRadius: "12px",
                padding: "60px",
                textAlign: "center",
              }}
            >
              <GitBranch
                size={48}
                color={theme.colors.textSecondary}
                style={{ marginBottom: "20px" }}
              />
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                Select an Open Source Project
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: theme.colors.textSecondary,
                  maxWidth: "400px",
                  margin: "0 auto",
                  lineHeight: 1.5,
                }}
              >
                Choose an open source project from the sidebar to view real-time
                collaboration metrics and see how developers work together on
                popular repositories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LiveActivityPage() {
  return (
    <ThemeProvider>
      <LiveActivityContent />
    </ThemeProvider>
  );
}
