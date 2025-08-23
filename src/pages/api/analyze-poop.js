import { createClient } from '@supabase/supabase-js';
import { analyzePoopWithQwen, generateHealthReport, determineRiskLevel } from '../../lib/ai-service';

// 改为 Node.js runtime 以支持 Supabase
// export const runtime = 'edge';

// 显式声明支持的HTTP方法
export const dynamic = 'force-dynamic';

export default async function handler(req) {
  // 确保请求方法存在并且是POST
  const method = req.method || 'GET';
  console.log('API调用方法:', method, 'URL:', req.url);
  
  if (method !== 'POST') {
    return new Response(JSON.stringify({ 
      error: 'Method not allowed',
      method: method,
      allowedMethods: ['POST']
    }), {
      status: 405,
      headers: { 
        'Content-Type': 'application/json',
        'Allow': 'POST'
      }
    });
  }

  try {
    // 验证用户认证并创建带会话的Supabase客户端
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // 创建带有用户会话的Supabase客户端
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // 验证token并获取用户信息
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    // 处理 multipart/form-data (Edge Runtime 兼容)
    const formData = await req.formData();
    const imageFile = formData.get('image');
    
    if (!imageFile || !(imageFile instanceof File)) {
      return new Response(JSON.stringify({ error: 'No image file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const qwenResult = await analyzePoopWithQwen(imageFile);
    const riskLevel = determineRiskLevel(qwenResult);
    const description = formData.get('description') || '';
    const gptReport = await generateHealthReport(qwenResult, description, {});

    const fileExt = imageFile.name?.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `poop-images/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pet-images')
      .upload(filePath, imageFile, {
        contentType: imageFile.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error('Failed to upload image');
    }

    // 使用带认证会话的客户端插入记录，RLS策略会自动生效
    const { data, error } = await supabase
      .from('feces_records')
      .insert({
        image_url: uploadData.path,
        qwen_analysis: qwenResult,
        gpt_report: gptReport,
        risk_level: riskLevel,
        user_description: description || null,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to save record');
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        id: data.id,
        qwen_analysis: data.qwen_analysis,
        gpt_report: data.gpt_report,
        risk_level: data.risk_level,
        created_at: data.created_at
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Analysis failed:', error);
    
    // 检查是否是配置问题
    if (error.message.includes('missing') || error.message.includes('configuration')) {
      return new Response(JSON.stringify({ 
        error: 'Service temporarily unavailable',
        message: '服务暂时不可用，请联系管理员检查配置' 
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ 
        error: 'Analysis failed',
        message: error.message || '分析过程中发生错误，请稍后再试'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}