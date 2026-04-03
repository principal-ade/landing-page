import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Radar, FileText, Bot, FolderGit, Users } from 'lucide-react';
import { useTheme } from '@principal-ade/industry-theme';

export function WhyTeamsUse() {
  const { theme } = useTheme();
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );
  const [hoveredCard, setHoveredCard] = React.useState<number | null>(null);

  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const cards = [
    {
      icon: Eye,
      title: "Visual Code Understanding",
      description: "See what Agents are actually building",
    },
    {
      icon: Radar,
      title: "Quality Radar",
      description: "Know when things are off",
    },
    {
      icon: FileText,
      title: "Living Documentation",
      description: "Keep intent and code aligned",
    },
    {
      icon: Bot,
      title: "Optimized for Agents",
      description: "Built for agent-written software",
    },
    {
      icon: FolderGit,
      title: "Multi-Project Workspaces",
      description: "Agents reason across all repos",
    },
    {
      icon: Users,
      title: "Live Team Collaboration",
      description: "See who's working where",
    },
  ];

  return (
    <div
      style={{
        padding: isMobile ? "80px 24px" : isTablet ? "100px 40px" : "120px 40px",
        background: "#000000",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: isMobile ? "36px" : isTablet ? "48px" : "56px",
            fontWeight: "600",
            textAlign: "center",
            color: "#ffffff",
            marginBottom: isMobile ? "48px" : "64px",
            fontFamily: theme.fonts.body,
            letterSpacing: "-0.02em",
            lineHeight: "1.1",
          }}
        >
          How Teams Use Principal AI
        </motion.h2>

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(3, 1fr)",
            gap: isMobile ? "24px" : "32px",
            marginBottom: isMobile ? "48px" : "64px",
          }}
        >
          {cards.map((card, index) => {
            const Icon = card.icon;
            const isEven = index % 2 === 0;
            const isHovered = hoveredCard === index;
            const descriptionColor = isEven ? "#06b6d4" : "#3b82f6";
            const iconColor = isEven ? "#06b6d4" : "#3b82f6";
            const bgColor = isEven
              ? isHovered ? "rgba(6, 182, 212, 0.2)" : "rgba(6, 182, 212, 0.1)"
              : isHovered ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)";

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: "relative",
                  background: "linear-gradient(180deg, rgba(3, 7, 18, 0.8) 0%, rgba(17, 24, 39, 0.4) 100%)",
                  border: `1px solid ${isHovered ? "rgba(6, 182, 212, 0.5)" : "rgba(31, 41, 55, 1)"}`,
                  borderRadius: "12px",
                  padding: isMobile ? "24px" : "32px",
                  transition: "all 0.3s ease",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                  cursor: "default",
                }}
              >
                {/* Glow effect on hover */}
                <div
                  style={{
                    position: "absolute",
                    inset: "0",
                    background: "rgba(6, 182, 212, 0.05)",
                    borderRadius: "12px",
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    pointerEvents: "none",
                  }}
                />

                <div style={{ position: "relative" }}>
                  {/* Icon */}
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: bgColor,
                      transition: "background 0.3s ease",
                      marginBottom: "16px",
                    }}
                  >
                    <Icon
                      size={28}
                      color={iconColor}
                      strokeWidth={2}
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <h3
                      style={{
                        fontSize: isMobile ? "18px" : "20px",
                        fontWeight: "400",
                        color: "#ffffff",
                        marginBottom: "8px",
                        fontFamily: theme.fonts.body,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      style={{
                        fontSize: isMobile ? "14px" : "16px",
                        fontWeight: "400",
                        color: descriptionColor,
                        margin: "0",
                        fontFamily: theme.fonts.body,
                        letterSpacing: "-0.01em",
                        lineHeight: "1.5",
                      }}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{
            textAlign: "center",
            paddingTop: isMobile ? "32px" : "48px",
          }}
        >
          <p
            style={{
              fontSize: isMobile ? "18px" : isTablet ? "20px" : "24px",
              fontWeight: "400",
              color: "#d1d5db",
              maxWidth: "900px",
              margin: "0 auto",
              fontFamily: theme.fonts.body,
              letterSpacing: "-0.01em",
              lineHeight: "1.5",
            }}
          >
            As software becomes autonomous, understanding becomes the bottleneck.{" "}
            <span style={{ color: "#06b6d4" }}>Principal removes it.</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
