const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const srcDir = path.join(__dirname, 'src');
const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Fix: "font-black ] text-" -> "font-semibold text-"
  // Also: "font-bold ] text-" -> "font-semibold text-"
  // Also: "font-black ]" -> "font-semibold"
  content = content.replace(/font-black \] /g, 'font-semibold ');
  content = content.replace(/font-bold \] /g, 'font-medium ');
  content = content.replace(/text-\[10px\]/g, 'text-xs');
  content = content.replace(/text-\[11px\]/g, 'text-xs');
  content = content.replace(/text-\[9px\]/g, 'text-[10px]');

  // Fix [white] -> white class tokens  
  content = content.replace(/text-\[white\]/g, 'text-white');
  content = content.replace(/border-\[white\]/g, 'border-white');
  content = content.replace(/bg-\[white\]/g, 'bg-white');
  content = content.replace(/accent-\[white\]/g, 'accent-white');
  content = content.replace(/border-\[white\]\/(\d+)/g, 'border-white/$1');
  content = content.replace(/bg-\[white\]\/(\d+)/g, 'bg-white/$1');

  // Clean multiple spaces in className strings
  content = content.replace(/className="([^"]+)"/g, (match, p1) => {
    const cleaned = p1.replace(/\s{2,}/g, ' ').trim();
    return `className="${cleaned}"`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed: ${path.relative(__dirname, file)}`);
  }
});

console.log('Done.');
