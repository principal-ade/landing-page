"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@a24z/industry-theme";
import { Logo } from "@a24z/logo-component";

import { RepositoryMap } from "@/components/repository-map";
import { EventPlaybackControls } from "@/components/EventPlaybackControls";
import {
  EventPlaybackService,
  MIN_PLAYBACK_SPEED,
  PlaybackState,
  PlaybackSpeed,
} from "@/services/EventPlaybackService";

const HOURS_TO_FETCH = 24;

interface User {
  id: string;
  email: string;
  login: string;
  name: string;
  avatar_url: string | null;
  github_access_token?: string | null;
}

interface TimelineEvent {
  timestamp?: string | null;
  timestampMs?: number;
  eventType?: string;
  toolName?: string;
  sessionId?: string;
  repoName?: string;
  repoOwner?: string;
}

interface RepositoryReference {
  gitRoot?: string;
  relativePath?: string;
  remoteUrl?: string;
  owner?: string;
  repo?: string;
}

interface NormalizedFile {
  originalPath?: string;
  absolutePath?: string;
  displayPath?: string;
  repository?: RepositoryReference;
}

interface RepositoryEvent {
  timestamp: string;
  timestampMs: number;
  eventType?: string;
  tool_name?: string;
  normalized_files?: NormalizedFile[];
  operation?: string;
  [key: string]: unknown;
}

interface DailyPlaybackEvent extends RepositoryEvent {
  repoOwner: string;
  repoName: string;
  sessionId: string;
  rawEvent: RepositoryEvent;
}

interface AccumulatedFiles {
  read: Set<string>;
  edited: Set<string>;
}

type AccumulatedByRepoState = Record<string, AccumulatedFiles>;
type CurrentEventsByRepoState = Record<string, RepositoryEvent | null>;
type CurrentSessionByRepoState = Record<string, string | null>;

const createEmptyAccumulated = (): AccumulatedFiles => ({
  read: new Set<string>(),
  edited: new Set<string>(),
});

const getRepoKey = (owner: string, repo: string) => `${owner}/${repo}`;

const normalizeRepositoryEvent = (event: RepositoryEvent): RepositoryEvent => {
  const rawTimestampMs = (event as any).timestampMs ?? (event as any).timestamp_ms;

  let timestampMs: number;
  if (typeof rawTimestampMs === "number" && Number.isFinite(rawTimestampMs)) {
    timestampMs = rawTimestampMs;
  } else if (typeof rawTimestampMs === "string") {
    const parsed = Number(rawTimestampMs);
    timestampMs = Number.isNaN(parsed) ? Date.parse(event.timestamp) : parsed;
  } else if (event.timestamp) {
    timestampMs = Date.parse(event.timestamp);
  } else {
    timestampMs = Date.now();
  }

  if (!Number.isFinite(timestampMs)) {
    timestampMs = Date.now();
  }

  const timestamp = event.timestamp ?? new Date(timestampMs).toISOString();
  const derivedEventType =
    event.eventType ||
    (event as any).event_type ||
    (event as any).eventType ||
    undefined;

  return {
    ...event,
    timestamp,
    timestampMs,
    eventType: derivedEventType,
  };
};

interface RepositorySummary {
  key: string;
  owner: string;
  repo: string;
  sessionCount: number;
  totalEvents: number;
  lastEventTimestamp: number | null;
}

