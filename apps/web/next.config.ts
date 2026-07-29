import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@masar/types'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
