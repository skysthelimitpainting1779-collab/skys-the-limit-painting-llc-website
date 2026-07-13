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
    // Vercel Hobby plan: 1,000 source image transformations/month
    // Use only the breakpoints actually consumed by the UI to conserve quota
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000, // 30 days — maximize CDN hits, minimize re-transforms
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
