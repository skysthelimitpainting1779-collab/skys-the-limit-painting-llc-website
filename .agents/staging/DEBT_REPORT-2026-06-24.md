---
type: debt-report
title: "Architecture Debt Report — 2026-06-24"
tags: [debt, custodian, architecture, hygiene]
generated_at: 2026-06-24T20:33:45.825Z
total_items: 31
high_priority: 8
medium_priority: 23
---

# Architecture Debt Report
**Generated:** 2026-06-24T20:33:45.825Z
**Total Debt Items:** 31 (8 HIGH, 23 MEDIUM)

---

## HIGH Priority Items

### DEAD-LAYOUT_TSX
- **Law:** Law 1: Zero Dead Code
- **File:** `src\components\Layout.tsx`
- **Issue:** Orphaned file (0 importers, 7.6KB): src\components\Layout.tsx

### DEAD-AGENT_OS_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\agent-os.js`
- **Issue:** Orphaned file (0 importers, 159.1KB): scripts\agent-os.js

### DEAD-CRON_OPS_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\cron-ops.js`
- **Issue:** Orphaned file (0 importers, 10.4KB): scripts\cron-ops.js

### DEAD-GENERATE_SITEMAP_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\generate-sitemap.js`
- **Issue:** Orphaned file (0 importers, 6.5KB): scripts\generate-sitemap.js

### DEAD-HARNESS_CUSTODIAN_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\harness-custodian.js`
- **Issue:** Orphaned file (0 importers, 18.5KB): scripts\harness-custodian.js

### DEAD-HARNESS_OPS_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\harness-ops.js`
- **Issue:** Orphaned file (0 importers, 16.3KB): scripts\harness-ops.js

### DEAD-MEMORY_HARNESS_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\memory-harness.js`
- **Issue:** Orphaned file (0 importers, 11.9KB): scripts\memory-harness.js

### OKF-ANTI-LAZINESS
- **Law:** Law 4: OKF Compliance
- **File:** `.agents/wiki/`
- **Issue:** 47 of 50 sampled wiki files contain [System Note: Awaiting semantic compilation] — re-compile required

---

## MEDIUM Priority Items

### DEAD-PAGEMETA_TSX
- **Law:** Law 1: Zero Dead Code
- **File:** `src\components\PageMeta.tsx`
- **Issue:** Orphaned file (0 importers, 3.1KB): src\components\PageMeta.tsx

### DEAD-TRUSTANCHORS_TSX
- **Law:** Law 1: Zero Dead Code
- **File:** `src\components\TrustAnchors.tsx`
- **Issue:** Orphaned file (0 importers, 0.8KB): src\components\TrustAnchors.tsx

### DEAD-SETTINGS_TS
- **Law:** Law 1: Zero Dead Code
- **File:** `src\lib\settings.ts`
- **Issue:** Orphaned file (0 importers, 2.0KB): src\lib\settings.ts

### DEAD-PROXY_TS
- **Law:** Law 1: Zero Dead Code
- **File:** `src\proxy.ts`
- **Issue:** Orphaned file (0 importers, 0.6KB): src\proxy.ts

### DEAD-TYPES_D_TS
- **Law:** Law 1: Zero Dead Code
- **File:** `src\types.d.ts`
- **Issue:** Orphaned file (0 importers, 0.4KB): src\types.d.ts

### DEAD-COMMERCIAL_TSX
- **Law:** Law 1: Zero Dead Code
- **File:** `src\views\Commercial.tsx`
- **Issue:** Orphaned file (0 importers, 0.3KB): src\views\Commercial.tsx

### DEAD-PUBLICSECTOR_TSX
- **Law:** Law 1: Zero Dead Code
- **File:** `src\views\PublicSector.tsx`
- **Issue:** Orphaned file (0 importers, 0.3KB): src\views\PublicSector.tsx

### DEAD-RESIDENTIAL_TSX
- **Law:** Law 1: Zero Dead Code
- **File:** `src\views\Residential.tsx`
- **Issue:** Orphaned file (0 importers, 0.3KB): src\views\Residential.tsx

### DEAD-AUTO_LEARN_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\auto-learn.js`
- **Issue:** Orphaned file (0 importers, 2.1KB): scripts\auto-learn.js

### DEAD-CI_CHECK_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\ci_check.js`
- **Issue:** Orphaned file (0 importers, 2.2KB): scripts\ci_check.js

### DEAD-COMPILE_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\compile.js`
- **Issue:** Orphaned file (0 importers, 1.6KB): scripts\compile.js

### DEAD-CRON_CUSTODIAN_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\cron-custodian.js`
- **Issue:** Orphaned file (0 importers, 3.9KB): scripts\cron-custodian.js

### DEAD-DB_MIGRATE_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\db_migrate.js`
- **Issue:** Orphaned file (0 importers, 3.6KB): scripts\db_migrate.js

### DEAD-ENFORCE_OKF_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\enforce-okf.js`
- **Issue:** Orphaned file (0 importers, 2.2KB): scripts\enforce-okf.js

### DEAD-ENQUEUE_COMPILATION_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\enqueue-compilation.js`
- **Issue:** Orphaned file (0 importers, 0.8KB): scripts\enqueue-compilation.js

### DEAD-PING_GOOGLE_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\ping-google.js`
- **Issue:** Orphaned file (0 importers, 1.9KB): scripts\ping-google.js

### DEAD-RENAME_IMPORTS_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\rename-imports.js`
- **Issue:** Orphaned file (0 importers, 0.8KB): scripts\rename-imports.js

### DEAD-RUN_DB_MIGRATIONS_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\run-db-migrations.js`
- **Issue:** Orphaned file (0 importers, 1.8KB): scripts\run-db-migrations.js

### DEAD-TEST_ACCESSIBILITY_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\test-accessibility.js`
- **Issue:** Orphaned file (0 importers, 2.9KB): scripts\test-accessibility.js

### DEAD-TEST_QUEUE_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\test-queue.js`
- **Issue:** Orphaned file (0 importers, 1.1KB): scripts\test-queue.js

### DEAD-VALIDATE_OKF_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\validate-okf.js`
- **Issue:** Orphaned file (0 importers, 2.6KB): scripts\validate-okf.js

### DEAD-VERIFY_CSP_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\verify-csp.js`
- **Issue:** Orphaned file (0 importers, 2.7KB): scripts\verify-csp.js

### DEAD-VERIFY_DNS_JS
- **Law:** Law 1: Zero Dead Code
- **File:** `scripts\verify_dns.js`
- **Issue:** Orphaned file (0 importers, 2.4KB): scripts\verify_dns.js

---

## How to Resolve
Each item above has a corresponding task in the SQLite queue (`.agents/coordination.db`).
Run `node scripts/queue.js list` to see all queued repairs.
After fixing, re-run `node scripts/harness-custodian.js` to verify resolution.

*Generated by harness-custodian.js — Architecture Custodian State Machine*