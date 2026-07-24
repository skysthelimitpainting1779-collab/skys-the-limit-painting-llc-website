/**
 * Portal data access — real Supabase reads scoped to the authenticated email.
 * RLS: authenticated SELECT only when lower(email) = lower(jwt email)
 * (see supabase/migrations/20260709210000_portal_leads_select_by_email.sql).
 */

import { createClient } from '../supabase/server';
import { mapLeadsForPortal, type PortalLead, type PortalUser } from './portal';

export type PortalDashboardData = {
  user: PortalUser;
  leads: PortalLead[];
  source: 'supabase' | 'empty' | 'error';
  message?: string;
};

/** Minimal query surface used by loadPortalDashboard (injectable for tests). */
export type PortalLeadsQueryClient = {
  from: (table: 'leads' | string) => {
    select: (columns: string) => {
      ilike: (column: string, pattern: string) => {
        order: (
          column: string,
          options: { ascending: boolean }
        ) => {
          limit: (count: number) => PromiseLike<{
            data: Array<Record<string, unknown>> | null;
            error: { message: string } | null;
          }>;
        };
      };
    };
  };
};

export const PORTAL_LEADS_SELECT =
  'lead_id, name, email, status, market, project_type, city, timeline, budget, created_at, notes';

/**
 * Execute the same query chain production uses (table, columns, email filter).
 * Exported so tests assert the real path without reimplementing filters.
 */
export async function queryLeadsForPortalEmail(
  client: PortalLeadsQueryClient,
  email: string
): Promise<{ data: Array<Record<string, unknown>> | null; error: { message: string } | null }> {
  return client
    .from('leads')
    .select(PORTAL_LEADS_SELECT)
    .ilike('email', email)
    .order('created_at', { ascending: false })
    .limit(50);
}

/**
 * Load client-facing resources for a portal user.
 * Defense in depth: client filters by email + RLS enforces JWT email match.
 */
export async function loadPortalDashboard(
  user: PortalUser,
  clientFactory: () => Promise<PortalLeadsQueryClient> = async () =>
    (await createClient()) as unknown as PortalLeadsQueryClient
): Promise<PortalDashboardData> {
  try {
    const client = await clientFactory();
    const { data, error } = await queryLeadsForPortalEmail(client, user.email);

    if (error) {
      console.warn('[portal] leads fetch failed:', error.message);
      return {
        user,
        leads: [],
        source: 'error',
        message: 'Could not load your requests right now. Try again shortly.',
      };
    }

    // Map still filters by email (client-side) in case of misconfigured RLS in older envs
    const leads = mapLeadsForPortal(data as Array<Record<string, unknown>>, user.email);
    return {
      user,
      leads,
      source: leads.length ? 'supabase' : 'empty',
      message:
        leads.length === 0
          ? 'No estimate requests found for this email yet. Submit one from /estimate.'
          : undefined,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[portal] dashboard load failed:', message);
    return {
      user,
      leads: [],
      source: 'error',
      message: 'Portal data unavailable (configuration or network).',
    };
  }
}

/**
 * Simulate PostgREST + RLS: only rows where email matches jwt email pass.
 * Used in tests to model the shipped SQL policy without a live database.
 */
export function applyLeadsSelectRls(
  rows: Array<Record<string, unknown>>,
  jwtEmail: string
): Array<Record<string, unknown>> {
  const jwt = String(jwtEmail || '')
    .trim()
    .toLowerCase();
  if (!jwt) return [];
  return rows.filter((r) => {
    const e = r.email;
    if (e == null) return false;
    return String(e).trim().toLowerCase() === jwt;
  });
}
