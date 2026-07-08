import fs from 'node:fs';
import { join } from 'node:path';

const DB_PATH = join(process.cwd(), '.agents', 'hub_db.json');

function loadDb() {
  if (!fs.existsSync(DB_PATH)) return { tasks: [] };
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

export function claimNextTask() {
  const db = loadDb();
  const pending = (db.tasks || []).find(t => t.status === 'pending');
  if (!pending) return null;
  pending.status = 'running';
  pending.claimed_at = new Date().toISOString();
  saveDb(db);
  return pending;
}

export function resolveTask(taskId, status) {
  const db = loadDb();
  const task = (db.tasks || []).find(t => t.id === taskId);
  if (!task) return;
  task.status = status;
  task.resolved_at = new Date().toISOString();
  
  if (status === 'verified') {
    db.metrics = db.metrics || {};
    db.metrics.tasks_verified = (db.metrics.tasks_verified || 0) + 1;
    db.metrics.tasks_completed = (db.metrics.tasks_completed || 0) + 1;
  }
  
  saveDb(db);
}

export function enqueueTask(refId, title, priority) {
  const db = loadDb();
  db.tasks = db.tasks || [];
  
  const exists = db.tasks.some(t => t.title === title && (t.status === 'pending' || t.status === 'running'));
  if (exists) return;

  const newTask = {
    id: `TASK-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    goal_id: 'GOAL-1',
    title,
    priority,
    status: 'pending',
    created_at: new Date().toISOString(),
    ref_id: refId,
    dependencies: [],
    attempts: 0
  };
  db.tasks.push(newTask);
  saveDb(db);
}

