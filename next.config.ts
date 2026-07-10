import type { NextConfig } from 'next';

/**
 * Next.js 16 frontier config (Vercel plugin: knowledge-update + next-cache-components).
 * Platform routing headers/redirects/crons live in vercel.ts (@vercel/config).
 */
const nextConfig: NextConfig = {
  // Next.js 16 Cache Components / PPR (replaces experimental.ppr)
  cacheComponents: true,

  poweredByHeader: false,
  compress: true,

  typescript: {
    ignoreBuildErrors: false,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ouykfhoxlrkjgscdjjqg.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8055',
        pathname: '/assets/**',
      },
    ],
  },
};

export default nextConfig;
