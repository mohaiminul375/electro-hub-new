import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co.com',  // Use the correct hostname
        port: '',
        pathname: '/**',  // Allow all paths under this domain
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',  // Use the correct hostname
        port: '',
        pathname: '/**',  // Allow all paths under this domain
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,  // This will ignore TypeScript errors during the build
  },
};

export default nextConfig;
