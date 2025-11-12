import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Ensure Next uses the correct root for output file tracing in monorepos
  // This prevents Next inferring a different workspace root (and the
  // associated warning) when multiple lockfiles exist in the repo. On
  // Netlify this helps Next collect files correctly for server functions.
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  // Temporarily ignore ESLint during production build so we can iterate on TypeScript fixes.
  // We'll re-enable linting and fix issues in dedicated PRs.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
