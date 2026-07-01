import fs from 'fs';
import path from 'path';
import { enqueueTask } from './queue.js';

const dirs = ['.agents/wiki', 'wiki'];

console.log('[QUEUE] Starting mass background queue compilation...');

let enqueuedCount = 0;

dirs.forEach(dir => {
  const dirPath = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) return;
  
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
  
  files.forEach(file => {
    const targetFile = `${dir}/${file}`;
    const description = `Read raw Graphify/AST data in ${targetFile} and synthesize it into true OKF format, replacing all placeholder text.`;
    
    // Priority must be 'low' for background compilation
    enqueueTask('COMPILE-OKF', description, 'low');
    enqueuedCount++;
  });
});

console.log(`[QUEUE] Successfully enqueued ${enqueuedCount} background compilation tasks.`);
