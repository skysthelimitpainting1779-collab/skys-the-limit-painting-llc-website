---
name: skill-evaluator
description: Use when creating, codifying, or reviewing agent skills — especially auto-generated from-entire skills — to score quality, quarantine garbage, and keep only reusable skills in the load path.
---

# Skill evaluator

Gate **garbage skills** out of the catalog. Prefer measured quality over "we codified a commit message."

## When to use

- After Entire / learn-pipeline codifies new skills under `.agents/skills/from-entire/`
- Before trusting an auto-generated `SKILL.md` for agent load
- When the skill folder is full of deps-bumps, one-offs, or template stubs
- When improving `writeSkill` / evolution so only reusable skills stay active

## When NOT to use

- Hand-authored technique skills you already tested (writing-skills TDD path)
- Project rules that belong in `AGENTS.md` / CLAUDE.md, not skills

## Commands

```bash
# Dry-run report (default)
npm run learn:evaluate
# or
node scripts/evaluate-skills.mjs

# Stamp frontmatter + quarantine/reject garbage
npm run learn:evaluate:apply

# Hard-delete reject verdicts (archives under _evaluation/purged/)
npm run learn:evaluate:purge

# Single skill
node scripts/evaluate-skills.mjs --slug some-skill-slug --apply
```

Pipeline (automatic): `learn-pipeline` runs evaluate **after** evolve and applies quarantine.

## Verdicts

| Verdict | Score | Action |
|---------|------:|--------|
| **pass** | ≥70 | Keep active |
| **warn** | ≥45 | Keep; improve description/procedure |
| **quarantine** | low / one-off | Move to `from-entire/_quarantine/` |
| **reject** | hard fails | Quarantine (or purge with `--purge`) |

## Hard-fail garbage signals

- One-off **deps bump** / `from X to Y` version pins
- Mostly **auto-template** body (`Reusable skill codified from Entire`, generic Procedure)
- **Commit-stub** Evidence only, no transferable steps
- Prevention that only says "load other skills"
- No concrete commands, paths, or unique procedure

## What a good skill has

1. **Description** — trigger-oriented (`Use when…`), not a process summary
2. **When to use** — specific symptoms, not "matches original session"
3. **Procedure** — numbered steps with real `npm`/`node`/file paths
4. **Prevention** — reusable rules, not "prefer this path"
5. **Reusable** — not a single Dependabot SHA

## After evaluation

- Report: `.agents/skills/from-entire/_evaluation/REPORT.md`
- JSON: `.agents/skills/from-entire/_evaluation/latest.json`
- Quarantine: `.agents/skills/from-entire/_quarantine/<slug>/`
- Frontmatter stamps: `quality_score`, `quality_verdict`, `quality_checked_at`, `status`

## Agent checklist

1. Run `npm run learn:evaluate` (or trust pipeline output)
2. Do **not** load `status: quarantined` / `rejected` skills for work
3. Prefer `pass` / `proven` skills; fix `warn` before promoting
4. If codifying new failures, write a real procedure — evaluator will quarantine templates

## Related

- `scripts/evaluate-skills.mjs` — scorer + apply
- `scripts/evolve-skills.mjs` — outcome-driven rewrites
- `scripts/learn-pipeline.mjs` — codify → Turso → evolve → **evaluate**
- Superpowers `writing-skills` — TDD for hand-authored skills
