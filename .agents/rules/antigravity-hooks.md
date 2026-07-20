---
trigger: always_on
description: Native hooks for Antigravity (Gemini CLI) - integrates with Entire CLI and dev-healer hooks.
---

# Antigravity Native Hooks

Antigravity uses the centralized hooks system via `.agents/hooks.json`. All hooks are managed through the dev-healer plugin.

## Hook Schema (Antigravity)

Antigravity uses named hooks with the following schema:

```json
{
  "<hook-name>": {
    "enabled": true,
    "PreToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "/absolute/path/to/script",
            "timeout": 30
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "/absolute/path/to/script",
            "timeout": 30
          }
        ]
      }
    ],
    "PreInvocation": [{ ... }],
    "PostInvocation": [{ ... }],
    "Stop": [{ ... }]
  }
}
```

**Key differences from other agents:**
- Hooks are wrapped in named objects (e.g., "dev-healer")
- Each hook has an `"enabled": true` flag
- PreToolUse/PostToolUse use `"matcher"` → `"hooks"` array structure
- PreInvocation/PostInvocation/Stop use flat handler arrays (no matcher wrapper)
- Commands must use absolute paths

## Hook Integration

**Entire CLI Integration:**
- Git hooks are managed via Husky (`.husky/prepare-commit-msg`, `commit-msg`, `post-commit`, `post-rewrite`, `pre-push`)
- Entire CLI captures session checkpoints linked to Git commits
- Hooks are already installed and active for Antigravity

**Dev-Healer Hooks (PreToolUse):**
- `context-injector-hook.py` - Injects workspace context before tool use (matcher: `*`)
- `graphify-grep-enforcer.py` - Enforces graphify usage for codebase queries (matcher: `default_api:grep_search`)
- `schema-validator.py` - Validates tool inputs against schemas (matcher: `*`)
- `command-validator.py` - Validates command execution safety (matcher: `*`)

**Dev-Healer Hooks (PostToolUse):**
- `posttool_episodic_capture.py` - Captures episodic context after tool use (matcher: `*`)

## Current Configuration

Active hook: `dev-healer` in `.agents/hooks.json`
- All hooks use absolute paths to dev-healer Python scripts
- Timeout set to 5-10 seconds per hook
- Matchers configured for specific tools (grep_search) and global (*)

## Hard Denials

- Never disable or bypass hooks without explicit approval
- Never modify `.agents/hooks.json` without understanding the Antigravity schema
- Never remove Entire CLI integration from Husky hooks
- Hooks must always include a `"matcher"` key for PreToolUse/PostToolUse events
- Always use absolute paths for hook commands
- Never use relative paths - they resolve against terminal working directory, not workspace root

## Maintenance

- Verify hooks are active after npm install (Husky may overwrite)
- Run `entire update` to keep Entire CLI current
- Check `.agents/hooks.json` schema matches Antigravity format after any changes
- Test hooks by asking Antigravity "Which hooks are installed?"
