-- Portal: authenticated users may SELECT only leads matching their JWT email.
-- Replaces placeholder policy "authenticated can select own leads (placeholder)"
-- which used (false) and returned zero rows for every signed-in client.

drop policy if exists "authenticated can select own leads (placeholder)" on public.leads;
drop policy if exists "authenticated can select own leads by email" on public.leads;

-- Match session email to lead.email (case-insensitive).
-- Service role continues to bypass RLS for server-side lead inserts (API).
create policy "authenticated can select own leads by email"
  on public.leads
  for select
  to authenticated
  using (
    email is not null
    and lower(trim(email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
  );

comment on policy "authenticated can select own leads by email" on public.leads is
  'Client portal: signed-in users read only estimate requests submitted with their OAuth/session email.';
