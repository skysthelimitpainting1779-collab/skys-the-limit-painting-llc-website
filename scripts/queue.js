/**
 * Lightweight task claim/resolve helpers over Agent OS hub store.
 * Uses the same cache/local mirror as agent-os (Turso when configured).
 * Authoritative execution lives in agent-os.js executeNextTask.
 */

import fs from 'node:fs';
import { join } from 'node:path';
import {
  pickNextTask,
  normalizeTask,
  writeJsonAtomic,
  MAX_TASK_ATTEMPTS,
} from './agent-os-core.mjs';
import { getHub, setHubCache, saveHub, getLocalJsonPath } from './agent-os-store.mjs';

const DB_PATH = join(process.cwd(), '.agents', 'hub_db.json');

function loadDbSync() {
  // Prefer live Agent OS cache (after bootStore)
  let db = getHub();
  if (db) return db;

  const path = getLocalJsonPath() || DB_PATH;
  if (!fs.existsSync(path)) return { tasks: [], metrics: {} };
  try {
    db = JSON.parse(fs.readFileSync(path, 'utf8'));
    setHubCache(db);
    return db;
  } catch {
    return { tasks: [], metrics: {} };
  }
}

function saveDbSync(db) {
  setHubCache(db);
  try {
    writeJsonAtomic(getLocalJsonPath() || DB_PATH, db);
  } catch {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    } catch {
      /* ignore */
    }
  }
  // Fire-and-forget Turso when store already booted
  saveHub(db).catch((err) => {
    console.warn(`[queue] store persist non-fatal: ${err.message}`);
  });
}

export function claimNextTask() {
  const db = loadDbSync();
  db.tasks = Array.isArray(db.tasks) ? db.tasks.map(normalizeTask).filter(Boolean) : [];
  const pending = pickNextTask(db.tasks);
  if (!pending) return null;

  pending.status = 'running';
  pending.claimed_at = new Date().toISOString();
  saveDbSync(db);
  return pending;
}

export function resolveTask(taskId, status) {
  if (!taskId) return;
  const db = loadDbSync();
  db.tasks = Array.isArray(db.tasks) ? db.tasks : [];
  const task = db.tasks.find((t) => t.id === taskId);
  if (!task) return;

  const allowed = new Set(['verified', 'failed', 'blocked', 'pending', 'running']);
  task.status = allowed.has(status) ? status : 'failed';
  task.resolved_at = new Date().toISOString();

  if (task.status === 'failed' && (task.attempts || 0) >= MAX_TASK_ATTEMPTS) {
    task.status = 'blocked';
  }

  if (task.status === 'verified') {
    db.metrics = db.metrics || {};
    db.metrics.tasks_verified = (Number(db.metrics.tasks_verified) || 0) + 1;
    db.metrics.tasks_completed = (Number(db.metrics.tasks_completed) || 0) + 1;
  }

  saveDbSync(db);
}

export function enqueueTask(refId, title, priority) {
  const db = loadDbSync();
  db.tasks = db.tasks || [];

  const exists = db.tasks.some(
    (t) => t.title === title && (t.status === 'pending' || t.status === 'running')
  );
  if (exists) return null;

  const newTask = {
    id: `TASK-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    goal_id: 'GOAL-1',
    title,
    priority: priority || 'medium',
    status: 'pending',
    created_at: new Date().toISOString(),
    ref_id: refId,
    dependencies: [],
    attempts: 0,
    risk_level: 'low',
  };
  db.tasks.push(newTask);
  saveDbSync(db);
  return newTask;
}
