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

# Deployment

> Brain routing note: durable deployment truth starts at `../AGENTS.md`, `../../AGENTS.md`, and `../../business_vault/vault_index.md`. Use this file only as the local website deployment checklist.

## Production Platform

The site is configured for Vercel. Production deployments should come from the `main` branch unless a release manager chooses a different flow.

## Pre-Deploy Checklist

```bash
npm ci
npm run lint
node --test tests/site-architecture.test.mjs
npm run build
```

## Environment

Keep real secrets in Vercel environment variables. Keep `.env.example` updated with placeholder names only.

## Release Tags

Create release tags with this format:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The release workflow validates the app and creates a GitHub release for the tag.

## Rollback

Use Vercel's deployment history to promote a previous known-good deployment. If code needs to be reverted, open a focused pull request and include the deployment that is being restored.
