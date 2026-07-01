---
id: cap_database_administration
name: "Local Capability: Database Exploration & Administration"
type: capability
interface: database
description: "Programmatic schema inspection, seed management, and query validation"
tags: [system, db, storage]
references: [runtime_capability_matrix]
---

# Local Capability: Database Exploration & Administration 🧬

**ID**: cap_database_administration  
**Status**: Scaffolded  

## Interface Specification

- **Scope**: Scaffolded for relational and JSON-LD structured data exploration.
- **Constraints**: All writes require strict source reconciliation and dry-run confirmation notes.

## Usage Guidelines

- Maintain the JSON database (`.agents/hub_db.json`) with proper structure.
- Never write credentials, live database passwords, or private environment files to the repository.
