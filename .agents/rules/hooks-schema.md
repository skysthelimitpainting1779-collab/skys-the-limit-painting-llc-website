---
trigger: always_on
description: Ensures that PreToolUse and PostToolUse hooks always include a wildcard matcher to prevent silent failures.
---

# Hook Configuration Schema

When creating or modifying `hooks.json` files for `PreToolUse` or `PostToolUse` events:
- You **MUST** always specify a `"matcher"` key (e.g., `"matcher": "*"` or a specific tool regex).
- Omitting the matcher will cause the C++ engine to fail to intercept the tool call, rendering the security hook useless.
- Never deploy a PreToolUse/PostToolUse hook without explicitly defining the matcher boundary.
