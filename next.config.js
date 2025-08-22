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
  // Cloudflare Pages全栈应用配置 - 支持API路由
  // 使用标准构建模式，然后通过@cloudflare/next-on-pages适配器部署
  typescript: {
    ignoreBuildErrors: false,
  },
  // 修复workspace根目录警告
  outputFileTracingRoot: undefined,
}

export default nextConfig;