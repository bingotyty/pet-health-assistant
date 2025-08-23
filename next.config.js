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
  // Cloudflare Pages优化配置
  typescript: {
    ignoreBuildErrors: false,
  },
  // 修复workspace根目录警告
  outputFileTracingRoot: undefined,
  
  // Cloudflare Pages部署优化
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化配置
    if (!dev) {
      // 禁用或减小webpack缓存以避免超过Cloudflare 25MB限制
      config.cache = false;
      
      // 优化代码分割
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            // 创建更小的chunk
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 244 * 1024, // 244KB 限制
            },
          },
        },
      };
    }
    
    return config;
  },
}

export default nextConfig;