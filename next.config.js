/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure proper output for Vercel
  output: 'standalone',
  // Disable server-side file operations in production (use client-side only)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side: ignore fs module
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig