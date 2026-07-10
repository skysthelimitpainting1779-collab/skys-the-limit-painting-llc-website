import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');

// Supreme source of truth
const rootAgentsPath = path.join(ROOT, 'AGENTS.md');
if (!fs.existsSync(rootAgentsPath)) {
  console.error('Error: AGENTS.md not found at project root.');
  process.exit(1);
}
const constitution = fs.readFileSync(rootAgentsPath, 'utf8');

// Rules directories to ensure
const cursorRulesDir = path.join(ROOT, '.cursor', 'rules');
const claudeRulesDir = path.join(ROOT, '.claude', 'rules');

// Helpers for folder creation
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Scoped contents definitions
const redirectHeader = (fileType) => `<!--
  AUTO-GENERATED FILE — DO NOT EDIT DIRECTLY.
  This file is compiled from root AGENTS.md by scripts/sync-agent-rules.js.
  All edits must be made in the supreme constitution: AGENTS.md
-->

# Operating Manual (${fileType})

This AI agent instructions file is a redirect and complies with the root AGENTS.md constitution.

---

${constitution}
`;

const uiRuleContent = `---
description: Frontend UI rules enforcing Brutalist 0px border-radius and Safety Orange contrast.
globs: "src/app/**/*.tsx, src/components/**/*.tsx, src/views/**/*.tsx, src/app/**/*.css, src/index.css"
---
# Frontend UI Expert Scoped Rules

**Compliance Acknowledgment:** This module operates under the supreme authority of the root \`AGENTS.md\` constitution.

## Scoped Role: Frontend / UI Expert
You are permitted to write files ONLY under the following directories:
- \`src/app/\` (excluding \`/api/\`)
- \`src/components/\`
- \`src/views/\`
- \`public/images/\`

## Styling Standards (Non-Negotiable)
1. **Brutalist UI**: Set \`border-radius: 0px\` or \`rounded-none\` globally. Any rounded visual primitives are strictly banned.
2. **Safety Orange Contrast**: Backgrounds using Safety Orange (\`#FF5A00\`) must use Dark Charcoal (\`#050505\`) for text/icons. White text on orange is banned.
3. **Vanilla CSS Default**: Use Vanilla CSS in \`index.css\` as the default standard. Tailwind CSS is permitted only where brutalist layouts require.
4. **Emoji Restriction**: No graphical emojis in source code or React strings. Emojis (e.g. \`🧬\`) are allowed only in Markdown documentation files.
5. **Contractor Compliance**: Ensure the registration ID \`IR816596\` appears near any contractor reference.
`;

const backendRuleContent = `---
description: Backend CMS and Database rules for Supabase Postgres and Express routing.
globs: "backend/**/*, src/app/api/**/*.ts, supabase/**/*"
---
# Backend CMS & Database Scoped Rules

**Compliance Acknowledgment:** This module operates under the supreme authority of the root \`AGENTS.md\` constitution.

## Scoped Role: Backend / CMS Expert
You are permitted to write files ONLY under the following directories:
- \`backend/\`
- \`src/app/api/\`
- \`supabase/\`

## Database & Routing Standards
1. **Dual Storage Layout**: Ensure Directus CMS and local Supabase Postgres stay aligned.
2. **Rate Limiting**: Backend API endpoints must utilize Vercel KV (\`@vercel/kv\`) for shared state and rate-limiting rules.
3. **No UI Editing**: Modifying frontend CSS/TSX layout files is strictly forbidden.
`;

const seoRuleContent = `---
description: SEO, metadata, sitemaps, robots.txt, and AI crawlability parameters.
globs: "scripts/seo/**/*, public/llms.txt, public/sitemap.xml"
---
# SEO & AI Crawlability Scoped Rules

**Compliance Acknowledgment:** This module operates under the supreme authority of the root \`AGENTS.md\` constitution.

## Scoped Role: SEO Expert
You are permitted to write files ONLY under the following directories:
- \`scripts/seo/\`
- \`public/llms.txt\`
- \`public/sitemap.xml\`

## SEO & AI Crawlability Standards
1. **Canonical URLs**: Every routable page must expose alternates canonical URL attributes.
2. **Crawlers Access**: robots.txt must welcome GPTBot, ClaudeBot, Gemini-Bot, and PerplexityBot.
3. **JSON-LD Schema**: Inject valid schema tags on all Next.js Server Components.
`;

