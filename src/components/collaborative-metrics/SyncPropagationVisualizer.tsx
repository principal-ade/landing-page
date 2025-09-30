"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "themed-markdown";
import { Zap, AlertTriangle } from "lucide-react";
import { MetricsData } from "./types";
import { AGENTS } from "./agents";

interface Props {
  metrics: MetricsData;
}

export const SyncPropagationVisualizer: React.FC<Props> = ({ metrics }) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const drawSyncWaves = () => {
      const canvas = canvasRef.current!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Center positions for the three-tier architecture - adjusted for taller canvas
      const remoteServer = { x: canvas.width * 0.5, y: 40, label: "GitHub" };
      const syncServer = {
        x: canvas.width * 0.5,
        y: canvas.height * 0.5,
        label: "Sync Server",
      };

      // Client nodes arranged around the bottom with padding - now with agent colors
      const clientNodes = AGENTS.map((agent, index) => ({
        x: canvas.width * (0.15 + index * 0.175),
        y: canvas.height - 40,
        color: agent.color,
        name: agent.name,
      }));

      // Draw connections - Remote to Sync Server
      ctx.strokeStyle = `${theme.colors.border}60`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(remoteServer.x, remoteServer.y);
      ctx.lineTo(syncServer.x, syncServer.y);
      ctx.stroke();

      // Draw connections - Sync Server to all clients
      ctx.strokeStyle = `${theme.colors.border}40`;
      ctx.lineWidth = 1;
      clientNodes.forEach((node) => {
        ctx.beginPath();
        ctx.moveTo(syncServer.x, syncServer.y);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();
      });

      // Draw Remote Server (GitHub)
      ctx.beginPath();
      ctx.arc(remoteServer.x, remoteServer.y, 12, 0, 2 * Math.PI);
      ctx.fillStyle = theme.colors.secondary || theme.colors.primary;
      ctx.fill();
      ctx.strokeStyle = theme.colors.accent;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw GitHub label
      ctx.fillStyle = theme.colors.textSecondary;
      ctx.font = `10px ${theme.fonts.body}`;
      ctx.textAlign = "center";
      ctx.fillText(remoteServer.label, remoteServer.x, remoteServer.y - 15);

      // Draw Sync Server
      ctx.beginPath();
      ctx.arc(syncServer.x, syncServer.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = theme.colors.info;
      ctx.fill();
      ctx.strokeStyle = theme.colors.accent;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Sync Server label
      ctx.fillStyle = theme.colors.textSecondary;
      ctx.font = `10px ${theme.fonts.body}`;
      ctx.textAlign = "center";
      ctx.fillText(syncServer.label, syncServer.x, syncServer.y - 15);

      // Draw Client Nodes with agent colors
      clientNodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = node.color;
        ctx.fill();
        ctx.strokeStyle = theme.colors.accent;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Draw Clients label
      ctx.fillStyle = theme.colors.textSecondary;
      ctx.font = `10px ${theme.fonts.body}`;
      ctx.textAlign = "center";
      ctx.fillText("Agent Clients", canvas.width * 0.5, canvas.height - 8);

      // Draw sync propagation waves - showing the actual flow
      metrics.recentSyncs.forEach((sync) => {
        const age = Date.now() - sync.timestamp;
        const maxAge = 4000; // Show last 4 seconds for complete cycle

        if (age < maxAge) {
          const progress = age / maxAge;
          const opacity = Math.max(0, 1 - progress);

          // Get initiator client node
          const hashValue = sync.initiatorHash
            .split("")
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const initiatorIndex = Math.abs(hashValue) % clientNodes.length;
          const initiatorNode = clientNodes[initiatorIndex];

          // Phase 1: Client pushes to GitHub (0-25% of animation)
          if (progress < 0.25) {
            const pushProgress = progress * 4; // 0 to 1 over first quarter
            const currentY =
              initiatorNode.y -
              (initiatorNode.y - remoteServer.y) * pushProgress;

            // Draw push line with agent color
            ctx.beginPath();
            ctx.moveTo(initiatorNode.x, initiatorNode.y);
            ctx.lineTo(
              initiatorNode.x +
                (remoteServer.x - initiatorNode.x) * pushProgress,
              currentY,
            );
            ctx.strokeStyle = `${initiatorNode.color}${Math.floor(opacity * 255)
              .toString(16)
              .padStart(2, "0")}`;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw pulse at current position with agent color
            ctx.beginPath();
            ctx.arc(
              initiatorNode.x +
                (remoteServer.x - initiatorNode.x) * pushProgress,
              currentY,
              4,
              0,
              2 * Math.PI,
            );
            ctx.fillStyle = initiatorNode.color;
            ctx.fill();
          }

          // Phase 2: GitHub notifies Sync Server (25-40% of animation)
          if (progress >= 0.25 && progress < 0.4) {
            const notifyProgress = (progress - 0.25) * 6.67; // 0 to 1 over this phase
            const currentY =
              remoteServer.y + (syncServer.y - remoteServer.y) * notifyProgress;

            // Draw notification line
            ctx.beginPath();
            ctx.moveTo(remoteServer.x, remoteServer.y);
            ctx.lineTo(remoteServer.x, currentY);
            ctx.strokeStyle = `${theme.colors.warning}${Math.floor(
              opacity * 255,
            )
              .toString(16)
              .padStart(2, "0")}`;
            ctx.lineWidth = 3;
            ctx.stroke();

            // Pulse at sync server when notification arrives
            if (notifyProgress > 0.8) {
              ctx.beginPath();
              ctx.arc(
                syncServer.x,
                syncServer.y,
                15 * (1 - (notifyProgress - 0.8) * 5),
                0,
                2 * Math.PI,
              );
              ctx.strokeStyle = `${theme.colors.warning}${Math.floor(
                opacity * 0.5 * 255,
              )
                .toString(16)
                .padStart(2, "0")}`;
              ctx.lineWidth = 2;
              ctx.stroke();
            }
          }

          // Phase 3: Sync Server broadcasts to all clients (40-60% of animation)
          if (progress >= 0.4 && progress < 0.6) {
            const broadcastProgress = (progress - 0.4) * 5; // 0 to 1 over this phase

            // Draw broadcast waves from sync server
            ctx.beginPath();
            ctx.arc(
              syncServer.x,
              syncServer.y,
              broadcastProgress * 30,
              0,
              2 * Math.PI,
            );
            ctx.strokeStyle = `${theme.colors.info}${Math.floor(
              opacity * 0.5 * 255,
            )
              .toString(16)
              .padStart(2, "0")}`;
            ctx.lineWidth = 2 * (1 - broadcastProgress);
            ctx.stroke();

            // Draw lines to each client
            clientNodes.forEach((node, i) => {
              if (i !== initiatorIndex) {
                // Don't notify the initiator
                const currentY =
                  syncServer.y + (node.y - syncServer.y) * broadcastProgress;
                const currentX =
                  syncServer.x + (node.x - syncServer.x) * broadcastProgress;

                ctx.beginPath();
                ctx.moveTo(syncServer.x, syncServer.y);
                ctx.lineTo(currentX, currentY);
                ctx.strokeStyle = `${theme.colors.info}${Math.floor(
                  opacity * 255,
                )
                  .toString(16)
                  .padStart(2, "0")}`;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            });
          }

          // Phase 4: Clients pull from GitHub (60-100% of animation)
          if (progress >= 0.6) {
            const pullProgress = (progress - 0.6) * 2.5; // 0 to 1 over last 40%

            // Each client pulls from GitHub
            clientNodes.forEach((node, i) => {
              if (i !== initiatorIndex) {
                // Initiator already has the changes
                // Stagger the pulls slightly
                const staggeredProgress = Math.max(
                  0,
                  Math.min(1, pullProgress - i * 0.1),
                );

                if (staggeredProgress > 0) {
                  const currentY =
                    node.y - (node.y - remoteServer.y) * staggeredProgress;
                  const currentX =
                    node.x + (remoteServer.x - node.x) * staggeredProgress;

                  // Draw pull line with agent color
                  ctx.beginPath();
                  ctx.moveTo(node.x, node.y);
                  ctx.lineTo(currentX, currentY);
                  ctx.strokeStyle = `${node.color}${Math.floor(opacity * 255)
                    .toString(16)
                    .padStart(2, "0")}`;
                  ctx.lineWidth = 1;
                  ctx.stroke();

                  // Success indicator when pull completes with agent color
                  if (staggeredProgress > 0.9) {
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
                    ctx.fillStyle = `${node.color}${Math.floor(
                      opacity * 0.3 * 255,
                    )
                      .toString(16)
                      .padStart(2, "0")}`;
                    ctx.fill();
                  }
                }
              }
            });
          }
        }
      });

      // Draw collision indicators
      metrics.recentCollisions.forEach((collision) => {
        const age = Date.now() - collision.timestamp;
        const maxAge = 5000; // Show last 5 seconds

        if (age < maxAge) {
          const opacity = Math.max(0, 1 - age / maxAge);
          const pulseSize = 10 + Math.sin(age / 100) * 5;

          // Draw collision at center
          ctx.beginPath();
          ctx.arc(
            canvas.width * 0.5,
            canvas.height * 0.5,
            pulseSize,
            0,
            2 * Math.PI,
          );
          ctx.fillStyle = `${collision.resolved ? theme.colors.warning : theme.colors.error}${Math.floor(
            opacity * 255,
          )
            .toString(16)
            .padStart(2, "0")}`;
          ctx.fill();
        }
      });
    };

    const animate = () => {
      drawSyncWaves();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [metrics, theme]);

  return (
    <div
      style={{
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.radii[2],
        padding: theme.space[3],
        height: "100%",
      }}
    >
      <h3
        style={{
          fontSize: theme.fontSizes[2],
          fontWeight: theme.fontWeights.heading,
          marginBottom: theme.space[2],
          color: theme.colors.text,
        }}
      >
        Live Sync Network
      </h3>
      <canvas
        ref={canvasRef}
        width={350}
        height={280}
        style={{
          width: "100%",
          height: "auto",
          backgroundColor: theme.colors.backgroundTertiary,
          borderRadius: theme.radii[1],
        }}
      />
      <div
        style={{
          marginTop: theme.space[2],
          fontSize: theme.fontSizes[0],
          color: theme.colors.textSecondary,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: theme.space[2],
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.space[1],
            }}
          >
            <Zap size={12} />
            <span>Sync</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.space[1],
            }}
          >
            <AlertTriangle size={12} />
            <span>Collision</span>
          </div>
        </div>
      </div>
    </div>
  );
};
