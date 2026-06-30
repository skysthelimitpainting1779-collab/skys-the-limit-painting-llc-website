-- Create the CMS asset bucket used by the admin editor.

INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-assets', 'cms-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "cms_assets_public_read" ON storage.objects;
CREATE POLICY "cms_assets_public_read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'cms-assets');
