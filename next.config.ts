import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
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
      { source: "/service-area", destination: "/public-sector", permanent: true },
    ];
  },
};

export default nextConfig;
