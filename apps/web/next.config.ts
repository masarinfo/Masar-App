import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@masar/types'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  env: {
    NEXT_PUBLIC_API_URL: 'https://masar-api-production-48fd.up.railway.app',
  },
};

export default nextConfig;
