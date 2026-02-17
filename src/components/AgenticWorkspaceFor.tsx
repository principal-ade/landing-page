import { motion } from "framer-motion";
import { User, Users, Code2, Lightbulb, MessageSquare, Target } from "lucide-react";
import React from "react";

export function AgenticWorkspaceFor() {
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

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
      description: "The 'why' behind every decision, timestamped and searchable. Context returns when you do.",
      color: "cyan",
    },
    {
      icon: Users,
      title: "Small Teams",
      subtitle: "Shared Memory Without Meetings",
      description: "Team knowledge lives in git. New devs read decision history. Context outlasts turnover.",
      color: "blue",
    },
    {
      icon: Code2,
      title: "Engineering",
      subtitle: "Architecture as Context",
      description: "Architecture decisions inform future code. Agents check docs before proposing changes.",
      color: "cyan",
    },
    {
      icon: Lightbulb,
      title: "Product",
      subtitle: "Specs That Reflect Reality",
      description: "Specs stay synchronized. Code changes flag specs. Intent flows from research to implementation.",
      color: "blue",
    },
    {
      icon: MessageSquare,
      title: "Communications",
      subtitle: "Brand as Code",
      description: "Brand voice is versioned, not out of sync. Agents reference messaging when writing copy.",
      color: "cyan",
    },
    {
      icon: Target,
      title: "Leadership",
      subtitle: "Strategy That Cascades",
      description: "Strategy informs every line of code. OKRs connect to features. One query, not archaeology.",
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
            fontSize: 'clamp(1.75rem, 5vw, 3.75rem)',
            fontWeight: '700',
            marginBottom: '24px',
            color: '#ffffff',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          Perfect for:
        </h2>
      </motion.div>

      {/* Persona Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: isMobile ? '20px' : '24px',
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
                padding: '24px',
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
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  transition: 'all 0.3s ease',
                }}
              >
                <Icon style={{ width: '20px', height: '20px', color: iconColor }} />
              </div>

              {/* Title */}
              <div style={{ marginBottom: '12px' }}>
                <h3
                  style={{
                    color: '#ffffff',
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    marginBottom: '6px',
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
                    fontSize: '0.875rem',
                    letterSpacing: '-0.02em',
                    fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    margin: '0',
                  }}
                >
                  {persona.subtitle}
                </p>
              </div>

              {/* Description - More Concise */}
              <p
                style={{
                  color: '#9ca3af',
                  lineHeight: '1.5',
                  fontSize: '0.875rem',
                  letterSpacing: '-0.02em',
                  fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                  margin: '0',
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
        <p style={{ margin: '0' }}>
          A picture is worth a<br /><span style={{ color: '#06b6d4' }}>thousand lines of code</span>.
        </p>
      </motion.div>
    </div>
  );
}
