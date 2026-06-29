---
type: playbook
title: "Architecture Custodian Playbook"
tags: [architecture, hygiene, dead-code, custodian, adversarial, playbook]
last_sync: 2026-06-24
---

# Architecture Custodian Playbook

> **Purpose:** This playbook enforces structural integrity. It is adversarial by design.
> It looks for entropy, not just errors. The custodian runs on a 24-hour idle trigger.

## Core Laws (Non-Negotiable)

### Law 1: Zero Dead Code

- Any exported function, component, or CSS class not actively **imported** in the resolved module graph is **dead code**.
- Dead code must be flagged in `DEBT_REPORT.md` within 24 hours of detection.
- Dead code may **not** be deleted autonomously. It must be queued as a `REPAIR` task and approved by a human or specialized coding agent.
- **Threshold:** Files with zero incoming dependencies in the AST graph AND that are not route entry points (`page.tsx`, `layout.tsx`, `route.ts`, `not-found.tsx`) are flagged unconditionally.

### Law 2: Data Lineage Integrity

- Every TypeScript interface for an external API payload (HubSpot, Supabase, Resend, ManyChat) must have a **traceable path** from its definition → its API call → its UI consumption.
- Gaps in lineage are `DEBT-LINEAGE` items.
- The canonical lead payload interface is `LeadPayload` in `src/app/api/leads/route.ts`. Any divergence in other files is a lineage break.

### Law 3: Next.js 16.x Directory Boundaries

- Non-routable UI components (`*.tsx` that export a React component but are NOT `page.tsx`, `layout.tsx`, `not-found.tsx`, `error.tsx`, `loading.tsx`, or `template.tsx`) must **never** live inside `src/app/`.
- If a `.tsx` file inside `src/app/` does not match a Next.js reserved filename pattern, it is a **boundary violation**.
- Current known exception: `src/app/HomeClient.tsx` — this is a `"use client"` leaf component for the homepage. It is approved but should be monitored for size (currently 29KB — flag if it exceeds 40KB).

### Law 4: OKF Compliance

- Every `.md` file inside `wiki/`, `.agents/wiki/`, or `.agents/operations/` must contain valid YAML frontmatter with `type`, `title`, `tags`, and `last_sync`.
- Any file missing these fields is `DEBT-OKF`.
- Files with `[System Note: Awaiting semantic compilation]` in their body are **Anti-Laziness violations** per `RULES.md` and must be re-compiled immediately.

### Law 5: Memory Drift Prevention

- The `memory/shared-graph.json` nodes must stay synchronized with actual source files.
- If a node references a `source_file` path that no longer exists, it is a `DEBT-DRIFT` item.
- The custodian verifies file existence for all `properties.source_file` values in the graph.

---

## Sweep Phases

| Phase | Name              | Tool                                         | Output                  |
| ----- | ----------------- | -------------------------------------------- | ----------------------- |
| 1     | AST Sweep         | Graphify + direct import analysis            | Orphaned file list      |
| 2     | Data Trace        | TypeScript interface comparison              | Lineage break list      |
| 3     | Directory Cleanse | `src/app/` boundary scan                     | Boundary violation list |
| 4     | OKF Audit         | Frontmatter parser                           | Non-compliant file list |
| 5     | Memory Drift      | `shared-graph.json` source_file verification | Drift item list         |
| 6     | Remediation Queue | SQLite enqueue                               | DEBT_REPORT.md          |

---

## Remediation Protocol

1. The custodian writes `DEBT_REPORT.md` to `.agents/staging/` (never live directories).
2. Each debt item gets a `REPAIR-ARCH-[ID]` task in the SQLite queue with `priority: medium`.
3. Items classified as **CRITICAL** (boundary violations, lineage breaks) get `priority: high`.
4. The custodian **never deletes files autonomously**. It only flags.
5. After a human or specialized agent executes repairs, the custodian re-runs to verify resolution.

---

## Approved Exceptions Registry

| File                     | Law   | Reason                        | Approved By         | Date       |
| ------------------------ | ----- | ----------------------------- | ------------------- | ---------- |
| `src/app/HomeClient.tsx` | Law 3 | Client leaf for root page.tsx | Architecture Review | 2026-06-24 |

_Last sync: 2026-06-24_ 🧬
