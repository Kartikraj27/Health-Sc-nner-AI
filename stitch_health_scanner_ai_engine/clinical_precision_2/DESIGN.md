---
name: Clinical Precision
colors:
  surface: '#12131c'
  surface-dim: '#12131c'
  surface-bright: '#383843'
  surface-container-lowest: '#0d0e17'
  surface-container-low: '#1a1b24'
  surface-container: '#1e1f29'
  surface-container-high: '#282933'
  surface-container-highest: '#33343e'
  on-surface: '#e3e1ef'
  on-surface-variant: '#c8c4d4'
  inverse-surface: '#e3e1ef'
  inverse-on-surface: '#2f303a'
  outline: '#918f9e'
  outline-variant: '#474552'
  surface-tint: '#c4c0ff'
  primary: '#c4c0ff'
  on-primary: '#261c88'
  primary-container: '#5853ba'
  on-primary-container: '#dbd8ff'
  inverse-primary: '#5651b8'
  secondary: '#c3c0ff'
  on-secondary: '#261e84'
  secondary-container: '#3e389b'
  on-secondary-container: '#b0adff'
  tertiary: '#ffb2bd'
  on-tertiary: '#670024'
  tertiary-container: '#bf084b'
  on-tertiary-container: '#ffd0d6'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c4c0ff'
  on-primary-fixed: '#110069'
  on-primary-fixed-variant: '#3e379e'
  secondary-fixed: '#e3dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#100069'
  on-secondary-fixed-variant: '#3e389b'
  tertiary-fixed: '#ffd9dd'
  tertiary-fixed-dim: '#ffb2bd'
  on-tertiary-fixed: '#400013'
  on-tertiary-fixed-variant: '#900036'
  background: '#12131c'
  on-background: '#e3e1ef'
  surface-variant: '#33343e'
  neon-cyan: '#00F0FF'
  clinical-white: '#F8FAFC'
  deep-navy: '#0A0B14'
  alert-red: '#D31130'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  grid-margin: 24px
  gutter: 16px
  unit: 8px
  section-gap: 64px
---

## Brand & Style

The design system is engineered for a premium health diagnostic experience, blending the sterile accuracy of medical instrumentation with the sophisticated aesthetics of high-end consumer technology. The design language, "Clinical Precision," focuses on high-density information presented with surgical clarity.

The visual style is a hybrid of **Minimalism** and **Glassmorphism**. It utilizes expansive negative space to reduce cognitive load during health data analysis, while employing translucent, frosted layers to create a sense of depth and modernity. The emotional goal is to evoke "calm authority"—reassuring the user through technical excellence and visual order.

## Colors

The design system operates across two distinct modes. **Premium Dark Mode** serves as the signature experience, utilizing `deep-navy` for the foundation and `neon-cyan` as a functional accent for active data scans and "AI active" states. **White Mode** prioritizes `clinical-white` surfaces with `primary-color` (soft purple-blue) for a bright, airy medical feel.

- **Primary & Secondary:** Derived from institutional blues and purples to maintain a sense of medical heritage while looking futuristic.
- **Vibrant Accents:** Neon tones are reserved for data visualization and critical calls to action.
- **Tertiary/Status:** `alert-red` is used exclusively for critical health warnings or biometric anomalies.

## Typography

The typography system relies exclusively on **Inter** to maximize legibility and provide a systematic, neutral tone that feels both modern and professional. 

- **Data Presentation:** Use `label-caps` for technical metadata, sensor readings, and timestamps to differentiate them from conversational or instructional text.
- **Visual Hierarchy:** Large display sizes should use tighter letter spacing to maintain a "machined" look. 
- **Readability:** Body text maintains a generous line height to ensure health reports are accessible and easy to parse under stress.

## Layout & Spacing

The layout follows a **Fixed Grid** on desktop (1280px max-width) and a **Fluid Grid** on mobile devices. A strict **8px base unit** governs all spatial relationships, ensuring a "Clinical Precision" feel.

- **Desktop:** 12-column structure with 16px gutters. Margins are fixed at 24px or larger to create a premium frame.
- **Mobile:** 4-column structure with 16px margins.
- **Sectioning:** Large vertical gaps (`section-gap`) are used to separate distinct biometric data categories, preventing the UI from feeling cluttered despite high information density.

## Elevation & Depth

Hierarchy is established through **Backdrop Blurs** and **Tonal Layers** rather than heavy shadows.

- **Surface Strategy:** Backgrounds utilize a subtle gradient. Foreground cards use a semi-transparent blur (20px to 40px) to appear as though they are floating above a light-emitting source.
- **Borders:** Instead of shadows, use 1px "inner-glow" borders (low-opacity white or cyan) to define the edges of glass elements.
- **Neon Depth:** Active elements may emit a soft, localized glow (`box-shadow` with high blur, low spread) in the accent color to indicate "active scanning."

## Shapes

The shape language is defined by `ROUND_EIGHT` (0.5rem), providing a "soft-tech" feel. This level of roundedness avoids the aggression of sharp corners while remaining more structured and professional than fully pill-shaped "playful" designs.

- **Primary Components:** Cards, input fields, and buttons all share the 0.5rem base radius.
- **Containers:** Larger dashboard modules and modal overlays use `rounded-xl` (1.5rem) to create a distinct nesting hierarchy.
- **Data Markers:** Biometric dots and graph points remain perfectly circular.

## Components

### Buttons
- **Primary:** Solid fill with a subtle vertical gradient. In dark mode, these may feature a high-intensity cyan glow.
- **Secondary/Ghost:** 1px border with a glass background. Text inherits the primary color.

### Cards & Modules
- Cards must use a backdrop-filter (blur) and a faint 1px stroke. 
- Content within cards should follow the 8px grid for internal padding.

### Biometric Chips
- Small, rounded-pill indicators used for "In Range" or "Critical" status. 
- These should be high-contrast, using the `alert-red` or `neon-cyan` colors for instant status recognition.

### Inputs & Scanners
- Input fields are sleek with bottom-only borders or very subtle glass containers.
- Include a "Scanner" component: a horizontal light bar that pulses with `neon-cyan` to represent AI processing.

### Data Visualization
- Line charts should be anti-aliased with "glowing" strokes. 
- Use semi-transparent area fills beneath lines to emphasize volume.