---
Version: 1.0.0
Description: DESIGN.md file for **Google Stich** preferences.
---

# DESIGN.md - Modern Mobile-First Design System

## 1. Core Philosophy
- **Mobile-First:** All layouts must be designed for 375px width initially. Desktop views are progressive enhancements of the mobile layout.
- **Progressive Enhancement:** Essential functionality must be accessible via touch and basic interactions. Advanced hover states and multi-column layouts are added for larger viewports.
- **Hybrid Framework Compatibility:** Design tokens are mapped to work across Material Design (MUI) logic and shadcn/ui (Tailwind) implementation.

## 2. Design Tokens (Cross-Compatible)

### Color Palette (Hearth & Slate)
Mapped to CSS variables for shadcn/ui compatibility.
- `--background`: 0 0% 100% (White)
- `--foreground`: 222.2 84% 4.9% (Deep Slate)
- `--primary`: 262.1 83.3% 57.8% (Vibrant Violet / MUI Primary)
- `--primary-foreground`: 210 40% 98%
- `--secondary`: 210 40% 96.1% (Soft Gray)
- `--accent`: 262.1 83.3% 95% (Light Lavender)
- `--muted`: 210 40% 96.1%
- `--border`: 214.3 31.8% 91.4%
- `--radius`: 0.75rem (Rounded-XL for a modern look)

### Typography
- **System Stack:** Inter, -apple-system, sans-serif.
- **Scale:**
  - `text-xs`: 0.75rem / 12px (Captions)
  - `text-sm`: 0.875rem / 14px (Mobile Body)
  - `text-base`: 1rem / 16px (Desktop Body / Mobile Headers)
  - `text-lg`: 1.125rem / 18px (H3)
  - `text-xl`: 1.25rem / 20px (H2)
  - `text-2xl`: 1.5rem / 24px (H1)

### Elevation & Shadows
- **Level 1 (MUI Low):** 0px 1px 3px rgba(0,0,0,0.1) -> Used for standard cards.
- **Level 2 (MUI Med):** 0px 4px 6px rgba(0,0,0,0.1) -> Used for hover states/modals.
- **Focus Ring:** 2px solid var(--primary) with 4px offset.

## 3. Layout Patterns

### Grid & Spacing
- **Base Unit:** 4px.
- **Mobile Gutter:** 16px (4 units).
- **Desktop Gutter:** 24px (6 units).
- **Max Content Width:** 1200px.
- **Internal Spacing** 8px (2 units)

### Mobile-First Constraints
1. **Touch Targets:** Minimum 44x44px for all interactive elements.
2. **Navigation:** Bottom-tab navigation for mobile; Sidebar or Top-nav for desktop (MDPI 768px+).
3. **Forms:** Single column only on mobile. Inputs must be full-width.

## 4. Component Mapping

| Component | Material/MUI Logic | shadcn/ui Style | Behavior |
| :--- | :--- | :--- | :--- |
| **Button** | `variant="contained"` | `bg-primary text-primary-foreground` | Rounded-xl, high contrast. |
| **Card** | `elevation={1}` | `border bg-card text-card-foreground` | Subtle border + soft shadow. |
| **Input** | `variant="outlined"` | `flex h-10 w-full rounded-md border` | Standard labels (top-left). |
| **Dialog** | `fullScreen={isMobile}` | `fixed inset-0 z-50` | Full screen on mobile, centered modal on desktop. |

## 5. Agent Instructions for Google Stitch
- **Constraint:** When generating UI, always start with a `max-w-[375px]` container to simulate the mobile experience.
- **Iteration Logic:** If asked to "make it cleaner," increase white space (padding) using the 8px grid and reduce border-weights to 0.5px or use `border-muted`.
- **Accessibility:** Ensure all color combinations meet WCAG AA contrast ratios (4.5:1).
- **Code Generation:** Use Tailwind CSS utility classes. Prefer `flex-col` for mobile and `sm:flex-row` for desktop enhancement.