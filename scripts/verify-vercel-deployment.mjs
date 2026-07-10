#!/usr/bin/env node
/**
 * Wait for a READY Vercel deployment for the current git SHA, then health-check URL.
 *
 * Usage:
 *   node scripts/verify-vercel-deployment.mjs
 *   node scripts/verify-vercel-deployment.mjs --sha <sha> --timeout 600
 *
 * Env:
 *   VERCEL_TOKEN (required)
 *   VERCEL_PROJECT_ID (default from release workflow)
 *   VERCEL_ORG_ID / VERCEL_TEAM_ID (optional)
 *   GITHUB_SHA or git rev-parse HEAD
 */

import { execFileSync } from 'node:child_process';

const DEFAULT_PROJECT = 'prj_L3ZMoQ79YLx9G2o6Lg9OubqO9H8m';
const DEFAULT_TEAM = 'team_bseTA2AuCO6A2fCOVY9ubrJo';

function parseArgs(argv) {
  const out = { timeout: 720, sha: '', interval: 15 };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--sha') out.sha = argv[++i] || '';
    else if (argv[i] === '--timeout') out.timeout = Number(argv[++i]) || 720;
    else if (argv[i] === '--interval') out.interval = Number(argv[++i]) || 15;
  }
  return out;
}

function gitSha() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf8',
      windowsHide: true,
    }).trim();
  } catch {
    return '';
  }
}

async function vercelFetch(path, token, teamId) {
  const url = new URL(`https://api.vercel.com${path}`);
  if (teamId) url.searchParams.set('teamId', teamId);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text };
  }
  if (!res.ok) {
    const msg = body?.error?.message || body?.message || text.slice(0, 300);
    throw new Error(`Vercel API ${res.status}: ${msg}`);
  }
  return body;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function findDeployment(token, projectId, teamId, sha) {
  // Prefer meta githubCommitSha match
  const qs = new URLSearchParams({
    projectId,
    limit: '20',
  });
  if (teamId) qs.set('teamId', teamId);
  const data = await vercelFetch(`/v6/deployments?${qs}`, token, null);
  const list = data.deployments || data || [];
  const short = sha.slice(0, 7);
  const match = list.find((d) => {
    const meta = d.meta || {};
    const commit =
      meta.githubCommitSha ||
      meta.gitlabCommitSha ||
      meta.bitbucketCommitSha ||
      '';
    return (
      commit === sha ||
      commit.startsWith(short) ||
      (d.url && String(d.name || '').includes(short))
    );
  });
  return match || null;
}

async function getDeployment(token, idOrUrl, teamId) {
  const id = String(idOrUrl).replace(/^https?:\/\//, '').split('/')[0];
  // If it's a deployment id (dpl_...) use v13
  if (String(idOrUrl).startsWith('dpl_') || String(idOrUrl).match(/^[A-Za-z0-9]{8,}$/)) {
    return vercelFetch(`/v13/deployments/${encodeURIComponent(idOrUrl)}`, token, teamId);
  }
  return vercelFetch(`/v13/deployments/${encodeURIComponent(id)}`, token, teamId);
}

async function healthCheck(url) {
  const targets = [
    url.replace(/\/$/, ''),
    `${url.replace(/\/$/, '')}/`,
  ];
  for (const t of targets) {
    try {
      const res = await fetch(t, {
        method: 'GET',
        redirect: 'follow',
        headers: { 'User-Agent': 'skysthelimit-ci-vercel-verify' },
      });
      if (res.status > 0 && res.status < 500) {
        return { ok: true, status: res.status, url: t };
      }
    } catch (err) {
      return { ok: false, error: err.message, url: t };
    }
  }
  return { ok: false, error: 'no successful response', url };
}

export async function verifyVercelDeployment(options = {}) {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    return {
      ok: false,
      skipped: false,
      error: 'VERCEL_TOKEN not set — cannot verify deployment',
    };
  }

  const projectId = process.env.VERCEL_PROJECT_ID || DEFAULT_PROJECT;
  const teamId = process.env.VERCEL_ORG_ID || process.env.VERCEL_TEAM_ID || DEFAULT_TEAM;
  const sha = options.sha || gitSha();
  if (!sha) {
    return { ok: false, error: 'No commit SHA (GITHUB_SHA / git)' };
  }

  const timeoutMs = (options.timeout || 720) * 1000;
  const intervalMs = (options.interval || 15) * 1000;
  const start = Date.now();

  console.log(`[vercel-verify] project=${projectId} sha=${sha.slice(0, 12)}… timeout=${options.timeout || 720}s`);

  let lastState = 'waiting';
  let deployment = null;

  while (Date.now() - start < timeoutMs) {
    try {
      deployment = await findDeployment(token, projectId, teamId, sha);
      if (deployment) {
        const id = deployment.uid || deployment.id;
        const detail = id ? await getDeployment(token, id, teamId) : deployment;
        const state =
          detail.readyState ||
          detail.status ||
          deployment.readyState ||
          deployment.state ||
          'UNKNOWN';
        lastState = state;
        const url =
          (detail.url && `https://${detail.url}`) ||
          (deployment.url && `https://${deployment.url}`) ||
          detail.alias?.[0] ||
          null;

        console.log(`[vercel-verify] found deployment state=${state} url=${url || 'n/a'}`);

        if (state === 'READY' || state === 'ready') {
          if (!url) {
            return {
              ok: false,
              error: 'Deployment READY but no URL',
              state,
              sha,
              deploymentId: id,
            };
          }
          const health = await healthCheck(url);
          if (!health.ok) {
            return {
              ok: false,
              error: `Health check failed: ${health.error || health.status}`,
              state,
              url,
              sha,
              deploymentId: id,
            };
          }
          return {
            ok: true,
            state: 'READY',
            url: health.url || url,
            httpStatus: health.status,
            sha,
            deploymentId: id,
            inspectorUrl: detail.inspectorUrl || null,
          };
        }

        if (state === 'ERROR' || state === 'CANCELED' || state === 'FAILED') {
          return {
            ok: false,
            error: `Deployment ${state}`,
            state,
            url,
            sha,
            deploymentId: id,
          };
        }
      } else {
        console.log('[vercel-verify] no deployment yet for this SHA…');
      }
    } catch (err) {
      console.warn(`[vercel-verify] poll error: ${err.message}`);
      lastState = `error: ${err.message}`;
    }
    await sleep(intervalMs);
  }

  return {
    ok: false,
    error: `Timed out after ${options.timeout || 720}s (last=${lastState})`,
    state: lastState,
    sha,
  };
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const result = await verifyVercelDeployment(opts);
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

if (process.argv[1] && process.argv[1].includes('verify-vercel-deployment')) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
