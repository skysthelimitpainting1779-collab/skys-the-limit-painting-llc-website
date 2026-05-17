import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const siteUrl = (process.env.VITE_SITE_URL || 'https://skysthelimitpaintingllc.com').replace(/\/$/, '');
const defaultImage = '/brand/remotion/sky-premium-market-hero-v2.png';

const businessSchema = {
  '@context': 'https://schema.org',
  '@type': 'HousePainter',
  name: "Sky's the Limit Painting LLC",
  founder: 'Anthony Briseno',
  telephone: '+1-651-410-4196',
  email: 'skysthelimitpainting1779@gmail.com',
  url: siteUrl,
  logo: `${siteUrl}/brand/SkyLLP_BrandLogo.svg`,
  image: `${siteUrl}${defaultImage}`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Inver Grove Heights',
    addressRegion: 'MN',
    addressCountry: 'US',
  },
  areaServed: [
    { '@type': 'Place', name: 'Twin Cities Metro' },
    { '@type': 'AdministrativeArea', name: 'Minnesota' },
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

function breadcrumbSchema(items) {
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

function serviceSchema(name, description, pagePath) {
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
    url: `${siteUrl}${pagePath}`,
  };
}

const routes = [
  {
    path: '/',
    title: "Sky's the Limit Painting LLC | Minnesota Painting Contractor",
    description:
      'Sky’s the Limit Painting LLC is an insured, owner-operated Minnesota painting contractor built for residential painting, commercial work, and public-sector opportunities.',
    schema: businessSchema,
  },
  {
    path: '/residential',
    title: 'Residential Painting | Sky’s the Limit Painting LLC',
    description:
      'Residential painting in Inver Grove Heights and the Twin Cities Metro with clean prep, careful protection, owner accountability, and sharp finish work.',
    schema: [
      serviceSchema('Residential Painting', 'Residential painting in Inver Grove Heights and the Twin Cities Metro with clean prep, careful protection, owner accountability, and sharp finish work.', '/residential'),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Residential', path: '/residential' }]),
    ],
  },
  {
    path: '/commercial',
    title: 'Commercial Painting | Sky’s the Limit Painting LLC',
    description:
      'Commercial painting for Twin Cities shops, offices, facilities, and properties with organized communication, clean execution, and durable finishes.',
    schema: [
      serviceSchema('Commercial Painting', 'Commercial painting for Twin Cities shops, offices, facilities, and properties with organized communication, clean execution, and durable finishes.', '/commercial'),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Commercial', path: '/commercial' }]),
    ],
  },
  {
    path: '/public-sector',
    title: 'Public Sector Painting Opportunities | Sky’s the Limit Painting LLC',
    description:
      'Sky’s the Limit Painting is preparing to compete for Minnesota city, county, and state painting, facility, striping, and pavement-marking opportunities.',
    schema: [
      serviceSchema('Public Sector Opportunities', 'Sky’s the Limit Painting is preparing to compete for Minnesota city, county, and state painting, facility, striping, and pavement-marking opportunities.', '/public-sector'),
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Public Sector', path: '/public-sector' }]),
    ],
  },
  {
    path: '/projects',
    title: "Painting Projects in the Twin Cities | Sky's the Limit",
    description:
      'Real project proof from Sky’s the Limit Painting LLC, including residential painting, commercial repainting, and striping references in the Twin Cities area.',
    schema: breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Projects', path: '/projects' }]),
  },
  {
    path: '/about',
    title: "About Anthony | Sky's the Limit Painting LLC",
    description:
      'Meet Anthony Briseno, the owner behind Sky’s the Limit Painting LLC and its trade-built approach to Minnesota residential, commercial, and public-sector painting opportunities.',
    schema: breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }]),
  },
  {
    path: '/contact',
    title: "Contact Sky's the Limit Painting LLC | Get an Estimate",
    description:
      'Request an estimate from Sky’s the Limit Painting LLC for residential painting, commercial repainting, facility work, or public-sector opportunities in Minnesota.',
    schema: breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }]),
  },
  {
    path: '/404',
    title: "Page Not Found | Sky's the Limit Painting LLC",
    description:
      'The requested Sky’s the Limit Painting LLC page was not found. Start from the homepage, projects, markets, or contact page.',
  },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function canonicalFor(routePath) {
  return routePath === '/' ? siteUrl : `${siteUrl}${routePath}`;
}

function injectHead(template, route) {
  const canonical = canonicalFor(route.path);
  const image = `${siteUrl}${defaultImage}`;
  const schema = route.schema
    ? `\n    <script type="application/ld+json" id="page-schema">${JSON.stringify(route.schema)}</script>`
    : '';

  const fallbackContent = `<main><h1>${escapeHtml(route.title)}</h1><p>${escapeHtml(route.description)}</p></main>`;

  return template
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(route.title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${escapeHtml(route.description)}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/s, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${escapeHtml(route.title)}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/s, `<meta property="og:description" content="${escapeHtml(route.description)}" />`)
    .replace(/<meta property="og:image" content=".*?" \/>/s, `<meta property="og:image" content="${image}" />`)
    .replace(
      '<meta name="twitter:card" content="summary_large_image" />',
      `<meta property="og:type" content="website" />\n    <meta property="og:url" content="${canonical}" />\n    <meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:title" content="${escapeHtml(route.title)}" />\n    <meta name="twitter:description" content="${escapeHtml(route.description)}" />\n    <meta name="twitter:image" content="${image}" />${schema}`,
    )
    .replace('<div id="root"></div>', `<div id="root">${fallbackContent}</div>`);
}

const distDir = path.resolve('dist');
const template = await readFile(path.join(distDir, 'index.html'), 'utf8');

for (const route of routes) {
  const html = injectHead(template, route);
  const filePath =
    route.path === '/'
      ? path.join(distDir, 'index.html')
      : route.path === '/404'
        ? path.join(distDir, '404.html')
        : path.join(distDir, route.path.slice(1), 'index.html');

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, html);
}
