import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ClientThemeProvider from "../providers/ClientThemeProvider";
import { LayeredReveal } from "../reveal";
import { DashboardLayer, WorkflowLayer, CanvasLayer } from "../reveal/layers";

const meta = {
  title: "Landing/Layered Reveal",
  component: LayeredReveal,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <ClientThemeProvider>
        <Story />
      </ClientThemeProvider>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof LayeredReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Paper Lift** - The bottom edge of each layer lifts upward like turning a page.
 * Creates a natural "peeling back" effect that reveals what's underneath.
 */
export const PaperLift: Story = {
  args: {
    scrollHeight: "400vh",
  },
};

const LayerPreviewWrapper: React.FC<{ children: React.ReactNode; title: string }> = ({
  children,
  title,
}) => (
  <div
    style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px",
      boxSizing: "border-box",
      background: "#f5f5f5",
    }}
  >
    <h2 style={{ marginBottom: "24px", fontFamily: "system-ui" }}>{title}</h2>
    <div style={{ width: "100%", maxWidth: "600px", height: "500px" }}>{children}</div>
  </div>
);

export const DashboardLayerPreview: Story = {
  render: () => (
    <LayerPreviewWrapper title="Dashboard Layer">
      <DashboardLayer />
    </LayerPreviewWrapper>
  ),
};

export const WorkflowLayerPreview: Story = {
  render: () => (
    <LayerPreviewWrapper title="Workflow Layer">
      <WorkflowLayer />
    </LayerPreviewWrapper>
  ),
};

export const CanvasLayerPreview: Story = {
  render: () => (
    <LayerPreviewWrapper title="Canvas Layer">
      <CanvasLayer />
    </LayerPreviewWrapper>
  ),
};

// ============================================
// CURL STYLE COMPARISONS
// ============================================

const CurlDemoWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: "100%",
      minHeight: "100vh",
      padding: "40px",
      boxSizing: "border-box",
      background: "#1a1a2e",
      display: "flex",
      flexWrap: "wrap",
      gap: "40px",
      justifyContent: "center",
      alignItems: "flex-start",
    }}
  >
    {children}
  </div>
);

const CurlCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({
  title,
  description,
  children,
}) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
    <div
      style={{
        width: "300px",
        height: "250px",
        position: "relative",
        perspective: "800px",
        perspectiveOrigin: "center 40%",
      }}
    >
      {children}
    </div>
    <h3 style={{ color: "#c9a227", fontFamily: "monospace", margin: 0 }}>{title}</h3>
    <p
      style={{
        color: "#888",
        fontFamily: "system-ui",
        fontSize: "12px",
        maxWidth: "280px",
        textAlign: "center",
        margin: 0,
      }}
    >
      {description}
    </p>
  </div>
);

// Base layer style for all demos
// Positive rotateX with top origin = bottom edge comes toward viewer
const baseLayerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  border: "2px solid #c9a227",
  boxSizing: "border-box",
  position: "relative",
  transformStyle: "preserve-3d",
  transformOrigin: "top center",
  transform: "rotateX(15deg)", // Positive = bottom toward viewer
};

/**
 * **Curl Style 1: Flat Flap (Current)**
 * Simple rotated rectangle - looks like a flap, not a curl
 */
const CurlStyle1_FlatFlap: React.FC = () => (
  <div style={{ ...baseLayerStyle, clipPath: "inset(0 0 2px 0)" }}>
    <div
      style={{
        position: "absolute",
        bottom: -2,
        left: -2,
        right: -2,
        height: "40px",
        background: "linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 100%)",
        borderBottom: "2px solid #c9a227",
        borderLeft: "2px solid #c9a227",
        borderRight: "2px solid #c9a227",
        transformOrigin: "top center",
        transform: "rotateX(-30deg)", // Curls back/under
        transformStyle: "preserve-3d",
      }}
    />
  </div>
);

/**
 * **Curl Style 2: Multi-Strip Curl**
 * Multiple stacked strips with progressive rotation to simulate a curve
 */
const CurlStyle2_MultiStrip: React.FC = () => (
  <div style={{ ...baseLayerStyle, clipPath: "inset(0 0 2px 0)" }}>
    {/* Stack of strips forming a curve - curling back under */}
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          bottom: -2,
          left: -2,
          right: -2,
          height: "12px",
          background:
            i === 0
              ? "transparent"
              : `rgba(201, 162, 39, ${0.03 + i * 0.02})`,
          borderBottom: i === 0 ? "2px solid #c9a227" : "none",
          borderLeft: i === 0 ? "2px solid #c9a227" : "none",
          borderRight: i === 0 ? "2px solid #c9a227" : "none",
          transformOrigin: "top center",
          // Each strip curls further back
          transform: `rotateX(${-i * 18}deg) translateZ(${i * -2}px)`,
          transformStyle: "preserve-3d",
        }}
      />
    ))}
  </div>
);

