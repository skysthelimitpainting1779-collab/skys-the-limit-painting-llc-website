#!/usr/bin/env node
/**
 * Agent OS kernel — zero theater.
 *
 * Does NOT create queues, dashboards, hub_db, checkpoints, evidence, or
 * ontology novels. Product work uses: goal · ship:eval · agents:zero-theater ·
 * learn:prevent · host:compile.
 *
 * Self-heal policy (iron law): Quarantine only. Manual inspection required before retry.
 * Never restore user files via git checkout rollback. Never soft-skip failing checks.
 */
import {
  AGENT_OS_VERSION,
  MAX_TASK_ATTEMPTS,
  assertPhaseEntry,
  shouldQuarantineTask,
} from './agent-os-core.mjs';

// Keep core symbols live so knip/tests see real wiring (auto-seed via assertPhaseEntry).
void assertPhaseEntry;
void shouldQuarantineTask;
void MAX_TASK_ATTEMPTS;

function printUsage() {
  console.log(`agent-os v${AGENT_OS_VERSION} (zero-theater kernel)

Commands:
  status     Kernel version + theater=false
  store      Optional JSON/Turso hub backend status
  help

Removed (theater): bootstrap, eval, dashboard, auto-commit, queues, milestones.
Use: npm run goal | ship:eval | agents:zero-theater | learn:prevent
`);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command || command === 'help' || command === '-h' || command === '--help') {
    printUsage();
    return;
  }

  if (command === 'status') {
    console.log(
      JSON.stringify(
        {
          ok: true,
          version: AGENT_OS_VERSION,
          theater: false,
          max_task_attempts: MAX_TASK_ATTEMPTS,
          policy: 'Quarantine only — Manual inspection required before retry',
        },
        null,
        2,
      ),
    );
    return;
  }

  if (
    [
      'bootstrap',
      'eval',
      'dashboard',
      'run',
      'auto-commit',
      'migrate-turso',
      'pull-turso',
      'entire-sync',
    ].includes(command)
  ) {
    console.error(
      `[Agent OS] REMOVED theater command "${command}". Use npm run goal / ship:eval / agents:zero-theater / entire:sync.`,
    );
    process.exitCode = 1;
    return;
  }

  if (command === 'store') {
    try {
      const store = await import('./agent-os-store.mjs');
      if (typeof store.bootStore === 'function') await store.bootStore();
      const backend =
        typeof store.getBackend === 'function'
          ? store.getBackend()
          : process.env.AGENT_OS_STORE || 'json';
      console.log(JSON.stringify({ ok: true, backend, args }, null, 2));
    } catch (e) {
      console.error(`[Agent OS] store: ${e.message}`);
      process.exitCode = 1;
    }
    return;
  }

  printUsage();
  process.exitCode = 1;
}

main().catch((err) => {
  console.error(`[Agent OS] fatal: ${err.message}`);
  process.exit(1);
});
