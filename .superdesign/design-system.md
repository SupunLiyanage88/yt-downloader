# Pulse — Design System

## Product Context
Pulse is a modern one-page web app for downloading YouTube videos. It provides a clean, fast interface for users to paste a YouTube URL and download the video in HD quality. The brand identity centers on speed, simplicity, and energy — hence the name "Pulse."

## Target Audience
General users who want to download YouTube videos quickly without clutter, ads, or complex steps.

## Brand Values
- Fast & efficient
- Clean & minimal
- Trustworthy & open source

## Visual Design

### Color Palette
- **Background**: `#09090b` (zinc-950) — deep near-black
- **Surface**: `#18181b` (zinc-900) — elevated cards/sections
- **Surface Hover**: `#27272a` (zinc-800)
- **Border**: `#3f3f46` (zinc-700) / `#52525b` (zinc-600)
- **Text Primary**: `#fafafa` (zinc-50)
- **Text Secondary**: `#a1a1aa` (zinc-400)
- **Text Muted**: `#71717a` (zinc-500)
- **Accent Gradient**: `#ec4899` (pink-500) → `#a855f7` (purple-500) — primary brand gradient
- **Accent Solid**: `#d946ef` (fuchsia-500) — solid fallback
- **Success**: `#22c55e` (green-500)
- **Error**: `#ef4444` (red-500)

### Typography
- **Headings**: Inter, sans-serif (font-weight 600–800)
- **Body**: Inter, sans-serif (font-weight 400–500)
- **Monospace**: JetBrains Mono, for URLs/code
- **Scale**: text-xs (12px) → text-5xl (48px)

### Spacing
- 4px base unit. Consistent use of Tailwind spacing scale.
- Section padding: py-24 (96px) desktop, py-16 (64px) mobile
- Card padding: p-8 (32px)

### Radius
- Cards/containers: rounded-2xl (16px)
- Inputs/buttons: rounded-xl (12px)
- Small elements: rounded-lg (8px)

### Shadows
- Card: `0 4px 24px rgba(0,0,0,0.3)`
- Glow accent: `0 0 40px rgba(217,70,239,0.15)`

### Motion
- Transitions: 200ms ease-in-out
- Hover lifts: translateY(-2px) + shadow increase
- Loading spinner: rotate animation, 1s linear infinite

## Layout
- Single page, vertical scroll
- Sticky header with logo + GitHub CTA
- Full-width hero section with centered download widget
- Feature cards in a 3-column grid
- GitHub callout section
- Minimal footer

## Component Patterns
- **Input**: Dark surface, rounded-xl, focus ring with accent color
- **Button**: Gradient background (pink→purple), rounded-xl, hover lift
- **Cards**: zinc-900 surface, rounded-2xl, subtle border
- **Status indicators**: Color-coded text with icon
