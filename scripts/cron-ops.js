/**
 * cron-ops.js — Proactive Operations Monitor
 *
 * Runs as a background loop. On each cycle it:
 *   1. Parses .agents/operations/pipeline.md for active leads
 *   2. Checks for stale leads (>48h in estimate_drafting, >72h in approval_waitpoint)
 *   3. Checks for failed HubSpot syncs
 *   4. Reads KPIs.md and flags any off-target KPIs
 *   5. Scans .agents/approvals/ for items older than 24h
 *   6. Writes a trace log to .agents/traces/
 *
 * Usage:
 *   node scripts/cron-ops.js            # Run once
 *   node scripts/cron-ops.js --watch    # Run continuously every 30 minutes
 *   node scripts/cron-ops.js --interval 60  # Run every N minutes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { enqueueTask } from './queue.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── Paths ──────────────────────────────────────────────────────────────────
const PIPELINE_MD    = path.join(ROOT, '.agents', 'operations', 'pipeline.md');
const KPIS_MD        = path.join(ROOT, '.agents', 'operations', 'KPIs.md');
const APPROVALS_DIR  = path.join(ROOT, '.agents', 'approvals');
const TRACES_DIR     = path.join(ROOT, '.agents', 'traces');

// ─── Thresholds ──────────────────────────────────────────────────────────────
const STALE_ESTIMATE_HOURS    = 48;  // estimate_drafting
const STALE_APPROVAL_HOURS    = 72;  // approval_waitpoint
const APPROVAL_OVERDUE_HOURS  = 24;  // approval file overdue

// ─── Logger ──────────────────────────────────────────────────────────────────
function log(message, level = 'INFO') {
  const ts = new Date().toISOString();
  const line = `[${ts}] [cron-ops] [${level}] ${message}`;
  console.log(line);
  fs.mkdirSync(TRACES_DIR, { recursive: true });
  const traceFile = path.join(TRACES_DIR, `cron-${new Date().toISOString().slice(0, 10)}.log`);
  fs.appendFileSync(traceFile, line + '\n', 'utf8');
}

// ─── Parse pipeline.md for active leads ─────────────────────────────────────
function parsePipelineLeads() {
  if (!fs.existsSync(PIPELINE_MD)) {
    log('pipeline.md not found — skipping pipeline scan', 'WARN');
    return [];
  }

  const content = fs.readFileSync(PIPELINE_MD, 'utf8');
  const leads = [];

  // Parse table rows (skip header row and separator row)
  const lines = content.split('\n');
  let inTable = false;
  let headerPassed = false;

  for (const line of lines) {
    if (line.includes('| Lead ID |')) { inTable = true; continue; }
    if (inTable && line.startsWith('|---')) { headerPassed = true; continue; }
    if (!inTable || !headerPassed) continue;
    if (!line.startsWith('|') || line.includes('*(No active leads)*')) continue;
    if (line.startsWith('|---') || line.trim() === '') { inTable = false; continue; }

    // Parse columns: | Lead ID | Name | Market | Stage | Submitted At | Updated At | HubSpot Synced | Notes |
    const cols = line.split('|').map(c => c.trim()).filter((_, i) => i > 0); // drop empty first
    if (cols.length < 7) continue;

    const [leadId, name, market, stageRaw, submittedAt, updatedAt, hubspotSynced] = cols;

    // Skip closed leads
    const stage = stageRaw.replace(/`/g, '');
    if (stage === 'closed_won' || stage === 'closed_lost') continue;
    if (leadId === '—' || !leadId) continue;

    leads.push({
      leadId: leadId.trim(),
      name: name.trim(),
      market: market.trim(),
      stage: stage.trim(),
      submittedAt: submittedAt.trim(),
      updatedAt: updatedAt.trim(),
      hubspotSynced: hubspotSynced.includes('✅'),
    });
  }

  return leads;
}

// ─── Hours since a timestamp ─────────────────────────────────────────────────
function hoursSince(isoString) {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return null;
    return (Date.now() - d.getTime()) / (1000 * 60 * 60);
  } catch {
    return null;
  }
}

// ─── Stale lead scan ─────────────────────────────────────────────────────────
function scanForStaleLeads(leads) {
  let tasksEnqueued = 0;

  for (const lead of leads) {
    const age = hoursSince(lead.updatedAt);
    if (age === null) {
      log(`Cannot parse updatedAt for ${lead.leadId}: "${lead.updatedAt}"`, 'WARN');
      continue;
    }

    if (lead.stage === 'estimate_drafting' && age > STALE_ESTIMATE_HOURS) {
      log(`STALE: ${lead.leadId} (${lead.name}) has been in estimate_drafting for ${age.toFixed(1)}h — threshold: ${STALE_ESTIMATE_HOURS}h`, 'WARN');
      enqueueTask(
        lead.leadId,
        `FOLLOW-UP: Stale Lead Review — ${lead.leadId} (${lead.name}, ${lead.market}) stuck in estimate_drafting for ${Math.round(age)}h`,
        'high'
      );
      tasksEnqueued++;
    }

    if (lead.stage === 'approval_waitpoint' && age > STALE_APPROVAL_HOURS) {
      log(`STALE: ${lead.leadId} (${lead.name}) has been in approval_waitpoint for ${age.toFixed(1)}h — threshold: ${STALE_APPROVAL_HOURS}h`, 'WARN');
      enqueueTask(
        lead.leadId,
        `ESCALATE: Human Approval Overdue — ${lead.leadId} (${lead.name}, ${lead.market}) waiting ${Math.round(age)}h for approval`,
        'high'
      );
      tasksEnqueued++;
    }

    if (!lead.hubspotSynced && lead.stage !== 'intake') {
      log(`SYNC FAILURE: ${lead.leadId} (${lead.name}) has no HubSpot sync`, 'WARN');
      enqueueTask(
        lead.leadId,
        `REPAIR: HubSpot Sync Failure — ${lead.leadId} (${lead.name}) requires manual CRM sync`,
        'high'
      );
      tasksEnqueued++;
    }
  }

  return tasksEnqueued;
}

// ─── KPI divergence scan ─────────────────────────────────────────────────────
function scanKPIs() {
  if (!fs.existsSync(KPIS_MD)) {
    log('KPIs.md not found — skipping KPI scan', 'WARN');
    return;
  }

  const content = fs.readFileSync(KPIS_MD, 'utf8');
  const offTrack = [];

  // Simple line-based scan for KPI rows with 🔴 Off Track status
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.includes('🔴')) {
      // Extract KPI name (first column)
      const cols = line.split('|').map(c => c.trim());
      if (cols.length > 1 && cols[1] && cols[1] !== '---') {
        offTrack.push(cols[1]);
      }
    }
  }

  if (offTrack.length > 0) {
    log(`KPI divergence detected: ${offTrack.join(', ')}`, 'WARN');
    enqueueTask(
      'KPI_MONITOR',
      `KPI ALERT: The following KPIs are Off Track: ${offTrack.join(', ')}. Review KPIs.md and update targets or take corrective action.`,
      'medium'
    );
  } else {
    log('KPI scan: no off-track KPIs detected');
  }
}

// ─── Approval file overdue scan ───────────────────────────────────────────────
function scanApprovalQueue() {
  if (!fs.existsSync(APPROVALS_DIR)) {
    log('Approvals directory not found — skipping approval scan', 'WARN');
    return 0;
  }

  const files = fs.readdirSync(APPROVALS_DIR).filter(f => f.endsWith('.md'));
  let overdue = 0;

  for (const file of files) {
    const filePath = path.join(APPROVALS_DIR, file);
    const stat = fs.statSync(filePath);
    const age = (Date.now() - stat.mtimeMs) / (1000 * 60 * 60);

    // Read file to check if still pending
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('status: pending')) continue; // already actioned

    if (age > APPROVAL_OVERDUE_HOURS) {
      log(`OVERDUE APPROVAL: ${file} has been pending for ${age.toFixed(1)}h`, 'WARN');
      const leadId = file.replace('ESTIMATE-', '').replace('.md', '');
      enqueueTask(
        leadId,
        `ESCALATE: Approval Overdue — ${file} has been pending for ${Math.round(age)}h without human sign-off`,
        'high'
      );
      overdue++;
    }
  }

  log(`Approval scan: ${files.length} files, ${overdue} overdue`);
  return overdue;
}

// ─── Main scan cycle ─────────────────────────────────────────────────────────
async function runScanCycle() {
  const cycleStart = new Date().toISOString();
  log(`─── Cron scan cycle starting: ${cycleStart} ───`);

  // 1. Parse pipeline leads
  const leads = parsePipelineLeads();
  log(`Pipeline: ${leads.length} active lead(s) found`);

  // 2. Stale lead scan
  const staleTasks = scanForStaleLeads(leads);
  log(`Stale lead scan: ${staleTasks} task(s) enqueued`);

  // 3. KPI divergence scan
  scanKPIs();

  // 4. Approval overdue scan
  const overdueApprovals = scanApprovalQueue();

  // 5. Summary
  const summary = {
    cycleAt: cycleStart,
    activeLeads: leads.length,
    staleTasksEnqueued: staleTasks,
    overdueApprovals,
  };

  log(`─── Cycle complete: ${JSON.stringify(summary)} ───`);
  return summary;
}

// ─── CLI entry ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const watchMode  = args.includes('--watch');
const intervalFlagIdx = args.indexOf('--interval');
const intervalMins = intervalFlagIdx !== -1 ? parseInt(args[intervalFlagIdx + 1], 10) || 30 : 30;

if (watchMode) {
  log(`Starting in watch mode — cycle every ${intervalMins} minutes`);
  runScanCycle().catch(err => log(`Cycle error: ${err.message}`, 'ERROR'));

  setInterval(() => {
    runScanCycle().catch(err => log(`Cycle error: ${err.message}`, 'ERROR'));
  }, intervalMins * 60 * 1000);
} else {
  // Single run
  runScanCycle()
    .then(summary => {
      console.log('\n✅ Cron scan complete:', JSON.stringify(summary, null, 2));
    })
    .catch(err => {
      console.error('\n❌ Cron scan failed:', err.message);
      process.exit(1);
    });
}
