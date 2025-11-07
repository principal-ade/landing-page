import { motion } from "framer-motion";

export function ContextEngineering() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <div style={{ padding: '120px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <motion.div
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '80px',
        }}
        {...fadeIn}
      >
        {/* Headline */}
        <h2
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
            fontWeight: '700',
            margin: '0',
            color: '#ffffff',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            lineHeight: '1.2',
          }}
        >
          From Spec Debt to{" "}
          <span
            style={{
              background: 'linear-gradient(90deg, #00D9FF 0%, #0099FF 50%, #0066FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Spec Intelligence
          </span>
        </h2>

        {/* Description */}
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
            color: '#d1d5db',
            letterSpacing: '-0.02em',
            fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
            lineHeight: '1.6',
          }}
        >
          <p style={{ margin: 0 }}>Each undocumented code change creates debt.</p>
          <p style={{ margin: 0 }}>Principal ADE makes that visible.</p>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '64px',
            marginTop: '40px',
          }}
        >
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div
              style={{
                fontSize: '4rem',
                color: '#06b6d4',
                fontWeight: '700',
                letterSpacing: '-0.02em',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              ∞
            </div>
            <p
              style={{
                color: '#9ca3af',
                fontSize: '1.125rem',
                margin: 0,
                letterSpacing: '-0.02em',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Infinite memory
            </p>
          </motion.div>

          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div
              style={{
                fontSize: '4rem',
                color: '#06b6d4',
                fontWeight: '700',
                letterSpacing: '-0.02em',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              0
            </div>
            <p
              style={{
                color: '#9ca3af',
                fontSize: '1.125rem',
                margin: 0,
                letterSpacing: '-0.02em',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Manual documentation
            </p>
          </motion.div>

          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div
              style={{
                fontSize: '4rem',
                color: '#06b6d4',
                fontWeight: '700',
                letterSpacing: '-0.02em',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              100%
            </div>
            <p
              style={{
                color: '#9ca3af',
                fontSize: '1.125rem',
                margin: 0,
                letterSpacing: '-0.02em',
                fontFamily: 'Inter, "Geist Sans", system-ui, -apple-system, sans-serif',
              }}
            >
              Context preserved
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
