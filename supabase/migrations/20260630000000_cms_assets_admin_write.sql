-- Allow admins to manage objects in the public `cms-assets` bucket.
-- Public read is already granted via `cms_assets_public_read`. The admin console
-- uploads marketing photos/logos directly from the browser, and the row-level
-- check below restricts write access to authenticated users whose profile role is
-- `admin`. Anonymous writes remain disallowed.

DROP POLICY IF EXISTS "cms_assets_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "cms_assets_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "cms_assets_admin_delete" ON storage.objects;

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
  );

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
  );

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
  );
