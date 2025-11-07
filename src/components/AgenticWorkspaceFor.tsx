import { motion } from "framer-motion";
import { User, Users, Code2, Lightbulb, MessageSquare, Target } from "lucide-react";

export function AgenticWorkspaceFor() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const personas = [
    {
      icon: User,
      title: "Solo Developers",
      subtitle: "Your Personal Time Machine",
      description:
        'Never say "I forgot why I built it this way." The "why" behind every decision, timestamped and searchable. When you come back to code after 6 months, the context comes back too.',
      color: "cyan",
    },
    {
      icon: Users,
      title: "Small Teams",
      subtitle: "Shared Memory Without Meetings",
      description:
        'Your team\'s shared brain lives in git, not in someone\'s head. New devs read the decision history instead of asking "why" 50 times. When someone leaves, their reasoning doesn\'t leave with them.',
      color: "blue",
    },
    {
      icon: Code2,
      title: "Engineering",
      subtitle: "Architecture as Context",
      description:
        'Your architecture decisions inform future code, not just explain past code. Agents check /docs/architecture.md before proposing rewrites. "Why we chose PostgreSQL" is explicit and searchable.',
      color: "cyan",
    },
    {
      icon: Lightbulb,
      title: "Product",
      subtitle: "Specs That Reflect Reality",
      description:
        "Your specs stay synchronized with reality, not frozen in time. Code changes → spec gets flagged. Spec updates → agents notify engineers. Intent is preserved from user research → implementation.",
      color: "blue",
    },
    {
      icon: MessageSquare,
      title: "Communications",
      subtitle: "Brand as Code",
      description:
        "Your brand voice is code, not a Google Doc that gets out of sync. AI agents reference /comms/messaging.md when writing copy. Change the messaging doc → agents flag which pages need updates.",
      color: "cyan",
    },
    {
      icon: Target,
      title: "Leadership",
      subtitle: "Strategy That Cascades",
      description:
        'Your strategy isn\'t a PDF—it\'s context that informs every line of code. OKRs connect to features. Market research informs architecture. "Show me all AI decisions from Q4" is one query, not archaeology.',
      color: "blue",
    },
  ];

  return (
    <div style={{ padding: '80px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        style={{
          textAlign: 'center',
          marginBottom: '80px',
          maxWidth: '900px',
          margin: '0 auto 80px auto'
        }}
        {...fadeIn}
      >
        <h2
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#ffffff',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
          }}
        >
          Our{" "}
          <span
            style={{
              background: 'linear-gradient(90deg, #00D9FF 0%, #0099FF 50%, #0066FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Agentic Workspace
          </span>
          {" "}is ideal for:
        </h2>
      </motion.div>

      {/* Persona Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '80px'
        }}
      >
        {personas.map((persona, index) => {
          const Icon = persona.icon;
          const bgColor = persona.color === "cyan" ? 'rgba(6, 182, 212, 0.1)' : 'rgba(59, 130, 246, 0.1)';
          const iconColor = persona.color === "cyan" ? '#06b6d4' : '#3b82f6';
          const borderColor = persona.color === "cyan" ? 'rgba(6, 182, 212, 0.3)' : 'rgba(59, 130, 246, 0.3)';

          return (
            <motion.div
              key={persona.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              style={{
                backgroundColor: 'rgba(3, 7, 18, 0.5)',
                border: `1px solid #1f2937`,
                borderRadius: '12px',
                padding: '32px',
                height: '100%',
                transition: 'all 0.3s ease',
              }}
              whileHover={{
                borderColor: borderColor,
                scale: 1.02,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  transition: 'all 0.3s ease',
                }}
              >
                <Icon style={{ width: '24px', height: '24px', color: iconColor }} />
              </div>

              {/* Title */}
              <div style={{ marginBottom: '16px' }}>
                <h3
                  style={{
                    color: '#ffffff',
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    marginBottom: '8px',
                    letterSpacing: '-0.02em',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {persona.title}
                </h3>
                <p
                  style={{
                    color: iconColor,
                    fontStyle: 'italic',
                    fontSize: '0.95rem',
                    letterSpacing: '-0.02em',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  }}
                >
                  {persona.subtitle}
                </p>
              </div>

              {/* Description */}
              <p
                style={{
                  color: '#9ca3af',
                  lineHeight: '1.7',
                  fontSize: '0.95rem',
                  letterSpacing: '-0.02em',
                  fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                }}
              >
                {persona.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom tagline */}
      <motion.div
        style={{
          textAlign: 'center',
          fontSize: 'clamp(1.25rem, 2vw, 1.875rem)',
          color: '#d1d5db',
          fontStyle: 'italic',
          paddingTop: '32px',
          letterSpacing: '-0.02em',
          fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
        }}
        {...fadeIn}
      >
        <p>
          Context that <span style={{ color: '#06b6d4' }}>lives</span> with your code,
          <br />
          not <span style={{ color: '#6b7280' }}>buried</span> in Notion.
        </p>
      </motion.div>
    </div>
  );
}
