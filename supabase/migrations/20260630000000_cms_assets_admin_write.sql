-- Allow admins to manage objects in the public `cms-assets` bucket.
-- Public read is granted in a separate migration. The admin console uploads
-- marketing photos/logos directly from the browser, and the row-level check
-- below restricts write access to authenticated users whose profile role is
-- `admin`. Anonymous writes remain disallowed.
--
-- Prerequisite: `public.profiles` with a `role` column is provisioned out of
-- band in this project, so the policy block is skipped on fresh resets until
-- that table exists.

DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    EXECUTE 'DROP POLICY IF EXISTS "cms_assets_admin_insert" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "cms_assets_admin_update" ON storage.objects';
    EXECUTE 'DROP POLICY IF EXISTS "cms_assets_admin_delete" ON storage.objects';

    EXECUTE $policy$
      CREATE POLICY "cms_assets_admin_insert" ON storage.objects
        FOR INSERT TO authenticated
        WITH CHECK (
          bucket_id = 'cms-assets'
          AND EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role = 'admin'
          )
        )
    $policy$;

    EXECUTE $policy$
      CREATE POLICY "cms_assets_admin_update" ON storage.objects
        FOR UPDATE TO authenticated
        USING (
          bucket_id = 'cms-assets'
          AND EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role = 'admin'
          )
        )
        WITH CHECK (
          bucket_id = 'cms-assets'
          AND EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role = 'admin'
          )
        )
    $policy$;

    EXECUTE $policy$
      CREATE POLICY "cms_assets_admin_delete" ON storage.objects
        FOR DELETE TO authenticated
        USING (
          bucket_id = 'cms-assets'
          AND EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role = 'admin'
          )
        )
    $policy$;
  END IF;
END $$;
