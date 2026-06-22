# Agent Source Notes

## Inspected Skills

- `web-design-guidelines`: Vercel Labs web interface design guidelines. Provides stylistic structure recommendations.
- `react-best-practices`: Vercel React and Next.js performance guidelines, spanning bundle size, server fetching, rendering, and rerender optimizations.

## Contributions

- **Web Design Guidelines**: Helps ensure interface elements have sufficient contrast, clear hit states, proper typography scaling, and structured hierarchy for a premium feel.
- **React Best Practices**: Provides performance heuristics for React applications, such as deferring work, eliminating waterfalls, optimizing rendering, and bundle size reduction.

## Usefulness

- Design guidelines highlight the need for bold, high-contrast, fast UI, aligning directly with the "Conversion-focused local contractor" requirements.
- React best practices around rendering performance and removing waterfalls align with the requirement for speed and an optimized mobile experience.

## Ignored Instructions

- I've ignored Next.js-specific instructions (e.g., RSC, `next/dynamic`, server actions) since the current project is configured using React + Vite + React Router. The tech stack instruction says "Use the project’s recommended stack unless the existing repo says otherwise", so I'm honoring the existing Vite setup.
- Ignored generic SaaS design guidelines (like purple SaaS gradients or glassmorphism) to ensure the strict black/orange/white industrial brand scheme is preserved as commanded by the priority list.

## Improvements to the Website

- Applying fast rendering checks and strong typographic scales from the design guidelines will align exactly with the conversion goals of the site, making the Sky's the Limit brand appear hyper-professional, easy to parse on mobile, and incredibly clear in its CTA hierarchy.
