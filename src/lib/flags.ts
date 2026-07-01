// Lightweight, dependency-free feature flags. Free-tier friendly and
// framework-agnostic: flags resolve from NEXT_PUBLIC_ env vars at build time so
// they work in Server Components, Client Components, and static export alike.
//
// To graduate to Vercel Flags (A/B testing, gradual rollout) later, swap the
// resolver below for the `flags` SDK without changing call sites.

type FlagKey = 'calBooking' | 'heatmapOverlay' | 'reviewCarousel';

const DEFAULTS: Record<FlagKey, boolean> = {
  calBooking: true,
  heatmapOverlay: false,
  reviewCarousel: true,
};

// NEXT_PUBLIC_FLAG_<UPPER_SNAKE> = "1" | "true" | "0" | "false" overrides a default.
const ENV_OVERRIDES: Partial<Record<FlagKey, string | undefined>> = {
  calBooking: process.env.NEXT_PUBLIC_FLAG_CAL_BOOKING,
  heatmapOverlay: process.env.NEXT_PUBLIC_FLAG_HEATMAP_OVERLAY,
  reviewCarousel: process.env.NEXT_PUBLIC_FLAG_REVIEW_CAROUSEL,
};

function parseBool(value: string | undefined): boolean | undefined {
  if (value === undefined) return undefined;
  const v = value.trim().toLowerCase();
  if (v === '1' || v === 'true' || v === 'on') return true;
  if (v === '0' || v === 'false' || v === 'off') return false;
  return undefined;
}

export function isEnabled(flag: FlagKey): boolean {
  return parseBool(ENV_OVERRIDES[flag]) ?? DEFAULTS[flag];
}
