import fs from 'fs';
import path from 'path';

const dirs = ['.agents/wiki', 'wiki'];

console.log('[OKF] Starting OKF Anatomy Enforcement without gray-matter...');

let processedCount = 0;

dirs.forEach((dir) => {
  const dirPath = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.md'));

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const rawContent = fs.readFileSync(filePath, 'utf8');

    let contentBody = rawContent;
    let frontmatter = {};

    // Extract existing frontmatter if any
    const fmMatch = rawContent.match(/^---\r?\n([^]*?)\r?\n---/);
    if (fmMatch) {
      contentBody = rawContent.slice(fmMatch[0].length).trim();
      const lines = fmMatch[1].split(/\r?\n/);
      lines.forEach((line) => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          const key = parts.shift().trim();
          const val = parts.join(':').trim();
          frontmatter[key] = val;
        }
      });
    }

    // Default frontmatter fields
    frontmatter.title = frontmatter.title || file.replace('.md', '');
    frontmatter.type = frontmatter.type || 'concept';
    frontmatter.tags = frontmatter.tags || '[graphify, auto-compiled]';
    frontmatter.last_sync = frontmatter.last_sync || new Date().toISOString();

    // Ensure Anatomy Blocks
    if (!contentBody.includes('## Synthesis')) {
      contentBody +=
        '\n\n## Synthesis\n[System Note: Awaiting semantic compilation]';
    }
    if (!contentBody.includes('## Source References')) {
      contentBody +=
        '\n\n## Source References\n- Source: AST Graphify Extraction';
    }
    if (!contentBody.includes('## Open Questions')) {
      contentBody +=
        '\n\n## Open Questions\n- What contradictions exist in this node?';
    }

    // Reconstruct
    let newContent = '---\n';
    for (const [k, v] of Object.entries(frontmatter)) {
      newContent += `${k}: ${v}\n`;
    }
    newContent += '---\n\n' + contentBody + '\n';

    fs.writeFileSync(filePath, newContent, 'utf8');
    processedCount++;
  });
});

console.log(
  `[OKF] Successfully formatted ${processedCount} files into strict OKF schema.`
);
