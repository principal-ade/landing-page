import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  color?: string;
  particleColor?: string;
  opacity?: number;
}

export const Logo: React.FC<LogoProps> = ({
  width = 150,
  height = 150,
  color = "currentColor",
  particleColor,
  opacity = 0.9,
}) => {
  const finalParticleColor = particleColor || color;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      {/* Wireframe sphere with grid lines */}
      <defs>
        <radialGradient id="sphereGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
        </radialGradient>

        {/* Animated pulse at center */}
        <radialGradient id="centerPulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.8 }}>
            <animate
              attributeName="stop-opacity"
              values="0.8;0.3;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* Glow effect */}
      <circle cx="150" cy="150" r="120" fill="url(#sphereGlow)" opacity="0.5" />

      {/* Animated particles traveling along the wireframe lines */}

      {/* Horizontal center line */}
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="4s" repeatCount="indefinite" path="M 50,150 L 250,150" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* Horizontal latitude ellipses - full circles */}
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="8s" repeatCount="indefinite" begin="0s" path="M 50,150 A 100,20 0 0,0 250,150 A 100,20 0 0,0 50,150" />
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.9;0.95;1" dur="8s" begin="0s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="8s" repeatCount="indefinite" begin="1s" path="M 50,150 A 100,40 0 0,0 250,150 A 100,40 0 0,0 50,150" />
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.9;0.95;1" dur="8s" begin="1s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="8s" repeatCount="indefinite" begin="2s" path="M 50,150 A 100,60 0 0,0 250,150 A 100,60 0 0,0 50,150" />
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.9;0.95;1" dur="8s" begin="2s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="8s" repeatCount="indefinite" begin="3s" path="M 50,150 A 100,80 0 0,0 250,150 A 100,80 0 0,0 50,150" />
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.9;0.95;1" dur="8s" begin="3s" repeatCount="indefinite" />
      </circle>

      {/* Vertical longitude ellipses - full circles */}
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="8s" repeatCount="indefinite" begin="0.5s" path="M 150,50 A 20,100 0 0,0 150,250 A 20,100 0 0,0 150,50" />
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.9;0.95;1" dur="8s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="8s" repeatCount="indefinite" begin="1.5s" path="M 150,50 A 40,100 0 0,0 150,250 A 40,100 0 0,0 150,50" />
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.9;0.95;1" dur="8s" begin="1.5s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="8s" repeatCount="indefinite" begin="2.5s" path="M 150,50 A 60,100 0 0,0 150,250 A 60,100 0 0,0 150,50" />
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.9;0.95;1" dur="8s" begin="2.5s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="8s" repeatCount="indefinite" begin="3.5s" path="M 150,50 A 80,100 0 0,0 150,250 A 80,100 0 0,0 150,50" />
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.9;0.95;1" dur="8s" begin="3.5s" repeatCount="indefinite" />
      </circle>

      {/* Center pulse triggered by particles */}
      <circle cx="150" cy="150" r="20" fill="url(#centerPulse)" opacity="0.3">
        <animate
          attributeName="r"
          values="5;25;5"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;0;0.6"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Main sphere outline */}
      <circle
        cx="150"
        cy="150"
        r="100"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.9"
      />

      {/* Horizontal latitude lines */}
      <ellipse
        cx="150"
        cy="150"
        rx="100"
        ry="20"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <ellipse
        cx="150"
        cy="150"
        rx="100"
        ry="40"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <ellipse
        cx="150"
        cy="150"
        rx="100"
        ry="60"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <ellipse
        cx="150"
        cy="150"
        rx="100"
        ry="80"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Vertical longitude lines */}
      <ellipse
        cx="150"
        cy="150"
        rx="20"
        ry="100"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <ellipse
        cx="150"
        cy="150"
        rx="40"
        ry="100"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <ellipse
        cx="150"
        cy="150"
        rx="60"
        ry="100"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <ellipse
        cx="150"
        cy="150"
        rx="80"
        ry="100"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Diagonal grid lines (angled ellipses) */}
      <ellipse
        cx="150"
        cy="150"
        rx="100"
        ry="50"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
        transform="rotate(30 150 150)"
      />
      <ellipse
        cx="150"
        cy="150"
        rx="100"
        ry="50"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
        transform="rotate(60 150 150)"
      />
      <ellipse
        cx="150"
        cy="150"
        rx="100"
        ry="50"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
        transform="rotate(120 150 150)"
      />
      <ellipse
        cx="150"
        cy="150"
        rx="100"
        ry="50"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
        transform="rotate(150 150 150)"
      />

      {/* Center horizontal line */}
      <line
        x1="50"
        y1="150"
        x2="250"
        y2="150"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.8"
      />

      {/* Center vertical line */}
      <ellipse
        cx="150"
        cy="150"
        rx="0.5"
        ry="100"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  );
};