/**
 * **Curl Style 3: Gradient Shadow Illusion**
 * Uses radial/elliptical gradient to fake the shadow of a curved surface
 */
const CurlStyle3_GradientShadow: React.FC = () => (
  <div style={baseLayerStyle}>
    {/* Curved shadow at bottom */}
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "60px",
        background: `
          radial-gradient(
            ellipse 120% 40px at 50% 100%,
            rgba(0, 0, 0, 0.25) 0%,
            rgba(0, 0, 0, 0.1) 40%,
            transparent 70%
          )
        `,
        pointerEvents: "none",
      }}
    />
    {/* Highlight line suggesting curl edge */}
    <div
      style={{
        position: "absolute",
        bottom: "15px",
        left: "10%",
        right: "10%",
        height: "1px",
        background: "linear-gradient(to right, transparent, rgba(201, 162, 39, 0.3), transparent)",
      }}
    />
  </div>
);

/**
 * **Curl Style 4: Soft Drop Shadow Only**
 * No curl element, just a soft curved shadow suggesting lift
 */
const CurlStyle4_SoftShadow: React.FC = () => (
  <div
    style={{
      ...baseLayerStyle,
      boxShadow: `
        0 20px 30px -10px rgba(0, 0, 0, 0.3),
        0 10px 20px -5px rgba(0, 0, 0, 0.2)
      `,
    }}
  />
);

/**
 * **Curl Style 5: SVG Curved Edge**
 * Uses SVG path for an actual curved shape
 */
const CurlStyle5_SVGCurve: React.FC = () => (
  <div style={{ ...baseLayerStyle, clipPath: "inset(0 0 2px 0)" }}>
    <svg
      style={{
        position: "absolute",
        bottom: -2,
        left: -2,
        right: -2,
        width: "calc(100% + 4px)",
        height: "50px",
        overflow: "visible",
      }}
      viewBox="0 0 300 50"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="curlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="50%" stopColor="rgba(0,0,0,0.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
        </linearGradient>
      </defs>
      {/* Curved fill for shadow */}
      <path d="M0,0 L0,35 Q150,50 300,35 L300,0 Z" fill="url(#curlGradient)" />
      {/* Curved border line */}
      <path
        d="M0,35 Q150,50 300,35"
        fill="none"
        stroke="#c9a227"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  </div>
);

/**
 * **Curl Style 6: CSS Border Radius Trick**
 * Uses large border-radius on one corner to create curve illusion
 */
const CurlStyle6_BorderRadius: React.FC = () => (
  <div style={{ ...baseLayerStyle, clipPath: "inset(0 0 20px 0)", overflow: "visible" }}>
    <div
      style={{
        position: "absolute",
        bottom: -2,
        left: -2,
        right: -2,
        height: "40px",
        background: "linear-gradient(to top, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)",
        borderBottom: "2px solid #c9a227",
        borderLeft: "2px solid #c9a227",
        borderRight: "2px solid #c9a227",
        borderRadius: "0 0 50% 50% / 0 0 100% 100%",
        transformOrigin: "top center",
        transform: "rotateX(-25deg) scaleY(1.3)",
        transformStyle: "preserve-3d",
      }}
    />
  </div>
);

/**
 * **Curl Style 7: Corner Curl - Bottom Right**
 * Single corner peeling up like a sticky note
 */
const CurlStyle7_CornerCurl: React.FC = () => (
  <div
    style={{
      ...baseLayerStyle,
      transform: "rotateX(8deg)", // Slight tilt
      clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)",
    }}
  >
    {/* Corner triangle that curls */}
    <div
      style={{
        position: "absolute",
        bottom: -2,
        right: -2,
        width: "60px",
        height: "60px",
        background: `linear-gradient(135deg,
          transparent 0%,
          transparent 45%,
          rgba(0,0,0,0.1) 50%,
          rgba(201, 162, 39, 0.15) 55%,
          rgba(201, 162, 39, 0.1) 100%
        )`,
        borderRight: "2px solid #c9a227",
        borderBottom: "2px solid #c9a227",
        transformOrigin: "top left",
        transform: "rotate(0deg) rotateY(-30deg) rotateX(-20deg)",
        transformStyle: "preserve-3d",
        clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
      }}
    />
  </div>
);

