# Three-Market Redesign Design

## Goal

Reposition Sky's the Limit Painting LLC as an insured, owner-operated Minnesota painting contractor built for three serious markets: residential homeowners, commercial properties, and public-sector opportunities.

## Core Positioning

Primary line: "Residential detail. Commercial discipline. Public-work ambition."

Supporting line: "Sky's the Limit Painting LLC is an insured, owner-operated Minnesota painting contractor built for careful residential painting, reliable commercial work, and public-sector opportunities across city, county, and state work."

The site should feel ambitious and premium without pretending the company is already a large awarded government contractor.

## Architecture

Top-level routes:

- `/`
- `/residential`
- `/commercial`
- `/public-sector`
- `/projects`
- `/about`
- `/contact`

Legacy service routes should redirect into the appropriate new market page:

- `/services`, `/services/interior`, `/services/exterior` -> `/residential`
- `/services/commercial` -> `/commercial`
- `/services/striping`, `/service-area` -> `/public-sector`

## Homepage Structure

The homepage should lead with the three-market brand idea instead of an interior/exterior service list.

Sections:

- Hero: positioning, CTAs, insured/owner-operated/trade-built trust signals, premium visual panel.
- Three markets: residential, commercial, public sector as premium vertical lanes.
- Proof stack: insured, owner-operated, trade background, COI language.
- Process: Scope, Prep, Execute, Verify.
- Project proof: residential, commercial, and striping examples.
- Final CTA: call/text Anthony or request an estimate.

## Page Strategy

Residential page:
Warm and detail-focused. It should speak to trust, prep, protection, finish quality, home respect, communication, and owner accountability.

Commercial page:
Structured and professional. It should speak to property presentation, scheduling, occupied spaces, durable finishes, clean execution, and communication.

Public Sector page:
Sharp, organized, and documentation-minded. It should position the company as preparing to compete for city, county, and state painting, facility, and pavement-marking work. It must not claim awarded public contracts, MnDOT approval, DBE/TGB certification, bonding, or licensing.

## Verified Claim Rules

Allowed:

- "Insured Minnesota painting contractor"
- "General liability coverage in place"
- "Commercial auto and tools/equipment coverage in place"
- "COI available for qualified commercial and public-sector opportunities"
- "Owner-operated"
- "Minnesota-based"
- "Inver Grove Heights-based"
- "Journeyworker Painter & Decorator apprenticeship"

Forbidden unless separately verified and approved:

- "Licensed, bonded, and insured"
- "Fully licensed and bonded"
- "Workers comp covered"
- "Bonded"
- "MnDOT-approved"
- "Government-certified contractor"
- "Trusted by government agencies"
- "DBE certified"
- "TGB certified"
- "Awarded public contracts"

## Visual System

The visual language should stay dark, premium, and contractor-serious, but become more editorial and less template-like:

- Residential: warmer imagery, human/home detail, careful finish language.
- Commercial: ordered grids, property/facility imagery, direct proof language.
- Public sector: blueprint/grid linework, road-stripe rhythm, specification language, restrained civic/infrastructure energy.

Reusable motifs:

- Thin road-stripe rules
- Blueprint/grid overlays
- Editorial market numbers
- Scope / Prep / Execute / Verify process language
- Strong full-width bands instead of nested card stacks

