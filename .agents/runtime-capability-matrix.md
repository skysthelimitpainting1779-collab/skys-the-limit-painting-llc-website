# Runtime Capability Matrix

| Surface | Status | Adapter | Evidence |
|---|---|---|---|
| terminal and shell execution | implemented | runCommand() | scripts/agent-os.js |
| git and repository operations | guarded | git status diagnostics only | .agents/implementation-contract.md |
| local file management | implemented | filesystem artifacts under .agents/ | .agents/ |
| browser automation | scaffolded | .agents/adapters/browser.md | .agents/runtime-capability-matrix.md |
| desktop automation | scaffolded | .agents/adapters/desktop.md | .agents/runtime-capability-matrix.md |
| documents, decks, reports, spreadsheets | scaffolded | .agents/adapters/documents.md | .agents/runtime-capability-matrix.md |
| database exploration and administration | scaffolded | .agents/adapters/database.md | .agents/runtime-capability-matrix.md |
| cloud CLI and deployment operations | guarded | verification gates plus human approval | AGENTS.md |
| email, chat, calendar, CRM, support, finance | approval_required | .agents/effects/ | .agents/effects.md |
| research with source validation | scaffolded | .agents/workflows/research.md | .agents/runtime-capability-matrix.md |
| recurring automations and monitors | scaffolded | .agents/queues/recurring.md | .agents/status.md |
