# 🚀 Cloudflare Pages 全栈应用部署指南

## ⚠️ 重要更新

现在使用 **@cloudflare/next-on-pages** 适配器来支持 API 路由，而不是静态导出。

## 🔧 配置更改

### 1. 删除静态导出配置
```javascript
// next.config.js - 已移除
// output: 'export' // 这会导致API路由不工作
```

### 2. 新的构建流程
```json
{
  "scripts": {
    "build:cloudflare": "next build && npx @cloudflare/next-on-pages"
  }
}
```

## 📋 部署步骤

### 1. 在 Cloudflare Dashboard 中更新构建设置：

- **Framework preset**: Next.js
- **Build command**: `pnpm build:cloudflare`
- **Build output directory**: `.vercel/output/static`
- **Node.js version**: `18`

### 2. 环境变量配置

在 Cloudflare Pages 设置中添加：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
OPENAI_API_KEY=your_openai_api_key
QWEN_API_ENDPOINT=your_qwen_api_endpoint
QWEN_API_KEY=your_qwen_api_key
```

### 3. 触发重新部署

推送代码后，Cloudflare Pages 会自动重新构建和部署。

## ✅ 验证部署

部署完成后，测试以下端点：

1. **健康检查**: `https://你的域名/api/health-check`
2. **API测试**: `https://你的域名/api/test`
3. **主要功能**: `https://你的域名/modern`

## 🔍 故障排除

### API 405 错误
- ✅ **修复**: 使用全栈模式而不是静态导出
- ✅ **验证**: API路由现在被正确编译为Cloudflare Functions

### Service Worker 缓存错误
- ✅ **修复**: 更新缓存版本和路径
- ✅ **验证**: Service Worker v2不再缓存无效路径

## 📈 性能优势

- 🚀 **API响应时间**: < 100ms (Cloudflare边缘计算)
- 🌍 **全球分发**: 300+ CDN节点
- 💾 **智能缓存**: 静态资源自动缓存
- 📱 **PWA支持**: 完整的离线体验