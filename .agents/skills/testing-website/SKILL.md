---
name: testing-website
description: Test the Sky's the Limit Painting website end-to-end. Use when verifying UI rendering, component behavior, Tailwind class scanning, heading hierarchy, or performance attributes after refactoring or bug fixes.
---

# Testing the Website

## Environment Setup

1. The Vercel preview deployments require SSO authentication and may not be accessible for automated testing.
2. Use the local dev server instead:
   ```bash
   cd /home/ubuntu/repos/website
   # Set dummy Supabase env vars if not already present
   export NEXT_PUBLIC_SUPABASE_URL="https://placeholder.supabase.co"
   export NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder-key"
   npm run dev
   ```
3. Server runs on `http://localhost:3000`

## Key Testing Areas

### Tailwind CSS v4 Class Scanning

- Tailwind v4 uses static scanning of source files for class names
- Template literals with interpolation (e.g., `` `from-[${variable}]` ``) will NOT be detected
- All Tailwind classes must appear as complete literal strings in source code
- **How to verify:** Use browser console to query for gradient divs:
  ```js
  document.querySelectorAll('[class*="bg-gradient-to-r from-[#070706]"]')
    .length;
  ```
- If gradients are broken, the hero will show a uniformly transparent image with no directional darkening

### Heading Hierarchy (WCAG)

- Pages must not skip heading levels (h1 -> h3 is invalid)
- The `IconFeatureCard` component has a `headingLevel` prop that controls h2/h3
- **How to verify:** Use browser console:
  ```js
  Array.from(document.querySelectorAll("article h2")).map((h) =>
    h.textContent.trim(),
  );
  ```

### LCP Performance Props

- Hero images on market pages (`/residential`, `/commercial`, `/public-sector`) must have `loading="eager"` and `fetchPriority="high"` for optimal Largest Contentful Paint
- The `HeroOverlays` component passes these to the underlying `<img>` tag
- **How to verify:**
  ```js
  document
    .querySelector('section img[src*="marketing-hero"]')
    .getAttribute("loading"); // "eager"
  document
    .querySelector('section img[src*="marketing-hero"]')
    .getAttribute("fetchpriority"); // "high"
  ```

### Hero Gradient Overlays

- Pages use `HeroOverlays` component with explicit `gradients` prop (array of class strings)
- Two color schemes: `#050505` (About, Capabilities, Contact) and `#070706` (NotFound, Review)
- Each should have both a left-to-right AND bottom-to-top gradient div
- **Visual check:** Left side and bottom of hero should be significantly darker than center/right

## Testing Workflow

1. Start local dev server
2. Navigate to each page via browser
3. Verify DOM structure using browser console (querySelectorAll for classes/attributes)
4. Take screenshots as visual evidence
5. Record the session with `annotate_recording` for structured test evidence

## Pages to Test

| Page          | URL                     | Key Checks                                          |
| ------------- | ----------------------- | --------------------------------------------------- |
| 404           | `/any-nonexistent-path` | Gradient overlays with #070706                      |
| Review        | `/review`               | Gradient overlays with #070706                      |
| About         | `/about`                | Gradient with #050505, h2 headings on feature cards |
| Residential   | `/residential`          | LCP props on hero image                             |
| Commercial    | `/commercial`           | LCP props on hero image                             |
| Public Sector | `/public-sector`        | LCP props on hero image                             |

## Common Issues

- **Browser console returns `undefined`:** Avoid `var` declarations and multi-line statements. Use single-line expressions that return values directly.
- **Vercel preview 302 redirect:** SSO-protected; use localhost instead.
- **Next.js hydration:** Pages are server-rendered; all critical markup is in initial HTML response. Use `curl` for quick checks if browser testing is not needed.

## Devin Secrets Needed

None required for local testing. The app runs with dummy Supabase env vars for UI testing purposes.
