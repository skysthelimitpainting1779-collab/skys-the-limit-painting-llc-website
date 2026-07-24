---
name: heal-and-evolve
description: Classifies and troubleshoot compile and runtime codebase anomalies. Use when analyzing test errors or resolving compilation faults.
---
# Heal and Evolve Skill
Provides the diagnostic framework and decision trees required to resolve structural failures.

## Diagnostic Protocol
1. **Anomaly Classification**: Parse the logs to classify the software error:
   - `ToolFailure`: Execution command returned a non-zero exit code.
   - `InputCorruption`: Broken schema specifications or mismatched parameters.
   - `ReasoningCollapse`: Runaway loop recursion or step capacity threshold reached.
2. **Technical Sourcing**: Consult local configurations or make targeted queries using `search_web` if encountering unfamiliar dependency issues.
3. **Remediation Strategy**: Draft the isolated repair, define verification commands, and delegate task boundaries.
