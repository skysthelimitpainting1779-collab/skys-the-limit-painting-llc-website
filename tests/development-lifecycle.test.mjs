import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  findForbiddenPaths,
  resolveDeploymentCommit,
  validateCheckpointEnvelope,
  validateEvidenceReceipt,
  validateGovernedCommit,
} from '../scripts/lib/development-lifecycle.mjs';
import { canonicalSha256 } from '../scripts/lib/canonical-text.mjs';

const governedMessage = `fix(ci): enforce lifecycle contract

Execution-Program: stl-post-g20-sequential-tdd-v1
Execution-Node: AUDIT-REPOSITORY-HYGIENE
Checkpoint-ID: cp-20260728-001
Evidence-SHA256: ${'a'.repeat(64)}
`;

const rootUrl = new URL('../', import.meta.url);

test('governed commits require conventional subjects and lifecycle trailers', () => {
  assert.deepEqual(validateGovernedCommit(governedMessage), []);
  assert.deepEqual(validateGovernedCommit('updated lifecycle'), [
    'subject must follow Conventional Commits',
    'missing Execution-Program trailer',
    'missing Execution-Node trailer',
    'missing Checkpoint-ID trailer',
    'missing or invalid Evidence-SHA256 trailer',
  ]);
});

test('runtime databases, logs, and generated graphs cannot enter governed commits', () => {
  assert.deepEqual(
    findForbiddenPaths([
      'src/app/page.tsx',
      'dev/graphify.db',
      'graphify-out/graph.json',
      '.agents/checkpoints/runtime.json',
      'output/build.log',
    ]),
    [
      '.agents/checkpoints/runtime.json',
      'dev/graphify.db',
      'graphify-out/graph.json',
      'output/build.log',
    ]
  );
});

test('checkpoint envelopes bind execution state to exact Git and evidence hashes', () => {
  assert.deepEqual(
    validateCheckpointEnvelope({
      checkpointId: 'cp-20260728-001',
      programId: 'stl-post-g20-sequential-tdd-v1',
      nodeId: 'AUDIT-REPOSITORY-HYGIENE',
      stageId: 'stage:AUDIT-REPOSITORY-HYGIENE:verify_green',
      repository: 'owner/repo',
      branch: 'agent/development-lifecycle',
      headSha: 'a'.repeat(40),
      treeSha: 'b'.repeat(40),
      evidenceSha256: 'c'.repeat(64),
      clean: true,
      nextNode: 'G26-AUDIT-REMEDIATION-READY',
      nextStage: 'stage:G26-AUDIT-REMEDIATION-READY:collect_evidence',
    }),
    []
  );

  assert.deepEqual(
    validateCheckpointEnvelope({
      checkpointId: 'cp-bad',
      headSha: 'short',
      treeSha: '',
      evidenceSha256: 'bad',
      clean: false,
    }),
    [
      'programId is required',
      'nodeId is required',
      'stageId is required',
      'repository is required',
      'branch is required',
      'headSha must be a 40-character Git SHA',
      'treeSha must be a 40-character Git SHA',
      'evidenceSha256 must be a 64-character SHA-256',
      'checkpoint requires a clean worktree',
      'nextNode is required',
      'nextStage is required',
    ]
  );
});

test('commit evidence is bound to the configured program, audited node, and verification', () => {
  const receiptSha256 = 'd'.repeat(64);
  assert.deepEqual(
    validateEvidenceReceipt({
      message: governedMessage.replace('a'.repeat(64), receiptSha256),
      config: {
        programId: 'stl-post-g20-sequential-tdd-v1',
        executionGraph: { sha256: 'e'.repeat(64) },
      },
      nodeIds: new Set(['AUDIT-REPOSITORY-HYGIENE']),
      receiptSha256,
      receipt: {
        schemaVersion: 1,
        programId: 'stl-post-g20-sequential-tdd-v1',
        nodeId: 'AUDIT-REPOSITORY-HYGIENE',
        checkpointId: 'cp-20260728-001',
        graphSha256: 'e'.repeat(64),
        baseHeadSha: 'f'.repeat(40),
        verification: [{ command: 'npm test', status: 'passed' }],
        reviews: [{ reviewer: 'independent-reviewer', status: 'approved' }],
      },
    }),
    []
  );
});

