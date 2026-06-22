import fs from 'fs';
import path from 'path';

const SITE_URL = 'https://www.skysthelimitpaintingllc.com';

const staticRoutes = [
  '/',
  '/residential',
  '/commercial',
  '/public-sector',
  '/projects',
  '/about',
  '/contact',
  '/estimate',
  '/capabilities',
  '/service-area',
  '/refer',
];

const serviceAreasSlugs = [
  'inver-grove-heights',
  'south-st-paul',
  'st-paul',
  'eagan',
  'woodbury',
  'minneapolis',
  'twin-cities',
];

const paintingServicesSlugs = [
  'interior-painting',
  'exterior-painting',
  'commercial-painting',
  'cabinet-painting',
  'drywall-repair',
  'deck-fence-staining',
  'parking-lot-striping',
  'pavement-marking',
];

function generateSitemap() {
  console.log('Generating sitemap and robots.txt...');
  
  const today = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // 1. Static routes
  staticRoutes.forEach(route => {
    const priority = route === '/' ? '1.0' : '0.8';
    xml += '  <url>\n';
    xml += '    <loc>' + SITE_URL + route + '</loc>\n';
    xml += '    <lastmod>' + today + '</lastmod>\n';
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>' + priority + '</priority>\n';
    xml += '  </url>\n';
  });
  
  // 2. Service areas
  serviceAreasSlugs.forEach(slug => {
    xml += '  <url>\n';
    xml += '    <loc>' + SITE_URL + '/service-areas/' + slug + '</loc>\n';
    xml += '    <lastmod>' + today + '</lastmod>\n';
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n';
  });
  
  // 3. Painting services
  paintingServicesSlugs.forEach(slug => {
    xml += '  <url>\n';
    xml += '    <loc>' + SITE_URL + '/painting-services/' + slug + '</loc>\n';
    xml += '    <lastmod>' + today + '</lastmod>\n';
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n';
  });
  
  xml += '</urlset>\n';
  
  const workspaceRoot = path.resolve(process.cwd());
  const publicDir = path.normalize(path.resolve(workspaceRoot, 'public'));
  if (!publicDir.startsWith(workspaceRoot)) {
    throw new Error('Path traversal detected');
  }
  
  if (fs.existsSync(publicDir)) {
    // Write sitemap.xml to public
    const publicSitemapPath = path.normalize(path.join(publicDir, 'sitemap.xml'));
    if (!publicSitemapPath.startsWith(workspaceRoot)) {
      throw new Error('Path traversal detected');
    }
    fs.writeFileSync(publicSitemapPath, xml, 'utf8');
    console.log(`Sitemap written to: ${publicSitemapPath}`);

    // Generate robots.txt
    let robots = `User-agent: *\n`;
    robots += `Allow: /\n`;
    robots += `Disallow: /review\n`;
    robots += `Sitemap: ${SITE_URL}/sitemap.xml\n`;

    const publicRobotsPath = path.normalize(path.join(publicDir, 'robots.txt'));
    if (!publicRobotsPath.startsWith(workspaceRoot)) {
      throw new Error('Path traversal detected');
    }
    fs.writeFileSync(publicRobotsPath, robots, 'utf8');
    console.log(`Robots.txt written to: ${publicRobotsPath}`);
  }
  
  console.log('Sitemap and robots.txt generated successfully!');
}

generateSitemap();
