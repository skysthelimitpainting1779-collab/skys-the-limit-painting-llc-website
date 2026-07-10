---
type: handoff
title: Handoff — {{TITLE}}
description: Implementer prompt after architecture loop.
tags: [handoff, architecture-loop]
version: 1.0.0
date: "{{DATE}}"
---

# Handoff: {{TITLE}}

**Status:** Architecture locked — implement next.  
**Plan:** `docs/`  
**Stack:** `.agents/STACK.md`  
**Loop run:** `docs/architecture/`

---

## System prompt (paste for next agent)

```text
You are implementing under LOCKED architecture decisions. Do not re-litigate.

LOCKED:
1. …
2. …

MINIMUM SHIPPABLE:
- …

DO:
- …

DON'T:
- …

VERIFY:
- …
```

---

## Do / don’t

### Do

### Don’t

---

## Verify commands

```bash
npx tsc --noEmit
# domain tests…
```

---

## Successor checklist

- [ ] Versions pinned in PR
- [ ] Locks still match plan
- [ ] Tests green
- [ ] Preview verified if platform-sensitive
