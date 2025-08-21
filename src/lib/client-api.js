// 客户端API服务 - 用于Cloudflare Pages静态部署
import { supabase } from './supabase';
import { analyzePoopWithQwen, generateHealthReport } from './ai-service';

// 分析宠物便便 - 客户端版本
export async function analyzePoopClient(imageFile, userId) {
  try {
    console.log('🔍 开始客户端AI分析...');

    // 1. 压缩并上传图片到Supabase
    // 安全处理文件扩展名，移动端拍照可能没有name属性
    let fileExt = 'jpg'; // 默认扩展名
    if (imageFile.name && typeof imageFile.name === 'string') {
      const parts = imageFile.name.split('.');
      if (parts.length > 1) {
        fileExt = parts.pop() || 'jpg';
      }
    }
    // 根据文件类型确定扩展名
    if (imageFile.type) {
      if (imageFile.type.includes('jpeg')) fileExt = 'jpg';
      else if (imageFile.type.includes('png')) fileExt = 'png';
      else if (imageFile.type.includes('webp')) fileExt = 'webp';
    }
    
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `poop-images/${fileName}`;
    
    console.log('📁 文件信息:', {
      originalName: imageFile.name || 'camera-capture',
      fileType: imageFile.type || 'unknown',
      fileSize: imageFile.size || 0,
      extractedExt: fileExt,
      fileName: fileName,
      hasName: !!imageFile.name
    });

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pet-images')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('❌ 图片上传失败:', uploadError);
      throw new Error('图片上传失败');
    }

    console.log('✅ 图片上传成功:', uploadData.path);

    // 2. AI分析
    const qwenResult = await analyzePoopWithQwen(imageFile);
    console.log('🤖 Qwen分析结果:', qwenResult);

    // 3. 生成健康报告
    const healthReport = await generateHealthReport(qwenResult, '', {});
    console.log('📋 健康报告生成完成');

    // 4. 确定风险等级
    const riskLevel = determineRiskLevel(qwenResult);

    // 5. 保存到数据库
    const { data: recordData, error: saveError } = await supabase
      .from('feces_records')
      .insert({
        user_id: userId,
        image_url: uploadData.path,
        qwen_analysis: qwenResult,
        gpt_report: healthReport,
        risk_level: riskLevel,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (saveError) {
      console.error('❌ 数据保存失败:', saveError);
      throw new Error('分析结果保存失败');
    }

    console.log('✅ 分析完成并保存:', recordData.id);
    return recordData;

  } catch (error) {
    console.error('❌ 客户端分析失败:', error);
    throw error;
  }
}

// 获取用户记录 - 客户端版本
export async function getRecordsClient(userId, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('feces_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ 获取记录失败:', error);
      throw new Error('获取记录失败');
    }

    return data || [];
  } catch (error) {
    console.error('❌ 获取记录失败:', error);
    throw error;
  }
}

// 获取趋势分析 - 客户端版本
export async function getTrendsClient(userId, days = 7) {
  try {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const { data, error } = await supabase
      .from('feces_records')
      .select('risk_level, created_at')
      .eq('user_id', userId)
      .gte('created_at', sinceDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 获取趋势失败:', error);
      throw new Error('获取趋势失败');
    }

    return data || [];
  } catch (error) {
    console.error('❌ 获取趋势失败:', error);
    throw error;
  }
}

// 辅助函数：确定风险等级
function determineRiskLevel(analysis) {
  if (!analysis) return 'medium';

  let riskScore = 0;

  // 检查异常指标
  if (analysis.blood) riskScore += 3;
  if (analysis.worms) riskScore += 3;
  if (analysis.mucus) riskScore += 1;

  // 根据颜色判断
  if (analysis.color === 'black' || analysis.color === 'dark_red') {
    riskScore += 2;
  } else if (analysis.color === 'green') {
    riskScore += 1;
  }

  // 根据质地判断
  if (analysis.texture === 'watery' || analysis.texture === 'tarry') {
    riskScore += 2;
  } else if (analysis.texture === 'loose') {
    riskScore += 1;
  }

  // 确定最终等级
  if (riskScore >= 4) return 'high';
  if (riskScore >= 2) return 'medium';
  return 'low';
}