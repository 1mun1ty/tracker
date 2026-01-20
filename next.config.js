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
  // Include data folder in serverless functions
  outputFileTracingIncludes: {
    '/api/**/*': ['./data/**/*'],
    '/app': ['./data/**/*'],
  },
}

module.exports = nextConfig
