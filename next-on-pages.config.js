/** @type {import('@cloudflare/next-on-pages').Config} */
const config = {
  // 确保API路由被正确处理
  generateStaticRoutes: true,
  
  // 跳过不兼容的中间件
  skipMiddleware: [],
  
  // 确保动态路由被正确处理
  experimental: {
    runtime: 'nodejs'
  }
};

export default config;