test('independent approval comes from GitHub at the exact head, not receipt claims', async () => {
  const { approvedReviewers } = await import(
    new URL('../scripts/verify-pr-review.mjs', import.meta.url)
  );
  const headSha = 'a'.repeat(40);
  const reviews = [
    {
      id: 1,
      state: 'APPROVED',
      commit_id: headSha,
      submitted_at: '2026-07-28T20:00:00Z',
      author_association: 'MEMBER',
      user: { login: 'independent-reviewer' },
    },
    {
      id: 2,
      state: 'APPROVED',
      commit_id: headSha,
      submitted_at: '2026-07-28T20:01:00Z',
      author_association: 'OWNER',
      user: { login: 'commit-author' },
    },
    {
      id: 3,
      state: 'APPROVED',
      commit_id: 'b'.repeat(40),
      submitted_at: '2026-07-28T20:02:00Z',
      author_association: 'MEMBER',
      user: { login: 'stale-reviewer' },
    },
  ];
  assert.deepEqual(
    approvedReviewers(reviews, { headSha, author: 'commit-author' }),
    ['independent-reviewer']
  );
});

test('deployment verification resolves the deployed commit instead of default branch HEAD', () => {
  assert.equal(
    resolveDeploymentCommit({
      eventName: 'repository_dispatch',
      clientPayload: { git: { sha: 'a'.repeat(40) } },
    }),
    'a'.repeat(40)
  );
  assert.equal(
    resolveDeploymentCommit({
      eventName: 'deployment_status',
      deployment: { sha: 'b'.repeat(40) },
    }),
    'b'.repeat(40)
  );
  assert.equal(
    resolveDeploymentCommit({
      eventName: 'workflow_dispatch',
      githubSha: 'c'.repeat(40),
    }),
    null
  );
  assert.equal(
    resolveDeploymentCommit({
      eventName: 'deployment_status',
      deployment: {},
    }),
    null
  );
});

