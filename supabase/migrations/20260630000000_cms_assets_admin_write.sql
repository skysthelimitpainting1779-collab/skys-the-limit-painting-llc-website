-- Allow authenticated admins to manage objects in the public `cms-assets` bucket.
-- Public read is already granted via `cms_assets_public_read`. The admin console
-- (src/app/admin) uploads marketing photos/logos directly from the browser using
-- the authenticated user's session, so authenticated INSERT/UPDATE/DELETE are
-- scoped to this single bucket. Anonymous writes remain disallowed.

DROP POLICY IF EXISTS "cms_assets_admin_insert" ON storage.objects;
DROP POLICY IF EXISTS "cms_assets_admin_update" ON storage.objects;
DROP POLICY IF EXISTS "cms_assets_admin_delete" ON storage.objects;

CREATE POLICY "cms_assets_admin_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cms-assets');

CREATE POLICY "cms_assets_admin_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'cms-assets')
  WITH CHECK (bucket_id = 'cms-assets');

CREATE POLICY "cms_assets_admin_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'cms-assets');