/**
 * **Curl Style 8: Corner Curl with Shadow**
 * Corner curl with realistic shadow underneath
 */
const CurlStyle8_CornerCurlShadow: React.FC = () => (
  <div
    style={{
      ...baseLayerStyle,
      transform: "rotateX(5deg)",
      clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 50px), calc(100% - 50px) 100%, 0 100%)",
    }}
  >
    {/* Shadow under the curl */}
    <div
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: "80px",
        height: "80px",
        background: `radial-gradient(
          ellipse at 100% 100%,
          rgba(0,0,0,0.25) 0%,
          rgba(0,0,0,0.1) 40%,
          transparent 70%
        )`,
        pointerEvents: "none",
      }}
    />
    {/* Curled corner */}
    <div
      style={{
        position: "absolute",
        bottom: -2,
        right: -2,
        width: "70px",
        height: "70px",
        background: `linear-gradient(135deg,
          transparent 40%,
          rgba(26, 26, 46, 0.9) 45%,
          rgba(26, 26, 46, 1) 50%,
          rgba(40, 40, 60, 1) 100%
        )`,
        borderRight: "2px solid #c9a227",
        borderBottom: "2px solid #c9a227",
        transformOrigin: "0% 0%",
        transform: "rotateZ(-5deg) rotateY(-35deg) rotateX(-15deg) translateZ(5px)",
        transformStyle: "preserve-3d",
        clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
        boxShadow: "-5px 5px 10px rgba(0,0,0,0.2)",
      }}
    />
  </div>
);

/**
 * **Curl Style 9: Diagonal Corner Fold**
 * Corner folds diagonally revealing "underside"
 */
const CurlStyle9_DiagonalFold: React.FC = () => (
  <div
    style={{
      ...baseLayerStyle,
      transform: "rotateX(5deg)",
    }}
  >
    {/* Folded corner - shows "back" of paper */}
    <div
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: "0",
        height: "0",
        borderStyle: "solid",
        borderWidth: "0 0 70px 70px",
        borderColor: `transparent transparent rgba(201, 162, 39, 0.2) transparent`,
        filter: "drop-shadow(-3px 3px 3px rgba(0,0,0,0.2))",
      }}
    />
    {/* Cover the original corner */}
    <div
      style={{
        position: "absolute",
        bottom: -2,
        right: -2,
        width: "50px",
        height: "50px",
        background: "#1a1a2e",
        clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
      }}
    />
  </div>
);

/**
 * **Curl Style 10: Both Corners**
 * Both bottom corners curl symmetrically
 */
const CurlStyle10_BothCorners: React.FC = () => (
  <div
    style={{
      ...baseLayerStyle,
      transform: "rotateX(10deg)",
      clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 35px), calc(100% - 35px) 100%, 35px 100%, 0 calc(100% - 35px))",
    }}
  >
    {/* Left corner */}
    <div
      style={{
        position: "absolute",
        bottom: -2,
        left: -2,
        width: "50px",
        height: "50px",
        background: `linear-gradient(-135deg,
          transparent 40%,
          rgba(26, 26, 46, 0.95) 50%,
          rgba(35, 35, 55, 1) 100%
        )`,
        borderLeft: "2px solid #c9a227",
        borderBottom: "2px solid #c9a227",
        transformOrigin: "100% 0%",
        transform: "rotateY(30deg) rotateX(-15deg)",
        transformStyle: "preserve-3d",
        clipPath: "polygon(0 0, 0 100%, 100% 100%)",
      }}
    />
    {/* Right corner */}
    <div
      style={{
        position: "absolute",
        bottom: -2,
        right: -2,
        width: "50px",
        height: "50px",
        background: `linear-gradient(135deg,
          transparent 40%,
          rgba(26, 26, 46, 0.95) 50%,
          rgba(35, 35, 55, 1) 100%
        )`,
        borderRight: "2px solid #c9a227",
        borderBottom: "2px solid #c9a227",
        transformOrigin: "0% 0%",
        transform: "rotateY(-30deg) rotateX(-15deg)",
        transformStyle: "preserve-3d",
        clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
      }}
    />
  </div>
);

/**
 * **Style 11: Animated Glow Line**
 * Glowing line sweeps across bottom edge as it lifts
 */
