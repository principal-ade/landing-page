import { motion } from "framer-motion";
import { RefreshCw, FolderGit2, FileText, Smartphone, Boxes, GitBranch } from "lucide-react";

export function FeaturesAndBenefitsV2() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const features = [
    {
      icon: FileText,
      title: "Living Documentation",
      tagline: "Docs that auto-sync with code",
      color: "#00C2FF",
    },
    {
      icon: Smartphone,
      title: "Mobile Access",
      tagline: "Your full workspace, anywhere",
      color: "#0099FF",
    },
    {
      icon: Boxes,
      title: "Multi-Project Workspaces",
      tagline: "Agents reason across all repos",
      color: "#00C2FF",
    },
    {
      icon: GitBranch,
      title: "Auto-Sync Collaboration",
      tagline: "Zero merge conflicts",
      color: "#0099FF",
    },
    {
      icon: FolderGit2,
      title: "Universal Project Manager",
      tagline: "All your repos in one place",
      color: "#00C2FF",
    },
    {
      icon: RefreshCw,
      title: "Live Team Collaboration",
      tagline: "See who's working where",
      color: "#0099FF",
    },
  ];

  return (
    <div style={{ padding: '80px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        style={{
          textAlign: 'center',
          marginBottom: '80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          alignItems: 'center',
        }}
        {...fadeIn}
      >
        <div
          style={{
            backgroundColor: 'rgba(6, 182, 212, 0.2)',
            color: '#06b6d4',
            border: '1px solid rgba(6, 182, 212, 0.5)',
            borderRadius: '24px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Available Now
        </div>
        <h2
          style={{
            fontSize: 'clamp(1.75rem, 5vw, 3.75rem)',
            fontWeight: '700',
            margin: '0',
            color: '#ffffff',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          Features & Benefits
        </h2>
      </motion.div>

      {/* Features Grid - More Visual */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '32px',
          marginBottom: '80px',
        }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{
                backgroundColor: 'rgba(3, 7, 18, 0.5)',
                border: '1px solid #1f2937',
                borderRadius: '16px',
                padding: '48px 32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '24px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              whileHover={{
                borderColor: feature.color,
                scale: 1.05,
                y: -5,
              }}
            >
              {/* Large Icon */}
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: `${feature.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <Icon style={{ width: '40px', height: '40px', color: feature.color }} />
              </div>

              {/* Title */}
              <h3
                style={{
                  color: '#ffffff',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  margin: '0',
                  letterSpacing: '-0.02em',
                  fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                }}
              >
                {feature.title}
              </h3>

              {/* Tagline */}
              <p
                style={{
                  color: feature.color,
                  fontSize: '1.125rem',
                  fontWeight: '500',
                  margin: '0',
                  letterSpacing: '-0.02em',
                  fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                }}
              >
                {feature.tagline}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Section - Simplified */}
      <motion.div
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          alignItems: 'center',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div
          style={{
            border: '1px solid #374151',
            color: '#9ca3af',
            borderRadius: '24px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '500',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Coming Soon
        </div>
        <p
          style={{
            color: '#6b7280',
            fontStyle: 'italic',
            margin: '0',
            fontSize: '1.125rem',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            maxWidth: '600px',
          }}
        >
          Quality Lenses • Browser Preview • Slack Integration • Agent Mail
        </p>
      </motion.div>
    </div>
  );
}
