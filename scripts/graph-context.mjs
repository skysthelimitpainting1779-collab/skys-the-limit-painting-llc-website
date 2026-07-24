#!/usr/bin/env node
/**
 * Graphify token-budget context — the *only* preferred way to pull graph memory.
 *
 * Why this exists:
 *   - Dumping GRAPH_REPORT.md (~280k) or the whole .agents/wiki (~100 pages)
 *     burns context. graphify query with --budget returns a scoped subgraph
 *     (often ~10–75× smaller than raw corpus grep/read).
 *   - Karpathy-style wiki: index → one community page → few god nodes.
 *     Never "read all of wiki".
 *
 * Usage:
 *   node scripts/graph-context.mjs query "how does learn-pipeline use Turso"
 *   node scripts/graph-context.mjs query "..." --budget 1500
 *   node scripts/graph-context.mjs path "AuthModule" "Database"
 *   node scripts/graph-context.mjs explain "learn-pipeline"
 *   node scripts/graph-context.mjs status
 *
 * Env:
 *   GRAPHIFY_BUDGET=1500   default token cap for query
 *   GRAPHIFY_BIN=graphify  override binary
 */

import { execFileSync, spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  statSync,
} from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const GRAPH_JSON = join(ROOT, 'graphify-out', 'graph.json');
const GRAPH_REPORT = join(ROOT, 'graphify-out', 'GRAPH_REPORT.md');
const GRAPH_WIKI_INDEX = join(ROOT, 'graphify-out', 'wiki', 'index.md');
const AGENTS_WIKI_INDEX = join(ROOT, '.agents', 'wiki', 'index.md');
const OUT_DIR = join(ROOT, '.learnings');
const LAST_PATH = join(OUT_DIR, 'GRAPH_CONTEXT_LAST.md');
const STATS_PATH = join(OUT_DIR, 'GRAPH_CONTEXT_STATS.json');

const DEFAULT_BUDGET = Number(process.env.GRAPHIFY_BUDGET || 1500);

function graphifyBin() {
  return process.env.GRAPHIFY_BIN || 'graphify';
}

function parseArgs(argv) {
  const out = { cmd: null, args: [], budget: DEFAULT_BUDGET, json: false };
  const rest = [...argv];
  if (!rest.length) {
    out.cmd = 'status';
    return out;
  }
  out.cmd = rest.shift();
  while (rest.length) {
    const a = rest.shift();
    if (a === '--budget' || a === '-b') out.budget = Number(rest.shift() || DEFAULT_BUDGET);
    else if (a === '--json') out.json = true;
    else out.args.push(a);
  }
  return out;
}

function fileMeta(p) {
  if (!existsSync(p)) return null;
  const st = statSync(p);
  return { path: p, bytes: st.size, mtime: st.mtime.toISOString() };
}

function estimateTokensFromText(text) {
  // rough: ~4 chars/token
  return Math.ceil(String(text || '').length / 4);
}

function loadStats() {
  if (!existsSync(STATS_PATH)) {
    return { queries: 0, total_result_tokens: 0, last_at: null, last_budget: null };
  }
  try {
    return JSON.parse(readFileSync(STATS_PATH, 'utf8'));
  } catch {
    return { queries: 0, total_result_tokens: 0, last_at: null, last_budget: null };
  }
}

function saveStats(stats) {
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(STATS_PATH, JSON.stringify(stats, null, 2), 'utf8');
}

function runGraphify(args) {
  const bin = graphifyBin();
  const r = spawnSync(bin, args, {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 8 * 1024 * 1024,
  });
  const stdout = (r.stdout || '').trim();
  const stderr = (r.stderr || '').trim();
  // graphify prints skill version warnings on stderr — strip noise
  const cleanErr = stderr
    .split(/\r?\n/)
    .filter((l) => !/warning: skill is from graphify/i.test(l))
    .join('\n')
    .trim();
  if (r.status !== 0 && !stdout) {
    throw new Error(cleanErr || `graphify exited ${r.status}`);
  }
  return { stdout, stderr: cleanErr, status: r.status };
}

