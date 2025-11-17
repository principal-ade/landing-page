import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Rocket, Users, Zap } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  const stats = [
    { label: 'Alpha Launch', value: '2025 Q1' },
    { label: 'Built for', value: 'Engineers who ship' },
    { label: 'Focus', value: 'Production AI' },
  ];

  const values = [
    {
      icon: Code2,
      title: 'Engineers First',
      description: 'Built by engineers who ship AI products in production. We understand the pain points because we live them.',
    },
    {
      icon: Zap,
      title: 'Ship Fast, Ship Right',
      description: 'The AI development cycle is accelerating. Our tools help you maintain quality while moving at AI speed.',
    },
    {
      icon: Users,
      title: 'Transparency by Default',
      description: 'AI agents should be visible, reviewable, and collaborative. No black boxes, no surprises.',
    },
    {
      icon: Rocket,
      title: 'Production-Ready',
      description: 'From prototype to production. Built for real-world AI engineering, not just demos.',
    },
  ];

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #000000 0%, #0a1628 100%)',
        padding: '120px 20px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Main Heading */}
        <motion.div style={{ textAlign: 'center', marginBottom: '80px' }} {...fadeIn}>
          <h2
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: '700',
              margin: '0 0 24px 0',
              color: '#ffffff',
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              lineHeight: '1.2',
            }}
          >
            Built for AI Engineers Who{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #00D9FF 0%, #0099FF 50%, #0066FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Ship
            </span>
          </h2>
          <p
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              color: '#d1d5db',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.7',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            We're building the infrastructure for the next generation of AI development.
            Where agents work transparently, context persists, and teams ship faster.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            marginBottom: '100px',
          }}
          {...fadeIn}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(0, 194, 255, 0.05)',
                border: '1px solid rgba(0, 194, 255, 0.2)',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#00C2FF',
                  marginBottom: '8px',
                  fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '14px',
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* The Mission */}
        <motion.div
          style={{
            background: 'linear-gradient(135deg, rgba(0, 194, 255, 0.1), rgba(0, 152, 204, 0.05))',
            border: '1px solid rgba(0, 194, 255, 0.3)',
            borderRadius: '16px',
            padding: '60px 40px',
            marginBottom: '100px',
            textAlign: 'center',
          }}
          {...fadeIn}
        >
          <h3
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: '600',
              margin: '0 0 24px 0',
              color: '#ffffff',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            The Problem We're Solving
          </h3>
          <p
            style={{
              fontSize: '18px',
              color: '#d1d5db',
              lineHeight: '1.8',
              maxWidth: '900px',
              margin: '0 auto 32px auto',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            AI agents are writing code faster than anyone can review it. Documentation goes stale the moment it's written.
            Context is scattered across tools, repos, and conversations. Every team is reinventing the same workflows.
          </p>
          <p
            style={{
              fontSize: '20px',
              fontWeight: '500',
              color: '#00C2FF',
              lineHeight: '1.7',
              maxWidth: '900px',
              margin: '0 auto',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            We're building the workspace where AI development actually makes sense.
          </p>
        </motion.div>

        {/* Core Values */}
        <motion.div {...fadeIn}>
          <h3
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: '600',
              margin: '0 0 60px 0',
              color: '#ffffff',
              textAlign: 'center',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            What Drives Us
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              marginBottom: '80px',
            }}
          >
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(0, 194, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '40px',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      background: 'rgba(0, 194, 255, 0.1)',
                      border: '1px solid rgba(0, 194, 255, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '24px',
                    }}
                  >
                    <Icon size={28} color="#00C2FF" />
                  </div>
                  <h4
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      margin: '0 0 12px 0',
                      color: '#ffffff',
                      fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {value.title}
                  </h4>
                  <p
                    style={{
                      fontSize: '15px',
                      color: '#9ca3af',
                      margin: 0,
                      lineHeight: '1.7',
                      fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                    }}
                  >
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Team Philosophy */}
        <motion.div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(0, 194, 255, 0.2)',
            borderRadius: '16px',
            padding: '60px 40px',
            textAlign: 'center',
            marginBottom: '80px',
          }}
          {...fadeIn}
        >
          <h3
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: '600',
              margin: '0 0 24px 0',
              color: '#ffffff',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Who We Are
          </h3>
          <p
            style={{
              fontSize: '18px',
              color: '#d1d5db',
              lineHeight: '1.8',
              maxWidth: '900px',
              margin: '0 auto 24px auto',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            We're a team of engineers who've built AI products at scale. We've felt the pain of managing
            AI agents in production, of keeping documentation alive, of maintaining context across rapidly
            evolving codebases.
          </p>
          <p
            style={{
              fontSize: '18px',
              color: '#d1d5db',
              lineHeight: '1.8',
              maxWidth: '900px',
              margin: '0 auto',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            We're not building for tomorrow's AI engineering. We're building for the AI engineering
            happening right now, in production, with real stakes.
          </p>
        </motion.div>

        {/* Join Us CTA */}
        <motion.div
          style={{
            textAlign: 'center',
          }}
          {...fadeIn}
        >
          <h3
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              fontWeight: '600',
              margin: '0 0 32px 0',
              color: '#ffffff',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            Join the Alpha
          </h3>
          <p
            style={{
              fontSize: '18px',
              color: '#9ca3af',
              maxWidth: '700px',
              margin: '0 auto 40px auto',
              lineHeight: '1.7',
              fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            }}
          >
            We're working with a select group of teams to shape the future of AI development.
            If you're shipping AI products and want better tools, we'd love to hear from you.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://app.principal-ade.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                background: '#00C2FF',
                color: '#000000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'inline-block',
                textDecoration: 'none',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 194, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Try Web ADE
            </a>
            <a
              href="/download"
              style={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'transparent',
                color: '#00C2FF',
                border: '2px solid #00C2FF',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'inline-block',
                textDecoration: 'none',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 194, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Download Alpha
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
