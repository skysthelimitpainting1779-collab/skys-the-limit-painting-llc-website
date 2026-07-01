---
id: cap_filesystem_management
name: "Local Capability: Local Filesystem Management"
type: capability
interface: filesystem
description: "Read, write, and structure check capabilities for the file-based control plane"
tags: [system, fs, workspace]
references: [runtime_capability_matrix]
---

# Local Capability: Local Filesystem Management 🧬

**ID**: cap_filesystem_management  
**Status**: Implemented  

## Interface Specification

- **Scope**: Recursive folder creation, JSON database read/write, and markdown ledger compilation under `.agents/`.
- **Constraints**: Confined within the workspace directory. Does not perform mutations on outside folders or sensitive administrative system files.

## Usage Guidelines

- All critical states must write checkpoint files under `.agents/checkpoints/` before transitioning state.
- Keep the JSON database (`.agents/hub_db.json`) as the single source of truth; do not write duplicate database files.
