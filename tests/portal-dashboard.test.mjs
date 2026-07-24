/**
 * loadPortalDashboard + RLS policy path — drives shipped portal-data module.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const portalData = await import(
  pathToFileURL(join(ROOT, 'src/lib/auth/portal-data.ts')).href
);

const {
  loadPortalDashboard,
  queryLeadsForPortalEmail,
  applyLeadsSelectRls,
  PORTAL_LEADS_SELECT,
} = portalData;

const MIGRATION = join(
  ROOT,
  'supabase/migrations/20260709210000_portal_leads_select_by_email.sql'
);

/** Mock that records the query and applies RLS-like filtering (policy semantics). */
function createRlsAwareMock(allRows, jwtEmail) {
  const calls = { table: null, select: null, ilikeCol: null, ilikeVal: null, order: null, limit: null };
  return {
    calls,
    client: {
      from(table) {
        calls.table = table;
        return {
          select(columns) {
            calls.select = columns;
            return {
              ilike(column, pattern) {
                calls.ilikeCol = column;
                calls.ilikeVal = pattern;
                return {
                  order(column, options) {
                    calls.order = { column, options };
                    return {
                      async limit(count) {
                        calls.limit = count;
                        // Simulate RLS: only jwt email rows visible, then ilike
                        const afterRls = applyLeadsSelectRls(allRows, jwtEmail);
                        const want = String(pattern).toLowerCase();
                        const data = afterRls.filter(
                          (r) => String(r.email || '').toLowerCase() === want
                        );
                        return { data, error: null };
                      },
                    };
                  },
                };
              },
            };
          },
        };
      },
    },
  };
}

test('migration replaces using(false) with jwt email match', () => {
  const sql = readFileSync(MIGRATION, 'utf8');
  assert.match(sql, /drop policy if exists "authenticated can select own leads \(placeholder\)"/i);
  assert.match(sql, /authenticated can select own leads by email/);
  assert.match(sql, /auth\.jwt\(\)\s*->>\s*'email'/);
  assert.match(sql, /lower\(trim\(email\)\)\s*=\s*lower\(trim\(/);
  assert.doesNotMatch(sql, /using\s*\(\s*false\s*\)/i);
});

test('queryLeadsForPortalEmail hits leads with email ilike + select list', async () => {
  const { client, calls } = createRlsAwareMock([], 'a@b.com');
  await queryLeadsForPortalEmail(client, 'a@b.com');
  assert.equal(calls.table, 'leads');
  assert.equal(calls.select, PORTAL_LEADS_SELECT);
  assert.equal(calls.ilikeCol, 'email');
  assert.equal(calls.ilikeVal, 'a@b.com');
  assert.equal(calls.order.column, 'created_at');
  assert.equal(calls.limit, 50);
});

test('loadPortalDashboard returns only RLS-visible rows for session email', async () => {
  const rows = [
    { lead_id: 'L-mine', email: 'client@example.com', status: 'new', name: 'Me', project_type: 'Interior' },
    { lead_id: 'L-other', email: 'other@example.com', status: 'won', name: 'Them', project_type: 'Exterior' },
  ];
  const jwtEmail = 'client@example.com';
  const { client, calls } = createRlsAwareMock(rows, jwtEmail);

  const result = await loadPortalDashboard(
    { id: 'user-1', email: jwtEmail },
    async () => client
  );

  assert.equal(calls.table, 'leads');
  assert.equal(calls.ilikeCol, 'email');
  assert.equal(result.source, 'supabase');
  assert.equal(result.leads.length, 1);
  assert.equal(result.leads[0].lead_id, 'L-mine');
  assert.ok(!result.leads.some((l) => l.lead_id === 'L-other'));
});

test('loadPortalDashboard empty when RLS hides all (wrong email / using false simulation)', async () => {
  const rows = [
    { lead_id: 'L1', email: 'client@example.com', status: 'new', name: 'Me' },
  ];
  // jwt email empty ⇒ applyLeadsSelectRls returns [] (models broken/placeholder policy)
  const { client } = createRlsAwareMock(rows, '');

  const result = await loadPortalDashboard(
    { id: 'user-1', email: 'client@example.com' },
    async () => client
  );

  assert.equal(result.leads.length, 0);
  assert.equal(result.source, 'empty');
});

test('loadPortalDashboard surfaces query errors without leaking other data', async () => {
  const client = {
    from() {
      return {
        select() {
          return {
            ilike() {
              return {
                order() {
                  return {
                    async limit() {
                      return { data: null, error: { message: 'permission denied for table leads' } };
                    },
                  };
                },
              };
            },
          };
        },
      };
    },
  };

  const result = await loadPortalDashboard(
    { id: 'u', email: 'a@b.com' },
    async () => client
  );
  assert.equal(result.source, 'error');
  assert.equal(result.leads.length, 0);
  assert.match(result.message || '', /Could not load/i);
});

test('applyLeadsSelectRls matches SQL policy semantics (case-insensitive email)', () => {
  const rows = [
    { lead_id: '1', email: 'Alex@Co.COM' },
    { lead_id: '2', email: null },
    { lead_id: '3', email: 'other@co.com' },
  ];
  const out = applyLeadsSelectRls(rows, 'alex@co.com');
  assert.equal(out.length, 1);
  assert.equal(out[0].lead_id, '1');
});
