-- Migration: 0001_crm_views.sql
-- Creates updatable views in the payload schema that bridge to existing public CRM tables.
-- This allows Payload to read/write public.leads and public.crm_tasks via the 'payload' schema
-- without touching the public schema directly.
--
-- Postgres natively supports INSERT/UPDATE/DELETE on simple (non-aggregate, non-join) views.
-- The RLS policies on the underlying public tables still apply when accessed via these views
-- with a non-superuser connection, providing a hard security boundary.

-- Ensure payload schema exists (idempotent)
CREATE SCHEMA IF NOT EXISTS payload;

-- ─── leads view ──────────────────────────────────────────────────────────────
-- Mirrors all columns from public.leads so Payload's Drizzle schema aligns perfectly.
-- Payload will query this as payload.leads; writes pass through to public.leads.
CREATE OR REPLACE VIEW payload.leads AS
  SELECT
    id,
    lead_id,
    source,
    name,
    email,
    phone,
    city,
    project_address,
    market,
    project_type,
    property_type,
    timeline,
    budget,
    contact_method,
    notes,
    utm_source,
    utm_medium,
    utm_campaign,
    page,
    status,
    is_test,
    next_follow_up_at,
    value_estimate,
    assigned_to,
    photos_url,
    submitted_at,
    created_at,
    updated_at
  FROM public.leads;

-- Allow updates via the view (requires postgres 9.3+ simple view rules)
-- INSTEAD OF triggers are used for views that don't support auto-updatability.
-- public.leads is a simple table with no joins, so the view is auto-updatable.
-- No extra rules needed.

-- ─── crm_tasks view ─────────────────────────────────────────────────────────
-- Maps to public.crm_tasks. If this table does not yet exist, run
-- supabase/migrations/crm_tasks.sql first.
CREATE OR REPLACE VIEW payload.crm_tasks AS
  SELECT
    id,
    title,
    type,
    due_at       AS "dueAt",
    status,
    notes,
    lead_id,
    assigned_to  AS "assignedTo",
    created_at,
    updated_at
  FROM public.crm_tasks;

-- ─── lead_events view (read-only) ─────────────────────────────────────────
CREATE OR REPLACE VIEW payload.lead_events AS
  SELECT
    id,
    lead_id,
    event_type,
    provider,
    status,
    message,
    created_at
  FROM public.lead_events;

-- Grant select/insert/update/delete on views to the service role
-- Replace 'authenticated' with your actual Supabase service role username if different.
-- These grants are additive and safe to re-run.
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON payload.leads TO authenticated;
    GRANT SELECT, INSERT, UPDATE, DELETE ON payload.crm_tasks TO authenticated;
    GRANT SELECT ON payload.lead_events TO authenticated;
  END IF;
END $$;
