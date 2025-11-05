import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Temporarily ignore ESLint during production build so we can iterate on TypeScript fixes.
  // We'll re-enable linting and fix issues in dedicated PRs.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