const ObservatoryPage: React.FC = () => {
  const { theme } = useTheme();

  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  const [dailyEvents, setDailyEvents] = useState<DailyPlaybackEvent[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentEventsByRepo, setCurrentEventsByRepo] =
    useState<CurrentEventsByRepoState>({});
  const [accumulatedByRepo, setAccumulatedByRepo] =
    useState<AccumulatedByRepoState>({});
  const [currentSessionByRepo, setCurrentSessionByRepo] =
    useState<CurrentSessionByRepoState>({});

  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentIndex: -1,
    totalEvents: 0,
    speed: MIN_PLAYBACK_SPEED,
    currentEvent: null,
  });
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  const playbackServiceRef = useRef<EventPlaybackService | null>(null);
  const lastIndexRef = useRef<number>(-1);
  const previousEventTimestampByRepoRef = useRef<Record<string, number | null>>({});

  const isMobile = windowWidth < 768;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/user");
        const data = await response.json();

        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (authError) {
        console.error("[Observatory] Error checking auth", authError);
        setUser(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const repoSummaries = useMemo<RepositorySummary[]>(() => {
    if (dailyEvents.length === 0) {
      return [];
    }

    const summaryMap = new Map<string, {
      owner: string;
      repo: string;
      sessions: Set<string>;
      totalEvents: number;
      lastEventTimestamp: number | null;
    }>();

    dailyEvents.forEach(event => {
      const key = getRepoKey(event.repoOwner, event.repoName);
      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          owner: event.repoOwner,
          repo: event.repoName,
          sessions: new Set<string>(),
          totalEvents: 0,
          lastEventTimestamp: null,
        });
      }

      const summary = summaryMap.get(key)!;
      summary.sessions.add(event.sessionId);
      summary.totalEvents += 1;
      if (!summary.lastEventTimestamp || summary.lastEventTimestamp < event.timestampMs) {
        summary.lastEventTimestamp = event.timestampMs;
      }
    });

    return Array.from(summaryMap.entries()).map(([key, value]) => ({
      key,
      owner: value.owner,
      repo: value.repo,
      sessionCount: value.sessions.size,
      totalEvents: value.totalEvents,
      lastEventTimestamp: value.lastEventTimestamp,
    }));
  }, [dailyEvents]);

  const repoKeys = useMemo(() => repoSummaries.map(summary => summary.key), [repoSummaries]);

  const eventsByRepo = useMemo(() => {
    const map = new Map<string, DailyPlaybackEvent[]>();
    dailyEvents.forEach(event => {
      const key = getRepoKey(event.repoOwner, event.repoName);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(event);
    });
    return map;
  }, [dailyEvents]);

  const totalSessions = useMemo(() => {
    if (dailyEvents.length === 0) {
      return 0;
    }
    const uniqueSessions = new Set<string>();
    dailyEvents.forEach(event => uniqueSessions.add(event.sessionId));
    return uniqueSessions.size;
  }, [dailyEvents]);

  const timeWindow = useMemo(() => {
    if (dailyEvents.length === 0) {
      return { start: null, end: null, durationHours: 0 } as const;
    }

    const start = dailyEvents[0].timestampMs;
    const end = dailyEvents[dailyEvents.length - 1].timestampMs;
    const durationHours = (end - start) / (1000 * 60 * 60);
    return { start, end, durationHours } as const;
  }, [dailyEvents]);

  useEffect(() => {
    setCurrentTime(timeWindow.start ?? null);
  }, [timeWindow.start]);
  useEffect(() => {
    setCurrentEventsByRepo(prev => {
      const next: CurrentEventsByRepoState = {};
      repoKeys.forEach(key => {
        next[key] = prev[key] ?? null;
      });
      return next;
    });

    setAccumulatedByRepo(prev => {
      const next: AccumulatedByRepoState = {};
      repoKeys.forEach(key => {
        const existing = prev[key];
        next[key] = existing
          ? {
              read: new Set(existing.read),
              edited: new Set(existing.edited),
            }
          : createEmptyAccumulated();
      });
      return next;
    });

    setCurrentSessionByRepo(() => {
      const next: CurrentSessionByRepoState = {};
      repoKeys.forEach(key => {
        next[key] = null;
      });
      return next;
    });

    const resetTimestamps: Record<string, number | null> = {};
    repoKeys.forEach(key => {
      resetTimestamps[key] = null;
    });
    previousEventTimestampByRepoRef.current = resetTimestamps;
    lastIndexRef.current = -1;
  }, [repoKeys]);

  const resetPlaybackForRewind = useCallback(() => {
    setAccumulatedByRepo(() => {
      const next: AccumulatedByRepoState = {};
      repoKeys.forEach(key => {
        next[key] = createEmptyAccumulated();
      });
      return next;
    });

    setCurrentEventsByRepo(() => {
      const next: CurrentEventsByRepoState = {};
      repoKeys.forEach(key => {
        next[key] = null;
      });
      return next;
    });

    setCurrentSessionByRepo(() => {
      const next: CurrentSessionByRepoState = {};
      repoKeys.forEach(key => {
        next[key] = null;
      });
      return next;
    });

    const resetTimestamps: Record<string, number | null> = {};
    repoKeys.forEach(key => {
      resetTimestamps[key] = null;
    });
    previousEventTimestampByRepoRef.current = resetTimestamps;
  }, [repoKeys]);

  const handleDailyEvent = useCallback(
    (event: DailyPlaybackEvent, index: number) => {
      if (!event) {
        return;
      }

      if (index < lastIndexRef.current) {
        resetPlaybackForRewind();
      }

      lastIndexRef.current = index;

      const repoKey = getRepoKey(event.repoOwner, event.repoName);

      setCurrentEventsByRepo(prev => ({
        ...prev,
        [repoKey]: event.rawEvent,
      }));

      setCurrentSessionByRepo(prev => ({
        ...prev,
        [repoKey]: event.sessionId,
      }));

      const previousTimestamp = previousEventTimestampByRepoRef.current[repoKey];
      const currentTimestamp = event.timestampMs;

      if (
        previousTimestamp !== null &&
        typeof previousTimestamp === "number" &&
        currentTimestamp < previousTimestamp
      ) {
        setAccumulatedByRepo(prev => ({
          ...prev,
          [repoKey]: createEmptyAccumulated(),
        }));
      }

      const normalizedFiles = event.rawEvent.normalized_files ?? [];
      const filePaths = normalizedFiles
        .map(file => file.repository?.relativePath || file.displayPath)
        .filter((path): path is string => Boolean(path));

      if (filePaths.length > 0) {
        const operation = event.rawEvent.operation?.toLowerCase();
        setAccumulatedByRepo(prev => {
          const existing = prev[repoKey] ?? createEmptyAccumulated();
          const read = new Set(existing.read);
          const edited = new Set(existing.edited);

          if (operation === "read") {
            filePaths.forEach(path => read.add(path));
          } else if (operation === "edit" || operation === "write") {
            filePaths.forEach(path => edited.add(path));
          }

          return {
            ...prev,
            [repoKey]: {
              read,
              edited,
            },
          };
        });
      }

      previousEventTimestampByRepoRef.current[repoKey] = currentTimestamp;
      setCurrentTime(currentTimestamp);
    },
    [resetPlaybackForRewind]
  );

  useEffect(() => {
    const service = new EventPlaybackService();
    playbackServiceRef.current = service;

    const unsubscribeState = service.onStateChange(state => {
      setPlaybackState(state);
    });

    const unsubscribeEvent = service.onEventChange((event, index) => {
      handleDailyEvent(event as DailyPlaybackEvent, index);
    });

    return () => {
      unsubscribeState();
      unsubscribeEvent();
      service.destroy();
      playbackServiceRef.current = null;
    };
  }, [handleDailyEvent]);

  useEffect(() => {
    if (!playbackServiceRef.current) {
      return;
    }

    playbackServiceRef.current.loadEvents(dailyEvents);
  }, [dailyEvents]);

  useEffect(() => {
    if (isLoadingAuth) {
      return;
    }

    const fetchTimelineEvents = async () => {
      setIsLoadingData(true);
      setError(null);

      try {
        const headers: HeadersInit = {};
        if (user?.github_access_token) {
          headers["Authorization"] = `Bearer ${user.github_access_token}`;
        }

        const response = await fetch(
          `/api/agent-events/timeline?hours=${HOURS_TO_FETCH}`,
          { headers }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || data?.error || "Failed to fetch timeline events"
          );
        }

        const timelineEvents: TimelineEvent[] = Array.isArray(data.events)
          ? data.events
          : [];

        const sessionsByRepo = new Map<
          string,
          { repoOwner: string; repoName: string }
        >();

        timelineEvents.forEach(event => {
          if (event.sessionId && event.repoOwner && event.repoName) {
            const key = event.sessionId;
            if (!sessionsByRepo.has(key)) {
              sessionsByRepo.set(key, {
                repoOwner: event.repoOwner,
                repoName: event.repoName,
              });
            }
          }
        });

        if (sessionsByRepo.size === 0) {
          setDailyEvents([]);
          return;
        }

        const sessionEvents = await Promise.all(
          Array.from(sessionsByRepo.entries()).map(
            async ([sessionId, repoInfo]) => {
              try {
                const sessionResponse = await fetch(
                  `/api/agent-events/events?sessionId=${encodeURIComponent(
                    sessionId
                  )}`
                );
                const sessionData = await sessionResponse.json();

                if (!sessionResponse.ok) {
                  console.error(
                    `[Observatory] Failed to load events for session ${sessionId}`,
                    sessionData
                  );
                  return [] as DailyPlaybackEvent[];
                }

                const events: RepositoryEvent[] = Array.isArray(sessionData.events)
                  ? sessionData.events.map(normalizeRepositoryEvent)
                  : [];

                return events.map(event => ({
                  ...event,
                  eventType:
                    event.eventType ||
                    (event as any).event_type ||
                    event.tool_name ||
                    undefined,
                  repoOwner: repoInfo.repoOwner,
                  repoName: repoInfo.repoName,
                  sessionId,
                  rawEvent: event,
                }));
              } catch (sessionError) {
                console.error(
                  `[Observatory] Error fetching session ${sessionId} events`,
                  sessionError
                );
                return [] as DailyPlaybackEvent[];
              }
            }
          )
        );

        const flattenedEvents = sessionEvents.flat();
        flattenedEvents.sort((a, b) => a.timestampMs - b.timestampMs);

        setDailyEvents(flattenedEvents);
      } catch (timelineError) {
        console.error("[Observatory] Failed to fetch timeline", timelineError);
        setError(
          timelineError instanceof Error
            ? timelineError.message
            : "Failed to load timeline data"
        );
        setDailyEvents([]);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchTimelineEvents();
  }, [isLoadingAuth, user?.github_access_token]);

  const handlePlay = useCallback(() => {
    playbackServiceRef.current?.play();
  }, []);

  const handlePause = useCallback(() => {
    playbackServiceRef.current?.pause();
  }, []);

  const handleNext = useCallback(() => {
    playbackServiceRef.current?.next();
  }, []);

  const handlePrevious = useCallback(() => {
    playbackServiceRef.current?.previous();
  }, []);

  const handleGoToStart = useCallback(() => {
    playbackServiceRef.current?.goToStart();
  }, []);

  const handleGoToEnd = useCallback(() => {
    playbackServiceRef.current?.goToEnd();
  }, []);

  const handleSpeedChange = useCallback((speed: PlaybackSpeed) => {
    playbackServiceRef.current?.setSpeed(speed);
  }, []);

  const handleProgressChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const index = Number(event.target.value);
      if (!Number.isFinite(index)) {
        return;
      }
      playbackServiceRef.current?.goToIndex(Math.round(index));
    },
    []
  );

  const handleClearAccumulated = useCallback((repoKey: string) => {
    setAccumulatedByRepo(prev => ({
      ...prev,
      [repoKey]: createEmptyAccumulated(),
    }));
    previousEventTimestampByRepoRef.current[repoKey] = null;
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      const generateCodeChallenge = async () => {
        const codeVerifier =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const hash = await crypto.subtle.digest("SHA-256", data);
        const codeChallenge = btoa(
          String.fromCharCode(...new Uint8Array(hash))
        )
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
        return { codeVerifier, codeChallenge };
      };

      const { codeVerifier, codeChallenge } = await generateCodeChallenge();
      const state = Math.random().toString(36).substring(2, 15);

      sessionStorage.setItem("code_verifier", codeVerifier);
      sessionStorage.setItem("oauth_state", state);

      const response = await fetch("/api/auth/workos/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code_challenge: codeChallenge,
          state,
          return_url: window.location.href,
        }),
      });

      const data = await response.json();

      if (data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        console.error("[Observatory] Failed to get auth URL", data);
        alert("Authentication setup failed. Please try again.");
      }
    } catch (loginError) {
      console.error("[Observatory] Login error", loginError);
      alert("An error occurred. Please try again.");
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/auth/user", { method: "DELETE" });
      setUser(null);
    } catch (logoutError) {
      console.error("[Observatory] Logout error", logoutError);
    }
  }, []);

  const progressMax = Math.max(playbackState.totalEvents - 1, 0);
  const progressValue = playbackState.currentIndex >= 0 ? playbackState.currentIndex : 0;

  const formattedStart = timeWindow.start
    ? new Date(timeWindow.start).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";
  const formattedEnd = timeWindow.end
    ? new Date(timeWindow.end).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";
  const formattedCurrentTime = currentTime
    ? new Date(currentTime).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  const currentGlobalEvent = playbackState.currentEvent as DailyPlaybackEvent | null;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          borderBottom: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.backgroundSecondary,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: theme.space[4],
            padding: isMobile ? "8px 16px" : "16px 32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: theme.space[3] }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Logo
                width={isMobile ? 56 : 72}
                height={isMobile ? 56 : 72}
                color={theme.colors.primary}
                particleColor={theme.colors.accent}
                opacity={0.9}
              />
            </Link>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: isMobile ? "24px" : "32px",
                  fontWeight: 700,
                }}
              >
                Daily Observatory
              </h1>
              <div
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.fontSizes[1],
                }}
              >
                Review the last {HOURS_TO_FETCH} hours of activity across repositories.
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.space[3],
            }}
          >
            <Link
              href="/sessions"
              style={{
                padding: `${theme.space[2]} ${theme.space[3]}`,
                borderRadius: theme.radii[2],
                border: `1px solid ${theme.colors.border}`,
                textDecoration: "none",
                color: theme.colors.text,
                backgroundColor: theme.colors.background,
              }}
            >
              Sessions
            </Link>

            {isLoadingAuth ? (
              <div style={{ padding: `${theme.space[2]} ${theme.space[4]}` }}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: `2px solid ${theme.colors.border}`,
                    borderTopColor: theme.colors.primary,
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
              </div>
            ) : user ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.space[2],
                }}
              >
                {user.avatar_url && (
                  <Image
                    src={user.avatar_url}
                    alt={user.name}
                    width={isMobile ? 32 : 40}
                    height={isMobile ? 32 : 40}
                    style={{
                      borderRadius: "50%",
                      border: `2px solid ${theme.colors.border}`,
                    }}
                  />
                )}
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontWeight: theme.fontWeights.semibold,
                      fontSize: theme.fontSizes[2],
                    }}
                  >
                    {user.name}
                  </div>
                  <div
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: theme.fontSizes[0],
                    }}
                  >
                    @{user.login}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: `${theme.space[2]} ${theme.space[3]}`,
                    borderRadius: theme.radii[2],
                    border: `1px solid ${theme.colors.border}`,
                    backgroundColor: theme.colors.backgroundSecondary,
                    color: theme.colors.text,
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.space[2],
                  padding: `${theme.space[2]} ${theme.space[3]}`,
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.background,
                  borderRadius: theme.radii[2],
                  border: "none",
                  cursor: "pointer",
                  fontWeight: theme.fontWeights.semibold,
                }}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          padding: isMobile ? "16px" : "24px 48px",
          display: "flex",
          flexDirection: "column",
          gap: theme.space[4],
        }}
      >
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.space[3],
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii[3],
            padding: isMobile ? "16px" : "20px",
            backgroundColor: theme.colors.backgroundSecondary,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: theme.space[3],
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: theme.space[3], flexWrap: "wrap" }}>
              <div>
                <div
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.fontSizes[0],
                  }}
                >
                  Repositories
                </div>
                <div
                  style={{
                    fontSize: theme.fontSizes[4],
                    fontWeight: theme.fontWeights.bold,
                  }}
                >
                  {repoSummaries.length}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.fontSizes[0],
                  }}
                >
                  Sessions
                </div>
                <div
                  style={{
                    fontSize: theme.fontSizes[4],
                    fontWeight: theme.fontWeights.bold,
                  }}
                >
                  {totalSessions}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: theme.colors.textSecondary,
                    fontSize: theme.fontSizes[0],
                  }}
                >
                  Events
                </div>
                <div
                  style={{
                    fontSize: theme.fontSizes[4],
                    fontWeight: theme.fontWeights.bold,
                  }}
                >
                  {dailyEvents.length}
                </div>
              </div>
            </div>

            <div style={{ textAlign: isMobile ? "left" : "right" }}>
              <div
                style={{
                  color: theme.colors.textSecondary,
                  fontSize: theme.fontSizes[0],
                }}
              >
                Time Window
              </div>
              <div style={{ fontWeight: theme.fontWeights.medium }}>
                {formattedStart} – {formattedEnd}
              </div>
              <div style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes[0] }}>
                Current marker: {formattedCurrentTime}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: theme.space[2],
            }}
          >
            <label
              htmlFor="observatory-progress"
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: theme.colors.textSecondary,
                fontSize: theme.fontSizes[0],
              }}
            >
              <span>Daily timeline</span>
              <span>
                Event {Math.min(progressValue + 1, playbackState.totalEvents)} of {playbackState.totalEvents}
              </span>
            </label>
            <input
              id="observatory-progress"
              type="range"
              min={0}
              max={progressMax}
              step={1}
              value={Math.min(progressValue, progressMax)}
              onChange={handleProgressChange}
              disabled={playbackState.totalEvents === 0}
              style={{
                width: "100%",
                accentColor: theme.colors.primary,
              }}
            />
          </div>

          <EventPlaybackControls
            playbackState={playbackState}
            onPlay={handlePlay}
            onPause={handlePause}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onGoToStart={handleGoToStart}
            onGoToEnd={handleGoToEnd}
            onSpeedChange={handleSpeedChange}
          />

          {currentGlobalEvent && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: theme.space[3],
                padding: theme.space[3],
                borderRadius: theme.radii[2],
                backgroundColor: theme.colors.background,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div>
                <div style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes[0] }}>
                  Repository
                </div>
                <div style={{ fontWeight: theme.fontWeights.medium }}>
                  {getRepoKey(currentGlobalEvent.repoOwner, currentGlobalEvent.repoName)}
                </div>
              </div>
              <div>
                <div style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes[0] }}>
                  Session
                </div>
                <div style={{ fontWeight: theme.fontWeights.medium }}>
                  {currentGlobalEvent.sessionId}
                </div>
              </div>
              <div>
                <div style={{ color: theme.colors.textSecondary, fontSize: theme.fontSizes[0] }}>
                  Event
                </div>
                <div style={{ fontWeight: theme.fontWeights.medium }}>
                  {currentGlobalEvent.eventType || currentGlobalEvent.tool_name || "Unknown"}
                </div>
              </div>
            </div>
          )}
        </section>

        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.space[4],
          }}
        >
          {isLoadingData ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "80px 0",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  border: `3px solid ${theme.colors.border}`,
                  borderTopColor: theme.colors.primary,
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
            </div>
          ) : error ? (
            <div
              style={{
                border: `1px solid ${theme.colors.error}`,
                backgroundColor: theme.colors.errorMuted,
                color: theme.colors.error,
                padding: theme.space[4],
                borderRadius: theme.radii[2],
              }}
            >
              <strong>Unable to load events.</strong> {error}
            </div>
          ) : repoSummaries.length === 0 ? (
            <div
              style={{
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii[2],
                padding: theme.space[4],
                textAlign: "center",
                color: theme.colors.textSecondary,
              }}
            >
              No events recorded in the last {HOURS_TO_FETCH} hours.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: theme.space[4],
                gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              }}
            >
              {repoSummaries.map(summary => {
                const repoKey = summary.key;
                const currentEvent = currentEventsByRepo[repoKey];
                const accumulatedFiles = accumulatedByRepo[repoKey];
                const currentSession = currentSessionByRepo[repoKey];
                const repoEvents = eventsByRepo.get(repoKey) || [];
                const lastEventLabel = summary.lastEventTimestamp
                  ? new Date(summary.lastEventTimestamp).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "—";

                return (
                  <div
                    key={repoKey}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: theme.space[3],
                      padding: theme.space[3],
                      borderRadius: theme.radii[3],
                      border: `1px solid ${theme.colors.border}`,
                      backgroundColor: theme.colors.backgroundSecondary,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: theme.space[3],
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: theme.fontSizes[2],
                            fontWeight: theme.fontWeights.semibold,
                          }}
                        >
                          {summary.owner}/{summary.repo}
                        </div>
                        <div
                          style={{
                            color: theme.colors.textSecondary,
                            fontSize: theme.fontSizes[0],
                          }}
                        >
                          {summary.sessionCount} sessions • {summary.totalEvents} events
                        </div>
                        <div
                          style={{
                            color: theme.colors.textSecondary,
                            fontSize: theme.fontSizes[0],
                          }}
                        >
                          Last event: {lastEventLabel}
                        </div>
                      </div>
                      <button
                        onClick={() => handleClearAccumulated(repoKey)}
                        style={{
                          border: `1px solid ${theme.colors.border}`,
                          backgroundColor: theme.colors.background,
                          color: theme.colors.text,
                          borderRadius: theme.radii[1],
                          padding: `${theme.space[1]} ${theme.space[2]}`,
                          cursor: "pointer",
                        }}
                      >
                        Clear highlights
                      </button>
                    </div>

                    <div
                      style={{
                        borderRadius: theme.radii[2],
                        overflow: "hidden",
                        height: 320,
                        backgroundColor: theme.colors.background,
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    >
                      <RepositoryMap
                        owner={summary.owner}
                        repo={summary.repo}
                        className="w-full h-full"
                        currentEvent={currentEvent ?? undefined}
                        isPlaying={playbackState.isPlaying}
                        accumulatedFiles={accumulatedFiles}
                        githubToken={user?.github_access_token || null}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: theme.space[1],
                        backgroundColor: theme.colors.background,
                        borderRadius: theme.radii[2],
                        padding: theme.space[3],
                        border: `1px solid ${theme.colors.border}`,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          color: theme.colors.textSecondary,
                          fontSize: theme.fontSizes[0],
                        }}
                      >
                        <span>Active session</span>
                        <span>Event</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: theme.space[2],
                          fontWeight: theme.fontWeights.medium,
                        }}
                      >
                        <span>{currentSession ?? "—"}</span>
                        <span>{currentEvent?.eventType || currentEvent?.tool_name || "—"}</span>
                      </div>
                      <div
                        style={{
                          color: theme.colors.textSecondary,
                          fontSize: theme.fontSizes[0],
                        }}
                      >
                        Events today: {repoEvents.length}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ObservatoryPage;
