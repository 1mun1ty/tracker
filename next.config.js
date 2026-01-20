/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure proper output for Vercel
  output: 'standalone',
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
}

module.exports = nextConfig
