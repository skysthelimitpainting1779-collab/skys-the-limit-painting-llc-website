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
  
  // Ensure dist directory exists
  const workspaceRoot = path.resolve(process.cwd());
  const distDir = path.normalize(path.resolve(workspaceRoot, 'dist'));
  if (!distDir.startsWith(workspaceRoot)) {
    throw new Error('Path traversal detected');
  }
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Write sitemap.xml to dist
  const sitemapPath = path.normalize(path.join(distDir, 'sitemap.xml'));
  if (!sitemapPath.startsWith(workspaceRoot)) {
    throw new Error('Path traversal detected');
  }
  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`Sitemap written to: ${sitemapPath}`);
  
  // Write sitemap.xml to public so it is copied in other processes
  const publicDir = path.normalize(path.resolve(workspaceRoot, 'public'));
  if (!publicDir.startsWith(workspaceRoot)) {
    throw new Error('Path traversal detected');
  }
  if (fs.existsSync(publicDir)) {
    const publicSitemapPath = path.normalize(path.join(publicDir, 'sitemap.xml'));
    if (!publicSitemapPath.startsWith(workspaceRoot)) {
      throw new Error('Path traversal detected');
    }
    fs.writeFileSync(publicSitemapPath, xml, 'utf8');
    console.log(`Sitemap written to: ${publicSitemapPath}`);
  }
  
  // Generate robots.txt
  let robots = `User-agent: *\n`;
  robots += `Allow: /\n`;
  robots += `Disallow: /review\n`;
  robots += `Sitemap: ${SITE_URL}/sitemap.xml\n`;
  
  const robotsPath = path.normalize(path.join(distDir, 'robots.txt'));
  if (!robotsPath.startsWith(workspaceRoot)) {
    throw new Error('Path traversal detected');
  }
  fs.writeFileSync(robotsPath, robots, 'utf8');
  console.log(`Robots.txt written to: ${robotsPath}`);
  
  if (fs.existsSync(publicDir)) {
    const publicRobotsPath = path.normalize(path.join(publicDir, 'robots.txt'));
    if (!publicRobotsPath.startsWith(workspaceRoot)) {
      throw new Error('Path traversal detected');
    }
    fs.writeFileSync(publicRobotsPath, robots, 'utf8');
    console.log(`Robots.txt written to: ${publicRobotsPath}`);
  }

  // Copy sitemap.xsl to dist so it is available in build output
  if (fs.existsSync(publicDir)) {
    const publicXslPath = path.normalize(path.join(publicDir, 'sitemap.xsl'));
    const distXslPath = path.normalize(path.join(distDir, 'sitemap.xsl'));
    if (fs.existsSync(publicXslPath)) {
      if (!publicXslPath.startsWith(workspaceRoot) || !distXslPath.startsWith(workspaceRoot)) {
        throw new Error('Path traversal detected');
      }
      fs.copyFileSync(publicXslPath, distXslPath);
      console.log(`Sitemap stylesheet copied to: ${distXslPath}`);
    }
  }
  
  console.log('Sitemap and robots.txt generated successfully!');
}

generateSitemap();
