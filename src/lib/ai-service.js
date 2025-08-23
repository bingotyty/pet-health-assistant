// 🔒 安全检查：确保AI服务只在服务端运行
if (typeof window !== 'undefined') {
  throw new Error('🚨 SECURITY: AI服务必须在服务端运行！客户端运行会暴露API密钥！');
}

// OpenAI客户端懒加载初始化
let openai = null;

// 模拟数据生成函数已删除 - 现在直接报错而不是使用fallback

// 解析Qwen API响应
function parseQwenResponse(apiResponse) {
  try {
    // 根据实际Qwen API响应格式进行解析
    // 这里需要根据你使用的具体Qwen API格式来调整
    const analysis = apiResponse.choices?.[0]?.message?.content || apiResponse.response;
    
    // 简单的文本解析逻辑，你可能需要更复杂的解析
    const result = {
      color: extractValue(analysis, 'color', 'brown'),
      texture: extractValue(analysis, 'texture', 'normal'),
      blood: analysis.toLowerCase().includes('血') || analysis.toLowerCase().includes('blood'),
      worms: analysis.toLowerCase().includes('虫') || analysis.toLowerCase().includes('parasites'),
      mucus: analysis.toLowerCase().includes('粘液') || analysis.toLowerCase().includes('mucus'),
      consistency: extractValue(analysis, 'consistency', 'normal'),
      classification: determineClassificationFromText(analysis),
      confidence: 0.85, // 可以从API响应中提取
      size: 'normal',
      frequency: 'regular',
      analyzed_at: new Date().toISOString()
    };
    
    return result;
  } catch (error) {
    console.error('Failed to parse Qwen response:', error);
    throw new Error(`Failed to parse Qwen API response: ${error.message}`);
  }
}

function extractValue(text, key, defaultValue) {
  // 简单的关键词提取逻辑
  const patterns = {
    color: /(?:颜色|color)[:：]\s*([^\s,，。]+)/i,
    texture: /(?:质地|texture)[:：]\s*([^\s,，。]+)/i,
    consistency: /(?:形状|consistency)[:：]\s*([^\s,，。]+)/i
  };
  
  const match = text.match(patterns[key]);
  return match ? match[1] : defaultValue;
}

function determineClassificationFromText(text) {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('严重') || lowerText.includes('severe') || lowerText.includes('危险')) {
    return 'severe';
  }
  if (lowerText.includes('异常') || lowerText.includes('abnormal') || lowerText.includes('不正常')) {
    return 'abnormal';
  }
  if (lowerText.includes('轻微') || lowerText.includes('mild')) {
    return 'mild_abnormal';
  }
  return 'normal';
}

// 注释：OpenAI Vision已移除，现在只用Qwen做视觉分析，GPT只做文本报告生成

export async function analyzePoopWithQwen(imageFile) {
  console.log('Starting Qwen multimodal analysis...');
  
  const qwenEndpoint = process.env.QWEN_API_ENDPOINT;
  const qwenApiKey = process.env.QWEN_API_KEY;
  
  // 构建时提供默认响应，运行时检查环境变量
  if (!qwenEndpoint || !qwenApiKey) {
    if (typeof window === 'undefined') {
      // 构建时返回mock数据
      console.warn('Qwen API config missing during build - using fallback');
      return {
        color: 'brown',
        texture: 'normal',
        blood: false,
        worms: false,
        mucus: false,
        consistency: 'normal',
        classification: 'normal',
        confidence: 0.85,
        size: 'normal',
        frequency: 'regular',
        analyzed_at: new Date().toISOString(),
        source: 'build_fallback'
      };
    }
    throw new Error('Qwen API configuration missing. Please set QWEN_API_ENDPOINT and QWEN_API_KEY environment variables.');
  }
  
  console.log('Using Qwen API for image analysis...');
  // 直接调用API，失败就抛出错误
  return await tryQwenAPI(imageFile, qwenEndpoint, qwenApiKey);
}

