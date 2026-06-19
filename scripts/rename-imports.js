import fs from 'node:fs';
import path from 'node:path';

const appDir = 'C:\\Users\\Johnny Cage\\DEV\\skysthelimit-collab\\src';

function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('/pages/')) {
        console.log(`Updating imports in: ${fullPath}`);
        content = content.replace(/\/pages\//g, '/views/');
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processDirectory(appDir);
console.log('Imports update complete!');
