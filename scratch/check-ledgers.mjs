const paths = [
  '.agents/operating-summary.md',
  '.agents/implementation-contract.md',
  '.agents/runtime-capability-matrix.md',
  '.agents/evals.md',
  '.agents/effects.md',
  '.agents/waits.md',
  '.agents/queues/now.md',
  '.agents/queues/next.md',
  '.agents/queues/blocked.md',
  '.agents/queues/improve.md',
  '.agents/queues/recurring.md',
];
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

for (const p of paths) {
  const full = join(root, p);
  const ok = existsSync(full);
  console.log(`${ok ? 'OK    ' : 'MISSING'} ${p}`);
}
