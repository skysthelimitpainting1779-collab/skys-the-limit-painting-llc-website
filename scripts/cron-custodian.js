/**
 * cron-custodian.js — Architecture Custodian Idle Trigger
 *
 * Monitors repository idleness. If no git commits have been made in 24 hours,
 * automatically triggers harness-custodian.js for a full sweep.
 *
 * Usage:
 *   node scripts/cron-custodian.js           # Check once, run if idle
 *   node scripts/cron-custodian.js --watch   # Poll every 6 hours
 *   node scripts/cron-custodian.js --force   # Force run regardless of idleness
 */

import fs from 'fs';
import path from 'path';
import { execSync, fork } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TRACES_DIR = path.join(ROOT, '.agents', 'traces');
const IDLE_THRESHOLD_HOURS = 24;

function log(message, level = 'INFO') {
  const ts = new Date().toISOString();
  const line = `[${ts}] [cron-custodian] [${level}] ${message}`;
  console.log(line);
  fs.mkdirSync(TRACES_DIR, { recursive: true });
  fs.appendFileSync(
    path.join(TRACES_DIR, `cron-custodian-${new Date().toISOString().slice(0, 10)}.log`),
    line + '\n', 'utf8'
  );
}

function getLastCommitAge() {
  try {
    const output = execSync('git log -1 --format="%ct"', { cwd: ROOT }).toString().trim();
    const commitTimestamp = parseInt(output, 10) * 1000;
    return (Date.now() - commitTimestamp) / (1000 * 60 * 60);
  } catch (err) {
    log(`Could not determine last commit time: ${err.message}`, 'WARN');
    return null;
  }
}

function spawnCustodian() {
  log(`Spawning harness-custodian.js for full repository audit...`);
  const custodianPath = path.join(__dirname, 'harness-custodian.js');

  return new Promise((resolve, reject) => {
    const child = fork(custodianPath, [], {
      cwd: ROOT,
      stdio: 'inherit',
    });
    child.on('exit', code => {
      if (code === 0) {
        log('harness-custodian.js completed successfully');
        resolve();
      } else {
        log(`harness-custodian.js exited with code ${code}`, 'ERROR');
        reject(new Error(`Custodian exited with code ${code}`));
      }
    });
    child.on('error', err => {
      log(`Failed to spawn custodian: ${err.message}`, 'ERROR');
      reject(err);
    });
  });
}

async function checkAndRun(force = false) {
  log('─── Custodian idle check starting ───');

  if (force) {
    log('--force flag set. Running custodian sweep regardless of idleness.');
    await spawnCustodian();
    return;
  }

  const ageHours = getLastCommitAge();
  if (ageHours === null) {
    log('Could not determine repository age — skipping sweep.', 'WARN');
    return;
  }

  log(`Last git commit: ${ageHours.toFixed(1)}h ago (threshold: ${IDLE_THRESHOLD_HOURS}h)`);

  if (ageHours >= IDLE_THRESHOLD_HOURS) {
    log(`Repository has been idle for ${ageHours.toFixed(1)}h — triggering architecture sweep.`);
    await spawnCustodian();
  } else {
    const remainingHours = IDLE_THRESHOLD_HOURS - ageHours;
    log(`Repository is active. Next sweep eligible in ${remainingHours.toFixed(1)}h.`);
  }
}

// ─── CLI ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const watchMode = args.includes('--watch');
const forceMode = args.includes('--force');
const pollHours = 6;

if (watchMode) {
  log(`Starting in watch mode — polling every ${pollHours} hours`);
  checkAndRun(forceMode).catch(err => log(`Error: ${err.message}`, 'ERROR'));
  setInterval(() => {
    checkAndRun(false).catch(err => log(`Error: ${err.message}`, 'ERROR'));
  }, pollHours * 60 * 60 * 1000);
} else {
  checkAndRun(forceMode)
    .then(() => log('─── Custodian idle check complete ───'))
    .catch(err => {
      log(`Fatal error: ${err.message}`, 'ERROR');
      process.exit(1);
    });
}
