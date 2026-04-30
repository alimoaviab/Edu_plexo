---
name: Serene Education
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#3f484b'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#6f797c'
  outline-variant: '#bec8cb'
  surface-tint: '#086878'
  primary: '#006474'
  on-primary: '#ffffff'
  primary-container: '#2d7d8e'
  on-primary-container: '#f3fcff'
  inverse-primary: '#87d2e4'
  secondary: '#286771'
  on-secondary: '#ffffff'
  secondary-container: '#b0ecf8'
  on-secondary-container: '#306d77'
  tertiary: '#4d5e5d'
  on-tertiary: '#ffffff'
  tertiary-container: '#657676'
  on-tertiary-container: '#ebfefd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a9edff'
  primary-fixed-dim: '#87d2e4'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5b'
  secondary-fixed: '#b0ecf8'
  secondary-fixed-dim: '#95d0db'
  on-secondary-fixed: '#001f24'
  on-secondary-fixed-variant: '#034e58'
  tertiary-fixed: '#d4e6e5'
  tertiary-fixed-dim: '#b8cac9'
  on-tertiary-fixed: '#0e1e1e'
  on-tertiary-fixed-variant: '#3a4a49'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style
The brand personality of this design system is rooted in "Calm Authority." For a School Management System, the UI must alleviate the cognitive load of administrators and teachers while providing a welcoming environment for students and parents. The emotional response is one of clarity, reliability, and modern sophistication.

The design style is a hybrid of **Minimalism** and **Soft-UI**. It prioritizes high-quality whitespace and a "breathable" interface. By utilizing low-contrast surfaces and subtle transitions, the system moves away from traditional "utilitarian" software toward a premium, service-oriented experience. Visuals should incorporate high-quality, candid educational imagery with soft-focus backgrounds to maintain an airy feel.

## Colors
The palette is centered on a "Quiet Teal" and "Powder Blue" spectrum. The primary teal is desaturated to ensure professionalism, while the secondary light blues are used for supportive backgrounds and accents. 

- **Primary:** A deep, calm teal used for essential actions and brand presence.
- **Secondary:** A soft aqua for active states and highlights.
- **Tertiary:** Ultra-light teal washes for background grouping and subtle differentiation.
- **Neutral:** A range of slate grays that avoid pure black, maintaining the soft, low-contrast aesthetic.
- **Semantic:** Use a soft sage for success, a muted coral for errors, and a warm honey for warnings—all following the low-saturation rule.

## Typography
Plus Jakarta Sans is selected for its friendly, open counters and modern geometric construction. It strikes a balance between approachable warmth and academic precision. 

Headlines utilize a slightly tighter letter-spacing and heavier weights to establish a clear hierarchy against the airy backgrounds. Body text is prioritized for legibility with a generous 1.6x line height. For data-heavy views (like gradebooks), the `label-md` and `label-sm` tiers provide structure without overwhelming the visual field.

## Layout & Spacing
The layout philosophy follows a **Fixed-Fluid Hybrid**. Main content areas are constrained to a 1440px max-width to maintain readability, while dashboard sidebars and headers may span the full width. 

An 8px linear scale is used to define the rhythm. Large padding (`lg` or `xl`) is encouraged within containers to reinforce the "airy" feel. Content should be grouped logically into "Cards," with generous margins between sections to avoid a cluttered "traditional database" look common in education software.

## Elevation & Depth
Depth is conveyed through **Ambient Shadows** and **Tonal Layering**. Instead of harsh borders, surfaces are distinguished by very soft, multi-layered shadows with a slight teal tint (e.g., `rgba(45, 125, 142, 0.05)`).

- **Level 0 (Floor):** The main background in a soft off-white/blue tint.
- **Level 1 (Card):** White surfaces with 16px+ rounded corners and a 20px blur shadow.
- **Level 2 (Active/Floating):** Used for dropdowns and modals, featuring a 40px blur shadow and a 1px soft teal border to provide definition without adding visual weight.
- **Subtle Gradients:** Backgrounds can use extremely subtle linear gradients (top-left to bottom-right) from white to the tertiary teal color to create a sense of natural light.

## Shapes
The shape language is defined by large, welcoming radii. 
- **Containers:** Large-scale containers (cards, modals, main panels) must use `rounded-xl` (1.5rem / 24px) to create a soft, non-intimidating frame for complex data.
- **Interactive Elements:** Buttons and input fields use `rounded-md` (0.5rem / 8px) or `rounded-lg` (1rem / 16px) to maintain a distinct clickable identity that is softer than industry standards but more structured than the containers they sit within.
- **Icons:** Should be rounded-style (e.g., Lucide or Phosphor in 'Regular' weight) to match the typography.

## Components
- **Buttons:** Primary buttons should use a soft gradient of the primary and secondary colors. Shadow-on-hover should expand slightly to simulate physical depth.
- **Input Fields:** Backgrounds should be a very light gray-teal (off-white) rather than pure white, with no border except when focused. On focus, a soft teal glow (2px) should appear.
- **Chips & Badges:** Use the tertiary color for backgrounds with primary-colored text. These should be fully pill-shaped (rounded-full).
- **Cards:** The central component of this system. Cards should have a 1px stroke in a color just 2-3% darker than the surface, acting as a "ghost border" to assist the shadow in defining the shape.
- **Progress Indicators:** For student tracking, use thick, rounded progress bars with the secondary aqua color.
- **Data Tables:** Avoid vertical lines. Use horizontal rules in the lightest neutral color and generous row padding (16px - 20px).
- **Avatar Groups:** For classroom lists, use overlapping circular avatars with a white border stroke to maintain a clean "stacked" look.