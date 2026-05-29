---
name: Clinical Precision
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#434654'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#0c56d0'
  primary: '#003d9b'
  on-primary: '#ffffff'
  primary-container: '#0052cc'
  on-primary-container: '#c4d2ff'
  inverse-primary: '#b2c5ff'
  secondary: '#006e2c'
  on-secondary: '#ffffff'
  secondary-container: '#86f898'
  on-secondary-container: '#00722f'
  tertiary: '#404445'
  on-tertiary: '#ffffff'
  tertiary-container: '#585b5d'
  on-tertiary-container: '#d1d3d5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001848'
  on-primary-fixed-variant: '#0040a2'
  secondary-fixed: '#89fa9b'
  secondary-fixed-dim: '#6ddd81'
  on-secondary-fixed: '#002108'
  on-secondary-fixed-variant: '#005320'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is engineered for "Health Scanner AI," a platform that balances rigorous medical accuracy with a high-end, approachable user experience. The brand personality is **accurate, helpful, premium, and structured**. 

The visual style is **Corporate Modern with a Clinical Edge**. It leverages heavy whitespace and a restricted, high-fidelity color palette to evoke a sense of sterile precision without being cold. The UI should feel like a premium medical instrument: reliable, responsive, and intuitive. We avoid visual clutter to ensure that critical health data remains the focal point, utilizing a structured card-based architecture to organize complex nutritional information into digestible modules.

## Colors
The palette is rooted in medical semiotics. 
- **Medical White (#FFFFFF)**: The primary surface color, used to create a clean, open, and sterile environment.
- **Trust Blue (#0052CC)**: The primary brand color, used for core actions, branding, and representing "Science/AI" elements.
- **Health Green (#34A853)**: A secondary functional color used for positive health indicators, nutritional "passes," and success states.
- **Soft Slate (#F8FAFC)**: The foundation for the layout, used for background fills to provide a subtle contrast against white cards.
- **Neutral (#1E293B)**: Used for high-contrast typography to ensure maximum legibility and a premium feel.

## Typography
This design system utilizes **Inter** for its systematic, utilitarian nature and exceptional legibility at small sizes—essential for reading nutritional labels and medical data. 

The type hierarchy is characterized by **generous tracking** in label styles to enhance clarity and a slight negative letter spacing in headlines to maintain a tight, professional appearance. Information density is managed by using specific weights: `SemiBold` for data points and `Regular` for descriptive text. All labels should be clearly distinguished from body copy to facilitate quick scanning of reports.

## Layout & Spacing
The design system employs a **fixed grid** model for desktop to ensure a controlled, "dashboard" feel, transitioning to a fluid layout for mobile devices. 

- **Grid**: A 12-column grid on desktop with 24px gutters. Mobile uses a single-column stack with 16px side margins.
- **Rhythm**: An 8px base unit governs all spatial relationships. 
- **Negative Space**: Generous padding (minimum 24px) is required inside all card components to maintain the premium, clinical aesthetic. 
- **Reflow**: On tablet, the 12-column grid collapses to 6 columns, with cards typically spanning the full width or 3-column halves to maintain readability of data visualizations.

## Elevation & Depth
To maintain the high-end medical feel, this design system uses **Ambient Shadows** and **Tonal Layers** rather than heavy borders.

- **The Surface**: The main background is Soft Slate.
- **The Layer**: Cards and primary containers are pure White, elevated by extremely soft, diffused shadows (0px 4px 20px rgba(0, 0, 0, 0.04)). This creates a "floating" effect that suggests a light, modern interface.
- **The Interactive**: Hover states on cards should subtly increase the shadow spread and lift the element by 2px to provide tactile feedback without breaking the clinical rigidity.

## Shapes
The shape language is **Rounded**, balancing the "hard science" of the AI with the "soft care" of a health product. 

- **Containers**: Standard cards use a 0.5rem (8px) radius to feel modern and friendly.
- **Interactive Elements**: Buttons and Input fields follow the 8px standard.
- **Tags/Status**: Dietary tags and status chips (e.g., "Low Sugar," "High Protein") utilize the **rounded-xl (24px) or full pill** shape to distinguish them from structural elements and make them feel like "badges of health."

## Components
Consistent implementation of components is critical for the "Medical Grade" experience.

- **Cards**: The fundamental unit. Must have a white background, soft shadow, and 24px internal padding. They should be used to group related nutritional data or food scan results.
- **Buttons**: Primary buttons are solid Trust Blue with white text. Secondary buttons use a Trust Blue outline with a transparent background. Both use 0.5rem corner radius.
- **Pill Tags**: Small, high-contrast badges used for dietary restrictions. Use Health Green for "Safe" and Soft Slate for "Neutral" categories.
- **Nutritional Data Points**: Key metrics (Calories, Macros) should use `headline-lg` in Trust Blue or Neutral to create a clear visual hierarchy.
- **Input Fields**: Minimalist design with a 1px Soft Slate border that turns Trust Blue on focus.
- **Lists**: Clean, borderless lists with 16px vertical spacing and subtle separators (1px Soft Slate) between items.
- **Health Indicators**: Use circular progress rings or high-contrast bar charts to display daily allowances, utilizing Health Green to signify "Optimal" zones.