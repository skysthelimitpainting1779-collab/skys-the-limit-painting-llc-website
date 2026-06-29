-- Security & performance hardening based on Supabase advisor findings.
-- Idempotent: safe to replay.

-- 1. SECURITY: pin is_admin() search_path (advisor 0011 function_search_path_mutable).
--    All references inside the function are schema-qualified (public.profiles, auth.uid()),
--    so an empty search_path is safe and prevents search_path hijacking.
ALTER FUNCTION public.is_admin() SET search_path = '';

-- 2. PERFORMANCE: avoid per-row re-evaluation of auth.uid() in profiles RLS
--    (advisor auth_rls_initplan). Wrapping in a scalar subquery evaluates it once.
DROP POLICY IF EXISTS "profiles_self_access" ON public.profiles;
CREATE POLICY "profiles_self_access" ON public.profiles
  FOR SELECT
  USING ((SELECT auth.uid()) = id);

-- 3. PERFORMANCE: add covering indexes for foreign keys (advisor unindexed_foreign_keys).
CREATE INDEX IF NOT EXISTS idx_job_photos_job_id ON public.job_photos (job_id);
CREATE INDEX IF NOT EXISTS idx_jobs_customer_id ON public.jobs (customer_id);

-- 4. SECURITY: lock down the public `lead-photos` storage bucket (advisor 0025).
--    Uploads are issued server-side via service-role signed upload URLs
--    (src/app/api/storage/upload-url/route.ts), which bypass RLS, and a public
--    bucket serves objects over its public URL without a SELECT policy. The broad
--    anon INSERT/SELECT policies therefore allow anonymous arbitrary uploads and
--    full bucket listing with no application benefit. Remove them.
DROP POLICY IF EXISTS "Public Insert Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
