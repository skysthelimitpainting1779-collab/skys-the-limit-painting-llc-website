import { enqueueTask, claimNextTask, resolveTask, getAllTasks } from './queue.js';
import db from './db.js';

console.log('[TEST] Enqueueing 3 test tasks...');

enqueueTask('TEST-GOAL', 'Database connection verification', 'high');
enqueueTask('TEST-GOAL', 'Read latency test', 'low');
enqueueTask('TEST-GOAL', 'Atomic transaction test', 'medium');

console.log('[TEST] Testing atomic claim...');
const task1 = claimNextTask();
console.log(`Claimed Task: ${task1.description} (Status: ${task1.status})`);

const task2 = claimNextTask();
console.log(`Claimed Task: ${task2.description} (Status: ${task2.status})`);

const task3 = claimNextTask();
console.log(`Claimed Task: ${task3.description} (Status: ${task3.status})`);

console.log('[TEST] Resolving tasks...');
resolveTask(task1.id, 'completed');
resolveTask(task2.id, 'failed');
resolveTask(task3.id, 'completed');

console.log('[TEST] Current WAL Queue State:');
const tasks = getAllTasks();
console.table(tasks.map(t => ({ id: t.id, desc: t.description, status: t.status, priority: t.priority })));

console.log('[TEST] Execution complete.');
