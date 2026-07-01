-- RLS policies for leads (public insert from contact/estimate forms + internal read by service)
-- Follows supabase-postgres-best-practices + security checklist in .agents/skills/supabase/SKILL.md

-- anon: public can submit leads (insert only)
create policy "anon can insert leads"
  on public.leads
  for insert
  to anon
  with check (true);

-- authenticated: optional future owner reads (extend as needed)
create policy "authenticated can select own leads (placeholder)"
  on public.leads
  for select
  to authenticated
  using (false); -- tighten later with user_id or email match when auth added

-- service_role (backend): full access for API routes using service key (never expose)
-- No policy needed; service_role bypasses RLS by default when using service key client.

-- lead_events: anon insert for tracking, service full
create policy "anon can insert lead_events"
  on public.lead_events
  for insert
  to anon
  with check (true);

create policy "service can manage lead_events"
  on public.lead_events
  for all
  to service_role
  using (true)
  with check (true);

-- Recommended: run after push
-- supabase db advisors
-- supabase migration list --local
