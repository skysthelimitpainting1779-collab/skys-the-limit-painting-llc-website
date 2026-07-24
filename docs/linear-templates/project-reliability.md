# Linear project template: Reliability

**Template name:** skysthelimit Reliability project  
**Use when:** Prod, security, leads, infra, P0 remediation

---

## Summary

```
skysthelimit reliability: [topic]. Verification-gated. Prefer area:infra|security|leads.
```

## Description (paste below)

```markdown
## Mission

Keep production and lead path healthy for **skysthelimit**.

## Critical work

| Issue | Topic |
|-------|--------|
| | |

## Rules

- Verification-first (preview/logs/tests in issue)
- Secrets only via Vercel / env — never commit
- P0 labels + Urgent priority for live breaks

## Agent OS

```bash
npm run agentos:health
# domain often: api | ci-devops
```

## Turso

Not for product data. Agent learnings only if pipeline records outcomes.

## Related

- Platform project for features that depend on this fix
```
