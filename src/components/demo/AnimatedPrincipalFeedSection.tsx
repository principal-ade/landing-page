'use client';

import React, { useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Heart, ArrowRight, Smartphone, BookOpen } from 'lucide-react';
import Link from 'next/link';

// Color palette
const NAVY = '#1a2842';
const BLUE_DARK = '#2d4563';
const BLUE_MID = '#4a6fa5';
const BLUE_LIGHT = '#6b9bd1';
const ORANGE = '#ff6b35';
const GREEN = '#4ade80';
const RED = '#ef4444';

interface FileBlock {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string; // green = new file, orange = modified, blue = unchanged
  delay: number;
  author?: string; // which user touched this file
}

interface ActivityCard {
  id: string;
  repoName: string;
  author: string;
  collaborators: string[];
  message: string;
  additions: number;
  deletions: number;
  fileCount: number;
  timeAgo: string;
  fileBlocks: FileBlock[];
}

function MiniFileCity({
  blocks,
  isInView,
  selectedAuthor
}: {
  blocks: FileBlock[];
  isInView: boolean;
  selectedAuthor: string | null;
}) {
  return (
    <div
      style={{
        width: '160px',
        height: '160px',
        background: NAVY,
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden',
        border: '2px solid #000',
        flexShrink: 0,
      }}
    >
      {blocks.map((block, idx) => {
        const isHighlighted = selectedAuthor === null || block.author === selectedAuthor;

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView
                ? {
                    opacity: isHighlighted ? 1 : 0.25,
                    scale: 1,
                  }
                : {}
            }
            transition={{
              duration: 0.3,
              delay: block.delay,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              position: 'absolute',
              left: `${block.x}%`,
              top: `${block.y}%`,
              width: `${block.width}%`,
              height: `${block.height}%`,
              background: block.color,
              border: '1px solid #000',
              transition: 'opacity 0.3s ease',
            }}
          />
        );
      })}
    </div>
  );
}