// List of target files and expected contents
const targets = [
  { path: path.join(ROOT, '.cursorrules'), content: redirectHeader('Cursor Rules') },
  { path: path.join(ROOT, '.clauderules'), content: redirectHeader('Claude Code Rules') },
  { path: path.join(ROOT, '.github', 'copilot-instructions.md'), content: redirectHeader('GitHub Copilot Instructions') },
  { path: path.join(ROOT, 'CLAUDE.md'), content: redirectHeader('Claude Rules') },
  { path: path.join(ROOT, '.agents', 'AGENTS.md'), content: `# Redirect: Supreme Constitution

This file is a placeholder redirect to maintain backward compatibility with older harnesses.

The supreme source of truth for agent rules has been consolidated in the repository root:
👉 **[AGENTS.md](file:///c:/Users/Johnny%20Cage/DEV/skysthelimit-collab/AGENTS.md)**

Detailed technical doctrine, principal architect prompts, and capability matrices are located in:
👉 **[.agents/architecture_doctrine.md](file:///c:/Users/Johnny%20Cage/DEV/skysthelimit-collab/.agents/architecture_doctrine.md)**
` },
  { path: path.join(ROOT, '.cursor', 'rules', 'ui.mdc'), content: uiRuleContent, dir: cursorRulesDir },
  { path: path.join(ROOT, '.cursor', 'rules', 'backend.mdc'), content: backendRuleContent, dir: cursorRulesDir },
  { path: path.join(ROOT, '.cursor', 'rules', 'seo.mdc'), content: seoRuleContent, dir: cursorRulesDir },
  { path: path.join(ROOT, '.claude', 'rules', 'ui.md'), content: uiRuleContent, dir: claudeRulesDir },
  { path: path.join(ROOT, '.claude', 'rules', 'backend.md'), content: backendRuleContent, dir: claudeRulesDir },
  { path: path.join(ROOT, '.claude', 'rules', 'seo.md'), content: seoRuleContent, dir: claudeRulesDir }
];

let failed = false;

targets.forEach(target => {
  if (target.dir) {
    if (!checkOnly) ensureDir(target.dir);
  }
  const parentDir = path.dirname(target.path);
  if (!fs.existsSync(parentDir) && !checkOnly) {
    ensureDir(parentDir);
  }

  if (checkOnly) {
    if (!fs.existsSync(target.path)) {
      console.error(`[SYNC CHECK] File missing: ${path.relative(ROOT, target.path)}`);
      failed = true;
    } else {
      const existing = fs.readFileSync(target.path, 'utf8');
      if (existing !== target.content) {
        console.error(`[SYNC CHECK] Drift detected in: ${path.relative(ROOT, target.path)}`);
        failed = true;
      }
    }
  } else {
    fs.writeFileSync(target.path, target.content, 'utf8');
    console.log(`[SYNCED] Written ${path.relative(ROOT, target.path)}`);
  }
});

// 1. Validate that graphify-out/graph.json exists
const graphJsonPath = path.join(ROOT, 'graphify-out', 'graph.json');
if (!fs.existsSync(graphJsonPath)) {
  console.error('[SYNC CHECK] FAILED: graphify-out/graph.json is missing. Run `graphify update . --force` to build the codebase graph.');
  failed = true;
}

// 2. Validate that git hooks are installed and contain graphify
const postCommitPath = path.join(ROOT, '.husky', 'post-commit');
if (!fs.existsSync(postCommitPath)) {
  console.error('[SYNC CHECK] FAILED: Husky post-commit hook is missing. Run `graphify hook install` to register it.');
  failed = true;
} else {
  const hookContent = fs.readFileSync(postCommitPath, 'utf8');
  if (!hookContent.includes('graphify')) {
    console.error('[SYNC CHECK] FAILED: Husky post-commit hook does not invoke graphify. Run `graphify hook install` to fix it.');
    failed = true;
  }
}

if (failed) {
  console.error('[SYNC CHECK] FAILED: AI configuration or graph files are not synchronized or registered. Run `npm run compile` or install hooks.');
  process.exit(1);
} else {
  console.log(checkOnly ? '[SYNC CHECK] PASSED: All configuration, graph, and git hook files comply with supreme constitution.' : '[SYNC] Rules synchronized successfully.');
}
