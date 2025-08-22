export const runtime = 'edge';

export default function handler(req) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const requiredVars = {
    'NEXT_PUBLIC_SUPABASE_URL': !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'SUPABASE_SERVICE_KEY': !!process.env.SUPABASE_SERVICE_KEY,
    'OPENAI_API_KEY': !!process.env.OPENAI_API_KEY,
    'QWEN_API_ENDPOINT': !!process.env.QWEN_API_ENDPOINT,
    'QWEN_API_KEY': !!process.env.QWEN_API_KEY
  };

  const missingVars = Object.entries(requiredVars)
    .filter(([key, exists]) => !exists)
    .map(([key]) => key);

  const isHealthy = missingVars.length === 0;

  return new Response(JSON.stringify({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    configStatus: {
      ...requiredVars,
      missingVariables: missingVars
    },
    message: isHealthy 
      ? '所有配置正常' 
      : `缺少以下环境变量: ${missingVars.join(', ')}`
  }), {
    status: isHealthy ? 200 : 503,
    headers: { 'Content-Type': 'application/json' }
  });
}