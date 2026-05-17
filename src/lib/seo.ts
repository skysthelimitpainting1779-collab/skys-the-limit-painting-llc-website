const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://skysthelimitpaintingllc.com').replace(/\/$/, '');

export const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'HousePainter',
  name: "Sky's the Limit Painting LLC",
  founder: 'Anthony Briseno',
  telephone: '+1-651-410-4196',
  email: 'skysthelimitpainting1779@gmail.com',
  url: siteUrl,
  logo: `${siteUrl}/brand/SkyLLP_BrandLogo.svg`,
  image: `${siteUrl}/brand/remotion/sky-premium-market-hero-v2.png`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Inver Grove Heights',
    addressRegion: 'MN',
    addressCountry: 'US',
  },
  areaServed: [
    {
      '@type': 'Place',
      name: 'Twin Cities Metro',
    },
    {
      '@type': 'AdministrativeArea',
      name: 'Minnesota',
    },
  ],
  knowsAbout: [
    'Residential painting',
    'Commercial painting',
    'Interior painting',
    'Exterior painting',
    'Facility repainting',
    'Pavement marking',
    'Parking-lot striping',
    'Road striping',
    'Guardrail painting',
    'Light pole painting',
  ],
};

export function serviceSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'HousePainter',
      name: "Sky's the Limit Painting LLC",
      telephone: '+1-651-410-4196',
      email: 'skysthelimitpainting1779@gmail.com',
    },
    areaServed: 'Minnesota',
    url: `${siteUrl}${path}`,
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

