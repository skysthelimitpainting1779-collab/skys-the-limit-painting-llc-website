---
id: cap_shell_execution
name: "Local Capability: Shell & Command Execution"
type: capability
interface: runCommand(cmd)
description: "Safe execution of Node and PowerShell commands on local Windows host with execution-policy bypass controls"
tags: [system, shell, automation]
references: [runtime_capability_matrix]
---

# Local Capability: Shell & Command Execution 🧬

**ID**: cap_shell_execution  
**Status**: Implemented  

## Interface Specification

- **Signature**: `runCommand(cmd: string) -> string`
- **Scope**: Supports running executable scripts and general system command lines in PowerShell and CMD shells.
- **Constraints**: Mandatory PowerShell execution-policy bypass (`-ExecutionPolicy Bypass`) must be pre-pended to all script and pipeline executions to ensure compatibility on locked-down Windows systems.

## Usage Guidelines

- Always avoid passing boolean string interpolations directly to switch parameters (e.g. do not pass `-Switch:$false` since switch parameters toggle by presence).
- Utilize a temporary script file (`scratch/*.ps1`) for complex pipelines or multi-quoted parameters to prevent shell parsing failure.
