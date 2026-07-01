import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ouykfhoxlrkjgscdjjqg.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8055",
        pathname: "/assets/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "skysthelimitpaintingllc.com" }],
        destination: "https://www.skysthelimitpaintingllc.com/:path*",
        permanent: true,
      },
      { source: "/services", destination: "/residential", permanent: true },
      { source: "/services/interior", destination: "/residential", permanent: true },
      { source: "/services/exterior", destination: "/residential", permanent: true },
      { source: "/services/commercial", destination: "/commercial", permanent: true },
      { source: "/services/striping", destination: "/public-sector", permanent: true },
      { source: "/services/pavement-marking", destination: "/public-sector", permanent: true },
    ];
  },
};

export default nextConfig;
