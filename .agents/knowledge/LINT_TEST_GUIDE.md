---
id: lint_test_guide
name: "Reference Guide: Linting, Testing, and Builds"
type: concept
description: "SOP for triggering development workflows cleanly under PowerShell bypass policies on Windows machines."
tags: [runbook, testing, devops]
references: [workspace_knowledge]
---

# Reference Guide: Linting, Testing, and Builds

**Status**: Active  
**Domain**: Continuous Integration & Quality Gates

## PowerShell Execution Protocols

Since this Windows machine enforces strict local execution policies, all npm development and quality gates require the PowerShell execution-policy bypass.

### 1. Verification Checklist

Always run these narrow verifications first before committing changes, making pull requests, or initiating deploys:

| Task | PowerShell Bypass Command | Goal |
|---|---|---|
| **Linting Check** | `powershell -ExecutionPolicy Bypass -Command "npm run lint"` | Runs eslint and typescript compiler checks. |
| **Test Suite** | `powershell -ExecutionPolicy Bypass -Command "npm test"` | Executes unit and integration test specs. |
| **Production Build** | `powershell -ExecutionPolicy Bypass -Command "npm run build"` | Next.js production bundler and prerender checks. |

### 2. Multi-line Scripts & Pipelines

For complex scripts with quoting, piped commands, or environment variables, **never** execute inline pipelines. Instead:
1. Write a `.ps1` file inside `scratch/`.
2. Run it cleanly with:
   `powershell -ExecutionPolicy Bypass -File scratch/myscript.ps1`
