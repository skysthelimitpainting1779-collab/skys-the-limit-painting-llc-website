> [!NOTE]
> ### 🧬 MASTER BRAIN ROUTING ACTIVE
> This document is a subordinate execution or evidence surface. The supreme Single Source of Truth (SSOT) resides inside the Obsidian master control plane:
> *   **Supreme Index:** [[vault_index.md]]
> *   **Relative Path:** [vault_index.md](../../business_vault/vault_index.md)
> *   **Absolute Path:** [vault_index.md](file:///C:/Users/finan/New%20folder/business_vault/vault_index.md)

> [!NOTE]
> ### 🧬 MASTER BRAIN ROUTING ACTIVE
> This document is a subordinate execution or evidence surface. The supreme Single Source of Truth (SSOT) resides inside the Obsidian master control plane:
> *   **Supreme Index:** [[vault_index.md]]
> *   **Relative Path:** [vault_index.md](../../business_vault/vault_index.md)
> *   **Absolute Path:** [vault_index.md](file:///C:/Users/finan/New%20folder/business_vault/vault_index.md)

> [!NOTE]
> ### 🧬 MASTER BRAIN ROUTING ACTIVE
> This document is a subordinate execution or evidence surface. The supreme Single Source of Truth (SSOT) resides inside the Obsidian master control plane:
> *   **Supreme Index:** [[vault_index.md]]
> *   **Relative Path:** [vault_index.md](../../business_vault/vault_index.md)
> *   **Absolute Path:** [vault_index.md](file:///C:/Users/finan/New%20folder/business_vault/vault_index.md)

> [!NOTE]
> ### 🧬 MASTER BRAIN ROUTING ACTIVE
> This document is a subordinate execution or evidence surface. The supreme Single Source of Truth (SSOT) resides inside the Obsidian master control plane:
> *   **Supreme Index:** [[vault_index.md]]
> *   **Relative Path:** [vault_index.md](../../business_vault/vault_index.md)
> *   **Absolute Path:** [vault_index.md](file:///C:/Users/finan/New%20folder/business_vault/vault_index.md)

> [!NOTE]
> ### 🧬 MASTER BRAIN ROUTING ACTIVE
> This document is a subordinate execution or evidence surface. The supreme Single Source of Truth (SSOT) resides inside the Obsidian master control plane:
> *   **Supreme Index:** [[vault_index.md]]
> *   **Relative Path:** [vault_index.md](../../business_vault/vault_index.md)
> *   **Absolute Path:** [vault_index.md](file:///C:/Users/finan/New%20folder/business_vault/vault_index.md)

> [!NOTE]
> ### 🧬 MASTER BRAIN ROUTING ACTIVE
> This document is a subordinate execution or evidence surface. The supreme Single Source of Truth (SSOT) resides inside the Obsidian master control plane:
> *   **Supreme Index:** [[vault_index.md]]
> *   **Relative Path:** [vault_index.md](../../business_vault/vault_index.md)
> *   **Absolute Path:** [vault_index.md](file:///C:/Users/finan/New%20folder/business_vault/vault_index.md)

> [!NOTE]
> ### 🧬 MASTER BRAIN ROUTING ACTIVE
> This document is a subordinate execution or evidence surface. The supreme Single Source of Truth (SSOT) resides inside the Obsidian master control plane:
> *   **Supreme Index:** [[vault_index.md]]
> *   **Relative Path:** [vault_index.md](../../business_vault/vault_index.md)
> *   **Absolute Path:** [vault_index.md](file:///C:/Users/finan/New%20folder/business_vault/vault_index.md)

> [!NOTE]
> ### 🧬 MASTER BRAIN ROUTING ACTIVE
> This document is a subordinate execution or evidence surface. The supreme Single Source of Truth (SSOT) resides inside the Obsidian master control plane:
> *   **Supreme Index:** [[vault_index.md]]
> *   **Relative Path:** [vault_index.md](../../business_vault/vault_index.md)
> *   **Absolute Path:** [vault_index.md](file:///C:/Users/finan/New%20folder/business_vault/vault_index.md)

> [!NOTE]
> ### 🧬 MASTER BRAIN ROUTING ACTIVE
> This document is a subordinate execution or evidence surface. The supreme Single Source of Truth (SSOT) resides inside the Obsidian master control plane:
> *   **Supreme Index:** [[vault_index.md]]
> *   **Relative Path:** [vault_index.md](../../business_vault/vault_index.md)
> *   **Absolute Path:** [vault_index.md](file:///C:/Users/finan/New%20folder/business_vault/vault_index.md)

# Troubleshooting

> Brain routing note: troubleshoot from `../AGENTS.md`, `../../AGENTS.md`, `../../business_vault/vault_index.md`, and `../../business_vault/marketing/omni_sync_dashboard.md` before treating this local doc as current reality.

## `npm ci` Fails

- Confirm `package-lock.json` is committed and matches `package.json`.
- Delete local `node_modules` and run `npm ci` again.
- Check whether a dependency update pull request changed the lockfile.

## Type Check Fails

Run:

```bash
npm run lint
```

Fix the TypeScript errors shown in the output. This repository currently uses the `lint` script for TypeScript validation.

## Build Fails

Run:

```bash
npm run build
```

Common causes:

- Missing environment variable.
- Missing public asset path.
- Import path casing mismatch.
- TypeScript error surfaced during the Vite build.

## Video or Image Missing

- Confirm the file exists under `public/`.
- Confirm the code references it with a leading `/`.
- Regenerate Remotion assets when the source composition changed.

## Lead Form Issues

- Check `api/leads.ts`.
- Confirm environment variables are configured in Vercel.
- Review Vercel function logs for request or delivery errors.
