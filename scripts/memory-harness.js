/**
 * memory-harness.js — Unified Memory Harness
 *
 * Single access layer for memory/shared-graph.json used by BOTH:
 *   - The Agent OS (direct Node.js import)
 *   - The Next.js frontend (via /api/memory/route.ts)
 *
 * API:
 *   QueryMemory(query)               — semantic + graph traversal search
 *   UpdateMemory(conceptId, update)  — validated write with delta-log append
 *   GetNode(id)                      — fetch a single node by ID
 *   GetNeighbors(id, depth)          — traverse outward edges
 *   GetGraphStats()                  — return summary stats
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const GRAPH_FILE = path.join(ROOT, 'memory', 'shared-graph.json');
const DELTA_LOG  = path.join(ROOT, 'memory', 'delta-log.md');

// ─── OKF Node Schema ─────────────────────────────────────────────────────────
const VALID_TYPES  = ['entity', 'concept', 'playbook', 'integration', 'route', 'component', 'policy'];
const REQUIRED_NODE_FIELDS = ['id', 'type', 'title', 'tags', 'properties', 'last_sync', 'edges'];

function validateNodeSchema(node) {
  const errors = [];
  for (const field of REQUIRED_NODE_FIELDS) {
    if (!(field in node)) errors.push(`Missing required field: "${field}"`);
  }
  if (node.type && !VALID_TYPES.includes(node.type)) {
    errors.push(`Invalid type "${node.type}". Must be one of: ${VALID_TYPES.join(', ')}`);
  }
  if (node.id && !/^[a-z0-9_.]+$/.test(node.id)) {
    errors.push(`Invalid id "${node.id}". Must be lowercase alphanumeric with dots/underscores only.`);
  }
  if (node.tags && !Array.isArray(node.tags)) {
    errors.push(`"tags" must be an array`);
  }
  if (node.edges && !Array.isArray(node.edges)) {
    errors.push(`"edges" must be an array of node IDs`);
  }
  return errors;
}

// ─── Graph I/O ───────────────────────────────────────────────────────────────
function loadGraph() {
  if (!fs.existsSync(GRAPH_FILE)) {
    throw new Error(`shared-graph.json not found at ${GRAPH_FILE}`);
  }
  return JSON.parse(fs.readFileSync(GRAPH_FILE, 'utf8'));
}

function saveGraph(graph) {
  graph.last_updated = new Date().toISOString();
  graph.stats.total_nodes = graph.nodes.length;
  graph.stats.total_edges = graph.edges.length;
  // Recalculate isolated nodes (zero incoming edges)
  const allTargets = new Set(graph.edges.map(e => e.to));
  const hasIncoming = new Set(graph.edges.map(e => e.from));
  const isolated = graph.nodes.filter(n => !allTargets.has(n.id) && !hasIncoming.has(n.id));
  graph.stats.isolated_nodes = isolated.length;
  fs.writeFileSync(GRAPH_FILE, JSON.stringify(graph, null, 2), 'utf8');
}

// ─── Delta Log ───────────────────────────────────────────────────────────────
function appendDelta(agentId, operation, nodeId, summary) {
  const ts = new Date().toISOString();
  const line = `${ts} | ${agentId} | ${operation} | ${nodeId} | ${summary}\n`;
  fs.appendFileSync(DELTA_LOG, line, 'utf8');
}

// ─── QueryMemory ─────────────────────────────────────────────────────────────
/**
 * Search the graph using semantic text matching + optional type/tag filters.
 *
 * @param {string|object} query - Either a plain string (text search) or:
 *   { text, type, tags, relation, depth, nodeId }
 * @returns {{ nodes: Node[], edges: Edge[], total: number }}
 */
export function QueryMemory(query) {
  const graph = loadGraph();

  // Normalize query
  const q = typeof query === 'string' ? { text: query } : query;
  const { text, type, tags, nodeId, relation, depth = 1 } = q;

  // 1. If nodeId is specified — graph traversal from that node
  if (nodeId) {
    return traverseFrom(graph, nodeId, depth, relation);
  }

  // 2. Text + filter search
  const textLower = text ? text.toLowerCase() : null;
  const matchingNodes = graph.nodes.filter(node => {
    // Type filter
    if (type && node.type !== type) return false;
    // Tag filter
    if (tags?.length) {
      const nodeTags = node.tags || [];
      if (!tags.some(t => nodeTags.includes(t))) return false;
    }
    // Text match across id, title, tags, property values
    if (textLower) {
      const searchable = [
        node.id, node.title,
        ...(node.tags || []),
        ...Object.values(node.properties || {}).map(String),
      ].join(' ').toLowerCase();
      if (!searchable.includes(textLower)) return false;
    }
    return true;
  });

  // Collect edges between matched nodes
  const matchedIds = new Set(matchingNodes.map(n => n.id));
  const matchingEdges = graph.edges.filter(e => matchedIds.has(e.from) && matchedIds.has(e.to));

  return {
    query: q,
    nodes: matchingNodes,
    edges: matchingEdges,
    total: matchingNodes.length,
  };
}

function traverseFrom(graph, startId, depth, filterRelation) {
  const visited = new Set();
  const resultNodes = [];
  const resultEdges = [];

  function visit(nodeId, currentDepth) {
    if (visited.has(nodeId) || currentDepth > depth) return;
    visited.add(nodeId);
    const node = graph.nodes.find(n => n.id === nodeId);
    if (node) resultNodes.push(node);

    const outEdges = graph.edges.filter(e => e.from === nodeId);
    for (const edge of outEdges) {
      if (filterRelation && edge.relation !== filterRelation) continue;
      resultEdges.push(edge);
      visit(edge.to, currentDepth + 1);
    }
  }

  visit(startId, 0);
  return { nodes: resultNodes, edges: resultEdges, total: resultNodes.length };
}

