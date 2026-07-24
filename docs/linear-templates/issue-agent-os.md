# Linear issue template: Agent OS

**Template name:** Agent OS  
**Suggested defaults:** Labels: Improvement or Chore, !implement · Domain work stays under `.agents/`

---

## Description (paste below)

```markdown
## Goal

Improve Agent OS (domains, learnings, graph, Turso, skills, governance) for **skysthelimit**.

## Scope

- [ ] Kernel / ontology
- [ ] Domain(s): 
- [ ] Turso / learn pipeline
- [ ] Skills / evaluator
- [ ] Graph / health

## Commands

```bash
npm run agentos:health
npm run domain:sync -- all
npm run graph:query -- "…"
```

## Turso

Agent memory only (`TURSO_DATABASE_URL` remote). **Not** product CMS/leads.

## Verify

- [ ] `npm run agentos:health` turso.ok
- [ ] Domain learnings updated if failure/success
```
