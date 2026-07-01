import fs from 'fs';
import path from 'path';

function findStrings(filePath) {
  const workspaceRoot = path.resolve(process.cwd());
  const fullPath = path.normalize(path.resolve(workspaceRoot, filePath));
  
  if (!fullPath.startsWith(workspaceRoot)) {
    throw new Error('Path traversal detected');
  }

  const buffer = fs.readFileSync(fullPath);
  const text = buffer.toString('ascii');
  const matches = text.match(/[A-Za-z0-9 _-]{6,}/g) || [];
  console.log(`\n\n--- ${fullPath} ---`);
  console.log(matches.slice(0, 30).join(' '));
}

const workspaceRoot = path.resolve(process.cwd());
const backupDir = path.normalize(path.join(workspaceRoot, 'public/images/backup'));
if (!backupDir.startsWith(workspaceRoot)) {
  throw new Error('Path traversal detected');
}

if (fs.existsSync(backupDir)) {
  const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.jpg'));
  for (const f of files) {
    findStrings(path.join('public/images/backup', f));
  }
}
