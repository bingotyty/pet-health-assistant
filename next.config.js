/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true, // Required for static export
  },
  experimental: {
    esmExternals: true,
  },
  // Enable static export for Cloudflare Pages
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // Disable server-side features for static export
  typescript: {
    ignoreBuildErrors: false,
  },
}

export default nextConfig