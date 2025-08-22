import { createClient } from '@supabase/supabase-js';
import { analyzePoopWithQwen, generateHealthReport, determineRiskLevel } from '../../lib/ai-service';
import { IncomingForm } from 'formidable';
import { readFileSync } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 验证用户认证并创建带会话的Supabase客户端
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
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
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    const form = new IncomingForm();
    const [fields, files] = await form.parse(req);
    
    const imageFile = files.image?.[0];
    if (!imageFile) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // 读取文件内容转换为File对象
    const fileBuffer = readFileSync(imageFile.filepath);
    const file = new File([fileBuffer], imageFile.originalFilename || 'image.jpg', {
      type: imageFile.mimetype
    });

    const qwenResult = await analyzePoopWithQwen(file);
    const riskLevel = determineRiskLevel(qwenResult);
    const gptReport = await generateHealthReport(qwenResult, fields.description?.[0] || '', {});

    const fileExt = imageFile.originalFilename?.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `poop-images/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pet-images')
      .upload(filePath, fileBuffer, {
        contentType: imageFile.mimetype,
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
        user_description: fields.description?.[0] || null,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to save record');
    }

    res.status(200).json({
      success: true,
      data: {
        id: data.id,
        qwen_analysis: data.qwen_analysis,
        gpt_report: data.gpt_report,
        risk_level: data.risk_level,
        created_at: data.created_at
      }
    });

  } catch (error) {
    console.error('Analysis failed:', error);
    
    // 检查是否是配置问题
    if (error.message.includes('missing') || error.message.includes('configuration')) {
      res.status(503).json({ 
        error: 'Service temporarily unavailable',
        message: '服务暂时不可用，请联系管理员检查配置' 
      });
    } else {
      res.status(500).json({ 
        error: 'Analysis failed',
        message: error.message || '分析过程中发生错误，请稍后再试'
      });
    }
  }
}