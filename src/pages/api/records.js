import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 验证用户认证
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // 查询用户的记录
    const { data, error } = await supabase
      .from('feces_records')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
        
    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch records');
    }
    
    res.status(200).json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Fetch records failed:', error);
    res.status(500).json({ 
      error: 'Fetch failed',
      message: error.message 
    });
  }
}