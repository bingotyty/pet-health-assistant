# AI API 配置指南

## 支持的AI服务

### 1. OpenAI GPT-4 Vision (推荐)

**获取API密钥：**
1. 访问 https://platform.openai.com
2. 注册/登录账号
3. 进入 API Keys 页面
4. 创建新的API密钥

**配置环境变量：**
```bash
# .env.local
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**费用：** 约$0.01-0.03/次分析

### 2. Qwen-VL (通过OpenRouter)

**获取API密钥：**
1. 访问 https://openrouter.ai
2. 注册/登录账号
3. 获取API密钥
4. 充值账户余额

**配置环境变量：**
```bash
# .env.local
QWEN_API_ENDPOINT=https://openrouter.ai/api/v1
QWEN_API_KEY=sk-or-v1-your-openrouter-key-here
```

**注意：** 推荐使用模型 `qwen/qwen2.5-vl-72b-instruct`，支持视觉分析功能

**费用：** 约$0.005-0.015/次分析

### 3. Qwen-VL (阿里云DashScope)

**获取API密钥：**
1. 访问 https://dashscope.aliyuncs.com
2. 注册/登录阿里云账号
3. 开通DashScope服务
4. 获取API-KEY

**配置环境变量：**
```bash
# .env.local  
QWEN_API_ENDPOINT=https://dashscope.aliyuncs.com
QWEN_API_KEY=your-dashscope-api-key
```

## AI服务架构策略

应用采用双AI模型协作架构，成本最优化：

1. **Qwen多模态分析** (图像识别)
   - 使用 `qwen/qwen2.5-vl-72b-instruct` 进行宠物粪便图像分析
   - 输出结构化数据：颜色、质地、异常指标等
   - 成本低，专门用于视觉任务

2. **OpenAI GPT-3.5 报告生成** (文本生成)
   - 基于Qwen分析结果生成专业健康报告
   - 使用 `gpt-3.5-turbo` 模型，成本效益最优
   - 纯文本处理，无需视觉功能

3. **错误处理策略**
   - 如果Qwen API不可用，直接返回错误信息
   - 如果OpenAI API不可用，直接返回错误信息
   - 便于调试和问题定位，不使用模拟数据掩盖真实问题

## 推荐配置方案

### 方案一：完整AI体验 (推荐)
```bash
# 同时配置两个服务，获得最佳效果和稳定性
OPENAI_API_KEY=sk-your-openai-key
QWEN_API_ENDPOINT=https://openrouter.ai/api/v1
QWEN_API_KEY=sk-or-v1-your-openrouter-key
```

### 方案二：仅OpenAI (简单易用)
```bash
# 只配置OpenAI，稳定可靠
OPENAI_API_KEY=sk-your-openai-key
```

### 方案三：仅Qwen (性价比高)
```bash
# 只配置Qwen，成本较低
QWEN_API_ENDPOINT=https://openrouter.ai/api/v1
QWEN_API_KEY=sk-or-v1-your-key
```

### 方案四：开发调试模式
```bash
# 不配置API密钥时会直接报错，便于调试
# 确保在部署前正确配置所有必需的环境变量
```

## 配置步骤

1. **复制环境变量模板**
   ```bash
   cp .env.local.example .env.local
   ```

2. **编辑环境变量文件**
   ```bash
   nano .env.local  # 或使用你喜欢的编辑器
   ```

3. **重启开发服务器**
   ```bash
   npm run dev
   ```

4. **测试AI分析**
   - 上传任意图片
   - 查看控制台日志确认使用的AI服务
   - 检查分析结果的来源标识

## 故障排除

### OpenAI API常见问题
- **401 Unauthorized**: 检查API密钥是否正确
- **429 Too Many Requests**: API调用频率过高，稍后再试
- **413 Payload Too Large**: 图片文件过大，系统会自动压缩

### Qwen API常见问题  
- **API endpoint错误**: 确认使用正确的端点URL
- **模型不支持**: 某些Qwen模型可能不支持视觉分析
- **余额不足**: 检查OpenRouter或阿里云账户余额

### 调试技巧
查看浏览器控制台和服务器日志：
```bash
# 查看详细的AI调用日志
npm run dev
# 然后在浏览器中上传图片，查看控制台输出
```

## 安全建议

1. **永远不要提交API密钥到代码库**
2. **在生产环境中使用环境变量管理服务**
3. **定期轮换API密钥**
4. **设置API使用限额避免意外费用**
5. **监控API调用量和费用**