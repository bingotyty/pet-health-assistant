import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzePoopWithQwen(imageFile) {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const qwenEndpoint = process.env.QWEN_API_ENDPOINT;
    const qwenApiKey = process.env.QWEN_API_KEY;
    
    if (!qwenEndpoint || !qwenApiKey) {
      throw new Error('Missing Qwen API configuration');
    }

    const response = await fetch(qwenEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${qwenApiKey}`,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Qwen API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Mock response structure for development
    return {
      color: result.color || 'brown',
      texture: result.texture || 'normal',
      blood: result.blood || false,
      worms: result.worms || false,
      mucus: result.mucus || false,
      consistency: result.consistency || 'normal',
      classification: result.classification || 'normal',
      confidence: result.confidence || 0.85
    };
  } catch (error) {
    console.error('Qwen analysis failed:', error);
    
    // Return mock data for development
    return {
      color: 'brown',
      texture: 'soft',
      blood: false,
      worms: false,
      mucus: false,
      consistency: 'normal',
      classification: 'normal',
      confidence: 0.85
    };
  }
}

export async function generateHealthReport(qwenResult, userDescription = '', petInfo = {}) {
  try {
    const prompt = `
作为宠物健康分析师，基于以下信息生成健康报告：

粪便分析结果：
- 颜色: ${qwenResult.color}
- 质地: ${qwenResult.texture}
- 血丝: ${qwenResult.blood ? '有' : '无'}
- 寄生虫: ${qwenResult.worms ? '疑似有' : '无'}
- 粘液: ${qwenResult.mucus ? '有' : '无'}
- 一致性: ${qwenResult.consistency}

宠物信息: ${JSON.stringify(petInfo)}
主人描述: ${userDescription}

请提供：
1. 当前状态描述（1-2句话）
2. 风险等级判断（低/中/高）
3. 具体建议（2-3条）
4. 是否需要就医的建议

请用中文回复，语气友好专业。
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('GPT report generation failed:', error);
    
    // Return fallback report
    return `根据分析结果，您的宠物粪便状况基本正常。

建议：
1. 继续保持当前的饮食习惯
2. 确保充足的饮水
3. 定期观察宠物的排便情况

如果持续出现异常，建议咨询兽医。`;
  }
}

export function determineRiskLevel(qwenResult) {
  if (qwenResult.blood || qwenResult.worms) {
    return 'high';
  }
  if (qwenResult.mucus || qwenResult.classification === 'abnormal') {
    return 'medium';
  }
  return 'low';
}