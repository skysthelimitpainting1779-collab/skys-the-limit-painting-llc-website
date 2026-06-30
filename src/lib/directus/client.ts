import { createDirectus, rest, readItems, readSingleton } from '@directus/sdk';

// ─── CMS Types ──────────────────────────────────────────────────────
export interface CaseStudy {
  id: number;
  status: 'draft' | 'published' | 'archived';
  sort: number | null;
  type: string;
  location: string;
  problem: string;
  prep: string[];
  result: string;
  image: string | null;
  before_image: string | null;
  after_image: string | null;
  market: 'residential' | 'commercial' | 'public-sector';
  date_created: string | null;
  date_updated: string | null;
}

export interface CMSMarket {
  id: number;
  status: 'draft' | 'published';
  sort: number | null;
  slug: string;
  nav_label: string;
  number: string;
  title: string;
  headline: string;
  summary: string;
  description: string;
  image: string | null;
  hero_image: string | null;
  accent: string;
  proof: string[];
  capabilities: Array<{ title: string; body: string }>;
  process: Array<{ title: string; body: string }>;
  cta: string;
  meta_title: string;
  meta_description: string;
}

export interface SiteConfig {
  id: number;
  site_title: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  mn_contractor_id: string;
  naics_code: string;
  social_facebook: string | null;
  social_instagram: string | null;
  social_linkedin: string | null;
  social_google: string | null;
  cta_headline: string;
  cta_body: string;
  announcement_bar: string | null;
  announcement_active: boolean;
}

interface DirectusSchema {
  case_studies: CaseStudy[];
  markets: CMSMarket[];
  site_config: SiteConfig;
}

// ─── Client Factory ─────────────────────────────────────────────────
const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055';

function getClient() {
  return createDirectus<DirectusSchema>(DIRECTUS_URL).with(rest());
}

// ─── Asset URL Helper ───────────────────────────────────────────────
export function directusAssetUrl(fileId: string | null): string | null {
  if (!fileId) return null;
  return `${DIRECTUS_URL}/assets/${fileId}`;
}

// ─── Data Fetchers (with graceful fallback) ─────────────────────────
export async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    const client = getClient();
    const data = await client.request(
      readItems('case_studies', {
        filter: { status: { _eq: 'published' } },
        sort: ['sort'],
        fields: ['*'],
      })
    );
    return data as CaseStudy[];
  } catch (err) {
    console.warn('[CMS] case_studies fetch failed, returning empty:', (err as Error).message);
    return [];
  }
}

export async function getMarkets(): Promise<CMSMarket[]> {
  try {
    const client = getClient();
    const data = await client.request(
      readItems('markets', {
        filter: { status: { _eq: 'published' } },
        sort: ['sort'],
        fields: ['*'],
      })
    );
    return data as CMSMarket[];
  } catch (err) {
    console.warn('[CMS] markets fetch failed, returning empty:', (err as Error).message);
    return [];
  }
}

export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const client = getClient();
    const data = await client.request(
      readSingleton('site_config', { fields: ['*'] })
    );
    return data as SiteConfig;
  } catch (err) {
    console.warn('[CMS] site_config fetch failed, returning null:', (err as Error).message);
    return null;
  }
}
