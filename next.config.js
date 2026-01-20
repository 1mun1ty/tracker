/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Turbopack config (Next.js 16+)
  turbopack: {},
  // Images from Clerk and other sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: '*.clerk.com',
      },
    ],
  },
  // Transpile data files
  transpilePackages: [],
  // Webpack config to handle JSON imports
  webpack: (config) => {
    config.resolve.alias['@/data'] = require('path').join(__dirname, 'data');
    return config;
  },
}

module.exports = nextConfig
