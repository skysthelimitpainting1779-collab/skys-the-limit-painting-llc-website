# Architecture Decisions

## [2026-07-01] Vercel Fluid Deployment
We deploy the Express backend via Vercel Edge / Fluid compute instead of a traditional Docker VPS to keep ops overhead low.

## [2026-07-01] Agentic Offloading
The backend handles webhooks from CI/CD but immediately offloads heavy LLM logic to async `child_process` execution to avoid Vercel timeout limits.