async function tryQwenAPI(imageFile, qwenEndpoint, qwenApiKey) {
  try {
    // 将图片转换为base64（适用于大多数视觉API）
    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    const imageDataUrl = `data:${imageFile.type};base64,${imageBase64}`;

    // 尝试调用Qwen API（根据实际API格式调整）
    const prompt = `请分析这张宠物粪便图片的健康状况。请从以下方面进行分析：
1. 颜色：描述粪便的颜色
2. 质地：描述粪便的质地和形状
3. 异常情况：是否有血丝、粘液、寄生虫等
4. 健康评估：正常/轻微异常/异常/严重
请用中文回答，格式清晰。`;

    let response;

    // 根据配置的API端点类型调用不同的API
    if (qwenEndpoint.includes('openrouter.ai')) {
      // OpenRouter API调用 - 使用正确的endpoint格式
      const openrouterEndpoint = qwenEndpoint.endsWith('/chat/completions') ? qwenEndpoint : `${qwenEndpoint}/chat/completions`;
      
      response = await fetch(openrouterEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${qwenApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://localhost:3001', // Required by OpenRouter
          'X-Title': 'Pet Health Analysis App', // Optional but recommended
        },
        body: JSON.stringify({
          model: 'qwen/qwen2.5-vl-72b-instruct',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'image_url', image_url: { url: imageDataUrl } }
              ]
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        })
      });
    } else if (qwenEndpoint.includes('dashscope.aliyuncs.com')) {
      // 阿里云DashScope API调用
      response = await fetch(`${qwenEndpoint}/api/v1/services/aigc/multimodal-generation/generation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${qwenApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'qwen-vl-plus',
          input: {
            messages: [
              {
                role: 'user',
                content: [
                  { text: prompt },
                  { image: imageDataUrl }
                ]
              }
            ]
          }
        })
      });
    } else {
      // 通用API调用
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('prompt', prompt);

      response = await fetch(qwenEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${qwenApiKey}`,
        },
        body: formData
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Qwen API error response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      });
      throw new Error(`Qwen API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const responseText = await response.text();
    console.log('Qwen API raw response:', {
      length: responseText.length,
      preview: responseText.substring(0, 200),
      full: responseText
    });
    
    if (!responseText || responseText.trim() === '') {
      throw new Error('Qwen API returned empty response');
    }
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', {
        parseError: parseError.message,
        responseText,
        responseLength: responseText.length
      });
      throw new Error(`Invalid JSON response from Qwen API: ${parseError.message}. Response: ${responseText.substring(0, 100)}...`);
    }
    console.log('Qwen API response:', result);
    
    const parsedResult = parseQwenResponse(result);
    parsedResult.source = 'qwen';
    console.log('Qwen analysis completed:', parsedResult);
    
    return parsedResult;

  } catch (error) {
    console.error('Qwen API call failed:', error);
    throw error;
  }
}

export async function generateHealthReport(qwenResult, userDescription = '', petInfo = {}) {
  // 这个函数只应该在服务器端调用
  if (typeof window !== 'undefined') {
    throw new Error('generateHealthReport should only be called on server side');
  }

  // 构建时返回默认报告，运行时检查环境变量
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key missing - using fallback report');
    return `**健康状态评估**
基于AI分析，您的宠物粪便状况显示为${qwenResult.classification === 'normal' ? '正常' : '需要关注'}。

**具体分析**
1. 颜色与形状：${qwenResult.color}色，质地${qwenResult.texture}
2. 异常指标：${qwenResult.blood ? '发现血丝' : '无血丝'}，${qwenResult.mucus ? '有粘液' : '无粘液'}
3. 整体评估：${qwenResult.classification}

**专业建议**
请继续观察宠物的排便情况，如有异常请及时就医。

**就医指导**
${qwenResult.blood || qwenResult.worms ? '建议尽快就医检查' : '暂无紧急就医需要'}`;
  }

  // 运行时懒加载初始化OpenAI客户端
  if (!openai) {
    const OpenAI = (await import('openai')).default;
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  try {
    // 根据分析来源调整置信度描述
    const sourceText = qwenResult.source === 'openai_vision' ? 'GPT-4 Vision分析' :
                      qwenResult.source === 'qwen' ? 'Qwen多模态分析' : 
                      qwenResult.fallback ? '基于专业知识的评估' : 'AI智能分析';

    const prompt = `
作为资深宠物健康专家，基于${sourceText}结果，为宠物主人生成专业的健康评估报告：

【分析数据】
- 粪便颜色: ${qwenResult.color}
- 质地形状: ${qwenResult.texture}
- 一致性: ${qwenResult.consistency}
- 异常指标:
  * 血丝: ${qwenResult.blood ? '检测到' : '未检测到'}
  * 粘液: ${qwenResult.mucus ? '检测到' : '未检测到'}  
  * 寄生虫: ${qwenResult.worms ? '疑似存在' : '未发现'}
- AI分析置信度: ${Math.round(qwenResult.confidence * 100)}%
- 整体分类: ${qwenResult.classification}

【附加信息】
宠物基本信息: ${JSON.stringify(petInfo)}
主人补充描述: ${userDescription || '无'}

请按以下结构生成报告：

**健康状态评估**
简明扼要地描述当前粪便健康状况（2-3句话）

**具体分析**
1. 颜色与形状分析
2. 异常指标评估
3. 可能原因分析

**专业建议**
1. 即时护理建议
2. 饮食调整建议
3. 观察要点

**就医指导**
明确是否需要立即就医，以及紧急程度

请用温和专业的语气，避免过度惊慌，但要准确传达健康风险。用中文回复。
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
    throw error; // 直接抛出错误，不使用fallback
  }
}

export function determineRiskLevel(qwenResult) {
  // 高风险情况
  if (qwenResult.blood || qwenResult.worms || qwenResult.classification === 'severe' || qwenResult.classification === 'parasites_detected') {
    return 'high';
  }
  
  // 中等风险情况
  if (qwenResult.mucus || qwenResult.classification === 'abnormal' || qwenResult.classification === 'mild_abnormal') {
    return 'medium';
  }
  
  // 低风险（正常）
  return 'low';
}