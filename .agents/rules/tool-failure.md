---
trigger: always_on
glob:
description: tool-failure rule
---

# Defect Class: ToolFailure (Syntax Errors)

**Root Cause Analysis:**
JavaScript compilation crashes (e.g., `SyntaxError: Unexpected token`) are typically caused by unclosed brackets, missing commas, or structural defects introduced during codebase modifications.

**Compacted Prevention Rule:**
*   **Mandatory Pre-Commit Validation**: Before staging any `.js` file, you MUST independently verify its structural integrity by executing:
    `python run_tests_hardened.py node --check <filepath>`
*   **Hard Gate**: Do not declare the repair successful until `node --check` returns exit code 0.
