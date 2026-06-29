import fs from 'fs';
import path from 'path';

function getMdFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getMdFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.md')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const dirsToCheck = ['wiki', '.agents/wiki'];
const filesToCheck = [];
for (const dir of dirsToCheck) {
  getMdFiles(path.resolve(dir), filesToCheck);
}

let hasError = false;

for (const file of filesToCheck) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Custom simple frontmatter parser to avoid gray-matter / js-yaml v4 conflict
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  let frontmatter = {};
  if (match) {
    const lines = match[1].split('\n');
    lines.forEach(line => {
      const parts = line.split(':');
      if (parts.length > 1) {
        const key = parts[0].trim();
        const value = parts.slice(1).join(':').trim();
        frontmatter[key] = value;
      }
    });
  }
  
  const missingProps = [];
  if (!frontmatter.type) missingProps.push('type');
  if (!frontmatter.title) missingProps.push('title');
  if (!frontmatter.timestamp && !frontmatter.last_sync) missingProps.push('timestamp');
  
  if (missingProps.length > 0) {
    console.error(`Error in ${file}: Missing frontmatter properties: ${missingProps.join(', ')}`);
    hasError = true;
  }
  
  // Semantic Checks
  if (content.includes('[System Note: Awaiting semantic compilation]')) {
    console.error(`Error in ${file}: Contains forbidden placeholder '[System Note: Awaiting semantic compilation]'`);
    hasError = true;
  }
  
  if (content.match(/Source:\s*AST Graphify Extraction\s*(?:\r?\n|$)/)) {
    console.error(`Error in ${file}: Contains vague 'Source: AST Graphify Extraction' without a specific file path`);
    hasError = true;
  }
  
  const synthesisMatch = content.match(/## Synthesis([\s\S]*?)(?=##|$)/);
  if (synthesisMatch) {
    const synthesisText = synthesisMatch[1].trim();
    const wordCount = synthesisText.split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount < 30) {
      console.error(`Error in ${file}: Synthesis section is under 30 words (Found ${wordCount} words)`);
      hasError = true;
    }
  } else {
    console.error(`Error in ${file}: Missing ## Synthesis section`);
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
} else {
  console.log('OKF Validation passed: All required frontmatter properties are present.');
}
