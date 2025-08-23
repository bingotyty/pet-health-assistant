// Cloudflare Pages 要求 Edge Runtime
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function handler(req) {
  console.log('API test called:', req.method, req.url);
  
  const response = {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    message: 'API路由工作正常'
  };
  
  // 允许所有方法用于测试
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}