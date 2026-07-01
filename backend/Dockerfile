# Agentic backend — deployed as a Vercel Function from a Dockerfile (OCI image on
# Fluid compute). See: https://vercel.com/changelog/bring-your-dockerfile-to-vercel-functions
# The server MUST listen on $PORT (Vercel assigns it). See server.js.

# Pinned base image (no :latest) for reproducible, supply-chain-safe builds.
FROM node:24-alpine

# Small hardening: run as the built-in non-root `node` user.
ENV NODE_ENV=production
WORKDIR /app

# Install production deps from the lockfile for deterministic builds.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy source and drop privileges.
COPY --chown=node:node . .
USER node

# Documentation only — Vercel routes traffic to $PORT at runtime.
EXPOSE 3000

# Lightweight liveness probe against the /health endpoint.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT:-3000}/health" || exit 1

CMD ["npm", "start"]
