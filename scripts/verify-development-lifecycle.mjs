#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  findForbiddenPaths,
  parseLifecycleTrailers,
  validateEvidenceReceipt,
  validateGovernedCommit,
} from './lib/development-lifecycle.mjs';

const root = resolve(import.meta.dirname, '..');
const configPath = resolve(root, '.agents/governance/development-lifecycle.json');

function git(args) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  }).trim();
}

function gitBuffer(args) {
  return execFileSync('git', args, {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function sha256Bytes(value) {
  return createHash('sha256').update(value).digest('hex');
}

function readJson(path, errors) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    errors.push(`${path}: ${error.message}`);
    return null;
  }
}

function verifyCommitEvidence(commit, message, config, executionGraph, errors) {
  const values = parseLifecycleTrailers(message);
  const evidenceSha256 = values.get('Evidence-SHA256');
  if (!/^[a-f0-9]{64}$/.test(evidenceSha256 || '')) return;
  const directory = config.evidenceReceipts?.directory;
  if (!directory) {
    errors.push('evidenceReceipts.directory is required');
    return;
  }
  const receiptPath = `${directory.replace(/\/+$/, '')}/${evidenceSha256}.json`;
  let bytes;
  try {
    bytes = gitBuffer(['show', `${commit}:${receiptPath}`]);
  } catch {
    errors.push(`${commit}: missing committed evidence receipt ${receiptPath}`);
    return;
  }
  const digest = sha256Bytes(bytes);
  let receipt;
  try {
    receipt = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    errors.push(`${commit}: invalid evidence receipt JSON: ${error.message}`);
    return;
  }
  for (const detail of validateEvidenceReceipt({
    message,
    config,
    nodeIds: executionGraph.nodeIds,
    receipt,
    receiptSha256: digest,
  })) {
    errors.push(`${commit}: ${detail}`);
  }
}

function verifyCommits(config, executionGraph, errors, { head, requireClean }) {
  try {
    git(['cat-file', '-e', `${config.enforceAfter}^{commit}`]);
    git(['cat-file', '-e', `${head}^{commit}`]);
    git(['merge-base', '--is-ancestor', config.enforceAfter, head]);
  } catch {
    errors.push(`audited baseline ${config.enforceAfter} is not an ancestor of ${head}`);
    return { commitsChecked: 0, pathsChecked: 0 };
  }

  const commits = git(['rev-list', '--reverse', `${config.enforceAfter}..${head}`])
    .split(/\r?\n/)
    .filter(Boolean);
  let commitsChecked = 0;
  for (const commit of commits) {
    const parents = git(['show', '-s', '--format=%P', commit]).split(/\s+/).filter(Boolean);
    if (parents.length > 1) {
      errors.push(`${commit}: merge commits are not allowed in the governed integration range`);
      continue;
    }
    commitsChecked += 1;
    const message = git(['show', '-s', '--format=%B', commit]);
    for (const detail of validateGovernedCommit(message)) {
      errors.push(`${commit}: ${detail}`);
    }
    verifyCommitEvidence(commit, message, config, executionGraph, errors);
  }

  const tracked = git(['diff', '--name-only', config.enforceAfter, head, '--'])
    .split(/\r?\n/)
    .filter(Boolean);
  const localHead = git(['rev-parse', 'HEAD']);
  const untracked =
    head === localHead
      ? git(['ls-files', '--others', '--exclude-standard']).split(/\r?\n/).filter(Boolean)
      : [];
  const paths = [...new Set([...tracked, ...untracked])];
  for (const path of findForbiddenPaths(paths)) {
    errors.push(`${path}: runtime/generated state must not be committed`);
  }
  if (requireClean && git(['status', '--porcelain=v1', '--untracked-files=all'])) {
    errors.push('worktree must be clean for this lifecycle gate');
  }
  return { commitsChecked, pathsChecked: paths.length };
}

function verifyExecutionGraph(config, errors) {
  const document = config.executionGraph || {};
  const required = ['path', 'schemaPath', 'validationPath', 'manifestPath', 'sha256'];
  for (const field of required) {
    if (!document[field]) errors.push(`executionGraph.${field} is required`);
  }
  if (document.authoritative !== true) {
    errors.push('executionGraph.authoritative must be true');
  }
  if (errors.length) return null;

  const paths = Object.fromEntries(
    required
      .filter((field) => field.endsWith('Path') || field === 'path')
      .map((field) => [field, resolve(root, document[field])])
  );
  for (const [field, path] of Object.entries(paths)) {
    if (!existsSync(path)) errors.push(`executionGraph.${field} does not exist: ${path}`);
  }
  if (errors.length) return null;

  const digest = sha256(paths.path);
  if (digest !== document.sha256) {
    errors.push(`execution graph SHA-256 mismatch: expected ${document.sha256}, got ${digest}`);
  }
  const validation = readJson(paths.validationPath, errors);
  const manifest = readJson(paths.manifestPath, errors);
  const nodeIds = new Set();
  const sourceRecords = [];
  for (const [index, line] of readFileSync(paths.path, 'utf8').split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    try {
      const record = JSON.parse(line);
      if (record.recordType === 'node' && record.nodeId) nodeIds.add(record.nodeId);
      if (record.recordType === 'source') sourceRecords.push(record);
    } catch (error) {
      errors.push(`execution graph line ${index + 1} is invalid JSON: ${error.message}`);
    }
  }
  if (validation) {
    if (
      validation.ok !== true ||
      validation.parseErrorCount !== 0 ||
      validation.schemaErrorCount !== 0 ||
      validation.semanticErrorCount !== 0
    ) {
      errors.push('audited execution validation is not clean');
    }
    if (validation.sha256 !== digest) {
      errors.push('validation sidecar does not match the execution graph SHA-256');
    }
  }
  if (manifest?.audited?.sha256 !== digest || manifest?.audited?.validationOk !== true) {
    errors.push('audit manifest does not authorize the execution graph SHA-256');
  }
  const sourceBundle = manifest?.retainedSourceBundle;
  const sourceBundlePath = sourceBundle?.path ? resolve(root, sourceBundle.path) : null;
  if (!sourceBundlePath || !existsSync(sourceBundlePath)) {
    errors.push('retained audited source bundle is missing');
  } else {
    const sourceDigest = sha256(sourceBundlePath);
    if (sourceDigest !== sourceBundle.sha256) {
      errors.push('retained audited source bundle SHA-256 mismatch');
    }
    for (const source of sourceRecords) {
      if (
        source.sha256 !== sourceDigest ||
        !String(source.path || '').startsWith(`zip://${sourceBundle.path}!/`)
      ) {
        errors.push(`execution source ${source.recordId} is not bound to the retained bundle`);
      }
    }
  }
  return {
    sha256: digest,
    currentCursor: validation?.currentCursor || null,
    nodeIds,
  };
}

function argumentValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

export function verifyDevelopmentLifecycle(options = {}) {
  const errors = [];
  const config = readJson(configPath, errors);
  if (!config) return { ok: false, errors };
  if (config.version !== 1) errors.push('development lifecycle version must be 1');
  if (!config.programId) errors.push('programId is required');

  const executionGraph = verifyExecutionGraph(config, errors);
  const head =
    options.head ||
    argumentValue('--head') ||
    process.env.LIFECYCLE_HEAD_SHA ||
    'HEAD';
  const requireClean =
    options.requireClean === true || process.argv.includes('--require-clean');
  const gitState = executionGraph
    ? verifyCommits(config, executionGraph, errors, { head, requireClean })
    : { commitsChecked: 0, pathsChecked: 0 };
  return {
    ok: errors.length === 0,
    programId: config.programId,
    baseline: config.enforceAfter,
    head,
    ...gitState,
    executionGraph,
    errors,
  };
}

const result = verifyDevelopmentLifecycle();
if (process.argv.includes('--json') || !result.ok) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(
    `[Lifecycle] OK: ${result.programId}; ${result.commitsChecked} governed commit(s); ` +
      `graph ${result.executionGraph.sha256.slice(0, 12)}`
  );
}
if (!result.ok) process.exitCode = 1;
