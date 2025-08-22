export const runtime = 'edge';

export default function handler(req, res) {
  console.log('API test called:', req.method, req.url);
  
  const response = {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    message: 'API路由工作正常'
  };
  
  // 允许所有方法用于测试
  res.status(200).json(response);
}