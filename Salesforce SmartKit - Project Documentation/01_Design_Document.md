# Salesforce SmartKit: Complete Design Document

## 1. Executive Design Vision

The Salesforce SmartKit was designed to break the mold of traditional, utilitarian CRM extensions. The design philosophy centers around delivering a **"premium, glassmorphic, and highly dynamic"** experience. Unlike the default Salesforce Lightning Design System (SLDS), which prioritizes dense information over aesthetics, SmartKit introduces a sleek, modern UI with deep dark-mode support, vibrant gradients, and smooth micro-animations.

The core objective is to make advanced Salesforce administration and data manipulation feel like using a state-of-the-art macOS native application or a highly polished web3 dashboard.

## 2. Global Styling & CSS Architecture

The extension relies exclusively on standard, highly optimized vanilla CSS without the bloat of external utility frameworks (like Tailwind or Bootstrap). All styling is centralized in `src/index.css` and scoped component CSS.

### 2.1 CSS Custom Properties (Design Tokens)

The foundational design tokens are defined in the `:root` pseudo-class in `index.css`. This ensures absolute consistency across the extension and provides a single source of truth for the entire color palette.

```css
:root {
  --bg-primary: #0a0e1a;      /* Deepest background, almost black with a blue tint */
  --bg-surface: #0f172a;      /* Elevated surface color (slate-900 equivalent) */
  --bg-card: rgba(30, 41, 59, 0.7); /* Semi-transparent slate-800 for Glassmorphism */
  
  --text-primary: #f1f5f9;    /* Crisp, high-contrast white (slate-100) */
  --text-muted: #64748b;      /* Muted text for secondary information (slate-500) */
  
  --accent: #6366f1;          /* Primary indigo accent color */
  
  /* Typography Tokens */
  --font-main: 'Varela Round', 'Inter', sans-serif;
}
```

### 2.2 Typography

Typography is a critical element of the premium feel. The application imports two fonts from Google Fonts:
1.  **Varela Round:** Used as the primary font for its soft, rounded, and friendly appearance, making dense technical data less intimidating.
2.  **Inter:** Used as a robust, highly legible fallback for technical data and dense tables.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Varela+Round&display=swap');

body {
  font-family: var(--font-main);
  /* ... */
}
```

### 2.3 The Glassmorphic Foundation

The signature look of the application is built on the `.glass-card` CSS class. This is applied to nearly all modular panels, data tables, and input containers.

```css
.glass-card {
  background: var(--bg-card); /* rgba(30, 41, 59, 0.7) */
  backdrop-filter: blur(12px); /* Creates the frosted glass effect */
  border: 1px solid rgba(255,255,255,0.08); /* Subtle highlight border */
  padding: 16px;
  border-radius: 12px; /* Soft, modern corners */
  box-shadow: 0 4px 20px rgba(0,0,0,0.2); /* Deep shadow for elevation against the dark background */
}
```

## 3. UI Components & Layouts

### 3.1 The Main App Container
The application utilizes a strict Flexbox layout ensuring the extension always fits within the viewport without body-level scrolling (`height: 100vh; overflow: hidden;`).

```css
#root {
  height: 100%;
  display: flex;
  flex-direction: column;
}
```

### 3.2 Header and Branding
The top navigation bar (`.app-header`) uses a gradient text effect to make the logo pop, setting the premium tone immediately upon opening.

```css
.logo h1 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  /* Signature Gradient: Light Blue to Indigo */
  background: linear-gradient(135deg, #60a5fa, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### 3.3 Dynamic Tab Navigation
The primary navigation (`.tab-navigation`) features 6 distinct tabs, each assigned a unique semantic color to help users build spatial memory of the interface. 

The CSS handles both the active state (solid border and color) and the hover state (subtle background highlight).

*   **Records Tab:** Rose (`#f43f5e`)
*   **Data Tab:** Emerald (`#10b981`)
*   **Import Tab:** Amber (`#f59e0b`)
*   **Schema Tab:** Cyan (`#06b6d4`)
*   **Permissions Tab:** Violet (`#8b5cf6`)
*   **Dev Tab:** Indigo (`#6366f1`)

**Hover Micro-interaction Example (Data Tab):**
```css
.tab-btn:not(.active).tab-data:hover { 
  color: #10b981; 
  background-color: rgba(16, 185, 129, 0.05); /* 5% opacity tint */
}
```

### 3.4 Data Table Premium Interactions
To make raw Salesforce data feel alive, tables utilize a `.premium-row` class. Instead of standard row highlighting, it uses an inset box shadow to create a sophisticated selection effect.

```css
.premium-row {
  transition: all 0.15s ease;
}
.premium-row:hover td {
  /* Highlights the entire row with a subtle indigo wash */
  box-shadow: inset 0 0 0 9999px rgba(99, 102, 241, 0.06) !important;
}
```

## 4. Animation and Loading States

Waiting for Salesforce API responses can take time. SmartKit masks this latency with bespoke, highly polished CSS loading animations.

### 4.1 The Tri-Ring Spinner
Instead of a generic loading icon, SmartKit uses a custom 3-ring orbital spinner (`.sk-spinner-ring`). Each ring spins at the same rate but features different colors, widths, and delays, creating a complex, mesmerizing 3D-like effect.

```css
.sk-spinner-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: #6366f1; /* Ring 1: Indigo */
  animation: sk-spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.sk-spinner-ring:nth-child(2) {
  border-top-color: #f59e0b; /* Ring 2: Amber */
  animation-delay: -0.15s;
  border-width: 1.5px;
  margin: 20%;
}

.sk-spinner-ring:nth-child(3) {
  border-top-color: #10b981; /* Ring 3: Emerald */
  animation-delay: -0.3s;
  border-width: 1px;
  margin: 40%;
}
```

### 4.2 Pulsing Text
To complement the spinner, loading labels pulse smoothly between 40% and 100% opacity.

```css
@keyframes sk-pulse-text {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
```

## 5. Standard Dropdowns and Menus
Dropdown items (`.dropdown-item`) maintain the glassmorphic aesthetic. They feature 150ms transitions on all properties to ensure that hover states and active states feel snappy but not jarring. Active states receive a distinct border to denote selection without relying purely on color differences.

## 6. Target Environments
This design system is implemented identically across three distinct contexts:
1.  **Popup Window:** The standard extension popup (`index.html`).
2.  **Side Panel:** The persistent Chrome Side Panel (`chrome.sidePanel`).
3.  **In-Page Injected UI:** Certain elements (like the smart toggler) injected directly into the Salesforce DOM via `content/index.tsx`.

By keeping all styling in vanilla CSS, the extension avoids namespace collisions when injected into the dense DOM of Salesforce Lightning.
