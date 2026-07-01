---
id: cap_git_diagnostics
name: "Local Capability: Repository Diagnostics & Tracking"
type: capability
interface: gitStatus()
description: "Repository change tracking, active status, branch inspection, and change safety guards"
tags: [system, git, tracking]
references: [runtime_capability_matrix]
---

# Local Capability: Repository Diagnostics & Tracking 🧬

**ID**: cap_git_diagnostics  
**Status**: Guarded  

## Interface Specification

- **Scope**: Read-only repository telemetry (`git status`, `git branch`, etc.).
- **Constraints**: Automatic checkout/revert is guarded; any file restoration must be manually inspected or requested via explicit operator approvals. No automatic rollback of source files is performed by default.

## Usage Guidelines

- Use git status to verify workspace cleanliness prior to running builds.
- Check porcelain output (`git status --porcelain`) during self-healing triage to identify exactly which files were modified leading up to an execution failure.