const Style11_GlowLine: React.FC = () => (
  <div style={{ ...baseLayerStyle, transform: "rotateX(12deg)" }}>
    {/* Animated glow line */}
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "#c9a227",
        overflow: "hidden",
      }}
    >
      {/* Sweeping glow */}
      <div
        style={{
          position: "absolute",
          top: "-4px",
          left: "-20%",
          width: "40%",
          height: "10px",
          background: "linear-gradient(90deg, transparent, rgba(201, 162, 39, 0.8), white, rgba(201, 162, 39, 0.8), transparent)",
          filter: "blur(3px)",
          animation: "sweepGlow 2s ease-in-out infinite",
        }}
      />
    </div>
    <style>{`
      @keyframes sweepGlow {
        0% { left: -40%; }
        100% { left: 100%; }
      }
    `}</style>
  </div>
);

/**
 * **Style 12: Lift Line with Glow Pulse**
 * Bottom line pulses/breathes as layer lifts
 */
const Style12_PulseLine: React.FC = () => (
  <div style={{ ...baseLayerStyle, transform: "rotateX(12deg)" }}>
    {/* Pulsing bottom edge */}
    <div
      style={{
        position: "absolute",
        bottom: "-1px",
        left: 0,
        right: 0,
        height: "2px",
        background: "#c9a227",
        boxShadow: "0 0 10px rgba(201, 162, 39, 0.5), 0 0 20px rgba(201, 162, 39, 0.3), 0 0 30px rgba(201, 162, 39, 0.2)",
        animation: "pulseGlow 1.5s ease-in-out infinite",
      }}
    />
    <style>{`
      @keyframes pulseGlow {
        0%, 100% {
          box-shadow: 0 0 5px rgba(201, 162, 39, 0.3), 0 0 10px rgba(201, 162, 39, 0.2);
        }
        50% {
          box-shadow: 0 0 15px rgba(201, 162, 39, 0.6), 0 0 30px rgba(201, 162, 39, 0.4), 0 0 45px rgba(201, 162, 39, 0.2);
        }
      }
    `}</style>
  </div>
);

/**
 * **Style 13: Scanner Line**
 * Line scans from top to bottom like a blueprint scanner
 */
const Style13_ScannerLine: React.FC = () => (
  <div style={{ ...baseLayerStyle, transform: "rotateX(12deg)" }}>
    {/* Scanner line */}
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: "linear-gradient(90deg, transparent 0%, #c9a227 20%, white 50%, #c9a227 80%, transparent 100%)",
        boxShadow: "0 0 10px rgba(201, 162, 39, 0.8), 0 2px 20px rgba(201, 162, 39, 0.4)",
        animation: "scanDown 2s ease-in-out infinite",
      }}
    />
    <style>{`
      @keyframes scanDown {
        0% { top: 0; opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { top: calc(100% - 2px); opacity: 0; }
      }
    `}</style>
  </div>
);

/**
 * **Style 14: Edge Trace**
 * Line traces around the bottom edge like drawing
 */
const Style14_EdgeTrace: React.FC = () => (
  <div style={{ ...baseLayerStyle, transform: "rotateX(12deg)", border: "none" }}>
    {/* SVG for animated stroke */}
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      viewBox="0 0 300 250"
      preserveAspectRatio="none"
    >
      <rect
        x="1"
        y="1"
        width="298"
        height="248"
        fill="none"
        stroke="#c9a227"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        style={{
          strokeDasharray: "1100",
          strokeDashoffset: "1100",
          animation: "traceEdge 3s ease-out forwards infinite",
        }}
      />
    </svg>
    <style>{`
      @keyframes traceEdge {
        0% { stroke-dashoffset: 1100; }
        100% { stroke-dashoffset: 0; }
      }
    `}</style>
  </div>
);

/**
 * **Style 15: Separation Glow**
 * Glowing gap appears between lifting layer and one below
 */
const Style15_SeparationGlow: React.FC = () => (
  <div style={{ position: "relative", width: "100%", height: "100%" }}>
    {/* Layer behind (simulated) */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        border: "2px solid rgba(201, 162, 39, 0.3)",
        boxSizing: "border-box",
      }}
    />
    {/* Glow between layers */}
    <div
      style={{
        position: "absolute",
        bottom: "-15px",
        left: "10%",
        right: "10%",
        height: "20px",
        background: "radial-gradient(ellipse at center, rgba(201, 162, 39, 0.4) 0%, transparent 70%)",
        filter: "blur(5px)",
        animation: "glowPulse 2s ease-in-out infinite",
      }}
    />
    {/* Lifting layer */}
    <div style={{ ...baseLayerStyle, transform: "rotateX(15deg)" }} />
    <style>{`
      @keyframes glowPulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
    `}</style>
  </div>
);

