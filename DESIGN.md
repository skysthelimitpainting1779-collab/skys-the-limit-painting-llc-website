# Design

## Visual Theme
The site uses a premium, dark, industrial craftsman design language featuring high contrast, sharp geometric shapes (0px border radius), and blueprint/road grid overlays.

## Color Palette
- **Background**: `#050505` (`--color-page-bg`) - Pitch black surface
- **Text Primary**: `#F7F7F7` (`--color-page-text`) - Off-white high contrast text
- **Neutral Accent**: `#9CA3AF` (`--color-gray-muted`) - Muted secondary text
- **Brand Primary Accent**: `#FF5A00` (`--color-orange-safety`) - Safety Orange (high contrast)
- **Brand Secondary Accent**: `#E94F00` (`--color-orange-deep`) - Deep industrial orange
- **Trust Accent**: `#2E7D32` (`--color-green-trust`) - Forest trust green
- **Golden Accent**: `#f0c067` - Outline highlights and links

## Typography
- **Display Headings**: `"Outfit", "Oswald", sans-serif` (`--font-display`) - bold, modern uppercase structure.
- **Body Text**: `"Inter", sans-serif` (`--font-body`) - clear readability.
- **Technical/Numeric UI**: `"Fira Code", monospace` (`--font-mono`) - precise monospace details.

## Layout & Radius
- **Border Radii**: Strict `0px` globally (no curves, raw mechanical layout tension).
- **Macro Spacing**: Spacious vertical sections (`py-24` or `py-20`).
- **Layout Grid**: CSS Grid and clean layout blocks with clear structural borders (`border-white/10` or `border-l border-[#c8a45d]/35`).

## Motion & Transitions
- **Easing**: `cubic-bezier(0.32, 0.72, 0, 1)` (`--ease-premium`) for fluid, high-end spring-like responses.
- **Transitions**: Heavy fade-up entries (`.reveal-up` / `@keyframes reveal-up`), infinite marquees (`.animate-marquee`), and kinetic button overlays (`.shimmer-cta`).
