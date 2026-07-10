import type { MetadataRoute } from 'next';
import { ENV } from '../lib/env';

const site = ENV.SITE_URL.replace(/\/$/, '');

/**
 * App Router robots — prefer this over a stale public/robots.txt when Next serves it.
 * Keep AI crawlers allowed; block only non-public utility routes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/review'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/', '/llms.txt'],
        disallow: ['/admin', '/api/', '/review'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/llms.txt'],
        disallow: ['/admin', '/api/', '/review'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/', '/llms.txt'],
        disallow: ['/admin', '/api/', '/review'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/llms.txt'],
        disallow: ['/admin', '/api/', '/review'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/llms.txt'],
        disallow: ['/admin', '/api/', '/review'],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
