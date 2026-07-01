---
type: documentation
title: Sky's the Limit Painting LLC Website Repository
description: Production Next.js website for Sky's the Limit Painting LLC (MN painting contractor, IR816596). Includes agentic OS, CI/CD, design system and full marketing site.
tags: [documentation, website, nextjs, painting, compliance, agent-os]
---

# Sky's the Limit Painting LLC - Website

This repository contains the complete, production-ready website for **Sky's the Limit Painting LLC**, a premier Minnesota painting and pavement marking contractor based in Inver Grove Heights.

## Agent Operating Manual

Use [.agents/AGENTS.md](.agents/AGENTS.md) as the source of truth for agent work. It defines the wiki-first workflow, verification gate, claim guardrails, and Google Open Knowledge standard.

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

_For Vercel:_ This repo includes `vercel.json` with a Single Page App rewrite so deep links such as `/services/exterior` resolve to the React app.

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
11. **Local SEO landing pages** (`/service-areas/:city`)
12. **Service landing pages** (`/painting-services/:service`)

## Asset Usage Notes

- The site now uses the verified safe service images in `public/images/services` plus generated support images in `src/assets/images`.
- Public backup image scans were removed from the deployable site because they were not verified marketing assets.
- **Replacing draft media**: Place actual marketing images in the `public` folder and reference them directly in the React components (e.g., `<img src="/images/exterior-hero.jpg" />`).

## Missing Asset List

- **Logo Files**: Required for the navigation header, website footer, and favicon.
- **Anthony's Headshot**: Need a clear, trustworthy photo for the About section when approved for website use.
- **Projects Gallery Photos**: High-quality interior/exterior before-and-after shots, including the smoke shop ceiling.
- **Insurance Documents / Certifications**: General liability, commercial auto, and tools/equipment coverage are referenced carefully. Add document images only after approval. Do not claim "licensed," "bonded," government-certified, DBE/TGB, or other specialty credentials unless separately verified.

## Claim Guardrail Checklist

- **Insurance**: Mentioned carefully without claiming "fully insured." The FAQ says general liability is being finalized and documentation should be confirmed before jobs requiring a COI.
- **Local Area**: Restricted realistically to Twin Cities, Inver Grove Heights, and surrounding regions.
- **Certifications**: Kept strictly to what was provided: Journeyworker Painter & Decorator apprenticeship. No fake DBE, government-approved vendor, EPA, licensed, or bonded claims are used.
- **Owner-Operated**: Emphasized.
- **Reviews**: Replaced fake testimonials and inflated star counts with an honest project proof / reviews-coming-soon section.

## Verification Notes

- Run `npm run build` before deploying.
- Run `npm run lint` for TypeScript validation.
- Browser-check the homepage, `/services`, `/projects`, and `/contact` after visual or copy changes.

## Google Open Knowledge Notes

Structured data work must follow [docs/google-open-knowledge.md](docs/google-open-knowledge.md). Keep JSON-LD aligned with visible page content, use stable entity IDs, validate changed URLs with Google Rich Results Test, and avoid unsupported claims.

## Image Usage Directory

- `Home.tsx`: Hero background (1920x1080), service/project proof images, striping showcase, commercial proof image
- `Projects.tsx`: Commercial refresh, interior repaint, striping showcase, living room finish
- `About.tsx`: Interior project image until a verified owner headshot is available
- `ServiceInterior.tsx`: Interior Showcase (1200x600)
- `ServiceExterior.tsx`: Exterior Showcase (1200x600)
- `ServiceCommercial.tsx`: Commercial Showcase (1200x600)
- `ServiceStriping.tsx`: Striping Showcase (1200x600)

## Unresolved TODOs

- **Add Google Analytics / Plausible tracking snippet**: Added HTML comment locally in `/index.html`.
- **Lead tracker**: `/api/leads` supports Resend email delivery and optional `LEAD_WEBHOOK_URL` delivery for a CRM, spreadsheet, or automation platform.
- **Owner Headshot**: Insert a real owner photo once approved for website use.

## 🧬 Elite Branching & CI/CD Posture

This repository is secured under an elite security configuration and branching posture:

1. **Branching Model:**
   - `main`: Serves as the stable production branch.
   - `develop`: Serves as the active preview/staging integration branch.
2. **CI/CD Security:** All GitHub Action step dependencies are pinned to unique 40-character commit SHAs to protect against supply-chain and tag-hijacking attacks.
3. **Branch Protection:** Pull requests require 1 approving review from codeowners (`.github/CODEOWNERS`) and must pass all validation checks (`PR Quality`, `Validate (20.x)`, `Validate (22.x)`, `npm Audit`, and `CodeQL`) before merging.