export function AnimatedPrincipalFeedSection({ isMobile }: { isMobile: boolean }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [selectedAuthors, setSelectedAuthors] = React.useState<Record<string, string | null>>({});

  const activities = useMemo<ActivityCard[]>(() => {
    return [
      {
        id: '1',
        repoName: 'openclaw',
        author: 'OS',
        collaborators: ['CM', 'JA'],
        message: 'fix: map runtime modes to correct permission levels (#1587)',
        additions: 189,
        deletions: 105,
        fileCount: 9,
        timeAgo: '4m ago',
        fileBlocks: [
          { x: 5, y: 5, width: 35, height: 40, color: ORANGE, delay: 0.1, author: 'OS' },
          { x: 42, y: 5, width: 28, height: 32, color: BLUE_MID, delay: 0.15, author: 'CM' },
          { x: 72, y: 5, width: 23, height: 38, color: ORANGE, delay: 0.2, author: 'OS' },
          { x: 5, y: 47, width: 18, height: 22, color: GREEN, delay: 0.25, author: 'JA' },
          { x: 25, y: 47, width: 15, height: 22, color: BLUE_DARK, delay: 0.3, author: 'JA' },
          { x: 42, y: 39, width: 12, height: 20, color: ORANGE, delay: 0.35, author: 'OS' },
          { x: 56, y: 39, width: 14, height: 28, color: BLUE_LIGHT, delay: 0.4, author: 'CM' },
          { x: 72, y: 45, width: 11, height: 23, color: GREEN, delay: 0.45, author: 'JA' },
          { x: 85, y: 45, width: 10, height: 23, color: BLUE_MID, delay: 0.5, author: 'OS' },
          { x: 5, y: 71, width: 35, height: 19, color: BLUE_LIGHT, delay: 0.55, author: 'CM' },
          { x: 42, y: 61, width: 28, height: 29, color: GREEN, delay: 0.6, author: 'JA' },
          { x: 72, y: 70, width: 23, height: 20, color: ORANGE, delay: 0.65, author: 'OS' },
        ],
      },
      {
        id: '2',
        repoName: 'paperclip',
        author: 'TC',
        collaborators: ['DP'],
        message: 'refactor: modernize state management hooks',
        additions: 234,
        deletions: 156,
        fileCount: 12,
        timeAgo: '18m ago',
        fileBlocks: [
          { x: 5, y: 5, width: 40, height: 45, color: ORANGE, delay: 0.1, author: 'TC' },
          { x: 47, y: 5, width: 25, height: 30, color: GREEN, delay: 0.15, author: 'TC' },
          { x: 74, y: 5, width: 21, height: 42, color: BLUE_MID, delay: 0.2, author: 'DP' },
          { x: 5, y: 52, width: 20, height: 20, color: ORANGE, delay: 0.25, author: 'TC' },
          { x: 27, y: 52, width: 18, height: 20, color: BLUE_LIGHT, delay: 0.3, author: 'DP' },
          { x: 47, y: 37, width: 15, height: 28, color: GREEN, delay: 0.35, author: 'TC' },
          { x: 64, y: 37, width: 10, height: 28, color: ORANGE, delay: 0.4, author: 'TC' },
          { x: 76, y: 49, width: 19, height: 20, color: BLUE_DARK, delay: 0.45, author: 'DP' },
          { x: 5, y: 74, width: 40, height: 16, color: GREEN, delay: 0.5, author: 'TC' },
          { x: 47, y: 67, width: 27, height: 23, color: BLUE_MID, delay: 0.55, author: 'DP' },
          { x: 76, y: 71, width: 19, height: 19, color: ORANGE, delay: 0.6, author: 'TC' },
        ],
      },
      {
        id: '3',
        repoName: 'gstack',
        author: 'CA',
        collaborators: ['AI', 'JA'],
        message: 'feat: add telemetry integration for agent workflows',
        additions: 456,
        deletions: 89,
        fileCount: 23,
        timeAgo: '43m ago',
        fileBlocks: [
          { x: 5, y: 5, width: 30, height: 38, color: GREEN, delay: 0.1, author: 'CA' },
          { x: 37, y: 5, width: 25, height: 45, color: GREEN, delay: 0.15, author: 'CA' },
          { x: 64, y: 5, width: 31, height: 32, color: ORANGE, delay: 0.2, author: 'AI' },
          { x: 5, y: 45, width: 15, height: 25, color: BLUE_MID, delay: 0.25, author: 'JA' },
          { x: 22, y: 45, width: 13, height: 25, color: GREEN, delay: 0.3, author: 'CA' },
          { x: 37, y: 52, width: 10, height: 20, color: ORANGE, delay: 0.35, author: 'AI' },
          { x: 49, y: 52, width: 13, height: 20, color: BLUE_LIGHT, delay: 0.4, author: 'JA' },
          { x: 64, y: 39, width: 16, height: 24, color: GREEN, delay: 0.45, author: 'CA' },
          { x: 82, y: 39, width: 13, height: 24, color: ORANGE, delay: 0.5, author: 'AI' },
          { x: 5, y: 72, width: 30, height: 18, color: ORANGE, delay: 0.55, author: 'AI' },
          { x: 37, y: 74, width: 25, height: 16, color: BLUE_MID, delay: 0.6, author: 'JA' },
          { x: 64, y: 65, width: 31, height: 25, color: GREEN, delay: 0.65, author: 'CA' },
        ],
      },
    ];
  }, []);

  return (
    <section
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: NAVY,
        padding: isMobile ? '80px 24px' : '100px 40px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1200px', width: '100%' }}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: 'center',
            marginBottom: isMobile ? '48px' : '64px',
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? '36px' : '56px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '24px',
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            For the{' '}
            <Heart
              size={isMobile ? 36 : 48}
              fill={ORANGE}
              stroke={ORANGE}
              style={{ flexShrink: 0 }}
            />{' '}
            of following the work.
          </h2>
          <p
            style={{
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: '800',
              color: ORANGE,
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Principal Activity Feed
          </p>
          <p
            style={{
              fontSize: isMobile ? '15px' : '17px',
              color: BLUE_LIGHT,
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              lineHeight: 1.5,
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            A live stream of how software evolves. Across your repos, your team, and the builders shaping the code you depend on. Even the non-human ones.
          </p>
        </motion.div>

        {/* Feed Cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '20px' : '24px',
            marginBottom: isMobile ? '40px' : '60px',
          }}
        >
          {activities.map((activity, cardIndex) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.3 + cardIndex * 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
              style={{
                background: `linear-gradient(135deg, ${NAVY} 0%, #0d1628 100%)`,
                borderRadius: '12px',
                padding: isMobile ? '20px' : '24px',
                border: `2px solid ${BLUE_DARK}`,
              }}
            >
              {/* Main Content: File City + Message + Stats */}
              <div
                style={{
                  display: 'flex',
                  gap: isMobile ? '16px' : '20px',
                  alignItems: 'flex-start',
                }}
              >
                {/* Mini File City */}
                {!isMobile && (
                  <MiniFileCity
                    blocks={activity.fileBlocks}
                    isInView={isInView}
                    selectedAuthor={selectedAuthors[activity.id] || null}
                  />
                )}

                {/* Message + Stats */}
                <div style={{ flex: 1 }}>
                  {/* Repo Name + Time */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.3 + cardIndex * 0.2 }}
                      style={{
                        color: BLUE_LIGHT,
                        fontSize: '14px',
                        fontWeight: '600',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      {activity.repoName}
                    </motion.span>
                    <span style={{ color: BLUE_LIGHT, fontSize: '13px', fontFamily: 'monospace' }}>
                      {activity.timeAgo}
                    </span>
                  </div>

                  {/* Avatars */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    {/* Collaboration Line with Avatars */}
                    {[activity.author, ...activity.collaborators].map((user, idx) => {
                      const isSelected = selectedAuthors[activity.id] === user;

                      return (
                        <React.Fragment key={idx}>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={isInView ? { scale: 1 } : {}}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.3 + cardIndex * 0.2 + idx * 0.1,
                              type: 'spring',
                              stiffness: 300,
                            }}
                            onClick={() => {
                              setSelectedAuthors((prev) => ({
                                ...prev,
                                [activity.id]: prev[activity.id] === user ? null : user,
                              }));
                            }}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              background: idx === 0 ? ORANGE : BLUE_LIGHT,
                              border: isSelected ? `3px solid #ffffff` : '2px solid #000',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: '700',
                              color: '#ffffff',
                              fontFamily: 'Inter, sans-serif',
                              cursor: 'pointer',
                              boxShadow: isSelected ? `0 0 12px ${idx === 0 ? ORANGE : BLUE_LIGHT}` : 'none',
                              transition: 'border 0.2s ease, box-shadow 0.2s ease',
                              marginRight: idx < activity.collaborators.length ? '8px' : '0',
                            }}
                          >
                            {user}
                          </motion.div>
                          {idx < activity.collaborators.length && (
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={isInView ? { scaleX: 1 } : {}}
                              transition={{
                                duration: 0.3,
                                delay: 0.3 + cardIndex * 0.2 + idx * 0.1 + 0.2,
                              }}
                              style={{
                                width: '24px',
                                height: '2px',
                                background: BLUE_LIGHT,
                                transformOrigin: 'left',
                                marginRight: '8px',
                              }}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Commit Message */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + cardIndex * 0.2 + 0.4 }}
                    style={{
                      color: '#ffffff',
                      fontSize: isMobile ? '14px' : '15px',
                      fontWeight: '600',
                      fontFamily: 'Inter, sans-serif',
                      marginBottom: '12px',
                    }}
                  >
                    {activity.message}
                  </motion.p>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + cardIndex * 0.2 + 0.5 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                      marginBottom: '12px',
                    }}
                  >
                    <span style={{ color: GREEN, fontWeight: '700' }}>+{activity.additions}</span>
                    <span style={{ color: RED, fontWeight: '700' }}>-{activity.deletions}</span>
                    <span style={{ color: BLUE_LIGHT }}>{activity.fileCount} files</span>
                  </motion.div>

                  {/* Addition/Deletion Bars */}
                  <div style={{ display: 'flex', gap: '4px', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={isInView ? { scaleX: 1 } : {}}
                      transition={{
                        duration: 0.8,
                        delay: 0.3 + cardIndex * 0.2 + 0.6,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      style={{
                        flex: activity.additions,
                        background: GREEN,
                        transformOrigin: 'left',
                        borderRadius: '2px',
                      }}
                    />
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={isInView ? { scaleX: 1 } : {}}
                      transition={{
                        duration: 0.8,
                        delay: 0.3 + cardIndex * 0.2 + 0.7,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      style={{
                        flex: activity.deletions,
                        background: RED,
                        transformOrigin: 'left',
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Link
            href="https://app.principal-ade.com/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: ORANGE,
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '600',
              textDecoration: 'none',
              fontFamily: 'var(--font-inter, Inter, sans-serif)',
              padding: isMobile ? '12px 24px' : '14px 32px',
              border: `2px solid ${ORANGE}`,
              borderRadius: '12px',
              transition: 'all 0.3s ease',
            }}
          >
            Go to Live Feed
            <ArrowRight size={20} strokeWidth={2.5} />
          </Link>

          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '12px' : '24px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Link
              href="/principal-feed"
              style={{
                color: BLUE_MID,
                fontSize: isMobile ? '15px' : '16px',
                fontWeight: '500',
                textDecoration: 'none',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                borderBottom: `1px solid ${BLUE_MID}`,
                transition: 'opacity 0.2s ease',
              }}
            >
              Learn more about Principal Feed →
            </Link>

            <Link
              href="https://apps.apple.com/us/app/principal-ai/id6761268899"
              style={{
                color: BLUE_MID,
                fontSize: isMobile ? '15px' : '16px',
                fontWeight: '500',
                textDecoration: 'none',
                fontFamily: 'var(--font-inter, Inter, sans-serif)',
                borderBottom: `1px solid ${BLUE_MID}`,
                transition: 'opacity 0.2s ease',
              }}
            >
              Get iOS app →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
