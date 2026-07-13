# Host-native only (zero theater)

| Host | Loads |
|------|--------|
| All | root `AGENTS.md` |
| Claude | `CLAUDE.md` @AGENTS + `.claude/agents` + `.claude/skills` |
| Cursor | `.cursor/rules` + `.cursor/agents` |
| Codex | `AGENTS.md` + `.codex/agents` + `.agents/skills` |
| Antigravity | `GEMINI.md` + `.agents/rules` + `.agents/skills` |
| Copilot | `.github/copilot-instructions.md` + `.github/skills` |

**SSOT:** `.agents/specialists.json` · `.agents/skills/`  
**Compile:** `npm run host:compile`  
**No** domains/, queues/, hub_db, ontology novels, status mirrors.
