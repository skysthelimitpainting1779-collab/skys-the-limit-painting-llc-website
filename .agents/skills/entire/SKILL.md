---
name: entire
description: Entire CLI for agent session checkpoints linked to git. Use for entire, checkpoints, session history, and commit-linked agent context.
---

---
name: entire
description: How to use the Entire CLI (checkpoints, search, sessions, and more). Use whenever a task involves entire, checkpoints, or the `entire` command.
kind: local
tools:
  - run_shell_command
---

<!-- ENTIRE-MANAGED AGENT-HELP SKILL v1 -->

Entire's CLI is the source of truth for its own usage. Do not guess flags or subcommands.

Run `entire agent-help` for a map of when to use entire and which subcommand to use,
then `entire agent-help <command>` (e.g. `entire agent-help checkpoint`) for that command's
exact, currently-installed flags.

You are already inside the repo — entire auto-detects it from the git origin remote.
Never ask the user for the repo name.


## Grok (this agent)

- No native Entire lifecycle hooks for Grok yet. Capture happens via **Git hooks** when you commit/push in this repo.
- Antigravity uses the **gemini** Entire agent integration (hooks in `.gemini/settings.json`).
- Prefer: `entire agent-help`, `entire status`, `entire session list`, `entire checkpoint list`, `entire search --json` (after `entire login`).
- Binary: C:\Users\Johnny Cage\.local\bin\entire.exe
