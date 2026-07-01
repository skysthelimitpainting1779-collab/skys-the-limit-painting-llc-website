/**
 * /api/memory — Memory Bridge for Next.js
 *
 * Exposes the Agent OS shared-graph.json to the live website.
 * The frontend queries this endpoint exactly as the agent would query memory-harness.js directly.
 *
 * GET  /api/memory?q=residential            — text search
 * GET  /api/memory?nodeId=sky.business      — fetch node by ID
 * GET  /api/memory?nodeId=sky.business&depth=2 — traverse neighbors
 * GET  /api/memory?stats=1                  — graph statistics
 * GET  /api/memory?type=service             — filter by type
 * POST /api/memory  { conceptId, update, agentId } — write a node update
 */

import { NextRequest, NextResponse } from 'next/server';

// Dynamic import at runtime — memory-harness is a Node.js ESM module
// Running in Next.js Edge-incompatible, so this must be a Node.js route (not Edge Runtime)
async function getHarness() {
  // Use process.cwd() to build absolute path — safe in Next.js Node runtime
  const harnessPath = `${process.cwd()}/scripts/memory-harness.js`;
  // Indirect import bypasses Turbopack static analysis of dynamic paths
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const importFn = new Function('p', 'return import(p)');
  return (await importFn(harnessPath)) as {
    QueryMemory: (opts: {
      text: string;
      type?: string;
      tags?: string[];
    }) => unknown;
    GetNode: (id: string) => unknown;
    GetNeighbors: (id: string, depth: number) => unknown;
    GetGraphStats: () => unknown;
    UpdateMemory: (
      conceptId: string,
      update: Record<string, unknown>,
      agentId: string
    ) => { success: boolean; errors?: unknown; node?: unknown };
  };
}

export const runtime = 'nodejs'; // explicitly: memory files live on disk, not edge

// ─── GET ─────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const { QueryMemory, GetNode, GetNeighbors, GetGraphStats } =
      await getHarness();
    const { searchParams } = new URL(req.url);

    // Stats
    if (searchParams.get('stats')) {
      const stats = GetGraphStats();
      return NextResponse.json(stats);
    }

    // Node by ID with optional neighbor traversal
    const nodeId = searchParams.get('nodeId');
    if (nodeId) {
      const depthParam = searchParams.get('depth');
      if (depthParam) {
        const depth = Math.min(parseInt(depthParam, 10) || 1, 3); // cap at depth 3
        const result = GetNeighbors(nodeId, depth);
        return NextResponse.json(result);
      }
      const node = GetNode(nodeId);
      if (!node) {
        return NextResponse.json(
          { error: `Node not found: ${nodeId}` },
          { status: 404 }
        );
      }
      return NextResponse.json(node);
    }

    // Text/type/tag search
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || undefined;
    const tagsParam = searchParams.get('tags');
    const tags = tagsParam
      ? tagsParam.split(',').map((t) => t.trim())
      : undefined;

    const result = QueryMemory({ text: q, type, tags });

    // Cache for 60s — graph updates happen via POST, not by polling
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Memory harness error';
    console.error('[/api/memory GET]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── POST ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Require internal secret to prevent public graph writes
  const secret = req.headers.get('x-memory-secret');
  const expectedSecret = process.env.MEMORY_WRITE_SECRET;

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Unauthorized. Provide x-memory-secret header.' },
      { status: 401 }
    );
  }

  try {
    const { UpdateMemory } = await getHarness();
    const body = (await req.json()) as {
      conceptId: string;
      update: Record<string, unknown>;
      agentId?: string;
    };

    if (!body.conceptId || !body.update) {
      return NextResponse.json(
        { error: 'Missing conceptId or update' },
        { status: 400 }
      );
    }

    const result = UpdateMemory(
      body.conceptId,
      body.update,
      body.agentId || 'api-route'
    );

    if (!result.success) {
      return NextResponse.json(
        { error: 'Schema validation failed', errors: result.errors },
        { status: 422 }
      );
    }

    return NextResponse.json({ ok: true, node: result.node }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Memory write error';
    console.error('[/api/memory POST]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
