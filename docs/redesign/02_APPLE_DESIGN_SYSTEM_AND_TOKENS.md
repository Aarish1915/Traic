# Apple Design System & Token Specifications

> **System Standard**: Based on Apple Human Interface Guidelines (HIG) and apple.com product showcase design language.

---

## 1. Design Tokens (CSS Custom Properties)

```css
:root {
  /* Surfaces & Canvas */
  --bg-primary: #000000;              /* True Black Baseline */
  --surface-1: #1C1C1E;               /* Primary Elevated Cards & Bento Blocks */
  --surface-2: #2C2C2E;               /* Secondary Surface / Input Background */
  --surface-glass: rgba(28, 28, 30, 0.72);
  --nav-glass: rgba(0, 0, 0, 0.65);
  
  /* Text Contrast Hierarchy (WCAG AAA) */
  --text-primary: #F5F5F7;            /* 100% White-Silver (18.2:1 against #000) */
  --text-secondary: rgba(235, 235, 245, 0.64); /* 64% White for Lead & Body */
  --text-tertiary: rgba(235, 235, 245, 0.36);  /* 36% White for Captions & Deco */
  
  /* Dividers & Borders */
  --separator: rgba(84, 84, 88, 0.55);
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.18);
  
  /* Accent System (Strictly 1 Accent) */
  --accent: #64D2FF;                  /* Apple SystemCyan Dark */
  --accent-hover: #7fe0ff;
  --accent-muted: rgba(100, 210, 255, 0.16);

  /* Functional Status Tokens */
  --color-success: #30D158;           /* Apple SystemGreen Dark */
  --color-warning: #FF9F0A;           /* Apple SystemOrange Dark */
  --color-error: #FF453A;             /* Apple SystemRed Dark */

  /* Continuous Corner Radii (Squircles) */
  --radius-sm: 12px;                  /* Input Fields, Tag Chips */
  --radius-md: 18px;                  /* Stat Cards, Nested Badges */
  --radius-lg: 24px;                  /* Bento Grid Cards, Modals */
  --radius-pill: 9999px;              /* Buttons, Nav Bars, Tab Bars */

  /* Layout Geometry & Constraints */
  --max-w: 1140px;                    /* Apple Standard Content Boundary */
  --grid-gap: 20px;
  --section-py-desktop: 112px;
  --section-py-mobile: 72px;

  /* Font Stacks */
  --font-system: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Inter, system-ui, sans-serif;
  
  /* Motion & Spring Timing */
  --ease-apple: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-hover: 0.25s;
  --duration-reveal: 0.65s;
}
```

---

## 2. Color Distribution (60-30-10 Rule)

To prevent visual fatigue and maintain strict focus:
- **60% Dominant Base**: Deep Carbon Black (`#000000`, `#0D0D0E`, `#1C1C1E`).
- **30% Structure & Text**: Silver-white typography (`#F5F5F7`), secondary body text (`rgba(235, 235, 245, 0.64)`), and hairline separators.
- **10% Focused Accent**: Apple systemCyan (`#64D2FF`). Used exclusively on primary CTAs, active indicators, and exactly one hero emphasis word.

---

## 3. Typography Hierarchy & Optical Scales

| Element | Size | Line Height | Tracking | Weight | Semantic Role |
|---|---|---|---|---|---|
| **Hero Title** | `clamp(44px, 8.5vw, 88px)` | `1.05` | `-0.035em` | Semibold (`600`) | Main statement headline |
| **Section Title** | `clamp(34px, 4.8vw, 56px)` | `1.08` | `-0.025em` | Semibold (`600`) | Section message headline |
| **Card Heading (H3)** | `22px – 28px` | `1.20` | `-0.015em` | Semibold (`600`) | Bento & project card titles |
| **Lead Paragraph** | `clamp(18px, 2.2vw, 22px)` | `1.40` | `-0.010em` | Regular (`400`) | Hero subtitle |
| **Section Desc** | `clamp(17px, 1.8vw, 20px)` | `1.45` | `-0.010em` | Regular (`400`) | Section subtitle |
| **Body Text** | `15px – 17px` | `1.50` | `-0.012em` | Regular (`400`) | Card copy, descriptions |
| **Eyebrow / Label** | `13px` | `1.20` | `+0.080em` | Semibold (`600`) | All-caps uppercase tag above H2 |
| **Button Label** | `15px` | `1.00` | `-0.005em` | Semibold (`600`) | Action CTAs |

*Strict Rules*:
1. No all-caps body text.
2. Max line length: 60 to 75 characters per line (`max-width: 60ch`).
3. Sentence case for all headings and UI labels.

---

## 4. Materials, Translucency & Elevation

### 4.1 Liquid Glass Translucent Navigation Bar
```css
.header-nav {
  height: 56px;
  background: var(--nav-glass);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-pill);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}
```

### 4.2 Bento & Project Cards
- Pure dark surface background (`#1C1C1E`) with zero glowing borders.
- Border is an extremely subtle 1px translucent stroke: `border: 1px solid rgba(255, 255, 255, 0.08)`.
- On hover: smooth spring lift (`transform: translateY(-4px)`) and subtle border illumination (`rgba(255, 255, 255, 0.18)`). Zero tacky neon drop shadows.

---

## 5. Iconography (SF Symbols Monoline Standards)

- **Vector Format**: SVG `<symbol>` repository embedded at root.
- **Stroke Width**: Strict `1.5px` uniform stroke.
- **Cap & Join**: `stroke-linecap: round; stroke-linejoin: round;`.
- **Fill**: `none` (monoline outline only).
- **Scale**: Rendered in standard $24\times24\text{px}$ viewports.
- **Color**: Inherits parent text color via `stroke: currentColor;`.

---

## 6. Motion Physics & Accessibility

- **Standard Curve**: Apple natural spring curve `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Scroll Reveal**: Elements start with `opacity: 0; transform: translateY(20px);` and smoothly animate to `opacity: 1; transform: translateY(0);` when intersecting the viewport.
- **Reduced Motion Support**:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .reveal-on-scroll {
    opacity: 1 !important;
    transform: none !important;
  }
}
```