function writeLast(meta, body) {
  mkdirSync(OUT_DIR, { recursive: true });
  const md = `---
type: graph_context
title: Last graphify context pull
source: graph-context.mjs
budget: ${meta.budget ?? 'n/a'}
cmd: ${meta.cmd}
at: ${meta.at}
result_tokens_est: ${meta.result_tokens}
---

# Graph context (budgeted)

**Command:** \`${meta.cmdLine}\`
**Budget:** ${meta.budget ?? 'n/a'} · **Result ~tokens:** ${meta.result_tokens}
**Why:** Prefer this over dumping \`GRAPH_REPORT.md\` or all of \`.agents/wiki\`.

## Result

\`\`\`text
${body.slice(0, 120_000)}
\`\`\`
`;
  writeFileSync(LAST_PATH, md, 'utf8');
}

function status() {
  const g = fileMeta(GRAPH_JSON);
  const report = fileMeta(GRAPH_REPORT);
  const gWiki = fileMeta(GRAPH_WIKI_INDEX);
  const aWiki = fileMeta(AGENTS_WIKI_INDEX);
  const stats = loadStats();

  const policy = {
    graph_query_first: true,
    default_budget: DEFAULT_BUDGET,
    never_dump: ['graphify-out/GRAPH_REPORT.md', '.agents/wiki/** (bulk)', 'repomix-output.md'],
    karpathy_wiki: {
      principle: 'index → one community/article → few god nodes; compile/update, do not bulk-load',
      preferred_index: gWiki
        ? 'graphify-out/wiki/index.md'
        : aWiki
          ? '.agents/wiki/index.md (legacy auto-compile — prefer regenerating graphify wiki)'
          : 'missing — run graphify with --wiki after rebuild when package supports it',
    },
    token_savings: 'query --budget N returns scoped subgraph; often ~10–75× smaller than full corpus reads',
  };

  const out = {
    ok: Boolean(g),
    graph: g,
    report,
    wiki: { graphify: gWiki, agents_legacy: aWiki },
    stats,
    policy,
    commands: {
      query: `npm run graph:query -- "your question"`,
      path: `npm run graph:path -- "A" "B"`,
      explain: `npm run graph:explain -- "concept"`,
      update: `npm run graph:update`,
    },
  };

  if (!g) {
    out.blocker = 'graphify-out/graph.json missing — run: npm run graph:update';
  }

  return out;
}

function cmdQuery(question, budget) {
  if (!existsSync(GRAPH_JSON)) {
    throw new Error('No graphify-out/graph.json. Run: npm run graph:update');
  }
  if (!question) throw new Error('Usage: graph-context query "<question>" [--budget N]');
  const args = ['query', question, '--budget', String(budget)];
  const { stdout } = runGraphify(args);
  const result_tokens = estimateTokensFromText(stdout);
  const at = new Date().toISOString();
  const cmdLine = `graphify query ${JSON.stringify(question)} --budget ${budget}`;
  writeLast({ cmd: 'query', budget, result_tokens, at, cmdLine }, stdout);

  const stats = loadStats();
  stats.queries += 1;
  stats.total_result_tokens += result_tokens;
  stats.last_at = at;
  stats.last_budget = budget;
  stats.last_question = question.slice(0, 200);
  saveStats(stats);

  return { ok: true, budget, result_tokens, path: LAST_PATH, stdout };
}

function cmdPath(a, b) {
  if (!existsSync(GRAPH_JSON)) {
    throw new Error('No graphify-out/graph.json. Run: npm run graph:update');
  }
  if (!a || !b) throw new Error('Usage: graph-context path "A" "B"');
  const { stdout } = runGraphify(['path', a, b]);
  const result_tokens = estimateTokensFromText(stdout);
  const at = new Date().toISOString();
  writeLast(
    {
      cmd: 'path',
      budget: null,
      result_tokens,
      at,
      cmdLine: `graphify path ${JSON.stringify(a)} ${JSON.stringify(b)}`,
    },
    stdout
  );
  return { ok: true, result_tokens, path: LAST_PATH, stdout };
}

function cmdExplain(concept) {
  if (!existsSync(GRAPH_JSON)) {
    throw new Error('No graphify-out/graph.json. Run: npm run graph:update');
  }
  if (!concept) throw new Error('Usage: graph-context explain "concept"');
  const { stdout } = runGraphify(['explain', concept]);
  const result_tokens = estimateTokensFromText(stdout);
  const at = new Date().toISOString();
  writeLast(
    {
      cmd: 'explain',
      budget: null,
      result_tokens,
      at,
      cmdLine: `graphify explain ${JSON.stringify(concept)}`,
    },
    stdout
  );
  return { ok: true, result_tokens, path: LAST_PATH, stdout };
}

