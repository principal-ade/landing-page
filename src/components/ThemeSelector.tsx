"use client";

import React from "react";
import { useTheme } from "@a24z/industry-theme";
import { ChevronDown } from "lucide-react";
import { useThemeSwitcher } from "./providers/ClientThemeProvider";

interface ThemeSelectorProps {
  position?: "fixed" | "relative";
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  position = "fixed",
}) => {
  const { theme } = useTheme();
  const { currentTheme, setCurrentTheme, availableThemes } = useThemeSwitcher();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName);
    setIsOpen(false);
  };

  const containerStyle: React.CSSProperties =
    position === "fixed"
      ? {
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }
      : {
          position: "relative",
        };

  return (
    <div ref={dropdownRef} style={containerStyle}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 16px",
          backgroundColor: theme.colors.backgroundSecondary,
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          transition: "all 0.2s ease",
          fontFamily: theme.fonts.body,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.backgroundHover;
          e.currentTarget.style.borderColor = theme.colors.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor =
            theme.colors.backgroundSecondary;
          e.currentTarget.style.borderColor = theme.colors.border;
        }}
      >
        <span>Theme: {currentTheme}</span>
        <ChevronDown
          size={16}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: "200px",
            backgroundColor: theme.colors.background,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: "8px",
            boxShadow: theme.shadows[3],
            overflow: "hidden",
            zIndex: 1001,
          }}
        >
          {availableThemes.map((themeName) => (
            <button
              key={themeName}
              onClick={() => handleThemeChange(themeName)}
              style={{
                width: "100%",
                padding: "12px 16px",
                textAlign: "left",
                backgroundColor:
                  currentTheme === themeName
                    ? theme.colors.backgroundSecondary
                    : "transparent",
                color:
                  currentTheme === themeName
                    ? theme.colors.primary
                    : theme.colors.text,
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: currentTheme === themeName ? "600" : "400",
                transition: "all 0.15s ease",
                fontFamily: theme.fonts.body,
                display: "block",
              }}
              onMouseEnter={(e) => {
                if (currentTheme !== themeName) {
                  e.currentTarget.style.backgroundColor =
                    theme.colors.backgroundHover;
                }
              }}
              onMouseLeave={(e) => {
                if (currentTheme !== themeName) {
                  e.currentTarget.style.backgroundColor = "transparent";
                } else {
                  e.currentTarget.style.backgroundColor =
                    theme.colors.backgroundSecondary;
                }
              }}
            >
              {themeName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
