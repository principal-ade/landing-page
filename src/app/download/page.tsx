"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Download,
  Monitor,
  Apple,
  Package,
  Info,
} from "lucide-react";
import { useTheme } from "@a24z/industry-theme";
import { Logo } from "@a24z/logo-component";

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

function DownloadPageContent() {
  const { theme } = useTheme();
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<
    "mac" | "windows" | "linux" | null
  >(null);

  // Responsive breakpoints
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

  const detectPlatform = useCallback(() => {
    if (releases.length === 0) return; // Wait for releases to load

    const userAgent = window.navigator.userAgent.toLowerCase();
    let detectedPlatform: "mac" | "windows" | "linux" | null = null;

    if (userAgent.includes("mac")) {
      detectedPlatform = "mac";
    } else if (userAgent.includes("win")) {
      detectedPlatform = "windows";
    } else if (userAgent.includes("linux")) {
      detectedPlatform = "linux";
    }

    // Only set the platform if we have a download available for it
    if (
      detectedPlatform &&
      releases[0] &&
      getAssetForPlatform(releases[0], detectedPlatform)
    ) {
      setSelectedPlatform(detectedPlatform);
    }
  }, [releases]);

  useEffect(() => {
    fetchReleases();
  }, []);

  // Detect platform after releases are loaded
  useEffect(() => {
    if (releases.length > 0) {
      detectPlatform();
    }
  }, [releases, detectPlatform]);

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
      setError(err instanceof Error ? err.message : "Failed to load releases");
    } finally {
      setLoading(false);
    }
  };

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

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
      }}
    >
      {/* Logo in top left as back button */}
      <Link
        href="/"
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 1000,
          textDecoration: "none",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <Logo
          width={isMobile ? 40 : 50}
          height={isMobile ? 40 : 50}
          color={theme.colors.primary}
          particleColor={theme.colors.accent}
          opacity={0.9}
        />
      </Link>

      {/* Logo in top right */}
      <Link
        href="/"
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          textDecoration: "none",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <Logo
          width={isMobile ? 40 : 50}
          height={isMobile ? 40 : 50}
          color={theme.colors.primary}
          particleColor={theme.colors.accent}
          opacity={0.9}
        />
      </Link>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "20px" : "40px 20px",
        }}
      >
        <header style={{ marginBottom: "60px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: isMobile ? "32px" : isTablet ? "40px" : "48px",
              fontWeight: "700",
              marginBottom: isMobile ? "12px" : "16px",
              color: theme.colors.primary,
              width: "100%",
            }}
          >
            Download ADE
          </h1>
        </header>

        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div
              style={{
                display: "inline-block",
                width: "40px",
                height: "40px",
                border: `3px solid ${theme.colors.border}`,
                borderTop: `3px solid ${theme.colors.primary}`,
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <style jsx>{`
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: theme.colors.error + "20",
              border: `1px solid ${theme.colors.error}`,
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {!loading &&
          !error &&
          releases.length > 0 &&
          (() => {
            const allPlatforms = [
              { id: "mac", icon: Apple, label: "macOS" },
              { id: "windows", icon: Monitor, label: "Windows" },
              { id: "linux", icon: Package, label: "Linux" },
            ];

            const availablePlatforms = allPlatforms.filter(({ id }) => {
              return releases[0] && getAssetForPlatform(releases[0], id as any);
            });

            const unavailablePlatforms = allPlatforms.filter(({ id }) => {
              return (
                !releases[0] || !getAssetForPlatform(releases[0], id as any)
              );
            });

            if (availablePlatforms.length === 0) {
              return (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    backgroundColor: theme.colors.backgroundSecondary,
                    borderRadius: "12px",
                  }}
                >
                  <Info
                    size={48}
                    style={{
                      color: theme.colors.textSecondary,
                      marginBottom: "16px",
                    }}
                  />
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      marginBottom: "8px",
                      color: theme.colors.text,
                    }}
                  >
                    No Downloads Available
                  </h3>
                  <p
                    style={{
                      color: theme.colors.textSecondary,
                      fontSize: "16px",
                      margin: 0,
                    }}
                  >
                    Downloads are being prepared. Please check back soon.
                  </p>
                </div>
              );
            }

            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "16px",
                    marginBottom: "40px",
                    flexWrap: "wrap",
                  }}
                >
                  {availablePlatforms.map(({ id, icon: Icon, label }) => {
                    const isSelected = selectedPlatform === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setSelectedPlatform(id as any)}
                        style={{
                          padding: "16px 32px",
                          backgroundColor: isSelected
                            ? theme.colors.primary
                            : theme.colors.backgroundSecondary,
                          border: `2px solid ${isSelected ? theme.colors.primary : theme.colors.border}`,
                          borderRadius: "8px",
                          color: isSelected ? "white" : theme.colors.text,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "16px",
                          fontWeight: "600",
                          transition: "all 0.2s",
                        }}
                      >
                        <Icon size={20} />
                        {label}
                      </button>
                    );
                  })}

                  {/* Coming Soon platforms */}
                  {unavailablePlatforms.map(({ id, icon: Icon, label }) => {
                    return (
                      <div
                        key={`${id}-coming-soon`}
                        style={{
                          padding: "16px 32px",
                          backgroundColor: theme.colors.backgroundTertiary,
                          border: `2px solid ${theme.colors.border}`,
                          borderRadius: "8px",
                          color: theme.colors.textSecondary,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "16px",
                          fontWeight: "600",
                          opacity: 0.7,
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Icon size={20} />
                          {label}
                        </div>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "400",
                            color: theme.colors.textMuted,
                          }}
                        >
                          Coming Soon
                        </span>
                      </div>
                    );
                  })}
                </div>

                {selectedPlatform && (
                  <div
                    style={{
                      backgroundColor: theme.colors.backgroundSecondary,
                      borderRadius: "12px",
                      padding: isMobile ? "20px" : "32px",
                      marginBottom: isMobile ? "24px" : "40px",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: isMobile ? "20px" : "24px",
                        fontWeight: "600",
                        marginBottom: isMobile ? "16px" : "24px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <Download size={24} />
                      Latest Release
                    </h2>

                    {releases[0] && (
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "20px",
                            flexWrap: "wrap",
                            gap: "16px",
                          }}
                        >
                          <div>
                            <h3
                              style={{
                                fontSize: isMobile ? "18px" : "20px",
                                fontWeight: "600",
                                marginBottom: "8px",
                              }}
                            >
                              {releases[0].name || releases[0].tag_name}
                            </h3>
                            <p
                              style={{
                                color: theme.colors.textSecondary,
                                fontSize: "14px",
                              }}
                            >
                              Released {formatDate(releases[0].published_at)}
                            </p>
                          </div>

                          {(() => {
                            const asset = getAssetForPlatform(
                              releases[0],
                              selectedPlatform,
                            );
                            return asset ? (
                              <a
                                href={`/api/github/download?assetId=${asset.id}&filename=${encodeURIComponent(asset.name)}`}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  padding: isMobile ? "10px 20px" : "12px 24px",
                                  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary || theme.colors.primary} 100%)`,
                                  color: "white",
                                  borderRadius: "8px",
                                  textDecoration: "none",
                                  fontWeight: "600",
                                  fontSize: isMobile ? "14px" : "16px",
                                  transition: "transform 0.2s",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform =
                                    "translateY(-2px) scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform =
                                    "translateY(0) scale(1)";
                                }}
                              >
                                <Download size={20} />
                                Download ({formatFileSize(asset.size)})
                              </a>
                            ) : (
                              <div
                                style={{
                                  padding: "12px 24px",
                                  backgroundColor:
                                    theme.colors.backgroundTertiary,
                                  borderRadius: "8px",
                                  color: theme.colors.textSecondary,
                                }}
                              >
                                No download available for this platform
                              </div>
                            );
                          })()}
                        </div>

                        {releases[0].body && (
                          <div
                            style={{
                              backgroundColor: theme.colors.backgroundTertiary,
                              borderRadius: "8px",
                              padding: "20px",
                              marginTop: "20px",
                            }}
                          >
                            <h4
                              style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                marginBottom: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <Info size={16} />
                              Release Notes
                            </h4>
                            <div
                              style={{
                                fontSize: "14px",
                                lineHeight: "1.6",
                                color: theme.colors.textSecondary,
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {releases[0].body}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Join Waitlist section for unavailable platforms */}
                {unavailablePlatforms.length > 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: isMobile ? "20px" : "32px",
                      backgroundColor: theme.colors.backgroundSecondary,
                      borderRadius: "12px",
                      marginTop: isMobile ? "24px" : "40px",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: isMobile ? "18px" : "20px",
                        fontWeight: "600",
                        marginBottom: "12px",
                        color: theme.colors.text,
                      }}
                    >
                      Want{" "}
                      {unavailablePlatforms.map((p) => p.label).join(" & ")}{" "}
                      Support?
                    </h3>
                    <p
                      style={{
                        fontSize: isMobile ? "14px" : "16px",
                        color: theme.colors.textSecondary,
                        marginBottom: "24px",
                        maxWidth: isMobile ? "100%" : "500px",
                        margin: "0 auto 24px auto",
                      }}
                    >
                      We&apos;re working on builds for all platforms. Join our
                      Discord to get notified when they&apos;re ready!
                    </p>
                    <button
                      onClick={() => {
                        window.open("https://discord.gg/TGf9SVFZ", "_blank");
                      }}
                      style={{
                        padding: isMobile ? "10px 20px" : "12px 24px",
                        fontSize: isMobile ? "14px" : "16px",
                        backgroundColor: "#5865f2", // Discord brand color
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.9";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 -28.5 256 256"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                      >
                        <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" />
                      </svg>
                      Join Waitlist on Discord
                    </button>
                  </div>
                )}

                <div
                  style={{
                    textAlign: "center",
                    marginTop: "60px",
                    paddingTop: "40px",
                    borderTop: `1px solid ${theme.colors.border}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      color: theme.colors.textSecondary,
                      margin: 0,
                    }}
                  >
                    Need help or have questions? Contact our support team.
                  </p>
                </div>
              </>
            );
          })()}
      </div>
    </div>
  );
}

export default function DownloadPage() {
  return <DownloadPageContent />;
}
