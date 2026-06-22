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
