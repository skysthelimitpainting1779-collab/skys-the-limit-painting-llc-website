# Errors Log

This file tracks operational errors and tool failures for continuous self-improvement.

## [ERR-20260521-001] replace_file_content

**Logged**: 2026-05-21T18:11:00Z
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary [ERR-20260521-001]

Accidental truncation of `index.html` during `replace_file_content` edit due to mismatch in line range bounds.

### Error [ERR-20260521-001]

```text
File truncated to 28 lines instead of the full HTML document, dropping main content and scripts.
```

### Context [ERR-20260521-001]

- Command/operation attempted: Editing `index.html` to inject the HubSpot tracking script using `replace_file_content`
- Input or parameters used: Incorrect StartLine and EndLine bounds, matching partial tags
- Environment details: Windows dev environment, editing `index.html` in `Skysthelimititsme101`

### Suggested Fix [ERR-20260521-001]

Double check the exact line numbers and the target content in the source file before performing the replace. Ensure the target range completely covers all lines containing the target content without crossing block boundaries. If truncation occurs, run `git checkout -- <file>` immediately to restore.

### Metadata [ERR-20260521-001]

- Reproducible: yes
- Related Files: index.html
- See Also: None

### Resolution [ERR-20260521-001]

- **Resolved**: 2026-05-21T18:12:00Z
- **Commit/PR**: Manual git checkout recovery
- **Notes**: Recovered the file by running `git checkout -- index.html` and reapplied the edit with precise, verified line bounds and unique target context.

---

## [ERR-1782151203303] Task failure: Compliance and Terminology Audit

**Logged**: 2026-06-22T18:00:03.303Z
**Priority**: high
**Status**: quarantined
**Area**: devops-execution

### Summary [ERR-1782151203303]

Task command "npm run lint" failed during runtime.

### Error Output [ERR-1782151203303]

```text
src/app/page.tsx(4,14): error TS2559: Type '123' has no properties in common with type 'Metadata'.
```

### Diagnostics Context [ERR-1782151203303]

```text
[Diagnostics] Analyzing failure of command: "npm run lint"
[Git Status] Modified workspace files:
 M src/app/page.tsx
?? graphify-out/2026-06-21/
?? graphify-out/cache/ast/v0.8.39/1c066c5f1f3ada255b6a35640a4ec1550e23f116006aac6d4af7ed5c21463dea.json
?? graphify-out/cache/ast/v0.8.39/24517661e9f9dbfcba179bdd755a5dff350f7abeccd0a73d93fd0abedc6c1ff8.json
?? graphify-out/cache/ast/v0.8.39/33d7864a5bdcc9471f7c5bee59a7062827a79d1d76a1dfb4c2233b4bd58b566e.json
?? graphify-out/cache/semantic/08e7f294d81118acc559c0a94c457c99db684010c4943a92b069300596546f91.json
?? graphify-out/cache/semantic/09e5fa9c810226a188b26c1cf380faef0e6440b67acbd20f082c34299a6f2042.json
?? graphify-out/cache/semantic/11716a19ab373c379aa767c822bd370150506c314b63f675c767fc1df16aa736.json
?? graphify-out/cache/semantic/13c9aebaea9cde9be4d8dc8bf00d1f3b3da7d4d717ee02ad74ce9e819ca33417.json
?? graphify-out/cache/semantic/19439861dfc7a3e34513575c649335549ff991d8cdabdaf618bb18b99f4794e7.json
?? graphify-out/cache/semantic/3248ec
```

### Suggested Fix [ERR-1782151203303]

Fix the TypeScript compiler type errors in modified files: src/app/page.tsx.

---

## [ERR-20260622-002] Codebase Anti-Pattern Auditing & Cleanups

**Logged**: 2026-06-22T18:33:00Z
**Priority**: medium
**Status**: resolved
**Area**: frontend-typescript-accessibility

### Summary [ERR-20260622-002]

Identified and resolved three codebase anti-patterns:

