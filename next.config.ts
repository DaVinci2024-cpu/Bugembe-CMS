import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Content is admin-managed now, so image URLs can come from anywhere (no
  // upload/media library module yet) — allow any https host rather than
  // hardcoding a domain allowlist that would need a redeploy per new host.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  transpilePackages: ['motion'],
};

export default nextConfig;
