---
id: cap_linting_verification
name: "Local Capability: Linting & Static Code Analysis"
type: capability
interface: npm run lint
description: "Run TypeScript compiler diagnostics and ESLint rules to enforce quality and type safety"
tags: [qa, lint, typescript]
references: [runtime_capability_matrix, lint_test_guide]
---

# Local Capability: Linting & Static Code Analysis 🧬

**ID**: cap_linting_verification  
**Status**: Implemented  

## Interface Specification

- **Command**: `npm run lint`
- **Scope**: Analyzes codebase for syntax issues, structural typing mismatches, and deprecated patterns.
- **Constraints**: Must pass with 100% success rate without warnings prior to pull-request submission.

## Usage Guidelines

- Always run lint checks after modifying any TypeScript, TSX, React, or configuration files.
- Resolve any `: any` typing mismatches by defining precise interfaces or type aliases.
