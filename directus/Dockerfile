# Directus CMS as an OCI image on Vercel Functions (Fluid compute).
# See: https://vercel.com/changelog/bring-your-dockerfile-to-vercel-functions
#
# NOTE: Directus is a stateful, long-running server that needs a persistent
# Postgres + object storage and is NOT viable on a free hobby plan. The
# free-tier path for this repo is the Supabase-native CMS. Keep this image
# opt-in for paid/self-hosted environments; pin the tag (never :latest) and
# prefer pushing a pinned copy to Vercel Container Registry (VCR).
FROM directus/directus:11.3.5

# Directus reads PORT from the environment; Vercel assigns $PORT at runtime.
ENV PORT=8055
EXPOSE 8055
