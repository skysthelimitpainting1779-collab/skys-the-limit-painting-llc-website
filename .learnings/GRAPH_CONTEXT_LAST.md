---
type: graph_context
title: Last graphify context pull
source: graph-context.mjs
budget: 1500
cmd: query
at: 2026-07-10T07:31:16.622Z
result_tokens_est: 1200
---

# Graph context (budgeted)

**Command:** `graphify query "portal admin cms leads auth payload" --budget 1500`
**Budget:** 1500 · **Result ~tokens:** 1200
**Why:** Prefer this over dumping `GRAPH_REPORT.md` or all of `.agents/wiki`.

## Result

```text
Traversal: BFS depth=2 | Start: ['AdminPage()', 'AdminLayout()', 'CMSMarket', 'isAuthOk()', 'scanForStaleLeads()', 'isPayload()'] | 115 nodes found

NODE entire-to-agentos.mjs [src=scripts/entire-to-agentos.mjs loc=L1 community=5]
NODE learning-loop.mjs [src=scripts/learning-loop.mjs loc=L1 community=4]
NODE learn-pipeline.mjs [src=scripts/learn-pipeline.mjs loc=L1 community=2]
NODE harness-custodian.js [src=scripts/harness-custodian.js loc=L1 community=10]
NODE evaluate-skills.mjs [src=scripts/evaluate-skills.mjs loc=L1 community=17]
NODE main() [src=scripts/agent-os.js loc=L3422 community=0]
NODE recordFailure() [src=scripts/learning-loop.mjs loc=L219 community=4]
NODE queue.js [src=scripts/queue.js loc=L1 community=0]
NODE syncEntireToAgentOs() [src=scripts/entire-to-agentos.mjs loc=L764 community=5]
NODE cron-ops.js [src=scripts/cron-ops.js loc=L1 community=25]
NODE Projects.tsx [src=src/views/Projects.tsx loc=L1 community=22]
NODE route.ts [src=src/app/api/leads/route.ts loc=L1 community=18]
NODE rebuildMarkdownViews() [src=scripts/learning-loop.mjs loc=L565 community=4]
NODE harness-ops.js [src=scripts/harness-ops.js loc=L1 community=30]
NODE POST() [src=src/app/api/leads/route.ts loc=L358 community=18]
NODE enqueueTask() [src=scripts/queue.js loc=L88 community=0]
NODE utils.ts [src=src/lib/api/utils.ts loc=L1 community=18]
NODE asText() [src=src/lib/api/utils.ts loc=L1 community=18]
NODE client.ts [src=src/lib/directus/client.ts loc=L1 community=38]
NODE page.tsx [src=src/app/admin/page.tsx loc=L1 community=31]
NODE ReviewCarousel.tsx [src=src/components/ReviewCarousel.tsx loc=L1 community=31]
NODE saveDbSync() [src=scripts/queue.js loc=L35 community=0]
NODE isFakeEntireLesson() [src=scripts/entire-to-agentos.mjs loc=L184 community=5]
NODE loadDbSync() [src=scripts/queue.js loc=L19 community=0]
NODE runScanCycle() [src=scripts/cron-ops.js loc=L224 community=25]
NODE writeSkill() [src=scripts/entire-to-agentos.mjs loc=L452 community=5]
NODE isSkillWorthyLesson() [src=scripts/entire-to-agentos.mjs loc=L210 community=5]
NODE log() [src=scripts/cron-ops.js loc=L42 community=25]
NODE processLead() [src=scripts/harness-ops.js loc=L277 community=30]
NODE extractLessons() [src=scripts/entire-to-agentos.mjs loc=L343 community=5]
NODE scanForStaleLeads() [src=scripts/cron-ops.js loc=L110 community=25]
NODE recordErrors() [src=scripts/entire-to-agentos.mjs loc=L637 community=5]
NODE ensureDir() [src=scripts/entire-to-agentos.mjs loc=L141 community=5]
NODE createClient() [src=src/lib/supabase/client.ts loc=L3 community=31]
NODE buildLeadHtml() [src=src/lib/api/utils.ts loc=L69 community=18]
NODE writeWorkflow() [src=scripts/entire-to-agentos.mjs loc=L526 community=5]
NODE validate() [src=src/lib/api/utils.ts loc=L40 community=18]
NODE phase6_RemediationQueue() [src=scripts/harness-custodian.js loc=L327 community=10]
NODE collectPlatform() [src=scripts/entire-to-agentos.mjs loc=L244 community=5]
NODE sendAutoReplyToLead() [src=src/app/api/leads/route.ts loc=L159 community=18]
NODE scanApprovalQueue() [src=scripts/cron-ops.js loc=L189 community=25]
NODE scanKPIs() [src=scripts/cron-ops.js loc=L155 community=25]
NODE writeRules() [src=scripts/entire-to-agentos.mjs loc=L569 community=5]
NODE getCaseStudies() [src=src/lib/directus/client.ts loc=L82 community=38]
NODE runEntire() [src=scripts/entire-to-agentos.mjs loc=L86 community=5]
NODE sendWithResend() [src=src/app/api/leads/route.ts loc=L113 community=18]
NODE shouldPublishSkill() [src=scripts/evaluate-skills.mjs loc=L609 community=17]
NODE assertNoFakeEntireLessons() [src=scripts/entire-to-agentos.mjs loc=L224 community=5]
NODE slugify() [src=scripts/entire-to-agentos.mjs loc=L129 community=5]
NODE getClient() [src=src/lib/directus/client.ts loc=L71 community=38]
NODE isAuthOk() [src=scripts/entire-to-agentos.mjs loc=L165 community=5]
NODE autoCommit() [src=scripts/entire-to-agentos.mjs loc=L697 community=5]
NODE buildAutoReplyHtml() [src=src/app/api/leads/route.ts loc=L139 community=18]
NODE isPayload() [src=src/lib/api/utils.ts loc=L5 community=18]
NODE parsePipelineLeads() [src=scripts/cron-ops.js loc=L52 community=25]
NODE FORBIDDEN_LESSON_ID_PREFIXES [src=scripts/entire-to-agentos.mjs loc=L36 community=5]
NODE isOneOffCommitSubject() [src=scripts/entire-to-agentos.mjs loc=L170 community=5]
NODE uploadCmsAsset() [src=src/app/admin/page.tsx loc=L60 community=31]
NODE sendToHubspot() [src=src/app/api/leads/route.ts loc=L217 community=18]
NODE AdminPage() [src=src/app/admin/page.tsx loc=L181 community=31]
NODE client.ts [src=src/lib/supabase/client.ts loc=L1 community=31]
... (truncated — 54 more nodes cut by ~1500-token budget. Narrow with context_filter=['call'] or use get_node for a specific symbol)
```
