# Linear issue template: Feature

**Template name:** Feature  
**Team:** Skysthelimit  
**Suggested defaults:** Project `skysthelimit · Platform` · Priority High/Medium · Labels: Feature, !implement, agent-ready, (one) area:*

---

## Title format

`[area] Short outcome title`

## Description (paste below)

```markdown
## Goal

One sentence: what ships for painter / client / visitor.

## Context

- Linear epic / parent:
- Plan path (repo): `docs/superpowers/plans/…`
- Design: `DESIGN.md` / surface (marketing | portal | homebase | cms)
- Agent OS domain(s): frontend-vercel | ui-ux | api | content-market | seo | ci-devops

## Acceptance criteria

- [ ] 
- [ ] 
- [ ] Tests or preview verified

## Out of scope

- 

## Implementation

```
Files:
- Create:
- Modify:
```

## Agent OS

```bash
npm run agentos:health
npm run domain:route -- <paths>
npm run graph:query -- "<task>"
```

## Verify

```bash
npx tsc --noEmit
# + relevant tests
```

## Naming

Slug **skysthelimit** — see `docs/NAMING.md`. One Area label only. One playbook label only.
```
