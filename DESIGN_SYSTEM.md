# Principal AI Design System

## Color Philosophy

Following Apple's design principles, our color system is:
- **Minimal**: Only colors with clear purpose
- **Semantic**: Named by function, not appearance
- **Hierarchical**: Clear primary, secondary, and accent relationships
- **Consistent**: Single source of truth in `src/styles/colors.ts`

## Color Palette

### Brand Colors
```
Primary (Cyan)
├─ primary: #00C2FF       → Main brand color, headlines, CTAs
├─ primaryHover: #00E5FF  → Brighter hover state
└─ primaryDark: #0098CC   → Darker variant for logo particles

Secondary (Cyan Light)
├─ secondary: #06B6D4     → Borders, secondary elements
└─ secondaryDark: #0891B2 → Darker secondary variant

Accent (Lime)
├─ accent: #84CC16        → Emphasis, success states
└─ accentDark: #65A30D    → Darker accent variant
```

### Semantic Colors
```
success: #14B8A6  → Teal - positive states
error: #EF4444    → Red - errors, destructive actions
warning: #F59E0B  → Amber - warnings, cautions
info: #2563EB     → Blue - informational states
```

### Neutrals (Grayscale)
```
white → black (10 steps)
gray100: Lightest backgrounds
gray400: Body text, secondary content
gray500: Headings, labels
gray600: Dividers, subtle elements
gray800: Primary text, strong contrast
```

### Special Colors
```
navyDark: #1E3A8A  → Gradient start (hero background)
black: #000000     → Gradient end
```

## Usage Examples

### Good ✓
```typescript
import { COLORS } from "../styles/colors";

// Semantic, clear purpose
color: COLORS.primary
background: COLORS.gray100
border: `1px solid ${COLORS.secondary}`
```

### Bad ✗
```typescript
// Hardcoded hex values
color: "#00C2FF"
background: "#F3F4F6"

// Generic naming
color: COLORS.cyan
background: COLORS.lightGray
```

## Typography Scale

All font sizes follow 8pt grid:
```
12px → Small UI text (badges, captions)
14px → Body text, list items
16px → Standard body, mobile headlines
18px → Subheadings
20px → Large body, small headlines
24px → Section headings
32px → Mobile hero headlines
48px → Tablet headlines
64px → Desktop hero headlines
```

Font weights:
```
400 → Regular (body text)
600 → Semibold (labels, buttons)
700 → Bold (headlines, emphasis)
```

## Spacing System (8pt Grid)

All spacing uses multiples of 8:
```
8, 16, 24, 32, 40, 48, 56, 64, 72, 80, ...
```

Examples:
- Component padding: 24px, 32px
- Section margins: 48px, 64px
- Button padding: 16px 32px
- Element gaps: 8px, 16px

## Animation Standards

### Timing
```
Fast: 0.2s   → Hover states, micro-interactions
Medium: 0.4s → Element transitions, page loads
Slow: 0.6s   → Large content changes (rarely used)
```

### Easing
```
Standard: cubic-bezier(0.4, 0, 0.2, 1)
```
Apple's easing curve - smooth, natural motion

### Examples
```typescript
// Button hover
transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"

// Content fade-in
transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
```

## Depth & Shadows

Subtle, purposeful depth using layered shadows:

```typescript
// Subtle - cards, backgrounds
boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"

// Medium - elevated cards
boxShadow: "0 4px 12px rgba(6, 182, 212, 0.15)"

// Strong - CTAs, hero elements
boxShadow: "0 8px 24px rgba(37, 99, 235, 0.25)"

// Interactive - button states
boxShadow: "0 4px 12px rgba(0, 194, 255, 0.3)"
hover: "0 6px 16px rgba(0, 194, 255, 0.4)"
```

## Component Standards

### Buttons
- Font: 16-20px, weight 600
- Padding: 16px 32-40px
- Border radius: 8px
- Hover: scale(1.02) + enhanced shadow
- Transition: 0.2s

### Cards
- Background: white or gray100
- Border radius: 16px
- Padding: 24-32px
- Subtle shadow for depth

### Typography
- Headlines: 700 weight, tight leading (1.05)
- Body: 400 weight, comfortable leading (1.47-1.7)
- Letter spacing: -0.04em (headlines), 0.007em (body)

---

**Philosophy**: Every design decision should serve the user experience and reinforce the brand. Remove anything that doesn't have a clear purpose.
