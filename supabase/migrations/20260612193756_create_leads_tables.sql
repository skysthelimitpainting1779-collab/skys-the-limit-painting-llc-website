-- Create leads table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.leads (
    id SERIAL PRIMARY KEY,
    lead_id CHARACTER VARYING UNIQUE NOT NULL,
    source CHARACTER VARYING,
    name CHARACTER VARYING NOT NULL,
    phone CHARACTER VARYING NOT NULL,
    email CHARACTER VARYING NOT NULL,
    city CHARACTER VARYING NOT NULL,
    project_address TEXT,
    market CHARACTER VARYING NOT NULL,
    project_type CHARACTER VARYING NOT NULL,
    property_type CHARACTER VARYING,
    timeline CHARACTER VARYING NOT NULL,
    budget CHARACTER VARYING,
    contact_method CHARACTER VARYING NOT NULL,
    notes TEXT,
    utm_source CHARACTER VARYING,
    utm_medium CHARACTER VARYING,
    utm_campaign CHARACTER VARYING,
    page CHARACTER VARYING,
    status CHARACTER VARYING DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create lead_events table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.lead_events (
    id SERIAL PRIMARY KEY,
    lead_id CHARACTER VARYING REFERENCES public.leads(lead_id) ON DELETE CASCADE,
    event_type CHARACTER VARYING NOT NULL,
    provider CHARACTER VARYING NOT NULL,
    status CHARACTER VARYING NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security (best practice)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_lead_id ON public.leads(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS idx_lead_events_lead_id ON public.lead_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_events_created_at ON public.lead_events(created_at);
