// ============================================
// next.config.js
// ============================================
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    return config;
  },
};

module.exports = nextConfig;
