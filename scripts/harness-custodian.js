/**
 * harness-custodian.js — Architecture Custodian State Machine
 *
 * Adversarial repository audit. Fights structural entropy.
 * Playbook: .agents/playbooks/ARCHITECTURE_CUSTODIAN.md
 *
 * Phases:
 *   1. AST_SWEEP        — Find files with no importers (dead code candidates)
 *   2. DATA_TRACE       — Verify LeadPayload lineage src→api→crm
 *   3. DIR_CLEANSE      — Detect non-routable .tsx inside src/app/
 *   4. OKF_AUDIT        — Check wiki/.agents/wiki/ for frontmatter compliance
 *   5. MEMORY_DRIFT     — Verify shared-graph.json source_file paths exist
 *   6. REMEDIATION_QUEUE — Write DEBT_REPORT.md and enqueue SQLite tasks
 *
 * Usage:
 *   node scripts/harness-custodian.js           # Full sweep + report
 *   node scripts/harness-custodian.js --phase 1 # Single phase
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { enqueueTask } from './queue.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── Paths ────────────────────────────────────────────────────────────────────
const SRC_DIR = path.join(ROOT, 'src');
const APP_DIR = path.join(ROOT, 'src', 'app');
const COMP_DIR = path.join(ROOT, 'src', 'components');
const WIKI_DIR = path.join(ROOT, '.agents', 'wiki');
const GRAPH_FILE = path.join(ROOT, 'memory', 'shared-graph.json');
const STAGING_DIR = path.join(ROOT, '.agents', 'staging');
const TRACES_DIR = path.join(ROOT, '.agents', 'traces');

// Next.js reserved filenames that ARE valid inside src/app/
const NEXTJS_RESERVED = new Set([
  'page.tsx',
  'page.ts',
  'page.js',
  'page.jsx',
  'layout.tsx',
  'layout.ts',
  'layout.js',
  'layout.jsx',
  'route.ts',
  'route.js',
  'not-found.tsx',
  'error.tsx',
  'loading.tsx',
  'template.tsx',
  'global-error.tsx',
  'default.tsx',
]);

// Approved exceptions (from playbook)
const APPROVED_EXCEPTIONS = new Set(['HomeClient.tsx']);

let debtItems = [];
let sweepLog = [];

// ─── Logger ───────────────────────────────────────────────────────────────────
function log(phase, message, level = 'INFO') {
  const ts = new Date().toISOString();
  const line = `[${ts}] [custodian] [${level}] [Phase ${phase}] ${message}`;
  console.log(line);
  sweepLog.push(line);
  fs.mkdirSync(TRACES_DIR, { recursive: true });
  fs.appendFileSync(
    path.join(
      TRACES_DIR,
      `custodian-${new Date().toISOString().slice(0, 10)}.log`
    ),
    line + '\n',
    'utf8'
  );
}

function debt(id, law, priority, file, description) {
  debtItems.push({ id, law, priority, file, description });
  log('DEBT', `[${priority.toUpperCase()}] ${id}: ${description}`, 'WARN');
}

// ─── Utility: Walk directory tree ─────────────────────────────────────────────
function walkDir(dir, exts = null, exclude = []) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (exclude.some((ex) => fullPath.includes(ex))) continue;
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath, exts, exclude));
    } else if (!exts || exts.includes(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

// ─── Phase 1: AST Sweep — Dead Code Detection ─────────────────────────────────
function phase1_AstSweep() {
  log(1, 'Starting AST sweep — scanning import graph for orphaned files...');

  // Collect all .ts/.tsx source files
  const allSourceFiles = walkDir(
    SRC_DIR,
    ['.ts', '.tsx'],
    ['node_modules', '.next']
  );
  const scriptFiles = walkDir(
    path.join(ROOT, 'scripts'),
    ['.js'],
    ['node_modules']
  );
  const allFiles = [...allSourceFiles, ...scriptFiles];

  log(1, `Found ${allFiles.length} source files`);

  // Build a simple "who imports whom" map by grepping import statements
  const importedFiles = new Set();

  for (const file of allFiles) {
    let content = '';
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }

    // Match: import ... from '...', require('...'), dynamic import('...')
    const importPattern =
      /(?:import|from|require)\s*\(?['"](\.{1,2}\/[^'"]+)['"]\)?/g;
    let match;
    while ((match = importPattern.exec(content)) !== null) {
      const rawImport = match[1];
      const resolvedBase = path.resolve(path.dirname(file), rawImport);

      // Try resolving with common extensions
      for (const ext of [
        '',
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '/index.ts',
        '/index.tsx',
      ]) {
        const resolved = resolvedBase + ext;
        if (fs.existsSync(resolved)) {
          importedFiles.add(resolved);
          break;
        }
      }
    }
  }

  // Find files that are never imported
  const orphans = allFiles.filter((f) => {
    // Skip Next.js entry points — they're never imported, they're route handlers
    const filename = path.basename(f);
    if (NEXTJS_RESERVED.has(filename)) return false;
    if (APPROVED_EXCEPTIONS.has(filename)) return false;
    // Skip script entry points — they're called directly
    if (f.includes('/scripts/') && !f.includes('/lib/')) return false;
    return !importedFiles.has(f);
  });

  log(1, `AST sweep complete: ${orphans.length} orphaned file(s) found`);

  for (const orphan of orphans) {
    const rel = path.relative(ROOT, orphan);
    const stat = fs.statSync(orphan);
    const sizeKb = (stat.size / 1024).toFixed(1);
    debt(
      `DEAD-${path.basename(orphan).replace(/\W/g, '_').toUpperCase()}`,
      'Law 1: Zero Dead Code',
      stat.size > 5000 ? 'high' : 'medium',
      rel,
      `Orphaned file (0 importers, ${sizeKb}KB): ${rel}`
    );
  }

  return { orphans: orphans.map((f) => path.relative(ROOT, f)) };
}

// ─── Phase 2: Data Lineage Trace ──────────────────────────────────────────────
function phase2_DataTrace() {
  log(
    2,
    'Tracing lead payload lineage: LeadPayload → /api/leads → HubSpot/Supabase/Resend...'
  );

  const leadsRoute = path.join(APP_DIR, 'api', 'leads', 'route.ts');
  const lineageBreaks = [];

  if (!fs.existsSync(leadsRoute)) {
    debt(
      'LINEAGE-LEADS-ROUTE',
      'Law 2: Data Lineage',
      'high',
      'src/app/api/leads/route.ts',
      'Lead API route not found — critical lineage break'
    );
    return { breaks: lineageBreaks };
  }

  const routeContent = fs.readFileSync(leadsRoute, 'utf8');

  // Check LeadPayload interface exists
  if (!routeContent.includes('interface LeadPayload')) {
    debt(
      'LINEAGE-NO-INTERFACE',
      'Law 2: Data Lineage',
      'high',
      'src/app/api/leads/route.ts',
      'LeadPayload interface not found'
    );
    lineageBreaks.push('Missing LeadPayload interface');
  } else {
    log(2, '✅ LeadPayload interface: found');
  }

  // Check HubSpot integration
  if (!routeContent.includes('sendToHubspot')) {
    debt(
      'LINEAGE-NO-HUBSPOT',
      'Law 2: Data Lineage',
      'high',
      'src/app/api/leads/route.ts',
      'sendToHubspot not found — CRM lineage broken'
    );
    lineageBreaks.push('Missing HubSpot integration');
  } else {
    log(2, '✅ HubSpot (sendToHubspot): found');
  }

  // Check Supabase persistence
  if (!routeContent.includes('saveLeadToDb')) {
    debt(
      'LINEAGE-NO-SUPABASE',
      'Law 2: Data Lineage',
      'high',
      'src/app/api/leads/route.ts',
      'saveLeadToDb not found — DB lineage broken'
    );
    lineageBreaks.push('Missing Supabase persistence');
  } else {
    log(2, '✅ Supabase (saveLeadToDb): found');
  }

  // Check Resend notification
  if (!routeContent.includes('sendWithResend')) {
    debt(
      'LINEAGE-NO-RESEND',
      'Law 2: Data Lineage',
      'medium',
      'src/app/api/leads/route.ts',
      'sendWithResend not found — email notification lineage broken'
    );
    lineageBreaks.push('Missing Resend notification');
  } else {
    log(2, '✅ Resend (sendWithResend): found');
  }

  // Check that LeadForm.tsx actually calls /api/leads
  const leadForm = path.join(COMP_DIR, 'LeadForm.tsx');
  if (fs.existsSync(leadForm)) {
    const formContent = fs.readFileSync(leadForm, 'utf8');
    if (!formContent.includes('/api/leads')) {
      debt(
        'LINEAGE-FORM-DISCONNECT',
        'Law 2: Data Lineage',
        'high',
        'src/components/LeadForm.tsx',
        'LeadForm.tsx does not reference /api/leads — UI→API lineage broken'
      );
      lineageBreaks.push('LeadForm disconnected from /api/leads');
    } else {
      log(2, '✅ LeadForm → /api/leads: connected');
    }
  }

  log(2, `Data trace complete: ${lineageBreaks.length} lineage break(s)`);
  return { breaks: lineageBreaks };
}

// ─── Phase 3: Directory Cleanse ────────────────────────────────────────────────
function phase3_DirCleanse() {
  log(3, 'Scanning src/app/ for non-routable .tsx boundary violations...');

  const violations = [];
  const appFiles = walkDir(APP_DIR, ['.tsx', '.ts'], ['node_modules']);

  for (const file of appFiles) {
    const filename = path.basename(file);
    if (NEXTJS_RESERVED.has(filename)) continue;
    if (APPROVED_EXCEPTIONS.has(filename)) {
      log(3, `✅ Approved exception: ${filename}`);
      continue;
    }
    // Non-reserved, non-approved .tsx inside src/app/
    const rel = path.relative(ROOT, file);
    const stat = fs.statSync(file);
    violations.push(rel);
    debt(
      `BOUNDARY-${filename.replace(/\W/g, '_').toUpperCase()}`,
      'Law 3: Next.js 16.x Directory Boundaries',
      'high',
      rel,
      `Non-routable component inside src/app/ (${(stat.size / 1024).toFixed(1)}KB): move to src/components/`
    );
  }

  log(
    3,
    `Directory cleanse complete: ${violations.length} boundary violation(s)`
  );
  return { violations };
}

// ─── Phase 4: OKF Audit ───────────────────────────────────────────────────────
function phase4_OkfAudit() {
  log(4, 'Auditing .agents/wiki/ for OKF frontmatter compliance...');

  const wikiFiles = walkDir(WIKI_DIR, ['.md'], []);
  let nonCompliant = 0;
  let antiLaziness = 0;
  const violations = [];

  const REQUIRED_FM = ['type', 'title', 'tags', 'last_sync'];

  for (const file of wikiFiles.slice(0, 50)) {
    // sample first 50 to avoid timeout
    let content = '';
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }

    // Check frontmatter
    if (!content.startsWith('---')) {
      nonCompliant++;
      violations.push(path.relative(ROOT, file));
      continue;
    }

    const fmEnd = content.indexOf('---', 3);
    if (fmEnd === -1) {
      nonCompliant++;
      continue;
    }

    const fm = content.slice(3, fmEnd);
    const missingFields = REQUIRED_FM.filter((f) => !fm.includes(f + ':'));
    if (missingFields.length > 0) nonCompliant++;

    // Anti-Laziness check
    if (content.includes('[System Note: Awaiting semantic compilation]')) {
      antiLaziness++;
    }
  }

  log(
    4,
    `OKF audit (sample of 50): ${nonCompliant} non-compliant, ${antiLaziness} anti-laziness violations`
  );

  if (nonCompliant > 0) {
    debt(
      'OKF-NONCOMPLIANT',
      'Law 4: OKF Compliance',
      'medium',
      '.agents/wiki/',
      `${nonCompliant} of 50 sampled wiki files missing required frontmatter fields`
    );
  }
  if (antiLaziness > 0) {
    debt(
      'OKF-ANTI-LAZINESS',
      'Law 4: OKF Compliance',
      'high',
      '.agents/wiki/',
      `${antiLaziness} of 50 sampled wiki files contain [System Note: Awaiting semantic compilation] — re-compile required`
    );
  }

  return { nonCompliant, antiLaziness, totalSampled: 50 };
}

// ─── Phase 5: Memory Drift Detection ──────────────────────────────────────────
function phase5_MemoryDrift() {
  log(5, 'Checking shared-graph.json source_file references for drift...');

  if (!fs.existsSync(GRAPH_FILE)) {
    debt(
      'MEMORY-GRAPH-MISSING',
      'Law 5: Memory Drift',
      'high',
      'memory/shared-graph.json',
      'shared-graph.json not found'
    );
    return { driftItems: 1 };
  }

  const graph = JSON.parse(fs.readFileSync(GRAPH_FILE, 'utf8'));
  let driftCount = 0;

  for (const node of graph.nodes) {
    const srcFile = node.properties?.source_file;
    if (!srcFile) continue;
    const resolved = path.join(ROOT, srcFile);
    if (!fs.existsSync(resolved)) {
      driftCount++;
      debt(
        `DRIFT-${node.id.replace(/\./g, '_').toUpperCase()}`,
        'Law 5: Memory Drift',
        'medium',
        `memory/shared-graph.json (node: ${node.id})`,
        `Node "${node.id}" references source_file "${srcFile}" which does not exist on disk`
      );
    } else {
      log(5, `✅ ${node.id} → ${srcFile}`);
    }
  }

  log(5, `Memory drift check complete: ${driftCount} drift item(s)`);
  return { driftItems: driftCount };
}

// ─── Phase 6: Remediation Queue ───────────────────────────────────────────────
async function phase6_RemediationQueue() {
  log(
    6,
    `Writing DEBT_REPORT.md to .agents/staging/ and enqueuing ${debtItems.length} repair task(s)...`
  );

  fs.mkdirSync(STAGING_DIR, { recursive: true });

  const ts = new Date().toISOString();
  const reportPath = path.join(
    STAGING_DIR,
    `DEBT_REPORT-${ts.slice(0, 10)}.md`
  );

  const highItems = debtItems.filter((d) => d.priority === 'high');
  const mediumItems = debtItems.filter((d) => d.priority === 'medium');

  const reportContent = [
    `---`,
    `type: debt-report`,
    `title: "Architecture Debt Report — ${ts.slice(0, 10)}"`,
    `tags: [debt, custodian, architecture, hygiene]`,
    `generated_at: ${ts}`,
    `total_items: ${debtItems.length}`,
    `high_priority: ${highItems.length}`,
    `medium_priority: ${mediumItems.length}`,
    `---`,
    ``,
    `# Architecture Debt Report`,
    `**Generated:** ${ts}`,
    `**Total Debt Items:** ${debtItems.length} (${highItems.length} HIGH, ${mediumItems.length} MEDIUM)`,
    ``,
    `---`,
    ``,
    `## HIGH Priority Items`,
    ``,
    ...(highItems.length > 0
      ? highItems.map((d) =>
          [
            `### ${d.id}`,
            `- **Law:** ${d.law}`,
            `- **File:** \`${d.file}\``,
            `- **Issue:** ${d.description}`,
            ``,
          ].join('\n')
        )
      : ['*None*', '']),
    `---`,
    ``,
    `## MEDIUM Priority Items`,
    ``,
    ...(mediumItems.length > 0
      ? mediumItems.map((d) =>
          [
            `### ${d.id}`,
            `- **Law:** ${d.law}`,
            `- **File:** \`${d.file}\``,
            `- **Issue:** ${d.description}`,
            ``,
          ].join('\n')
        )
      : ['*None*', '']),
    `---`,
    ``,
    `## How to Resolve`,
    `Each item above has a corresponding task in the SQLite queue (\`.agents/coordination.db\`).`,
    `Run \`node scripts/queue.js list\` to see all queued repairs.`,
    `After fixing, re-run \`node scripts/harness-custodian.js\` to verify resolution.`,
    ``,
    `*Generated by harness-custodian.js — Architecture Custodian State Machine*`,
  ].join('\n');

  fs.writeFileSync(reportPath, reportContent, 'utf8');
  log(6, `DEBT_REPORT written: ${reportPath}`);

  // Enqueue each debt item as a REPAIR task
  let enqueued = 0;
  for (const item of debtItems) {
    try {
      enqueueTask(
        item.id,
        `REPAIR-ARCH: [${item.priority.toUpperCase()}] ${item.id} — ${item.description} (Law: ${item.law}, File: ${item.file})`,
        item.priority
      );
      enqueued++;
    } catch (err) {
      log(6, `Failed to enqueue ${item.id}: ${err.message}`, 'ERROR');
    }
  }

  log(
    6,
    `${enqueued}/${debtItems.length} repair task(s) enqueued in SQLite queue`
  );
  return { reportPath, enqueued };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function runFullSweep(phaseFilter = null) {
  const sweepStart = new Date().toISOString();
  log('ALL', `═══ Architecture Custodian sweep starting: ${sweepStart} ═══`);

  const results = {};

  if (!phaseFilter || phaseFilter === '1') results.phase1 = phase1_AstSweep();
  if (!phaseFilter || phaseFilter === '2') results.phase2 = phase2_DataTrace();
  if (!phaseFilter || phaseFilter === '3') results.phase3 = phase3_DirCleanse();
  if (!phaseFilter || phaseFilter === '4') results.phase4 = phase4_OkfAudit();
  if (!phaseFilter || phaseFilter === '5')
    results.phase5 = phase5_MemoryDrift();
  if (!phaseFilter || phaseFilter === '6')
    results.phase6 = await phase6_RemediationQueue();

  log('ALL', `═══ Sweep complete. ${debtItems.length} total debt items. ═══`);

  return { sweepStart, results, debtItems };
}

// ─── CLI ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const phaseFlag = args.indexOf('--phase');
const phaseFilter = phaseFlag !== -1 ? args[phaseFlag + 1] : null;

runFullSweep(phaseFilter)
  .then(({ debtItems: items, results }) => {
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`ARCHITECTURE CUSTODIAN — SWEEP RESULTS`);
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Total debt items: ${items.length}`);
    console.log(`HIGH:   ${items.filter((d) => d.priority === 'high').length}`);
    console.log(
      `MEDIUM: ${items.filter((d) => d.priority === 'medium').length}`
    );
    console.log('');
    console.log('Top 3 highest-impact debt items:');
    const top3 = [...items]
      .sort((a, b) => (a.priority === 'high' ? -1 : 1))
      .slice(0, 3);
    top3.forEach((d, i) => {
      console.log(`  ${i + 1}. [${d.priority.toUpperCase()}] ${d.id}`);
      console.log(`     ${d.description}`);
    });
    if (results.phase6?.reportPath) {
      console.log('');
      console.log(`DEBT_REPORT: ${results.phase6.reportPath}`);
    }
    console.log('═══════════════════════════════════════════════════════');
  })
  .catch((err) => {
    console.error('Custodian sweep failed:', err.message);
    process.exit(1);
  });
