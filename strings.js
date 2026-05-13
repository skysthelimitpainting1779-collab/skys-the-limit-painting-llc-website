import fs from 'fs';

function findStrings(filePath) {
  const buffer = fs.readFileSync(filePath);
  const text = buffer.toString('ascii');
  const matches = text.match(/[A-Za-z0-9 _-]{6,}/g) || [];
  console.log(`\n\n--- ${filePath} ---`);
  console.log(matches.slice(0, 30).join(' '));
}

const files = fs.readdirSync('public/images/backup').filter(f => f.endsWith('.jpg'));
for (const f of files) {
  findStrings(`public/images/backup/${f}`);
}
