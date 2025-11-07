import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function FeaturesAndBenefits() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const features = [
    {
      number: "1",
      title: "Auto-Sync",
      features: [
        "Keeps your main Git branch always up to date.",
        "Registers webhooks to automatically sync code and prevent merge/rebase issues.",
        "Allows teammates to see who's working on what file in real time via color mapping.",
      ],
      benefits: [
        "Eliminates painful merge conflicts.",
        'Keeps "main" always current and conflict-free.',
        "Enables continuous collaboration between humans and agents without manual Git commands.",
        "Developers and non-technical contributors both stay in sync automatically.",
      ],
    },
    {
      number: "2",
      title: "Unified Workspace / Universal Project Manager",
      features: [
        "Manages all Git projects on a user's computer in one place.",
        "Simplifies cloning, switching, and managing multiple repos.",
      ],
      benefits: [
        "Reduces command-line friction.",
        "Lets users (especially non-technical) work across repos without needing terminal knowledge.",
        "Provides a single interface for all active agentic projects.",
      ],
    },
    {
      number: "3",
      title: "Excalidraw Integration",
      features: [
        "Built-in support for Excalidraw diagrams within ADE.",
        "Automatically saves drawings directly into Git for persistence and context.",
      ],
      benefits: [
        "Keeps visual planning in the same system of record as the code.",
        "Familiar tool — lowers adoption friction.",
        "Agents gain access to these visual files for reasoning/context.",
      ],
    },
    {
      number: "4",
      title: "Map / FileTree City View",
      features: [
        "Visualize your entire codebase as an interactive city map.",
        "File size and activity represented through building heights and colors.",
      ],
      benefits: [
        "Quickly identify hotspots and dead code.",
        "Intuitive spatial understanding of project structure.",
        "Helps onboard new developers with visual context.",
      ],
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
            fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
            fontWeight: '700',
            margin: '0',
            color: '#ffffff',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Features & Benefits
        </h2>
        <p
          style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
            color: '#9ca3af',
            maxWidth: '768px',
            margin: '0',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Because if we're going to ask you to change how you work, they better be worth it.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          marginBottom: '80px',
        }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            style={{ height: '100%' }}
          >
            <div
              style={{
                backgroundColor: 'rgba(3, 7, 18, 0.5)',
                border: '1px solid #1f2937',
                borderRadius: '12px',
                padding: '32px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1f2937';
              }}
            >
              {/* Feature Number & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    color: '#06b6d4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    letterSpacing: '-0.02em',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {feature.number}
                </div>
                <h3
                  style={{
                    color: '#ffffff',
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    margin: '0',
                    letterSpacing: '-0.02em',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {feature.title}
                </h3>
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p
                  style={{
                    color: '#06b6d4',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    margin: '0',
                    letterSpacing: '-0.02em',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  Feature:
                </p>
                <ul style={{ margin: '0', padding: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {feature.features.map((item, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        gap: '8px',
                        color: '#d1d5db',
                        fontSize: '0.875rem',
                        letterSpacing: '-0.02em',
                        fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                        lineHeight: '1.5',
                      }}
                    >
                      <span style={{ color: '#06b6d4', marginTop: '4px' }}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p
                  style={{
                    color: '#06b6d4',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    margin: '0',
                    letterSpacing: '-0.02em',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  Benefits:
                </p>
                <ul style={{ margin: '0', padding: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {feature.benefits.map((item, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        gap: '8px',
                        color: '#9ca3af',
                        fontSize: '0.875rem',
                        letterSpacing: '-0.02em',
                        fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                        lineHeight: '1.5',
                      }}
                    >
                      <Check style={{ width: '16px', height: '16px', color: '#06b6d4', marginTop: '2px', flexShrink: 0 }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Coming Soon Section */}
      <motion.div
        style={{
          textAlign: 'center',
          paddingTop: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
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
            fontSize: '0.95rem',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Multi-repo intelligence, AI-powered refactoring suggestions, and enterprise governance
          tools
        </p>
      </motion.div>
    </div>
  );
}
