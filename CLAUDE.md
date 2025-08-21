# 🐾 宠物粪便识别 MVP - CLAUDE 技术文档

## 项目概述

**项目名称**：宠物粪便识别 MVP
**技术栈**：Next.js + Supabase + Qwen多模态 + OpenAI GPT
**目标用户**：城市宠物主人（20-45岁）
**核心价值**：通过AI技术帮助宠物主人识别粪便健康状况，提供专业健康建议

## 系统架构

### 前端架构（Next.js）
```
src/
├── components/
│   ├── UploadComponent.jsx      # 照片上传组件
│   ├── ResultCard.jsx           # 分析结果展示卡片
│   ├── HistoryList.jsx          # 历史记录列表
│   └── PetProfile.jsx           # 宠物档案组件
├── pages/
│   ├── index.js                 # 首页（拍照识别）
│   ├── history.js               # 历史记录页
│   └── report/[id].js           # 详细报告页
├── lib/
│   ├── supabase.js              # Supabase客户端配置
│   ├── ai-service.js            # AI模型调用服务
│   └── utils.js                 # 工具函数
└── styles/
    └── globals.css              # 全局样式
```

### 后端架构（Supabase）

#### 数据库表结构

```sql
-- 用户表
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 宠物档案表
CREATE TABLE pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL, -- 'cat' or 'dog'
  breed TEXT,
  age INTEGER,
  weight DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 粪便识别记录表
CREATE TABLE feces_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  qwen_analysis JSONB, -- Qwen识别结果
  gpt_report TEXT, -- GPT生成的健康报告
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  user_description TEXT, -- 用户补充描述
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## AI模型集成

### Qwen-VL 多模态识别

**功能**：识别粪便视觉特征
**输入**：宠物粪便照片
**输出**：结构化分析结果

```javascript
// AI服务调用示例
async function analyzePoopWithQwen(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch('/api/qwen-analysis', {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
  // 期望输出格式：
  // {
  //   "color": "brown",
  //   "texture": "soft",
  //   "blood": false,
  //   "worms": false,
  //   "mucus": false,
  //   "consistency": "normal",
  //   "classification": "mild_abnormal",
  //   "confidence": 0.85
  // }
}
```

### OpenAI GPT 报告生成

**功能**：基于识别结果生成自然语言健康报告
**输入**：Qwen分析结果 + 用户描述
**输出**：结构化健康报告

```javascript
async function generateHealthReport(qwenResult, userDescription, petInfo) {
  const prompt = `
    宠物健康分析师角色，基于以下信息生成健康报告：
    
    粪便分析结果：${JSON.stringify(qwenResult)}
    宠物信息：${JSON.stringify(petInfo)}
    主人描述：${userDescription}
    
    请提供：
    1. 当前状态描述
    2. 风险等级（低/中/高）
    3. 具体建议
    4. 是否需要就医
  `;
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });
  
  return response.choices[0].message.content;
}
```

## 关键功能实现

### 1. 照片上传与处理

```javascript
// components/UploadComponent.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function UploadComponent({ onAnalysisComplete }) {
  const [uploading, setUploading] = useState(false);
  
  const handleFileUpload = async (file) => {
    setUploading(true);
    
    try {
      // 上传到Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `poop-images/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pet-images')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // 调用AI分析
      const qwenResult = await analyzePoopWithQwen(file);
      const gptReport = await generateHealthReport(qwenResult, '', {});
      
      // 保存记录到数据库
      const { data, error } = await supabase
        .from('feces_records')
        .insert({
          image_url: uploadData.path,
          qwen_analysis: qwenResult,
          gpt_report: gptReport,
          risk_level: determineRiskLevel(qwenResult)
        });
        
      onAnalysisComplete(data[0]);
      
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="upload-container">
      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        onChange={(e) => handleFileUpload(e.target.files[0])}
        disabled={uploading}
      />
      {uploading && <div>分析中...</div>}
    </div>
  );
}
```

### 2. 结果展示组件

```javascript
// components/ResultCard.jsx
export default function ResultCard({ record }) {
  const getRiskColor = (level) => {
    const colors = {
      'low': 'text-green-600',
      'medium': 'text-yellow-600', 
      'high': 'text-red-600'
    };
    return colors[level] || 'text-gray-600';
  };
  
  const getRiskIcon = (level) => {
    const icons = {
      'low': '✅',
      'medium': '⚠️',
      'high': '❌'
    };
    return icons[level] || '❓';
  };
  
  return (
    <div className="result-card bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">{getRiskIcon(record.risk_level)}</span>
        <h3 className={`text-lg font-semibold ${getRiskColor(record.risk_level)}`}>
          健康状态：{record.risk_level === 'low' ? '正常' : record.risk_level === 'medium' ? '轻度异常' : '严重异常'}
        </h3>
      </div>
      
      <div className="analysis-details mb-4">
        <h4 className="font-medium mb-2">分析结果：</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>颜色：{record.qwen_analysis?.color}</li>
          <li>质地：{record.qwen_analysis?.texture}</li>
          <li>血丝：{record.qwen_analysis?.blood ? '有' : '无'}</li>
          <li>寄生虫：{record.qwen_analysis?.worms ? '疑似有' : '未发现'}</li>
        </ul>
      </div>
      
      <div className="gpt-report">
        <h4 className="font-medium mb-2">健康建议：</h4>
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {record.gpt_report}
        </p>
      </div>
      
      <div className="timestamp text-xs text-gray-400 mt-4">
        {new Date(record.created_at).toLocaleString('zh-CN')}
      </div>
    </div>
  );
}
```

### 3. 历史记录与趋势分析

```javascript
// pages/history.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [trendData, setTrendData] = useState(null);
  
  useEffect(() => {
    fetchHistoryRecords();
    generateTrendAnalysis();
  }, []);
  
  const fetchHistoryRecords = async () => {
    const { data, error } = await supabase
      .from('feces_records')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
      
    if (data) setRecords(data);
  };
  
  const generateTrendAnalysis = async () => {
    const { data } = await supabase
      .from('feces_records')
      .select('risk_level, created_at')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      
    // 生成7天趋势数据
    const trend = analyzeTrend(data);
    setTrendData(trend);
  };
  
  return (
    <div className="history-page">
      <h1 className="text-2xl font-bold mb-6">健康记录</h1>
      
      {trendData && (
        <div className="trend-card mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">7天趋势</h2>
          <p className="text-sm text-gray-600">{trendData.summary}</p>
        </div>
      )}
      
      <div className="records-list space-y-4">
        {records.map(record => (
          <ResultCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}
```

## API 端点设计

### RESTful API 结构

```
POST /api/analyze-poop
- 上传照片并进行AI分析
- Body: FormData (image file)
- Response: 分析结果和报告

GET /api/records
- 获取用户的历史记录
- Query: limit, offset, pet_id
- Response: 记录列表

GET /api/records/:id
- 获取特定记录详情
- Response: 完整记录信息

POST /api/pets
- 创建宠物档案
- Body: 宠物信息
- Response: 创建的宠物数据

GET /api/trends
- 获取趋势分析数据
- Query: days (默认7天)
- Response: 趋势分析结果
```

## 性能优化策略

### 1. 图片处理优化
```javascript
// 前端图片压缩
const compressImage = (file, quality = 0.7) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // 限制最大尺寸
      const maxWidth = 800;
      const maxHeight = 600;
      
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};
```

### 2. 缓存策略
```javascript
// Redis缓存AI分析结果（基于图片hash）
const getCachedAnalysis = async (imageHash) => {
  const cached = await redis.get(`analysis:${imageHash}`);
  return cached ? JSON.parse(cached) : null;
};

const setCachedAnalysis = async (imageHash, result) => {
  await redis.setex(`analysis:${imageHash}`, 3600, JSON.stringify(result));
};
```

## 安全性考虑

### 1. 数据加密
```sql
-- Supabase RLS (Row Level Security) 策略
ALTER TABLE feces_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户只能访问自己的记录" ON feces_records
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "用户只能访问自己的宠物" ON pets  
  FOR ALL USING (auth.uid() = user_id);
```

### 2. 图片存储安全
```javascript
// Supabase Storage 安全策略
const uploadPolicy = {
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
  autoDeleteAfter: 365 // 一年后自动删除
};
```

## 监控与分析

### 关键指标监控
```javascript
// 核心业务指标
const trackMetrics = {
  analysisAccuracy: 0.85, // AI识别准确率目标
  responseTime: 5000, // 5秒内响应目标
  dailyActiveUsers: 0, // 日活用户
  analysisFrequency: 10, // 月均分析次数/用户
  userRetention: 0.3 // 30天留存率目标
};

// 埋点示例
const trackEvent = (eventName, properties) => {
  analytics.track(eventName, {
    userId: user.id,
    timestamp: new Date(),
    ...properties
  });
};

// 关键事件埋点
trackEvent('poop_analysis_started', { petId, imageSize });
trackEvent('poop_analysis_completed', { riskLevel, confidence });
trackEvent('report_viewed', { recordId, duration });
```

## 部署配置

### Vercel 部署配置
```json
// vercel.json
{
  "functions": {
    "pages/api/analyze-poop.js": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "OPENAI_API_KEY": "@openai-api-key",
    "QWEN_API_ENDPOINT": "@qwen-api-endpoint"
  }
}
```

### 环境变量管理
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_key
OPENAI_API_KEY=your_openai_key
QWEN_API_ENDPOINT=your_qwen_endpoint
QWEN_API_KEY=your_qwen_key
```

## 测试策略

### 单元测试示例
```javascript
// __tests__/ai-service.test.js
import { analyzePoopWithQwen, generateHealthReport } from '../lib/ai-service';

describe('AI Service', () => {
  test('should analyze poop image correctly', async () => {
    const mockResult = await analyzePoopWithQwen(mockImageFile);
    expect(mockResult).toHaveProperty('color');
    expect(mockResult).toHaveProperty('texture');
    expect(mockResult.confidence).toBeGreaterThan(0.5);
  });
  
  test('should generate appropriate health report', async () => {
    const mockAnalysis = {
      color: 'brown',
      texture: 'soft',
      blood: true,
      classification: 'abnormal'
    };
    
    const report = await generateHealthReport(mockAnalysis, '', {});
    expect(report).toContain('blood');
    expect(report).toContain('建议');
  });
});
```

## 未来扩展规划

### Phase 2 功能
1. **多宠物管理**：支持用户管理多只宠物档案
2. **智能提醒**：基于历史数据的健康提醒推送
3. **兽医对接**：与宠物医院系统API集成
4. **社区功能**：宠物主人经验分享平台

### Phase 3 商业化
1. **会员服务**：高级分析报告、趋势预测
2. **保险对接**：与宠物保险公司数据共享
3. **电商整合**：基于健康状况推荐宠物用品
4. **B2B服务**：为宠物医院提供AI分析工具

---

*此文档将随着项目开发进度持续更新和完善*