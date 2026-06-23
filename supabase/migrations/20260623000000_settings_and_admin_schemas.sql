-- Construct settings, testimonials, portfolio, and service_areas tables with RLS

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    company_name TEXT NOT NULL DEFAULT 'Sky''s the Limit Painting LLC',
    phone TEXT NOT NULL DEFAULT '+1-651-410-4196',
    email TEXT NOT NULL DEFAULT 'skysthelimitpainting1779@gmail.com',
    logo_url TEXT,
    primary_color TEXT NOT NULL DEFAULT '#FF5A00',
    tagline TEXT NOT NULL DEFAULT 'Residential detail. Commercial discipline. Public-sector ready.',
    service_areas TEXT[] NOT NULL DEFAULT ARRAY['Inver Grove Heights', 'South St. Paul', 'St. Paul', 'Eagan', 'Woodbury', 'Minneapolis'],
    services TEXT[] NOT NULL DEFAULT ARRAY['Residential Painting', 'Commercial Painting', 'Interior Painting', 'Exterior Painting', 'Pavement Marking', 'Parking-Lot Striping'],
    meta_title_default TEXT NOT NULL DEFAULT 'Sky''s the Limit Painting LLC | Premium Painting & Striping',
    meta_desc_default TEXT NOT NULL DEFAULT 'Professional painting contractor serving the Twin Cities Metro. Quality prep, clean lines, and durable coatings.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert default row if not exists
INSERT INTO public.settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    quote TEXT NOT NULL,
    approved BOOLEAN DEFAULT false NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create portfolio table
CREATE TABLE IF NOT EXISTS public.portfolio (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    problem TEXT NOT NULL,
    prep TEXT[] NOT NULL DEFAULT '{}',
    result TEXT NOT NULL,
    image_url TEXT,
    before_image_url TEXT,
    after_image_url TEXT,
    project_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create service_areas table
CREATE TABLE IF NOT EXISTS public.service_areas (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    description TEXT NOT NULL,
    meta_title TEXT,
    meta_desc TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Seed initial default service areas
INSERT INTO public.service_areas (slug, city, description, meta_title, meta_desc)
VALUES 
('inver-grove-heights', 'Inver Grove Heights', 'Premium residential, commercial, and pavement marking painting services in Inver Grove Heights, MN.', 'Painting Contractor in Inver Grove Heights MN | Sky''s the Limit', 'Professional local painting services in Inver Grove Heights. Contact Anthony Briseno for your commercial or residential painting projects.'),
('st-paul', 'St. Paul', 'Reliable commercial painting, interior walls, and parking lot striping services across St. Paul, MN.', 'Commercial & Home Painting St. Paul MN | Sky''s the Limit', 'Looking for high-quality painting in St. Paul? We provide detail-oriented prep and painting for homes and facilities.'),
('eagan', 'Eagan', 'Professional local painting, cabinet spraying, and commercial facility upgrades in Eagan, MN.', 'Painting Company Eagan MN | Sky''s the Limit Painting LLC', 'Top-tier commercial, residential, and cabinet painting services in Eagan, MN. Request your free linear estimate.')
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_areas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to allow clean replay
DROP POLICY IF EXISTS "Public read settings" ON public.settings;
DROP POLICY IF EXISTS "Admin write settings" ON public.settings;
DROP POLICY IF EXISTS "Public read approved testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin read all testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin write testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Public read portfolio" ON public.portfolio;
DROP POLICY IF EXISTS "Admin write portfolio" ON public.portfolio;
DROP POLICY IF EXISTS "Public read service_areas" ON public.service_areas;
DROP POLICY IF EXISTS "Admin write service_areas" ON public.service_areas;

-- Create Settings policies
CREATE POLICY "Public read settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Admin write settings" ON public.settings TO authenticated USING (true) WITH CHECK (true);

-- Create Testimonials policies
CREATE POLICY "Public read approved testimonials" ON public.testimonials FOR SELECT USING (approved = true);
CREATE POLICY "Admin read all testimonials" ON public.testimonials FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin write testimonials" ON public.testimonials TO authenticated USING (true) WITH CHECK (true);

-- Create Portfolio policies
CREATE POLICY "Public read portfolio" ON public.portfolio FOR SELECT USING (true);
CREATE POLICY "Admin write portfolio" ON public.portfolio TO authenticated USING (true) WITH CHECK (true);

-- Create Service areas policies
CREATE POLICY "Public read service_areas" ON public.service_areas FOR SELECT USING (true);
CREATE POLICY "Admin write service_areas" ON public.service_areas TO authenticated USING (true) WITH CHECK (true);
