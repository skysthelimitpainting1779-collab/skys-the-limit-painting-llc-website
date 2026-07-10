---
type: decisions
title: Session decisions 2026-07-10
description: Architectural choices from Agent OS learning + active prevention session.
date: 2026-07-10
tags: [decisions, agent-os, learning]
okf: v0.1
---

# Decisions — 2026-07-10

## DEC-001 — Turso is Agent OS memory only

**Decision:** Use Turso for agent lessons, domain_events, hub control-plane memory. Product data stays on Supabase/portal (and future Payload CMS).

**Rationale:** Separation of concerns; Agent OS durability without polluting product schema.

**Impact:** `TURSO_*` env, learn-pipeline, domain:sync/pull, agent-os-store.

---

## DEC-002 — Root cause only (iron law 12)

**Decision:** Soft-exit wrappers, permanent check disables, and “always use absolute path” are not complete fixes. Fix PATH/auth/code/config; optional defense-in-depth only after VERIFY.

**Rationale:** WSL System32 bash ahead of Git; wrappers left agents broken.

**Canonical:** `.agents/governance/ROOT_CAUSE.md`

---

## DEC-003 — Active prevention (iron law 14)

**Decision:** Learning must **inject** (SessionStart / ACTIVE_CONTEXT) and **block** (PreToolUse deny) machine-detectable repeats. Logging without enforcement is incomplete.

**Rationale:** User requirement: agents must not make the same mistake again.

**Canonical:** `.agents/governance/ACTIVE_PREVENTION.md`, `scripts/active-prevention.mjs`

---

## DEC-004 — Project hooks prefer Node on Windows

**Decision:** Claude/project hooks invoke `node scripts/...` rather than bare `bash`/`sh`/`python3`.

**Rationale:** bash resolution was the failure mode; Node is present and stable.

---

## DEC-005 — Session learn requires evidence

**Decision:** “Learned” claims require `SESSION_CLOSE.md` (and ideally open:0 / health snapshot). Soft success without artifacts is dishonest.

**Canonical:** `docs/SESSION_LEARN.md`, iron law 13.
