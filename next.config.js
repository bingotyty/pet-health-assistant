/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    // 根据环境动态设置
    unoptimized: process.env.NODE_ENV === 'production',
  },
  experimental: {
    esmExternals: true,
  },
  // 仅在生产环境启用静态导出
  ...(process.env.DEPLOY_TARGET === 'cloudflare' && {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
  }),
  typescript: {
    ignoreBuildErrors: false,
  },
  // 修复workspace根目录警告
  outputFileTracingRoot: undefined,
}

export default nextConfig;