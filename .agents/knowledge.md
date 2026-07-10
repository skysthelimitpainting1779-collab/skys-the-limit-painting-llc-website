---
id: workspace_knowledge
name: "Workspace Knowledge & Runbook"
type: concept
description: "Aggregate system learnings, test commands, and failures cache."
---

# Workspace Knowledge & Runbook

Aggregate lessons learned and reference templates for task execution.

## Reference Command Guide

- **Linting**: `npm run lint`
- **Testing**: `npm test`
- **Next.js Production Compilation**: `npm run build`
- **Learning heal**: `node scripts/learning-loop.mjs heal`
- **Agent OS eval**: `node scripts/agent-os.js eval`

## Lessons Learned (token-cheap)

Do **not** paste full error dumps here. Use the structured learning loop:

- **Cold-start index**: `.learnings/ERRORS_INDEX.md`
- **Machine state**: `.learnings/index.json`
- **Prevention rules**: `.agents/governance/PREVENTION_RULES.md`
- **Record failure**: `node scripts/learning-loop.mjs record --title "..." --error "..."`
- **Heal pass**: `node scripts/learning-loop.mjs heal`

### Learning loop snapshot

- Unique fingerprints: 9
- Total records: 23
- Duplicates suppressed: 6
- Auto-heals: 1
- Open: 4 · Auto-healed: 0 · Resolved: 5

### Top incidents

- **ERR-20260710-e4d2** [general] Synthetic failure dedupe-test-1783674404787 (2x, open)
- **ERR-20260710-834e** [general] Synthetic failure dedupe-test-1783674420360 (2x, open)
- **ERR-20260710-4bfd** [general] Synthetic failure dedupe-test-1783674427016 (2x, open)
- **ERR-20260709-070a** [shell-powershell] PowerShell switch/quoting misuse (1x, resolved)
- **ERR-20260709-2e26** [nextjs-render] next/dynamic ssr:false in Server Component (1x, resolved)

