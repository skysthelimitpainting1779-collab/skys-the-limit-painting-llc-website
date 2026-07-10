# Linear issue template: Bug

**Template name:** Bug  
**Suggested defaults:** Project `skysthelimit · Reliability` · Priority Urgent/High · Labels: Bug, p0-critical or p1-high, (one) area:*

---

## Title format

`[P0|P1] Symptom — short title`

## Description (paste below)

```markdown
## Status

🔴 / 🟡 — impact (revenue, leads, security, UX).

## Evidence

```
route / deployment / log snippet
```

## Repro

1. 
2. 
3. Expected vs actual

## Likely root causes

1. 
2. 

## Remedy

1. 
2. 
3. Verify:

## Agent OS

```bash
npm run domain:route -- <path>
# on fail: domain:error + learning-loop
```

## Related

- Blocks:
- Related SKY-XX:
```
