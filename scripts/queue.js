import fs from 'node:fs';
import { join } from 'node:path';

const DB_PATH = join(process.cwd(), '.agents', 'state.json');

function loadDb() {
  if (!fs.existsSync(DB_PATH)) return { tasks: [] };
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

export function claimNextTask() {
  const db = loadDb();
  const pending = (db.tasks || []).find((t) => t.status === 'pending');
  if (!pending) return null;
  pending.status = 'running';
  pending.claimed_at = new Date().toISOString();
  saveDb(db);
  return pending;
}

export function resolveTask(taskId, status) {
  const db = loadDb();
  const task = (db.tasks || []).find((t) => t.id === taskId);
  if (!task) return;
  task.status = status;
  task.resolved_at = new Date().toISOString();
  saveDb(db);
}

export function enqueueTask(id, title, priority = 'normal') {
  const db = loadDb();
  db.tasks = db.tasks || [];
  db.tasks.push({
    id: `TASK-${Date.now()}`,
    title,
    priority,
    status: 'pending',
    created_at: new Date().toISOString(),
    assignee: 'agent',
  });
  saveDb(db);
}