test('repository pins one audited execution graph as lifecycle authority', () => {
  const config = JSON.parse(
    readFileSync(new URL('.agents/governance/development-lifecycle.json', rootUrl), 'utf8')
  );
  const graph = readFileSync(new URL(config.executionGraph.path, rootUrl));
  const digest = createHash('sha256').update(graph).digest('hex');

  assert.equal(config.version, 1);
  assert.equal(config.programId, 'stl-post-g20-sequential-tdd-v1');
  assert.equal(
    config.enforceAfter,
    '5eb385d33976503cdac81e982ed74fbbc7f6839c'
  );
  assert.equal(digest, config.executionGraph.sha256);
  assert.equal(config.executionGraph.authoritative, true);
  assert.equal(config.integrationBranch, 'agent/skys-limit-convex-os');
  assert.equal(config.evidenceReceipts.directory, '.agents/execution/evidence');
  assert.doesNotMatch(graph.toString('utf8'), /\/mnt\/data\//);
  const validation = readFileSync(
    new URL(config.executionGraph.validationPath, rootUrl),
    'utf8'
  );
  assert.doesNotMatch(validation, /\/mnt\/data\//);
  const manifest = JSON.parse(
    readFileSync(new URL(config.executionGraph.manifestPath, rootUrl), 'utf8')
  );
  const retainedBundle = readFileSync(
    new URL(manifest.retainedSourceBundle.path, rootUrl)
  );
  assert.equal(
    createHash('sha256').update(retainedBundle).digest('hex'),
    manifest.retainedSourceBundle.sha256
  );
});

test('text contract hashes are stable across Git checkout line endings', () => {
  assert.equal(canonicalSha256('one\ntwo\n'), canonicalSha256('one\r\ntwo\r\n'));
});

test('agent tooling discovers the shared control plane without tracked machine paths', () => {
  for (const relativePath of [
    '.agents/mcp_config.json',
    '.agents/sidecars.json',
    '.codex/config.toml',
    'docs/DEVELOPMENT_LIFECYCLE.md',
    '.husky/post-commit',
  ]) {
    const content = readFileSync(new URL(relativePath, rootUrl), 'utf8');
    assert.doesNotMatch(content, /[A-Za-z]:[\\/]Users[\\/]/);
  }

  const launcher = new URL(
    'scripts/execution/start_agentgraph_mcp.py',
    rootUrl,
  );
  const fixture = mkdtempSync(join(tmpdir(), 'sky-dev-control-plane-'));
  const controlPlane = join(fixture, 'dev');
  const server = join(controlPlane, 'mcp_server.py');
  mkdirSync(controlPlane);
  writeFileSync(server, '# control-plane fixture\n');
  for (const filename of [
    'sync-graphify-db.ps1',
    'graphify_sqlite.py',
    'execution_graph_sqlite.py',
  ]) {
    writeFileSync(join(controlPlane, filename), '');
  }
  try {
    const result = spawnSync(
      'python',
      [fileURLToPath(launcher), '--print-path'],
      {
        encoding: 'utf8',
        env: {
          ...process.env,
          SKY_DEV_CONTROL_PLANE: fixture,
        },
      },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(existsSync(result.stdout.trim()), true);
    assert.equal(readFileSync(result.stdout.trim(), 'utf8'), '# control-plane fixture\n');

    const nestedWorktree = join(fixture, 'worktrees', 'app');
    mkdirSync(nestedWorktree, { recursive: true });
    const discoveryEnv = { ...process.env };
    delete discoveryEnv.SKY_DEV_CONTROL_PLANE;
    const discovered = spawnSync(
      'python',
      [fileURLToPath(launcher), '--print-path'],
      {
        cwd: nestedWorktree,
        encoding: 'utf8',
        env: discoveryEnv,
      },
    );
    assert.equal(discovered.status, 0, discovered.stderr);
    assert.equal(
      readFileSync(discovered.stdout.trim(), 'utf8'),
      '# control-plane fixture\n'
    );

    rmSync(join(controlPlane, 'execution_graph_sqlite.py'));
    const incomplete = spawnSync(
      'python',
      [fileURLToPath(launcher), '--print-path'],
      {
        encoding: 'utf8',
        env: {
          ...process.env,
          SKY_DEV_CONTROL_PLANE: fixture,
        },
      },
    );
    assert.notEqual(incomplete.status, 0);
    assert.match(
      incomplete.stderr,
      /SKY_DEV_CONTROL_PLANE is not a control-plane workspace/
    );
  } finally {
    rmSync(fixture, { force: true, recursive: true });
  }

  const launcherText = readFileSync(launcher, 'utf8');
  assert.match(launcherText, /AGENTGRAPH_SOURCE_ROOT/);
  const syncText = readFileSync(
    new URL('scripts/execution/sync_graphify_control_plane.py', rootUrl),
    'utf8'
  );
  assert.match(syncText, /graphify_sqlite_script/);
  assert.match(syncText, /execution_sqlite_script/);
  assert.match(syncText, /"import"/);
  assert.doesNotMatch(syncText, /sync-graphify-db\.ps1/);
});

test('pre-push accepts only the exact integration ref and gates SQLite state', () => {
  const head = spawnSync('git', ['rev-parse', 'HEAD'], {
    cwd: fileURLToPath(rootUrl),
    encoding: 'utf8',
  }).stdout.trim();
  const verifier = fileURLToPath(new URL('scripts/verify-push-target.mjs', rootUrl));
  const accepted = spawnSync(
    'node',
    [verifier, 'origin'],
    {
      cwd: fileURLToPath(rootUrl),
      encoding: 'utf8',
      input: `HEAD ${head} refs/heads/agent/skys-limit-convex-os ${'0'.repeat(40)}\n`,
    }
  );
  assert.equal(accepted.status, 0, accepted.stderr);

  const rejected = spawnSync(
    'node',
    [verifier, 'origin'],
    {
      cwd: fileURLToPath(rootUrl),
      encoding: 'utf8',
      input: `refs/heads/agent/audit-security-remediation ${head} refs/heads/agent/audit-security-remediation ${'0'.repeat(40)}\n`,
    }
  );
  assert.equal(rejected.status, 1);
  assert.match(rejected.stderr, /HEAD:agent\/skys-limit-convex-os/);

  const deletion = spawnSync(
    'node',
    [verifier, 'origin'],
    {
      cwd: fileURLToPath(rootUrl),
      encoding: 'utf8',
      input: `delete ${'0'.repeat(40)} refs/heads/main ${head}\n`,
    }
  );
  assert.equal(deletion.status, 1);
  assert.match(deletion.stderr, /attempts to delete/);

  const nonFastForward = spawnSync(
    'node',
    [verifier, 'origin'],
    {
      cwd: fileURLToPath(rootUrl),
      encoding: 'utf8',
      input: `HEAD ${head} refs/heads/agent/skys-limit-convex-os ${'f'.repeat(40)}\n`,
    }
  );
  assert.equal(nonFastForward.status, 1);
  assert.match(nonFastForward.stderr, /not a fast-forward/);

  const hook = readFileSync(new URL('.husky/pre-push', rootUrl), 'utf8');
  assert.match(hook, /verify-push-target\.mjs/);
  assert.match(hook, /lifecycle:verify -- --require-clean/);
  assert.match(hook, /verify_control_plane_state\.py/);
});

test('Graphify hooks bootstrap fresh worktrees and pre-push enforces freshness', () => {
  const checkoutHook = readFileSync(new URL('.husky/post-checkout', rootUrl), 'utf8');
  const commitHook = readFileSync(new URL('.husky/post-commit', rootUrl), 'utf8');
  const refresher = readFileSync(
    new URL('scripts/execution/refresh_graphify.py', rootUrl),
    'utf8'
  );
  const stateGate = readFileSync(
    new URL('scripts/execution/verify_control_plane_state.py', rootUrl),
    'utf8'
  );

  assert.doesNotMatch(checkoutHook, /Only run if graphify-out/);
  assert.match(checkoutHook, /refresh_graphify\.py/);
  assert.match(commitHook, /refresh_graphify\.py/);
  assert.match(checkoutHook, /Path\.home\(\)/);
  assert.match(commitHook, /Path\.home\(\)/);
  assert.doesNotMatch(checkoutHook, /r'\$_GRAPHIFY_LOG'/);
  assert.doesNotMatch(commitHook, /r'\$_GRAPHIFY_LOG'/);
  assert.match(refresher, /if graph_path\.is_file\(\):/);
  assert.match(refresher, /sync_graphify_control_plane\.py/);
  assert.match(stateGate, /Graphify output was not built at HEAD/);
  assert.match(stateGate, /SQLite has no Graphify import for this worktree at HEAD/);
  assert.match(stateGate, /execution_graph_imports/);
  assert.match(stateGate, /SQLite execution authority digest does not match the governed graph/);
  assert.match(stateGate, /checkpoint does not continue the execution cursor/);
  assert.match(stateGate, /requires exactly one exact-head handoff/);
  assert.match(stateGate, /execution_dependencies/);
  assert.match(stateGate, /source terminal stage/);
  assert.match(stateGate, /next sequential rank/);
  assert.match(stateGate, /handoff destination dependency is incomplete/);
  assert.match(stateGate, /checkpoint stage span is missing required edge/);
});

test('the lifecycle gate rejects merge commits instead of skipping their tree changes', () => {
  const verifier = readFileSync(
    new URL('scripts/verify-development-lifecycle.mjs', rootUrl),
    'utf8'
  );
  assert.match(verifier, /merge commits are not allowed in the governed integration range/);
  assert.doesNotMatch(verifier, /if \(parents\.length > 1\) continue/);
});