// ─── GetNode ─────────────────────────────────────────────────────────────────
export function GetNode(id) {
  const graph = loadGraph();
  const node = graph.nodes.find(n => n.id === id);
  if (!node) return null;
  // Enrich with incoming edge count
  const incoming = graph.edges.filter(e => e.to === id);
  const outgoing = graph.edges.filter(e => e.from === id);
  return { ...node, _meta: { incoming: incoming.length, outgoing: outgoing.length } };
}

// ─── GetNeighbors ────────────────────────────────────────────────────────────
export function GetNeighbors(id, depth = 1) {
  const graph = loadGraph();
  return traverseFrom(graph, id, depth, null);
}

// ─── GetGraphStats ────────────────────────────────────────────────────────────
export function GetGraphStats() {
  const graph = loadGraph();
  const allTargets = new Set(graph.edges.map(e => e.to));
  const allSources = new Set(graph.edges.map(e => e.from));
  const isolated = graph.nodes.filter(n => !allTargets.has(n.id) && !allSources.has(n.id));
  return {
    version: graph.version,
    last_updated: graph.last_updated,
    total_nodes: graph.nodes.length,
    total_edges: graph.edges.length,
    isolated_nodes: isolated.length,
    isolated_ids: isolated.map(n => n.id),
    node_types: [...new Set(graph.nodes.map(n => n.type))],
    communities: graph.stats,
  };
}

// ─── UpdateMemory ─────────────────────────────────────────────────────────────
/**
 * Validated write operation for the shared graph.
 *
 * @param {string} conceptId - The node id to create or update
 * @param {object} partialUpdate - Fields to merge. Must be OKF-schema valid.
 * @param {string} agentId - Identifier of the calling agent (for delta log)
 * @returns {{ success: boolean, errors?: string[], node: Node }}
 */
export function UpdateMemory(conceptId, partialUpdate, agentId = 'unknown-agent') {
  const graph = loadGraph();

  const existingIdx = graph.nodes.findIndex(n => n.id === conceptId);
  let node;
  let operation;

  if (existingIdx !== -1) {
    // Merge update into existing node
    node = {
      ...graph.nodes[existingIdx],
      ...partialUpdate,
      id: conceptId, // never override id
      last_sync: new Date().toISOString(),
    };
    operation = 'UPDATE';
  } else {
    // Create new node — requires full schema
    node = {
      ...partialUpdate,
      id: conceptId,
      last_sync: new Date().toISOString(),
    };
    operation = 'CREATE';
  }

  // ── OKF Schema Validation ─────────────────────────────────────────────────
  const errors = validateNodeSchema(node);
  if (errors.length > 0) {
    return { success: false, errors, node: null };
  }

  // ── Commit ────────────────────────────────────────────────────────────────
  if (existingIdx !== -1) {
    graph.nodes[existingIdx] = node;
  } else {
    graph.nodes.push(node);
  }

  // Add any new edges declared in the update
  if (partialUpdate.edges) {
    for (const targetId of partialUpdate.edges) {
      const edgeExists = graph.edges.some(e => e.from === conceptId && e.to === targetId);
      if (!edgeExists) {
        graph.edges.push({ from: conceptId, to: targetId, relation: 'related_to' });
      }
    }
  }

  saveGraph(graph);

  // ── Delta Log ─────────────────────────────────────────────────────────────
  const summary = `title="${node.title}" type=${node.type} tags=[${(node.tags || []).join(',')}]`;
  appendDelta(agentId, operation, conceptId, summary);

  return { success: true, errors: [], node };
}

// ─── CLI interface ────────────────────────────────────────────────────────────
const [,, command, ...cliArgs] = process.argv;

if (command === 'query') {
  const q = cliArgs.join(' ');
  const result = QueryMemory(q);
  console.log(`\n🔍 Query: "${q}" — ${result.total} node(s) found\n`);
  for (const n of result.nodes) {
    console.log(`  [${n.type}] ${n.id}: ${n.title}`);
    console.log(`           tags: ${n.tags.join(', ')}`);
  }
} else if (command === 'stats') {
  const stats = GetGraphStats();
  console.log('\n📊 Shared Graph Stats:');
  console.log(JSON.stringify(stats, null, 2));
} else if (command === 'node') {
  const id = cliArgs[0];
  const node = GetNode(id);
  if (!node) {
    console.log(`❌ Node not found: ${id}`);
  } else {
    console.log('\n📦 Node:');
    console.log(JSON.stringify(node, null, 2));
  }
} else if (command === 'neighbors') {
  const [id, depthStr] = cliArgs;
  const result = GetNeighbors(id, parseInt(depthStr || '1', 10));
  console.log(`\n🌐 Neighbors of "${id}" (depth ${depthStr || 1}): ${result.total} node(s)`);
  for (const n of result.nodes) {
    console.log(`  [${n.type}] ${n.id}: ${n.title}`);
  }
} else if (command) {
  console.log(`Unknown command: ${command}`);
} else {
  console.log(`
memory-harness.js — Unified Memory Harness

Commands:
  node scripts/memory-harness.js stats
  node scripts/memory-harness.js query <text>
  node scripts/memory-harness.js node <id>
  node scripts/memory-harness.js neighbors <id> [depth]

Exports (for programmatic use):
  QueryMemory(query)
  UpdateMemory(conceptId, partialUpdate, agentId)
  GetNode(id)
  GetNeighbors(id, depth)
  GetGraphStats()
`);
}
