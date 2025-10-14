import React, { ReactNode } from "react";
import { useTheme } from "@a24z/industry-theme";

interface SectionProps {
  id: string;
  textPosition: "left" | "right";
  background: "primary" | "secondary" | "grid";
  title: string;
  description: string | ReactNode;
  media: ReactNode;
  isMobile?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  id,
  textPosition,
  background,
  title,
  description,
  media,
  isMobile = false,
}) => {
  const { theme } = useTheme();

  // Create grid background pattern
  const gridBackground = `
    linear-gradient(${theme.colors.border}40 1px, transparent 1px),
    linear-gradient(90deg, ${theme.colors.border}40 1px, transparent 1px)
  `;

  // Determine background style
  const getBackgroundStyle = () => {
    switch (background) {
      case "primary":
        return {
          backgroundColor: theme.colors.background,
        };
      case "secondary":
        return {
          backgroundColor: theme.colors.backgroundSecondary,
        };
      case "grid":
        return {
          backgroundColor: theme.colors.background,
          backgroundImage: gridBackground,
          backgroundSize: "100px 100px",
          backgroundPosition: "-1px -1px",
        };
      default:
        return {
          backgroundColor: theme.colors.background,
        };
    }
  };

  // Determine grid columns based on text position
  const gridColumns = isMobile
    ? "1fr"
    : textPosition === "left"
      ? "30fr 70fr"
      : "70fr 30fr";

  // Text and media order
  const textContent = (
    <div>
      <h2
        style={{
          fontSize: isMobile ? "28px" : "36px",
          fontWeight: "600",
          marginBottom: "20px",
          color: theme.colors.text,
          marginTop: 0,
        }}
      >
        {title}
      </h2>
      {typeof description === "string" ? (
        <p
          style={{
            fontSize: isMobile ? "16px" : "18px",
            color: theme.colors.textSecondary,
            lineHeight: "1.8",
            margin: 0,
          }}
        >
          {description}
        </p>
      ) : (
        description
      )}
    </div>
  );

  const mediaContent = media;

  return (
    <div
      id={id}
      style={{
        minHeight: "100vh",
        ...getBackgroundStyle(),
        padding: isMobile ? "60px 20px" : "80px 40px",
        position: "relative",
        scrollSnapAlign: "start",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: gridColumns,
          gap: isMobile ? "40px" : "60px",
          alignItems: "center",
        }}
      >
        {textPosition === "left" ? (
          <>
            {textContent}
            {mediaContent}
          </>
        ) : (
          <>
            {mediaContent}
            {textContent}
          </>
        )}
      </div>
    </div>
  );
};
