const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace colors
  content = content.replace(/#f0c067/g, 'white');
  content = content.replace(/#FF5A00/g, 'white');
  content = content.replace(/orange-safety/g, 'white');
  content = content.replace(/orange-deep/g, 'gray-200');
  
  // Remove uppercase and tracking classes
  content = content.replace(/\buppercase\b/g, '');
  content = content.replace(/\btracking-[a-zA-Z0-9-\[\]\.]+\b/g, '');
  
  // Clean up multiple spaces in class names
  content = content.replace(/className="([^"]+)"/g, (match, p1) => {
    let cleaned = p1.replace(/\s+/g, ' ').trim();
    return `className="${cleaned}"`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
