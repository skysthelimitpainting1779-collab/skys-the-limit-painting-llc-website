# Sky's the Limit Painting LLC - Website

This repository contains the complete, production-ready website for **Sky's the Limit Painting LLC**, a premier Minnesota painting and pavement marking contractor based in Inver Grove Heights.

## Setup Instructions

This project uses React, Vite, Tailwind CSS (v4), TypeScript, and React Router.

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready assets will be generated in the `dist` folder.

## Deployment Instructions

This project is Vercel-ready and Netlify-ready.

1. Create a project on Vercel or Netlify.
2. Connect your Git repository.
3. Use the default build settings (`npm run build` with the `dist` output directory).
4. Deploy the application.

*For Vercel:* Ensure that you enable standard Single Page App routing in `vercel.json` if necessary, though typical Vite configurations handle this automatically.

## Delivered Pages

1. **Home** (`/`)
2. **Services Overview** (`/services`)
3. **Interior Painting** (`/services/interior`)
4. **Exterior Painting** (`/services/exterior`)
5. **Commercial Painting** (`/services/commercial`)
6. **Pavement Marking / Striping** (`/services/striping`)
7. **Projects / Gallery** (`/projects`)
8. **About** (`/about`)
9. **Service Area** (`/service-area`)
10. **Contact / Free Estimate** (`/contact`)

## Asset Usage Notes

- All original logo, branding, and work photo assets were not provided in the environment. We've utilized dynamic and contextual placeholder images (via `picsum.photos`) throughout the design to indicate exactly what dimensions and visual content type should go where.
- **Replacing placehoders**: Place your actual images in the `public` folder and reference them directly in the React components (e.g., `<img src="/images/exterior-hero.jpg" />`).

## Missing Asset List

- **Logo Files**: Required for the navigation header, website footer, and favicon.
- **Hero Photography**: Need a high-resolution, un-distorted photo of the crew working or a completed premium project for the homepage.
- **Anthony's Headshot**: Need a clear, trustworthy photo for the About section.
- **Projects Gallery Photos**: High-quality interior/exterior before-and-after shots, including the smoke shop ceiling.
- **Insurance Documents / Certifications**: If any exist, you can add verification badges to the Trust Strip section (`src/pages/Home.tsx`).

## Claim Guardrail Checklist

✅ **Insurance**: Mentioned correctly without claiming "fully insured". The FAQ copy carefully notes that insurance documentation is being finalized and available upon request.
✅ **Local Area**: Restricted realistically to Twin Cities, Inver Grove Heights, and surrounding regions.
✅ **Certifications**: Kept strictly to what was provided (Journeyworker Painter & Decorator apprenticeship). No fake DBE or government-approved vendor icons used.
✅ **Owner-Operated**: Emphasized.
✅ **Reviews**: Created a clean "Reviews coming soon" block, avoiding the use of fake star reviews to preserve 100% legal truth and trust.

## Final QA Report

- **Mobile Completeness**: Target touch targets scaled correctly. The sticky button structure works flawlessly on `<=768px`.
- **Accessibility**: Checked for high contrast, semantic header levels (H1 to H3 hierarchy respected), and clear ARIA affordances where possible using standard Tailwind UI constructs.
- **Performance**: Heavy hero images use optimized layouts. Added smooth un-styled `<PageMeta />` insertion, eliminating any layout shift that usually comes from heavy client-side helmet variations.
- **Build**: Successfully built without errors or `tsc` warnings.

## Image Usage Directory

- `Home.tsx`: Hero background (1920x1080), Anthony Headshot (800x800), Smoke Shop (800x600), Exterior Placeholder (800x600), Striping Placeholder (800x600)
- `Projects.tsx`: Smoke Shop (800x600), Exterior Placeholder (800x600), Striping Placeholder (800x600)
- `About.tsx`: Anthony Headshot (800x800)
- `ServiceInterior.tsx`: Interior Showcase (1200x600)
- `ServiceExterior.tsx`: Exterior Showcase (1200x600)
- `ServiceCommercial.tsx`: Commercial Showcase (1200x600)
- `ServiceStriping.tsx`: Striping Showcase (1200x600)

## Unresolved TODOs

- **Add Google Analytics / Plausible tracking snippet**: Added HTML comment locally in `/index.html`.
- **Form Action Validation**: The `/contact` form currently mocks a successful 1.5s network delay and shows a green success tag. You must bind this via `fetch` to whatever endpoint (e.g., Formspree, Resend, etc.) you use to process emails.
- **Swap out `picsum.photos` links**: Insert the actual directory sources once the business owner shares them.
- **Swap out the generic icon (`<Paintbrush />`)** in the navbar for the real company `logo.svg`.
