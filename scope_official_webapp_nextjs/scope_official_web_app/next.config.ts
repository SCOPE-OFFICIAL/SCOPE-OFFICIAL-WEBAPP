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
  // For monorepos we previously set `outputFileTracingRoot` to the workspace
  // root so Next could collect files used by server functions. However, when
  // deploying to Vercel this can cause the runtime to look for `.next` in a
  // parent folder (duplicated /vercel/path0 paths) and fail with ENOENT.
  //
  // To support both local/Netlify monorepo builds and Vercel deployments we
  // only set `outputFileTracingRoot` when not running on Vercel.
  ...(process.env.VERCEL ? {} : { outputFileTracingRoot: path.resolve(__dirname, '../../') }),
  // Temporarily ignore ESLint during production build so we can iterate on TypeScript fixes.
  // We'll re-enable linting and fix issues in dedicated PRs.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
