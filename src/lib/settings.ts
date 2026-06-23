import { createClient } from './supabase/server';

export interface CompanySettings {
  company_name: string;
  phone: string;
  email: string;
  logo_url: string | null;
  primary_color: string;
  tagline: string;
  service_areas: string[];
  services: string[];
  meta_title_default: string;
  meta_desc_default: string;
}

export const DEFAULT_SETTINGS: CompanySettings = {
  company_name: "Sky's the Limit Painting LLC",
  phone: "+1-651-410-4196",
  email: "skysthelimitpainting1779@gmail.com",
  logo_url: null,
  primary_color: "#FF5A00",
  tagline: "Residential detail. Commercial discipline. Public-sector ready.",
  service_areas: ['Inver Grove Heights', 'South St. Paul', 'St. Paul', 'Eagan', 'Woodbury', 'Minneapolis'],
  services: ['Residential Painting', 'Commercial Painting', 'Interior Painting', 'Exterior Painting', 'Pavement Marking', 'Parking-Lot Striping'],
  meta_title_default: "Sky's the Limit Painting LLC | Premium Painting & Striping",
  meta_desc_default: "Professional painting contractor serving the Twin Cities Metro. Quality prep, clean lines, and durable coatings."
};

export async function getCompanySettings(): Promise<CompanySettings> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'default')
      .single();

    if (data && !error) {
      return {
        company_name: data.company_name,
        phone: data.phone,
        email: data.email,
        logo_url: data.logo_url,
        primary_color: data.primary_color,
        tagline: data.tagline,
        service_areas: data.service_areas || DEFAULT_SETTINGS.service_areas,
        services: data.services || DEFAULT_SETTINGS.services,
        meta_title_default: data.meta_title_default,
        meta_desc_default: data.meta_desc_default
      };
    }
  } catch (err) {
    console.warn('Error fetching settings from database. Using hardcoded defaults.', err);
  }

  return DEFAULT_SETTINGS;
}
