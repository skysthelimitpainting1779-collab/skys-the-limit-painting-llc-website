# Google Open Knowledge operating guide

This guide tells agents how to keep the Sky's the Limit Painting LLC website legible to Google Search, rich results, and knowledge graph systems.

## Goal

Represent the business, services, service areas, proof assets, and routed pages as consistent entities. Do not use schema to invent authority.

## Source of truth

Use Google Search Central before changing schema behavior:

- [Structured data introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

## Entity model

Keep one canonical business entity:

- `@type`: `LocalBusiness` or a specific eligible subtype only when Google supports the use case
- `@id`: stable homepage entity ID
- `name`: `Sky's the Limit Painting LLC`
- `url`: production canonical domain
- `telephone`: verified public phone number only
- `image`: crawlable, representative business image
- `address`: verified business address only
- `geo`: verified coordinates only
- `areaServed`: realistic Twin Cities service areas only
- `sameAs`: verified social profiles only

Each service page should describe one service intent and link back to the business entity. Each service-area page should describe one geographic intent and link back to the business entity.

## Page requirements

Before release, confirm each public route has:

- One canonical URL
- A matching sitemap entry when route generation changes
- Prerender coverage when static output changes
- Page metadata that matches the visible page intent
- `BreadcrumbList` data when the page has a hierarchy
- Structured data that describes visible content only
- No fake ratings, reviews, awards, certifications, or unsupported claims

## Validation

Use this checklist when schema changes:

1. Run `npm run lint`
2. Run `npm test` when behavior changed
3. Run `npm run build`
4. Test affected URLs with Google Rich Results Test
5. Inspect affected URLs in Google Search Console after deploy
6. Submit the sitemap when route coverage changed

## Claim guardrails

Schema must match published page copy. If the page cannot say the claim plainly to a customer, the schema cannot say it to Google.

Do not add:

- Aggregate ratings without real visible reviews
- Review markup for testimonials that are not visible on the same page
- License, bond, or certification claims without evidence
- Service areas outside the realistic operating region
- Images blocked by robots, login, redirects, or missing files
