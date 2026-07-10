#!/usr/bin/env node
/**
 * Architecture loop scaffold — improved RVPLP+ decision loop.
 * Workflow: .agents/workflows/architecture-loop.md
 * Skill:    .agents/skills/architecture-loop/SKILL.md
 *
 * Usage:
 *   npm run arch:loop -- init --slug payload-cms --title "Payload CMS topology"
 *   npm run arch:loop -- list
 *   npm run arch:loop -- help
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const RUNS_DIR = path.join(ROOT, 'docs', 'architecture');
const TEMPLATE = path.join(
  ROOT,
  '.agents',
  'skills',
  'architecture-loop',
  'templates',
  'LOOP_RUN.md',
);

function usage() {
  console.log(`architecture-loop

Commands:
  init --slug <kebab> --title "<decision title>"
  list
  help

Creates docs/architecture/YYYY-MM-DD-<slug>.md from the loop template.
Then follow .agents/workflows/architecture-loop.md phases 0–8.
`);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--slug') args.slug = argv[++i];
    else if (a === '--title') args.title = argv[++i];
    else if (a.startsWith('--')) args[a.slice(2)] = true;
    else args._.push(a);
  }
  return args;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
}

function init(args) {
  const slug = slugify(args.slug || args.title || 'decision');
  if (!slug) {
    console.error('Need --slug or --title');
    process.exit(1);
  }
  const title = args.title || slug;
  const date = today();
  const file = path.join(RUNS_DIR, `${date}-${slug}.md`);

  if (!fs.existsSync(TEMPLATE)) {
    console.error('Missing template:', TEMPLATE);
    process.exit(1);
  }
  fs.mkdirSync(RUNS_DIR, { recursive: true });
  if (fs.existsSync(file)) {
    console.error('Already exists:', path.relative(ROOT, file));
    process.exit(1);
  }

  let body = fs.readFileSync(TEMPLATE, 'utf8');
  body = body
    .replaceAll('{{TITLE}}', title)
    .replaceAll('{{SLUG}}', slug)
    .replaceAll('{{DATE}}', date);

  fs.writeFileSync(file, body, 'utf8');
  console.log('Created', path.relative(ROOT, file));
  console.log('Next: fill phases 0–8 per .agents/workflows/architecture-loop.md');
  console.log('Skill: architecture-loop');
}

function list() {
  if (!fs.existsSync(RUNS_DIR)) {
    console.log('No runs yet. npm run arch:loop -- init --slug <name> --title "..."');
    return;
  }
  const files = fs
    .readdirSync(RUNS_DIR)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .sort()
    .reverse();
  if (!files.length) {
    console.log('No run files in docs/architecture/');
    return;
  }
  for (const f of files) {
    const p = path.join(RUNS_DIR, f);
    const head = fs.readFileSync(p, 'utf8').slice(0, 400);
    const status = (head.match(/status:\s*(\S+)/) || [])[1] || '?';
    const title = (head.match(/title:\s*["']?(.+?)["']?\s*$/m) || [])[1] || f;
    console.log(`${f}\t${status}\t${title}`);
  }
}

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0] || 'help';

if (cmd === 'init') init(args);
else if (cmd === 'list') list();
else usage();