/**
 * **Style 16: Blueprint Grid Reveal**
 * Grid lines appear on the lifting edge
 */
const Style16_GridReveal: React.FC = () => (
  <div style={{ ...baseLayerStyle, transform: "rotateX(12deg)", overflow: "hidden" }}>
    {/* Grid lines at bottom */}
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "40px",
        background: `
          linear-gradient(to top, rgba(201, 162, 39, 0.15) 0%, transparent 100%),
          repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(201, 162, 39, 0.2) 19px, rgba(201, 162, 39, 0.2) 20px),
          repeating-linear-gradient(0deg, transparent, transparent 9px, rgba(201, 162, 39, 0.1) 9px, rgba(201, 162, 39, 0.1) 10px)
        `,
        animation: "revealGrid 2s ease-out infinite",
      }}
    />
    <style>{`
      @keyframes revealGrid {
        0% { height: 0px; opacity: 0; }
        50% { height: 40px; opacity: 1; }
        100% { height: 40px; opacity: 0; }
      }
    `}</style>
  </div>
);

export const CurlStyleComparison: Story = {
  render: () => (
    <CurlDemoWrapper>
      <CurlCard
        title="1. Flat Flap (Current)"
        description="Simple rotated rectangle. Looks like a rigid flap, not a natural curl."
      >
        <CurlStyle1_FlatFlap />
      </CurlCard>

      <CurlCard
        title="2. Multi-Strip Curl"
        description="Multiple stacked strips with progressive rotation. Simulates a curve through layering."
      >
        <CurlStyle2_MultiStrip />
      </CurlCard>

      <CurlCard
        title="3. Gradient Shadow"
        description="Radial gradient faking a curved shadow. Subtle but doesn't show actual curl."
      >
        <CurlStyle3_GradientShadow />
      </CurlCard>

      <CurlCard
        title="4. Soft Shadow Only"
        description="No curl element, just drop shadow. Clean and simple, suggests lift without curl."
      >
        <CurlStyle4_SoftShadow />
      </CurlCard>

      <CurlCard
        title="5. SVG Curved Edge"
        description="SVG path for actual curved shape. Most accurate curve but may feel disconnected."
      >
        <CurlStyle5_SVGCurve />
      </CurlCard>

      <CurlCard
        title="6. Border Radius Curve"
        description="Large border-radius creating elliptical edge. Good middle ground."
      >
        <CurlStyle6_BorderRadius />
      </CurlCard>

      <CurlCard
        title="7. Corner Curl"
        description="Single bottom-right corner peeling up like a sticky note."
      >
        <CurlStyle7_CornerCurl />
      </CurlCard>

      <CurlCard
        title="8. Corner + Shadow"
        description="Corner curl with shadow underneath for depth."
      >
        <CurlStyle8_CornerCurlShadow />
      </CurlCard>

      <CurlCard
        title="9. Diagonal Fold"
        description="Corner folds over diagonally, showing paper back."
      >
        <CurlStyle9_DiagonalFold />
      </CurlCard>

      <CurlCard
        title="10. Both Corners"
        description="Symmetrical curls on both bottom corners."
      >
        <CurlStyle10_BothCorners />
      </CurlCard>
    </CurlDemoWrapper>
  ),
};

/**
 * **Animated Line Styles** - Blueprint-themed lift effects
 */
export const AnimatedLineStyles: Story = {
  render: () => (
    <CurlDemoWrapper>
      <CurlCard
        title="11. Sweep Glow"
        description="Glowing line sweeps across bottom edge continuously."
      >
        <Style11_GlowLine />
      </CurlCard>

      <CurlCard
        title="12. Pulse Line"
        description="Bottom edge pulses with breathing glow effect."
      >
        <Style12_PulseLine />
      </CurlCard>

      <CurlCard
        title="13. Scanner Line"
        description="Line scans top to bottom like a blueprint scanner."
      >
        <Style13_ScannerLine />
      </CurlCard>

      <CurlCard
        title="14. Edge Trace"
        description="Line traces around the entire border like drawing."
      >
        <Style14_EdgeTrace />
      </CurlCard>

      <CurlCard
        title="15. Separation Glow"
        description="Glow appears in gap between lifting layer and one below."
      >
        <Style15_SeparationGlow />
      </CurlCard>

      <CurlCard
        title="16. Grid Reveal"
        description="Blueprint grid lines appear on the lifting edge."
      >
        <Style16_GridReveal />
      </CurlCard>
    </CurlDemoWrapper>
  ),
};