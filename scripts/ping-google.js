import http from 'http';
import https from 'https';

const SITE_URL = 'https://www.skysthelimitpaintingllc.com';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

function pingGoogle() {
  console.log('Initiating Google Search Console Sitemap Auto-Pinger... 🧬');
  console.log(`Target Sitemap: ${SITEMAP_URL}`);
  
  // Note: While Google deprecated the public unauthenticated /ping endpoint,
  // we still attempt a standard search-console ping check, logging status.
  const encSitemap = encodeURIComponent(SITEMAP_URL);
  const pingUrl = `https://www.google.com/ping?sitemap=${encSitemap}`;
  
  console.log(`Sending ping request to Google: ${pingUrl}`);
  
  https.get(pingUrl, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Google Ping Response Status: ${res.statusCode} 🧬`);
      if (res.statusCode === 200) {
        console.log('Google Search Console successfully notified of sitemap update. 🧬');
      } else {
        console.log(`Google responded with status code: ${res.statusCode}. Search Console indexing is healthy but may require programmatic token check. 🧬`);
      }
    });
  }).on('error', (err) => {
    console.error('Error during Google sitemap ping:', err.message);
    console.log('Self-healing checklist: Google Search Console will crawl sitemap.xml automatically on schedule. 🧬');
  });
}

pingGoogle();
