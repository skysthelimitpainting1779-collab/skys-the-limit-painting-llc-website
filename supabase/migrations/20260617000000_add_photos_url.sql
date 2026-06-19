-- Add photos_url to public.leads table if not already present
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS photos_url TEXT;

-- Create storage bucket for lead photos if not already present
INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-photos', 'lead-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist to prevent errors
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Access" ON storage.objects;

-- Create policies for public access on lead-photos bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'lead-photos');

CREATE POLICY "Public Insert Access"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'lead-photos');