function cmdUpdate() {
  // AST-only incremental — no LLM cost
  const r = spawnSync(graphifyBin(), ['update', '.'], {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
    stdio: 'inherit',
  });
  return { ok: r.status === 0, status: r.status };
}

/**
 * Rebuild graphify-out/wiki from current graph.json (Karpathy navigable index).
 * Does NOT write into .agents/wiki (policy-only there).
 */
function cmdWiki() {
  if (!existsSync(GRAPH_JSON)) {
    throw new Error('No graphify-out/graph.json. Run: npm run graph:update');
  }
  const pyFile = join(ROOT, 'graphify-out', '.graphify_python');
  let python = 'python';
  if (existsSync(pyFile)) {
    python = readFileSync(pyFile, 'utf8').trim() || python;
  }
  const script = `
import json
from pathlib import Path
from networkx.readwrite import json_graph
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes
from graphify.wiki import to_wiki

root = Path(${JSON.stringify(ROOT.replace(/\\/g, '/'))})
raw = json.loads((root / 'graphify-out' / 'graph.json').read_text(encoding='utf-8'))
try:
    G = json_graph.node_link_graph(raw)
except Exception:
    G = build_from_json(raw)
ap = root / 'graphify-out' / '.graphify_analysis.json'
lp = root / 'graphify-out' / '.graphify_labels.json'
if ap.exists():
    analysis = json.loads(ap.read_text(encoding='utf-8'))
    communities = {int(k): v for k, v in analysis.get('communities', {}).items()}
    cohesion = {int(k): v for k, v in analysis.get('cohesion', {}).items()}
else:
    communities = cluster(G)
    cohesion = score_all(G, communities)
labels = {int(k): v for k, v in json.loads(lp.read_text(encoding='utf-8')).items()} if lp.exists() else {cid: f'Community {cid}' for cid in communities}
gods = god_nodes(G)
out = root / 'graphify-out' / 'wiki'
out.mkdir(parents=True, exist_ok=True)
n = to_wiki(G, communities, out, community_labels=labels, cohesion=cohesion, god_nodes_data=gods)
print(json.dumps({'ok': True, 'pages': n, 'dir': str(out), 'nodes': G.number_of_nodes(), 'edges': G.number_of_edges()}))
`;
  const r = spawnSync(python, ['-c', script], {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 16 * 1024 * 1024,
  });
  if (r.stdout) console.log(r.stdout.trim());
  if (r.status !== 0) {
    throw new Error(r.stderr || `wiki export failed (${r.status})`);
  }
  return { ok: true };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  try {
    if (opts.cmd === 'status') {
      const s = status();
      console.log(JSON.stringify(s, null, 2));
      process.exit(s.ok ? 0 : 1);
    }
    if (opts.cmd === 'query') {
      const q = opts.args.join(' ').trim();
      const r = cmdQuery(q, opts.budget);
      console.log(r.stdout);
      console.error(
        `[graph-context] ~${r.result_tokens} tokens (budget ${r.budget}) → ${r.path}`
      );
      return;
    }
    if (opts.cmd === 'path') {
      const r = cmdPath(opts.args[0], opts.args[1]);
      console.log(r.stdout);
      console.error(`[graph-context] ~${r.result_tokens} tokens → ${r.path}`);
      return;
    }
    if (opts.cmd === 'explain') {
      const r = cmdExplain(opts.args.join(' ').trim());
      console.log(r.stdout);
      console.error(`[graph-context] ~${r.result_tokens} tokens → ${r.path}`);
      return;
    }
    if (opts.cmd === 'update') {
      const r = cmdUpdate();
      process.exit(r.ok ? 0 : 1);
    }
    if (opts.cmd === 'wiki') {
      cmdWiki();
      return;
    }
    console.error(
      'Usage: graph-context <query|path|explain|update|wiki|status> ... [--budget N]'
    );
    process.exit(2);
  } catch (err) {
    console.error('[graph-context]', err.message);
    process.exit(1);
  }
}

main();
