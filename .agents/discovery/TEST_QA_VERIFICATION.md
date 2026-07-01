---
id: cap_test_qa_verification
name: "Local Capability: Test & QA Verification Suite"
type: capability
interface: npm test
description: "Run automated unit, integration, and E2E verification suites"
tags: [qa, testing, verification]
references: [runtime_capability_matrix, lint_test_guide]
---

# Local Capability: Test & QA Verification Suite 🧬

**ID**: cap_test_qa_verification  
**Status**: Implemented  

## Interface Specification

- **Command**: `npm test`
- **Scope**: Validates component behaviors, routing flows, slider arithmetic constraints, and API responses.
- **Constraints**: Blocking quality gate. Any failing test halts execution state transitions.

## Usage Guidelines

- Run `npm test` before pushing to production or staging branches.
- Test suites must be executed with execution-policy bypass on Windows hosts.
