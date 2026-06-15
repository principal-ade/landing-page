"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { typography, spacing, px } from '../designSystem';

interface PrincipalTrailCardProps {
  trailId: string;
  url: string;
  isMobile?: boolean;
  delay?: number;
}

interface TrailData {
  owner: string;
  repo: string;
  entry: {
    title: string;
    summaryPreview: string;
    markerCount: number;
    createdBy: {
      githubLogin: string;
    };
    createdAt: string;
    updatedAt: string;
  };
  payload: {
    visitors?: {
      named: string[];
      anonymousCount: number;
    };
    notes?: Array<{
      body: string;
      author: string;
    }>;
  };
}

export const PrincipalTrailCard: React.FC<PrincipalTrailCardProps> = ({
  trailId,
  url,
  isMobile = false,
  delay = 0,
}) => {
  const [trailData, setTrailData] = React.useState<TrailData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch trail data using the Principal CLI API pattern
    fetch(`https://app.principal-ade.com/api/trails/by-id/${trailId}`)
      .then(res => res.json())
      .then(data => {
        setTrailData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [trailId]);

  if (loading || !trailData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        style={{
          background: '#0a1929',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          minHeight: isMobile ? '200px' : '280px',
        }}
      >
        <div style={{ padding: '24px', color: '#94a3b8' }}>
          Loading trail...
        </div>
      </motion.div>
    );
  }

  const { owner, repo, entry, payload } = trailData;
  const totalVisitors = (payload.visitors?.named?.length || 0) + (payload.visitors?.anonymousCount || 0);

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -4 }}
      style={{
        display: 'block',
        background: '#0a1929',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        textDecoration: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      }}
    >
      {/* Header - matches Principal app design */}
      <div
        style={{
          background: '#0f2438',
          padding: px(spacing.gap.sm),
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: px(spacing.gap.xs),
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: px(typography.size.bodySmall.mobile),
            color: '#64748b',
          }}
        >
          <span style={{ color: '#22d3ee', fontWeight: '600' }}>Principal AI</span>
          <span>/</span>
          <span>{owner}</span>
          <span>/</span>
          <span>{repo}</span>
        </div>

        {/* Published badge + Title */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: px(spacing.gap.xs) }}>
          <div
            style={{
              background: 'rgba(34, 211, 238, 0.15)',
              color: '#22d3ee',
              fontSize: px(typography.size.label.mobile),
              fontWeight: typography.weight.bold,
              letterSpacing: typography.letterSpacing.wide,
              textTransform: 'uppercase',
              padding: '4px 8px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono, monospace)',
              flexShrink: 0,
            }}
          >
            Published
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-space-grotesk, "Space Grotesk", sans-serif)',
              fontSize: px(typography.size.bodyLarge.mobile),
              fontWeight: typography.weight.semibold,
              color: '#f8fafc',
              margin: 0,
              lineHeight: typography.lineHeight.normal,
            }}
          >
            {entry.title}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: px(spacing.gap.sm) }}>
        {/* Summary */}
        <p
          style={{
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            fontSize: px(typography.size.bodySmall.mobile),
            lineHeight: typography.lineHeight.relaxed,
            color: '#94a3b8',
            margin: `0 0 ${px(spacing.gap.sm)} 0`,
          }}
        >
          {entry.summaryPreview}
        </p>

        {/* Metadata row */}
        <div
          style={{
            display: 'flex',
            gap: px(spacing.gap.sm),
            flexWrap: 'wrap',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: px(typography.size.bodySmall.mobile),
            color: '#64748b',
            marginBottom: payload.notes && payload.notes.length > 0 ? px(spacing.gap.sm) : '0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#22d3ee' }}>@</span>
            {entry.createdBy.githubLogin}
          </div>
          <div>{entry.markerCount} steps</div>
          {totalVisitors > 0 && (
            <div>
              {totalVisitors} visitor{totalVisitors !== 1 ? 's' : ''}
            </div>
          )}
          <div>{new Date(entry.updatedAt).toLocaleDateString()}</div>
        </div>

        {/* Feedback/Notes */}
        {payload.notes && payload.notes.length > 0 && (
          <div
            style={{
              background: 'rgba(15, 36, 56, 0.5)',
              borderLeft: '2px solid #22d3ee',
              borderRadius: '6px',
              padding: px(spacing.gap.xs),
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: px(typography.size.label.mobile),
                letterSpacing: typography.letterSpacing.wide,
                textTransform: 'uppercase',
                color: '#22d3ee',
                marginBottom: '8px',
              }}
            >
              Feedback
            </div>
            {payload.notes.slice(0, 2).map((note, idx) => (
              <p
                key={idx}
                style={{
                  fontFamily: 'var(--font-inter, Inter, sans-serif)',
                  fontSize: px(typography.size.bodySmall.mobile),
                  color: '#94a3b8',
                  lineHeight: typography.lineHeight.relaxed,
                  margin: idx < payload.notes!.length - 1 ? '0 0 8px 0' : '0',
                  fontStyle: 'italic',
                }}
              >
                "{note.body}" — {note.author}
              </p>
            ))}
          </div>
        )}

        {/* View trail link */}
        <div
          style={{
            marginTop: px(spacing.gap.sm),
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            fontSize: px(typography.size.bodySmall.mobile),
            fontWeight: typography.weight.semibold,
            color: '#22d3ee',
          }}
        >
          Open trail →
        </div>
      </div>
    </motion.a>
  );
};
