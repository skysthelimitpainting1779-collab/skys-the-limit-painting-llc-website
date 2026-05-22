import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

const defaultImage = '/og-preview.svg';

function getSiteUrl() {
  const fallback = typeof window === 'undefined' ? 'https://www.skysthelimitpaintingllc.com' : window.location.origin;
  return (import.meta.env.VITE_SITE_URL || fallback).replace(/\/$/, '');
}

function upsertMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.href = href;
}

export default function PageMeta({ title, description, path, image = defaultImage, type = 'website', schema }: PageMetaProps) {
  useEffect(() => {
    const siteUrl = getSiteUrl();
    const pagePath = path || window.location.pathname;
    const canonicalUrl = `${siteUrl}${pagePath === '/' ? '' : pagePath}`;
    const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

    document.title = title;

    upsertMeta('meta[name="description"]', 'name', 'description', description);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', type);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl);
    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);
    upsertLink('canonical', canonicalUrl);

    const verification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION;
    if (verification) {
      upsertMeta('meta[name="google-site-verification"]', 'name', 'google-site-verification', verification);
    }

    const existingSchema = document.getElementById('page-schema');
    existingSchema?.remove();
    if (schema) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'page-schema';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      document.getElementById('page-schema')?.remove();
    };
  }, [description, image, path, schema, title, type]);

  return null;
}
