---
trigger: always_on
description: Verify DevHealer hooks/sidecars/MCP are bound to the current workspace before using Graphify or any hook-dependent tool.
---

# DevHealer Workspace Binding Verification

Every DevHealer config file contains **hardcoded absolute paths**. When a workspace
is cloned, copied, or bootstrapped from another project, these paths are silently
stale and point to the wrong project.

## Mandatory Check (First Use Per Session)

Before using `graphify` MCP tools, hooks, or sidecars, verify binding:

### 1. Check Graphify node count is non-trivial
Run `graph_stats` via the graphify MCP. If it returns fewer than 100 nodes but
the project has source files, the MCP is pointing at the wrong `graph.json`.
Stop and fix `mcp_config.json` before proceeding with any code discovery.

### 2. Verify mcp_config.json graphify path
The graphify path must contain the CURRENT workspace directory, not any other project path.

### 3. Verify hooks.json and sidecars.json paths exist
Every path listed in `hooks.json` and `sidecars.json` must resolve to a real file
in the current workspace. Any MISSING entry must be removed or corrected before
those systems are trusted.

## Fix Protocol

If any path is wrong (e.g., points to `ITS/`, `MEMORY_GH/`, or any other workspace):
1. Replace the stale prefix with the current workspace root in all three files:
   - `.agents/mcp_config.json`
   - `.agents/hooks.json`
   - `.agents/sidecars.json`
2. Remove any sidecar entries whose scripts do not exist in this workspace
3. Commit the corrected configs
4. **Restart the IDE session** so MCP and hooks reload from the corrected paths

## Per-Project Isolation

Each project's `.agents/mcp_config.json`, `hooks.json`, and `sidecars.json` are
**fully independent**. Fixing one project's config never affects another project.