1. **Accessibility Dropdown**: CSS hover-only menus using Tailwind's `group-hover` bypass keyboard focus and screen readers.
2. **Vite Reference Typings**: Legacy `/// <reference types="vite/client" />` file references left after migrating to Next.js.
3. **TypeScript Type Safety**: Widespread use of `: any` in React props and database utility parameters, bypassing compiler safety checks.

### Fix / Learning [ERR-20260622-002]

1. **Dropdown Menu**: Refactored the "More" navigation dropdown in [ConversionHeader.tsx](file:///c:/Users/Johnny%20Cage/DEV/skysthelimit-collab/src/components/ConversionHeader.tsx) to manage state using React (`dropdownOpen`), implementing keyboard-accessible event triggers like click to toggle, `Escape` key to close, and an `onBlur` target containment trap.
2. **Obsolete References**: Deleted the Vite reference in `src/types.d.ts` as Next.js typescript targets handle modern resource declaration.
3. **Type Safety**: Declared interface `CaseStudyCardProps` in `src/views/Projects.tsx` and `LeadPayload` in `src/app/api/leads/route.ts` to replace all remaining `: any` typings.

### Metadata [ERR-20260622-002]

- Related Files: [ConversionHeader.tsx](file:///c:/Users/Johnny%20Cage/DEV/skysthelimit-collab/src/components/ConversionHeader.tsx), [Projects.tsx](file:///c:/Users/Johnny%20Cage/DEV/skysthelimit-collab/src/views/Projects.tsx), [types.d.ts](file:///c:/Users/Johnny%20Cage/DEV/skysthelimit-collab/src/types.d.ts), [route.ts](file:///c:/Users/Johnny%20Cage/DEV/skysthelimit-collab/src/app/api/leads/route.ts)

## [ERR-20260622-003] PowerShell Select-String switch parameter misuse

**Logged**: 2026-06-22T19:21:00Z
**Priority**: medium
**Status**: resolved
**Area**: tooling / shell scripting

### Summary [ERR-20260622-003]

Passing `-CaseSensitive:$false` to `Select-String` fails because `-CaseSensitive` is a
**switch parameter** — it accepts no value. PowerShell cannot convert the string `"False"`
to `SwitchParameter`, so the command errors out immediately.

### Error [ERR-20260622-003]

```text
Select-String : Cannot convert 'System.String' to the type
'System.Management.Automation.SwitchParameter' required by parameter 'CaseSensitive'.
```

Triggered by:

```powershell
# WRONG — $false gets interpolated inside double-quotes and passed as a value
npm test 2>&1 | Select-String -Pattern 'not ok|fail|FAIL' -CaseSensitive:$false
```

### Fix / Learning [ERR-20260622-003]

`Select-String` is **case-insensitive by default**. Simply omit the flag entirely.
Only include `-CaseSensitive` (no value) when you explicitly want case-sensitive matching.

```powershell
# CORRECT — omit the flag; default behaviour is already case-insensitive
npm test 2>&1 | Select-String -Pattern 'not ok|fail'

# CORRECT — explicit case-sensitive match (switch only, no value)
npm test 2>&1 | Select-String -Pattern 'not ok|FAIL' -CaseSensitive
```

Additional rule: **never pass boolean values to PowerShell switch parameters.**
Switch parameters toggle on by their presence, not by assignment.
Use `-Param:$false` only with non-switch boolean parameters (e.g. `-Recurse:$false`
on commands where `-Recurse` accepts a boolean, not a plain switch).

A second compounding mistake was piping `npm test 2>&1` inside a
`powershell -ExecutionPolicy Bypass -Command "..."` single-line string: variable
interpolation (`$false`) is evaluated at parse time inside double-quoted strings,
producing the literal word `False` which is then passed as a parameter value.
Prefer a `.ps1` script file for any pipeline with variables or complex quoting.

### Metadata [ERR-20260622-003]

- Affected command: `Select-String -CaseSensitive:$false`
- Root cause: Switch parameters do not accept values; double-quoted string interpolates `$false` to `"False"`
- Prevention: Use script files (`scratch/*.ps1`) for multi-step pipelines; never assign values to switch parameters

## [ERR-20260622-634] Task failure: Compliance and Terminology Audit

**Logged**: 2026-06-22T20:16:51.887Z
**Priority**: high
**Status**: quarantined
**Area**: devops-execution

### Summary [ERR-20260622-634]
Task command "npm run lint" failed during runtime execution.

### Error [ERR-20260622-634]
```text
Entry criteria failed for phase RESEARCH: No active checkpoints found for task GOAL-6-T1
```

### Fix / Learning [ERR-20260622-634]
Root cause diagnostics. Working resolution:

```javascript
# CORRECT
// Working file path modification or compilation fix

# WRONG
// Failing call: npm run lint
```

### Metadata [ERR-20260622-634]
- Root cause: command execution exit code non-zero
- Prevention: verify execution parameters and run locally prior to staging

## [ERR-20260622-592] Task failure: Compliance and Terminology Audit

**Logged**: 2026-06-22T20:24:07.642Z
**Priority**: high
**Status**: quarantined
**Area**: devops-execution

### Summary [ERR-20260622-592]
Task command "npm run lint" failed during runtime execution.

### Error [ERR-20260622-592]
```text
Entry criteria failed for phase EXECUTE: No active checkpoints found for task GOAL-6-T1
```

### Fix / Learning [ERR-20260622-592]
Root cause diagnostics. Working resolution:

```javascript
# CORRECT
// Working file path modification or compilation fix

# WRONG
// Failing call: npm run lint
```

### Metadata [ERR-20260622-592]
- Root cause: command execution exit code non-zero
- Prevention: verify execution parameters and run locally prior to staging

---

## [ERR-20260622-004] Checking graphify version via python module attribute throws AttributeError

**Logged**: 2026-06-22T20:29:30Z
**Priority**: low
**Status**: resolved
**Area**: tooling / shell scripting

### Summary [ERR-20260622-004]

Attempting to read `graphify.__version__` failed because the `graphify` python module does not expose `__version__` directly in its `__init__.py` file.

### Error [ERR-20260622-004]

```text
Traceback (most recent call last):
  File "<string>", line 1, in <module>
    import graphify; print(graphify.__version__)
                           ^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\Johnny Cage\AppData\Roaming\Python\Python314\site-packages\graphify\__init__.py", line 28, in __getattr__
    raise AttributeError(f"module 'graphify' has no attribute {name!r}")
AttributeError: module 'graphify' has no attribute '__version__'
```

### Fix / Learning [ERR-20260622-004]

The `graphifyy` package does not set a `__version__` attribute on the `graphify` namespace. To programmatically obtain the version of the package in Python, use `importlib.metadata`:

```python
# CORRECT
import importlib.metadata
version = importlib.metadata.version("graphifyy")
print(version)

# WRONG
import graphify
print(graphify.__version__)
```

Alternatively, query using the package manager (`pip show graphifyy` or `uv tool list`) or the package's CLI wrapper (`graphify --version`).

### Metadata [ERR-20260622-004]

- Root cause: Missing `__version__` attribute in the `graphify` Python package initialization file
- Prevention: Query package version via `importlib.metadata` or through the CLI directly instead of assuming module attributes

---

## [ERR-20260622-005] PowerShell inline double-quote escape parsing error in python command

**Logged**: 2026-06-22T20:29:45Z
**Priority**: low
**Status**: resolved
**Area**: tooling / shell scripting

### Summary [ERR-20260622-005]

Running an inline python command inside `powershell -Command` with backslash-escaped double-quotes `\"` fails due to PowerShell's parsing and argument forwarding, which strips or truncates the command, resulting in a `SyntaxError: '(' was never closed`.

### Error [ERR-20260622-005]

```text
  File "<string>", line 1
    import importlib.metadata; print(importlib.metadata.version(
                                                               ^
SyntaxError: '(' was never closed
```

### Fix / Learning [ERR-20260622-005]

PowerShell's `-Command` parses double quotes inside double quotes in complex ways. To pass string arguments cleanly to python from PowerShell, use single quotes inside double quotes, or escape double quotes using backticks (PowerShell's escape char) or triple-quotes, or use single-quoted script blocks `{ ... }`.

```powershell
# CORRECT
powershell -ExecutionPolicy Bypass -Command "python -c 'import importlib.metadata; print(importlib.metadata.version(\"\"\"graphifyy\"\"\"))'"
# OR even simpler, using single quotes in python code:
powershell -ExecutionPolicy Bypass -Command "python -c 'import importlib.metadata; print(importlib.metadata.version(''graphifyy''))'"
# OR running standard CMD / git bash style:
python -c "import importlib.metadata; print(importlib.metadata.version('graphifyy'))"
```

### Metadata [ERR-20260622-005]

- Root cause: PowerShell command parser strips backslash-escaped double quotes when running commands
- Prevention: Use single quotes or triple double-quotes inside python -c commands under PowerShell

---

## [ERR-20260622-006] PowerShell quoted command execution fails without call operator

**Logged**: 2026-06-22T20:31:30Z
**Priority**: low
**Status**: resolved
**Area**: tooling / shell scripting

### Summary [ERR-20260622-006]

Running a quoted executable path in PowerShell directly without using the call operator (`&`) results in a parser error: `Unexpected token '-m' in expression or statement`.

### Error [ERR-20260622-006]

```text
At line:1 char:75
+ ... y Cage\AppData\Local\Programs\Python\Python312\python.exe' -m pip ins ...
+                                                                ~~
Unexpected token '-m' in expression or statement.
At line:1 char:78
+ ... ge\AppData\Local\Programs\Python\Python312\python.exe' -m pip install ...
+                                                               ~~~
Unexpected token 'pip' in expression or statement.
```

### Fix / Learning [ERR-20260622-006]

In PowerShell, when invoking an executable whose path is in a quoted string, you must use the call operator (`&`) at the beginning of the command:

```powershell
# CORRECT
& 'C:\Users\Johnny Cage\AppData\Local\Programs\Python\Python312\python.exe' -m pip install --upgrade graphifyy

# WRONG
'C:\Users\Johnny Cage\AppData\Local\Programs\Python\Python312\python.exe' -m pip install --upgrade graphifyy
```

### Metadata [ERR-20260622-006]

- Root cause: PowerShell requires the call operator (`&`) to execute a command from a quoted string path
- Prevention: Always prefix quoted executable paths with `&` in PowerShell commands

---

## [ERR-20260622-007] Parent shell expansion of environment variables inside double-quoted PowerShell -Command

**Logged**: 2026-06-22T20:52:00Z
**Priority**: high
**Status**: resolved
**Area**: tooling / shell scripting

### Summary [ERR-20260622-007]

Executing a multi-statement PowerShell command inside double quotes via `powershell -Command "..."` causes the parent shell to interpolate and expand `$env:VARIABLE` before invoking the child process. Since the variables are undefined in the parent shell, they expand to empty strings, resulting in invalid PowerShell assignment statements like `='value'` and causing a syntax/command-not-found error.

### Error [ERR-20260622-007]

```text
=https://integrate.api.nvidia.com/v1 : The term '=https://integrate.api.nvidia.com/v1' is not recognized as the name 
of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if a path was included, 
verify that the path is correct and try again.
At line:1 char:1
+ ='https://integrate.api.nvidia.com/v1'; ='nvapi-zCvD8jqHiydmSNpU9kHhO ...
...
error: backend 'openai' requires OPENAI_API_KEY to be set.
```

### Fix / Learning [ERR-20260622-007]

When running PowerShell commands that define or use variables, either use a `.ps1` script file (highly recommended for complex quoting) or escape the variable symbol with a backtick (`` ` ``) or enclose the `-Command` argument in single quotes so that the parent shell does not expand the variables.

```powershell
# CORRECT — use a separate .ps1 script file
# In scratch/run_graphify.ps1:
$env:OPENAI_BASE_URL='https://integrate.api.nvidia.com/v1'
$env:OPENAI_API_KEY='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'
$env:OPENAI_MODEL='deepseek-ai/deepseek-v4-pro'
graphify . --backend openai --no-viz

# CORRECT — escape the variable prefix in double-quoted strings
powershell -ExecutionPolicy Bypass -Command "`$env:OPENAI_BASE_URL='https://integrate.api.nvidia.com/v1'; `$env:OPENAI_API_KEY='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'; `$env:OPENAI_MODEL='deepseek-ai/deepseek-v4-pro'; graphify . --backend openai --no-viz"

# WRONG — parent shell expands $env variables to empty string before child command runs
powershell -ExecutionPolicy Bypass -Command "$env:OPENAI_BASE_URL='https://integrate.api.nvidia.com/v1'; $env:OPENAI_API_KEY='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'; $env:OPENAI_MODEL='deepseek-ai/deepseek-v4-pro'; graphify . --backend openai --no-viz"
```

### Metadata [ERR-20260622-007]

- Affected command: `powershell -Command "$env:VAR='val'"`
- Root cause: Parent shell expanded `$env:VAR` to empty string inside double quotes
- Prevention: Use `.ps1` script files or escape `$` as `` `$ `` inside double-quoted `-Command` strings

---

## [ERR-20260622-008] SyntaxError due to unescaped nested backticks in template literal in scripts/agent-os.js

**Logged**: 2026-06-22T22:04:00Z
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary [ERR-20260622-008]

A SyntaxError occurred because raw nested backticks were used inside an outer backtick template literal defining `htmlContent`. This prematurely closed the string literal, causing subsequent HTML characters and scripts to be parsed as actual JavaScript code, resulting in invalid tokens (e.g. `class` or `/` in `\${matchCount} / ...`).

### Error [ERR-20260622-008]

```text
file:///C:/Users/Johnny%20Cage/DEV/skysthelimit-collab/scripts/agent-os.js:2277
        statsEl.innerText = `\${matchCount} / \${conceptNodes.length} Files`;
                             ^

SyntaxError: Invalid or unexpected token
```

### Fix / Learning [ERR-20260622-008]

Always escape all nested backticks inside outer backtick template literals in Node.js scripts using a backslash (`\``).

```javascript
# CORRECT
statsEl.innerText = \`\${matchCount} / \${conceptNodes.length} Files\`;

# WRONG
statsEl.innerText = `\${matchCount} / \${conceptNodes.length} Files`;
```

### Metadata [ERR-20260622-008]

- Affected command: `node scripts/agent-os.js`
- Root cause: Unescaped nested backticks inside outer backtick template literal
- Prevention: Always escape nested template literal backticks as `\`` inside outer template literals

---

## [ERR-20260623-001] Target file path mismatch during task.md update

**Logged**: 2026-06-23T02:23:00Z
**Priority**: low
**Status**: resolved
**Area**: tooling

### Summary [ERR-20260623-001]

An attempt to update the `task.md` file failed because the file was specified at the workspace root (`c:\Users\Johnny Cage\DEV\skysthelimit-collab\task.md`) instead of the active artifact directory (`C:\Users\Johnny Cage\.gemini\antigravity\brain\63cc26d4-e890-4757-829e-f6b7704720aa\task.md`).

### Error [ERR-20260623-001]

```text
C:\Users\Johnny Cage\DEV\skysthelimit-collab\task.md does not exist in the current location. Make sure the file path correct.
```

### Fix / Learning [ERR-20260623-001]

Always double-check the absolute directory location of the file to edit. For active session-specific checklists and implementation files (like `task.md` or `implementation_plan.md`), they are created inside the session-specific brain folder (`<appDataDir>\brain\<conversation-id>\`) and must be edited there.

```powershell
# CORRECT
TargetFile: "C:\Users\Johnny Cage\.gemini\antigravity\brain\63cc26d4-e890-4757-829e-f6b7704720aa\task.md"

# WRONG
TargetFile: "c:\Users\Johnny Cage\DEV\skysthelimit-collab\task.md"
```

### Metadata [ERR-20260623-001]

- Root cause: Target file specified in workspace directory instead of artifact directory
- Prevention: Always refer to planning documents using their correct, absolute artifact-directory paths

---

## [ERR-20260623-002] Non-existent Lucide-React Icon Reference (FolderCanvas)

**Logged**: 2026-06-23T02:39:00Z
**Priority**: high
**Status**: resolved
**Area**: frontend-typescript

### Summary [ERR-20260623-002]

TypeScript compilation during `npm run lint` failed because `src/app/admin/page.tsx` imported and referenced `FolderCanvas` from `'lucide-react'`, which is not an exported member of that library.

### Error [ERR-20260623-002]

```text
src/app/admin/page.tsx(11,3): error TS2305: Module '"lucide-react"' has no exported member 'FolderCanvas'.
```

### Context [ERR-20260623-002]

- Operation attempted: Running TypeScript type-checking / ESLint validation using `npm run lint`.
- Code state: `src/app/admin/page.tsx` had an active import of `FolderCanvas` from `'lucide-react'` and used it as `<FolderCanvas size={14} />`.

### Fix / Learning [ERR-20260623-002]

Verify the exact icon names exported by `lucide-react` before implementing them. When an invalid icon is referenced, replace it with a valid standard icon (such as `Folder` or `FolderOpen`) that matches the intended visual metaphor.

```typescript
# CORRECT
import { Folder } from 'lucide-react';
// ...
<Folder size={14} />

# WRONG
import { FolderCanvas } from 'lucide-react';
// ...
<FolderCanvas size={14} />
```

### Prevention Rule

Always double-check the official Lucide catalog or typings when using less common icon names, and run local type-checks before pushing code.

### Metadata [ERR-20260623-002]

- Root cause: Referenced a non-existent export `FolderCanvas` from `lucide-react`
- Prevention: Stick to standard, verified Lucide icons; run type checks locally to find icon reference issues early

---

## [ERR-20260623-003] next/dynamic ssr: false is not allowed in Server Components

**Logged**: 2026-06-23T02:40:00Z
**Priority**: high
**Status**: resolved
**Area**: frontend-nextjs-rendering

### Summary [ERR-20260623-003]

The Turbopack production build (`npm run build`) failed because `src/views/ServiceArea.tsx` (a Server Component) used `next/dynamic` to dynamically import `ServiceAreaMap` with the `{ ssr: false }` option. Next.js Server Components are evaluated server-side and do not allow client-only dynamic imports natively inside them.

### Error [ERR-20260623-003]

```text
Error: Turbopack build failed with 1 errors:
./src/views/ServiceArea.tsx:6:24
`ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.
```

### Context [ERR-20260623-003]

- Operation attempted: Compiling production build using `npm run build`
- Code state: `src/views/ServiceArea.tsx` statically imported nothing from `ServiceAreaMap` and loaded it dynamically instead:
  `const ServiceAreaMap = dynamic(() => import('../components/ServiceAreaMap'), { ssr: false });`

### Fix / Learning [ERR-20260623-003]

Since `ServiceAreaMap` is a Client Component that already wraps its browser-only code (Leaflet/Map loading) entirely inside `useEffect`, it can be imported statically inside Server Components. React/Next.js will safely render its static container on the server and hydrate the browser-only leaflet interactions on the client side.

```typescript
# CORRECT
import ServiceAreaMap from '../components/ServiceAreaMap';

# WRONG
import dynamic from 'next/dynamic';
const ServiceAreaMap = dynamic(() => import('../components/ServiceAreaMap'), { ssr: false });
```

### Prevention Rule

Never use `next/dynamic` with `ssr: false` inside a Server Component. If a component must be imported dynamically with `ssr: false`, wrap it inside a leaf Client Component instead of a Server Component, or ensure that the component is safe to render its skeleton on the server (i.e., using `useEffect` for all browser-only APIs).

### Metadata [ERR-20260623-003]

- Root cause: Used `next/dynamic` with `{ ssr: false }` directly inside a Server Component
- Prevention: Statically import client components that safe-guard browser-only APIs in `useEffect`; use dynamic imports with `ssr: false` only inside client-side components



